import { NextHandleFunction } from "connect";
import type { DevServer } from "../server";
import { cleanUrl } from "../utils";
import { send } from "../server/send";
import fsp from 'node:fs/promises'
export function transformHandler(serve: DevServer): NextHandleFunction {
  return async (req, res, next) => {
    console.log('Transform Handler Middleware', req.url, req.method, req.headers);
    if (req.method !== 'GET') return next()

    let url = cleanUrl(req.url!)

    if (req.headers['sec-fetch-dest'] === 'script') {
      // js 请求，获取源数据并将其转化为 esm 模块
      const jsResult = await tranformRequest(url, serve)
      const type = 'js'
      return send(req, res, jsResult!, type)
    }

    next()
  }
}

async function tranformRequest(url: string, server: DevServer) {
  console.log('tranformRequest', server.config.root, url)
  const code = await fsp.readFile(url, 'utf-8')
  console.log('tranformRequest', code)
  return code
}