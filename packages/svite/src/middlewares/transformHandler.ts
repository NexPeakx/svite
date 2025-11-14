import { NextHandleFunction } from "connect";
import type { DevServer } from "../server";
export function transformHandler(serve: DevServer): NextHandleFunction {

  console.log('Transform Handler Middleware');

  return (req, res, next) => {
    next()
  }
}