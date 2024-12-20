import * as esbuild from "https://deno.land/x/esbuild@v0.24.1/mod.js";

let result = await esbuild.build({
  entryPoints: ["charts/src/index.js"],
  outfile: "charts/app/site.bundle.js",
  bundle: true
})
