const { basename, dirname, resolve, join } = require("path");
const { argv, env } = require("process");
const { writeFileSync } = require("fs");
const { executeCmd } = require("./helpers/executeCmd");
const { pretty } = require("./helpers/pretty");

const isReleaseBuild = argv.includes("-r");

const entryFilePath = argv[2];
const entryName = basename(entryFilePath, ".nim");
const entryDirectory = dirname(entryFilePath);

/**
 *
 */
const nimbase = "/usr/local/Cellar/nim/1.4.2/nim/lib"; //env.NIM_LIB_PATH;
/**
 * Path to where the nim cache folder will be.
 * Keeping it in the same directory makes building easier.
 */
const nimcache = resolve(entryDirectory, "nimcache");

const target = {
  target_name: "main",
  include_dirs: [nimbase],
  cflags: isReleaseBuild ? ["-w", "-O3", "-fno-strict-aliasing"] : ["-w"],
  linkflags: ["-ldl"],
  sources: [],
};
// binding.gyp is a json so we hold the data in this variable
const gyp = {
  targets: [target],
};

/**
 * Runs the nim compiler on the entry file
 * and creates the equivalent C files in
 * nimcache to be used by node-gyp for
 * actual building later.
 */
executeCmd("nim", [
  "c",
  `--nimcache:${nimcache}`,
  isReleaseBuild ? "-d:release" : "--embedsrc",
  "--compileOnly",
  "--noMain",
  entryFilePath,
]);

/**
 * The nim compilation command will create some
 * files in the nimcache. Among them a .json file
 * which contains some metadata about how to compile
 * the generated C files.
 * We care about the source C files that node-gyp will
 * have to know about. We can get them from the json file's
 * compile property that has a list of the C files.
 */
const nimJson = require(resolve(nimcache, `${entryName}.json`));
target.sources = nimJson.compile.map((compile) =>
  join("nimcache", basename(compile[0]))
);

/**
 * Once the gyp object contains all data we write
 * the binding.gyp in the same directory as the
 * project's nim entry point file
 */
writeFileSync(resolve(entryDirectory, "binding.gyp"), pretty(gyp));

/**
 * Last step is to run the node-gyp build command
 * and create the final node extension which can be
 * imported into javascript
 */
executeCmd("node-gyp", [
  "rebuild",
  `--directory=${entryDirectory}`,
  ...(isReleaseBuild ? [] : ["--debug"]),
]);
