import fs from "node:fs";
import path from "node:path";

export function isFileESM(filePath: string) {
  if (/\.m[jt]s$/.test(filePath)) {
    return true;
  } else if (/\.c[jt]s$/.test(filePath)) {
    return false;
  } else {
    // TODO：添加更精确的检测逻辑
    return false;
  }
}

export function tryStatSync(file: string) {
  try {
    return fs.statSync(file, { throwIfNoEntry: false });
  } catch {
    // 不做处理，避免程序读取文件失败而崩溃
  }
}

export function deepMerge<T extends object>(
  target: T,
  ...sources: Partial<T>[]
): T {
  for (const source of sources) {
    if (!source) continue;

    Object.keys(source).forEach((key) => {
      const targetValue = target[key as keyof T];
      const sourceValue = source[key as keyof T];

      // 仅对非数组的纯对象递归合并
      if (
        isObject(targetValue) &&
        isObject(sourceValue) &&
        !Array.isArray(targetValue)
      ) {
        deepMerge(targetValue, sourceValue);
      } else {
        if (sourceValue !== undefined) {
          target[key as keyof T] = sourceValue!;
        }
      }
    });
  }
  return target;
}

export function isObject(value: any): value is object {
  return value && typeof value === "object" && !Array.isArray(value);
}

export function initPublicFiles(dirPath: string): string[] {
  let fileNames: string[] = [];

  function walkDir(currentPath: string, basePath: string = dirPath) {
    const stat = tryStatSync(currentPath);
    if (!stat) return;

    if (stat.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach((file) => {
        walkDir(path.join(currentPath, file), basePath);
      });
    } else if (stat.isFile()) {
      const relativePath = path.relative(basePath, currentPath);
      fileNames.push("/" + relativePath);
    }
  }

  const stat = tryStatSync(dirPath);
  if (stat?.isDirectory()) {
    walkDir(dirPath);
  }

  return fileNames;
}
