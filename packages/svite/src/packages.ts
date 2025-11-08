import path from "node:path";
import { tryStatSync } from "./utils";

/**
 * 查找最近的node_modules目录
 * 从指定的基础目录开始，向上级目录递归查找包含node_modules的目录
 * @param baseDir - 开始查找的基准目录路径
 * @returns 找到的node_modules目录路径，如果未找到则返回null
 */
export function findNearestNodeModules(baseDir: string): string | null {
  while (baseDir) {
    const pkgPath = path.join(baseDir, "node_modules");
    if (tryStatSync(pkgPath)?.isDirectory()) {
      return pkgPath;
    }

    const nextBaseDir = path.dirname(baseDir);
    if (baseDir === nextBaseDir) {
      break;
    }
    baseDir = nextBaseDir;
  }
  return null;
}
