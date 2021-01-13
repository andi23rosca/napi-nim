function printHelp() {
  console.log(
    `
napi-nim -h                      Show all options.
napi-nim init <projectName>      Create a new n-api addon project directory.
napi-nim <entryFile> [options]   Create a node-gyp build of a nim n-api project.

options

-r    Build project in release mode. Without this flag will default to debug mode.
`
  );
}
export function cli(args) {
  switch (args[2]) {
    case "init":
      require("./napiinit");
      break;
    case "-h":
      printHelp();
      break;
    default:
      require("./napibuild");
  }
}
