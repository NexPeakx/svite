import path from "node:path";
import fs from "node:fs";
import { promisify } from "node:util";
import { DEFAULT_CONFIG_FILES } from "./constants";
import { isFileESM } from "./utils";
import { createRequire } from "node:module";

// 将 fs.readFile 函数转为 promise 函数
const promisifyReadFile = promisify(fs.realpath);

const _require = createRequire(import.meta.url);

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

  const userConfig = isFileESM(resolvePath)
    ? resolveESMConfig(resolvePath)
    : await resolveCJSConfig(resolvePath);
}

function resolveESMConfig(filePath: string) {}

async function resolveCJSConfig(filePath: string) {
  const extension = path.extname(filePath);

  const realFileName = await promisifyReadFile(filePath);

  console.log(
    "resolved config file",
    _require.extensions,
    realFileName,
    filePath
  );

  // const row = _require(filePath).default;
  // console.log("resolved config file", realFileName, extension, row);
}
