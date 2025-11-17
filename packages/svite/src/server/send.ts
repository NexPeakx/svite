import {
  ServerResponse,
  IncomingMessage,
  OutgoingHttpHeaders
} from "node:http";


// TODO：增加 etag 等更多配置
interface SenOption {
  header?: OutgoingHttpHeaders
}

const alias: Record<string, string | undefined> = {
  js: 'text/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json',
}

export function send(
  req: IncomingMessage,
  res: ServerResponse,
  content: string | Buffer,
  type: string,
  option: SenOption = {}
) {
  const { header } = option

  res.setHeader("Content-Type", alias[type] || type);

  if (header) {
    for (const key in header) {
      res.setHeader(key, header[key]!)
    }
  }

  res.statusCode = 200
  if (req.method === 'HEAD') {
    res.end()
  } else {
    res.end(content)
  }
  return
}