import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { DEFAULT_CONFIG_FILES } from "./constants";
import { isFileESM } from "./utils";
import { findNearestNodeModules } from "./packages";
import { build } from "esbuild";

interface UserConfigExport {
  /**
   * 根目录
   * @default process.cwd()
   */
  root?: string;
  /*
   * 基础路径
   * @default '/'
   */
  base?: string;
  /**
   * 静态资源目录
   * @default 'public'
   */
  publicDir?: string;
  /**
   * 运行模式
   * @default 'development'
   */
  mode?: string;
  /**
   * 应用类型
   * @default 'spa'
   */
  appType?: "spa" | "mpa";
}

const configDefault = {
  base: "/",
  publicDir: "public",
  plugins: [],
  appType: "spa",
  dev: {},
};

export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config;
}

// 合并配置文件
export function resolveConfig(config: Object) {
  loadConfigFromFiles();
}

// 加载本地配置
async function loadConfigFromFiles(configRoot: string = process.cwd()) {
  // 获取配置文件
  let resolvePath: string | undefined;
  for (const file of DEFAULT_CONFIG_FILES) {
    const filePath = path.resolve(configRoot, file);
    console.log("resolved config file path", resolvePath);
    if (!fs.existsSync(filePath)) continue;
    resolvePath = filePath;
    break;
  }
  console.log("final resolved config file path", resolvePath);
  if (!resolvePath) {
    throw new Error("No svite config file found");
  }

  const userConfig = (await loadConfigFile(resolvePath)).default;

  console.log("resolved config", userConfig);
}

async function loadConfigFile(fileName: string) {
  let nodeModuleDir = findNearestNodeModules(path.dirname(fileName));

  // 创建临时目录
  if (nodeModuleDir) {
    try {
      await fsp.mkdir(path.resolve(nodeModuleDir, ".svite-temp/"), {
        recursive: true,
      });
    } catch (error) {
      nodeModuleDir = null;
      throw error;
    }
  }

  // 创建临时文件，用于node加载，因为node的ES模块系统要求通过有效的url加载，不能直接执行字符串代码
  const hash = `timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const ext = isFileESM(fileName) ? ".mjs" : ".cjs";
  const tempFileName = nodeModuleDir
    ? path.resolve(
        nodeModuleDir,
        `.svite-temp/${path.basename(fileName)}.${hash}${ext}`
      )
    : `${fileName}.${hash}${ext}`;

  console.log("resolved config file", tempFileName);

  const bundleCode = await bundleConfigFile(fileName, isFileESM(fileName));

  await fsp.writeFile(tempFileName, bundleCode);

  try {
    return (await import(pathToFileURL(tempFileName).href)).default;
  } finally {
    fs.unlink(tempFileName, () => {});
  }
}

async function bundleConfigFile(fileName: string, isESM: boolean) {
  const result = await build({
    entryPoints: [fileName],
    target: `node${process.versions.node}`,
    format: isESM ? "esm" : "cjs",
    platform: "node",
    bundle: true,
    write: false,
    external: ["esbuild"],
  });
  const { text } = result.outputFiles[0];
  return text;
}
