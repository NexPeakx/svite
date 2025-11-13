import { defineConfig } from "svite";
import { foo } from "./test";

export default defineConfig((env) => {
  foo();
  console.log(env, import.meta.url);
  return {
    server: {
      port: 8088,
      host: true,
    },
  };
});
