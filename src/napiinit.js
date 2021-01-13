const { argv } = require("process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { executeCmd } = require("./helpers/executeCmd");
const { pretty } = require("./helpers/pretty");

const projectName = argv[3];
const filesToInclude = [
  "napibindings.nim",
  "jsNativeApi.nim",
  "jsNativeApiTypes.nim",
  "nodeApi.nim",
  "nodeApiTypes.nim",
  "utils.nim",
];
const projectDir = path.resolve(projectName);

fs.mkdirSync(projectDir);
fs.mkdirSync(path.join(projectDir, "napi"));

filesToInclude.forEach((file) => {
  fs.copyFileSync(
    path.resolve(__dirname, "nim", file),
    path.resolve(projectDir, "napi", file)
  );
});

const packageFileContents = {
  name: projectName,
  version: "1.0.0",
  description: "Node JS extenstion written in Nim",
  main: "index.js",
  keywords: [],
  author: "",
};
fs.writeFileSync(
  path.join(projectDir, "package.json"),
  pretty(packageFileContents)
);

executeCmd("npm", ["install", "bindings"], projectDir);

fs.writeFileSync(
  path.resolve(projectDir, "index.js"),
  `const addon = require("bindings")("main");
addon.hello();`
);

fs.writeFileSync(
  path.resolve(projectDir, "main.nim"),
  `import ./napi/napibindings
init proc(exports: Module) =
  exports.registerFn(0, "hello"):
    echo "Hello world"`
);

let baseStyles = [
  "color: #fff",
  "background-color: #444",
  "padding: 2px 4px",
  "border-radius: 2px",
].join(";");

console.log(
  `%cProject created successfuly.

Next steps:
cd ${projectName}
napi-nim main.nim
node --napi-modules index.js
`,
  baseStyles
);

console.log("%s Project ready.", chalk.green.bold("DONE"));
console.log("\nTest that it works by buildding and running:");
console.log(
  chalk.cyanBright.bold(
    `  cd ${projectName}
  napi-nim main.nim
  node --napi-modules index.js`
  )
);
