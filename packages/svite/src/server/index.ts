import { createServer } from "node:http";
import connect from "connect";
import { htmlHandler, transformHandler, publicHandler } from "../middlewares";
import { resolveConfig } from "../config";
import { Server } from "node:http";
import { UserConfig } from "../config";
import { initPublicFiles } from "../utils";
import { createWsServer } from "../ws";
import chokidar from "chokidar";

export interface DevServer {
  server: Server;
  config: UserConfig;
}

export async function createDevServer(inlineConfig: Object) {
  const config = await resolveConfig(inlineConfig);

  const app = connect();

  let server = createServer(app);

  let devServer: DevServer = {
    server,
    config,
  };

  const ws = createWsServer();

  const watcher = chokidar.watch([config.root!, config.publicDir!]);

  watcher.on("change", (path) => {
    console.log(path, "change");
    ws.clients.forEach((client) => {
      client.send(JSON.stringify({ path, type: "change" }));
    });
  });

  watcher.on("add", (path) => {
    console.log(path, "add");
  });

  const publicDir = config.publicDir!;

  const publicFiles = initPublicFiles(publicDir);

  console.log(publicFiles, "all public files", publicDir);

  app.use(publicHandler(devServer, publicFiles));

  app.use(transformHandler(devServer));

  app.use(htmlHandler(devServer));

  server.listen(config.server?.port, () => {
    console.log(
      `Dev server running on http://localhost:${config.server?.port}`
    );
  });
}
