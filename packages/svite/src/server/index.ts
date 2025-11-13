import { createServer } from "node:http";
import connect from "connect";
import {
  htmlHandler,
  transformHandler
} from '../middlewares'
import { resolveConfig } from "../config";

export async function createDevServer(inlineCconfig: Object) {
  const config = await resolveConfig(inlineCconfig);
  console.log("config", config);
  const app = connect();

  let server = createServer(app);

  app.use(transformHandler(server))

  app.use(htmlHandler(server));

  server.listen(3000, () => {
    console.log("Dev server running on http://localhost:3000");
  });

  console.log("server created", config);
}
