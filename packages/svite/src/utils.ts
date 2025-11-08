import fs from "node:fs";

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
