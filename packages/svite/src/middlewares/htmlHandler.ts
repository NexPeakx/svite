import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function htmlHandler(req, res, next) {
  // console.log('HTML Handler Middleware', req.url, req.method);
  // const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');
  // res.writeHead(200, {
  //   'Content-Type': 'text/html',
  //   'Cache-Control': 'no-cache'
  // });
  // res.end(html)
  // return;
  // 处理根路径
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    try {
      // 从启动目录读取 index.html
      const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');

      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      });
      res.end(html);
      return;
    } catch (e) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('index.html not found in current directory');
      return;
    }
  }

  next();
}