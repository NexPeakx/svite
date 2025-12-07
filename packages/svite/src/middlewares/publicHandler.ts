import type { DevServer } from "../server";
import type { NextHandleFunction } from "connect";
import sirv from "sirv";
export function publicHandler(
  serve: DevServer,
  publicFiles: Set<string>
): NextHandleFunction {
  const dir = serve.config.publicDir;
  const servePublic = sirv(dir, {
    dev: true,
    etag: true,
    extensions: [],
  });

  return (req, res, next) => {
    console.log(req.url);
    if (
      publicFiles &&
      !publicFiles.has(req.url!)
      // TODO：添加其他逻辑
    ) {
      return next();
    }

    servePublic(req, res, next);
  };
}
