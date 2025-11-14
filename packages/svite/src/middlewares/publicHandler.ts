import type { DevServer } from "../server";
import type { NextHandleFunction } from "connect";
import fs from 'node:fs'
import { resolve } from "node:path";
export function publicHandler(serve: DevServer): NextHandleFunction {
  console.log('Public Handler Middleware');

  const publicDir = serve.config.publicDir;
  const files = fs.readdirSync(resolve(publicDir!));

  console.log('Public Files', files);

  return ((req, res, next) => {
    if (
      req.method === 'GET'
      && req.url?.startsWith('/')
      && files.includes(req.url.slice(1))
    ) {
      const fileName = req.url!.slice(1);
      const filePath = resolve(publicDir!, fileName);
      console.log(req.url, filePath)

      try {
        // 读取文件内容
        const fileContent = fs.readFileSync(filePath);

        // 根据文件扩展名设置正确的 Content-Type
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: Record<string, string> = {
          'html': 'text/html',
          'css': 'text/css',
          'js': 'application/javascript',
          'json': 'application/json',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon'
        };

        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        res.end(fileContent);
        return;
      } catch (error) {
        console.error(`Error serving public file ${fileName}:`, error);
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }
    }
    next()
  })
}