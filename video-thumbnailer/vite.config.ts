// vite.config.ts
// import path from "path";
import { defineConfig } from "vite";
//@ts-ignore
import dts from "vite-plugin-dts";
//@ts-ignore
import pkg from "./package.json" assert { type: "json" };

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    sourcemap: false,
    lib: {
      entry: "./src/index.ts",
      // formats: ["es", "umd"], // pure ESM package
      name: "index",
      fileName: "index", // otherwise it's called "video-thumbnailer"
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies), // don't bundle dependencies
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
      ],
    },
    target: "esnext",
  },
  plugins: [dts()],
});
