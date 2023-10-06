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
    sourcemap: true,
    lib: {
      entry: "./src/index.ts",
      formats: ["es"], // pure ESM package
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
