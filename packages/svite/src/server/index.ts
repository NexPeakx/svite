import { createServer } from "node:http";
import connect from "connect";
import { htmlHandler, transformHandler, publicHandler } from "../middlewares";
import { resolveConfig } from "../config";
import { Server } from "node:http";
import { UserConfig } from "../config";
import { initPublicFiles } from "../utils";

export interface DevServer {
  server: Server;
  config: UserConfig;
}

export async function createDevServer(inlineCconfig: Object) {
  const config = await resolveConfig(inlineCconfig);

  const app = connect();

  let server = createServer(app);

  let devServer: DevServer = {
    server,
    config,
  };

  const publicDir = config.publicDir!;

  const publicFiles = initPublicFiles(publicDir);

  console.log(publicFiles, "all public files");

  app.use(publicHandler(devServer, publicFiles));

  app.use(transformHandler(devServer));

  app.use(htmlHandler(devServer));

  server.listen(config.server?.port, () => {
    console.log(
      `Dev server running on http://localhost:${config.server?.port}`
    );
  });
}
