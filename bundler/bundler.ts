async function bundle() {
  return await Bun.build({
    entrypoints: ['./src/index.tsx'],
    outdir: './dist',
    minify: true,
    sourcemap: "external",
    target: "browser",
  });
}

bundle().then(output => {
  console.log(output.logs);
});
