import * as esbuild from "https://deno.land/x/esbuild@v0.24.1/mod.js";

let result = await esbuild.build({
  entryPoints: ["chartData/index.js"],
  outfile: "site.bundle.js",
  bundle: true
})
console.log(result);

Deno.exit(0);
