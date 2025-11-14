import { createServer } from "node:http";
import connect from "connect";
import {
  htmlHandler,
  transformHandler,
  publicHandler
} from '../middlewares'
import { resolveConfig } from "../config";
import { Server } from "node:http";
import { UserConfig } from "../config";

export interface DevServer {
  server: Server,
  config: UserConfig
}

export async function createDevServer(inlineCconfig: Object) {
  const config = await resolveConfig(inlineCconfig);
  console.log("config", config);
  const app = connect();

  let server = createServer(app);

  let devServer: DevServer = {
    server,
    config
  }
  console.log("devServer", devServer);
  app.use(publicHandler(devServer))

  app.use(transformHandler(devServer))

  app.use(htmlHandler(devServer));

  server.listen(config.server?.port, () => {
    console.log(`Dev server running on http://localhost:${config.server?.port}`);
  });
}
