import { NextHandleFunction } from "connect";
import type { Server } from "node:http";
export function transformHandler(serve: Server): NextHandleFunction {

  return (req, res, next) => {
    console.log('Transform Handler Middleware', req.url, req.method);
    next()
  }
}