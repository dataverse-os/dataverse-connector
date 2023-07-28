import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";
import autoprefixer from "autoprefixer";
import * as esbuild from "esbuild";
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";

const isWatching = process.argv.includes("--watch");
const isCssMinified = process.env.MINIFY_CSS === "true";
const baseBuildConfig = {
  banner: {
    js: '"use client";', // Required for Next 13 App Router
  },
  bundle: true,
  format: "esm",
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  platform: "browser",
  plugins: [
    vanillaExtractPlugin({
      identifiers: isCssMinified ? "short" : "debug",
      processCss: async css => {
        const result = await postcss([
          autoprefixer,
          prefixSelector({ prefix: "[data-rk]" }),
        ]).process(css, {
          from: undefined, // suppress source map warning
        });

        return result.css;
      },
    }),
    {
      name: "make-all-packages-external",
      setup(build) {
        let filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, args => ({
          external: true,
          path: args.path,
        }));
      },
    },
  ],
  splitting: true, // Required for tree shaking
};

const walletsBuild = options =>
  esbuild.build({
    ...baseBuildConfig,
    entryPoints: ["src/index.ts"],
    watch: isWatching
      ? {
          onRebuild(error, result) {
            if (error) console.error("wallets build failed:", error);
            else console.log("wallets build succeeded:", result);
          },
        }
      : undefined,
    ...options,
  });

Promise.all([
  (!process.argv[2] || process.argv[2] === "esm") &&
    walletsBuild({ format: "esm", outdir: "dist/esm" }),
  (!process.argv[2] || process.argv[2] === "cjs") &&
    walletsBuild({ format: "cjs", outdir: "dist/cjs", splitting: false }),
])
  .then(() => {
    if (isWatching) {
      console.log("watching...");
    }
  })
  .catch(() => process.exit(1));
