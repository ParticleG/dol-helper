import { readFileSync } from "fs";
import { defineConfig, UserConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const packageJson = JSON.parse(readFileSync("./package.json").toString());
export default defineConfig(
  ({ mode }): UserConfig => ({
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: "src/main.ts",
        name: packageJson.name,
      },
      minify: mode !== "development",
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    resolve: {
      alias: {
        assets: fileURLToPath(new URL("src/assets", import.meta.url)),
        components: fileURLToPath(new URL("src/components", import.meta.url)),
        src: fileURLToPath(new URL("src", import.meta.url)),
        types: fileURLToPath(new URL("src/types", import.meta.url)),
        utils: fileURLToPath(new URL("src/utils", import.meta.url)),
      },
    },
  }),
);
