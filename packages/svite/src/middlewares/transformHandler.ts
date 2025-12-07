import { NextHandleFunction } from "connect";
import type { DevServer } from "../server";
import { cleanUrl } from "../utils";
import { send } from "../server/send";
import fsp from "node:fs/promises";
import path from "node:path";
export function transformHandler(serve: DevServer): NextHandleFunction {
  return async (req, res, next) => {
    console.log(
      "Transform Handler Middleware",
      req.url,
      req.method,
      req.headers
    );
    if (req.method !== "GET") return next();

    let url = cleanUrl(req.url!);

    if (req.headers["sec-fetch-dest"] === "script") {
      // js 请求，获取源数据并将其转化为 esm 模块
      const jsResult = await transformRequest(url, serve);
      const type = "js";
      return send(req, res, jsResult!, type);
    }

    next();
  };
}

async function transformRequest(url: string, server: DevServer) {
  // console.log("transformRequest", server.config.root, url);
  const root = server.config.root;
  const fileName = path.join(root!, url);
  const code = await fsp.readFile(fileName, "utf-8");
  // console.log("transformRequest", code);
  return code;
}
