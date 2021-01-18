# Write NodeJS native extensions in Nim
Since the release of the `n-api` which lets you call native code easily from NodeJS, many languages which support interfacing with C can now directly communicate with JavaScript. [Nim](https://nim-lang.org/) is a language that values efficiency above all else, but provides a lot of high level constructs and niceties for developer productivity.

If you don't like the verbosity of C code and feel that C++ is too complex, then try to improve the performance of your NodeJS apps with `napi-nim`.

- [Write NodeJS native extensions in Nim](#write-nodejs-native-extensions-in-nim)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Basic usage](#basic-usage)
  * [API](#api)
    + [Defining a module](#defining-a-module)
    + [Registering module exports](#registering-module-exports)
    + [Converting between `napi_value` and Nim types](#converting-between--napi-value--and-nim-types)
      - [napi_value -> Nim](#napi-value----nim)
      - [Nim -> napi_value](#nim----napi-value)
    + [Function with arguments](#function-with-arguments)
  * [Low level API](#low-level-api)
  * [Roadmap](#roadmap)

## Prerequisites
Since we're building a NodeJS extension in Nim you should install both from:
- NodeJS:  https://nodejs.org/en/
- Nim:     https://nim-lang.org/install.html

Make sure you have `node-gyp` installed globally by doing 
```
npm i -g node-gyp
```

## Installation
Install `napi-nim` globally
```
npm i -g napi-nim
```


## Basic usage
To get started run the following command:
```
napi-nim init hello-world
```
If it didn't work one of the following things might be the cause:
- The location in which you ran the command should not contain a folder named `hello-world`.
- You need an internet connection when running the command since it does an `npm install` of the dependencies of the project for you.

If everything went fine the output of the command should say:
```
DONE Project ready.

Test that it works by building and running:
  cd hello-world
  napi-nim main.nim
  node --napi-modules index.js
```

`napi-nim` has now created a new folder in the directory in which you ran the command called `hello-world`.
The folder contains all of the necessary dependencies to start working on your Nim add-on.

Next up, follow the next steps outlined in the output:

1. `cd hello-world` to navigate to the project directory.
2. `napi-nim main.nim` will compile the Nim file to a C file, and then use `node-gyp` to build the final NodeJS add-on.
3. `node --napi-modules index.js` will run the JS file. the `--napi-modules` flag ensures that node knows to look for a n-api add-on.


Running the last command should output `Hello world` in the command line.

## API
`napi-nim` provides a high level API over the classic `n-api`.
This readme might be incomplete, to see all available high level APIs see `napi/napibindings.nim`.

### Defining a module
The `init` macro will help you define a module initialization proc.
The proc definition following it should accept an argument of the type `Module`.
```nim
init proc(module: Module) =
```

### Registering module exports
For exporting properties and functions there are 2 separate templates to use.
```nim
init proc(module: Module) =
  # equivalent to module.exports.hello = function () ....
  module.registerFn(0, "hello"):
    echo "hello world"

  # equivalent to module.exports.num = 23
  module.register("num", 23)
```

### Converting between `napi_value` and Nim types
The node api defines the type `napi_value` which can take the value of the JS types such as number, string, object, etc.
For you to be able to translate between JS types and Nim types and vice-versa, `napi-nim` exposes a few helpers.

#### napi_value -> Nim
```nim
jsString.getStr # to get the string equivalent
jsNumber.getInt # to convert a js number to int, getInt32/64 and getFloat32/64 are also available
```
See the rest in `napi/napibindings.nim`.

#### Nim -> napi_value
Use the `%*` operator to convert Nim types to JS.
Make sure there's an empty space between the operator and the definition.
```nim
let obj = %* {"someProp": 23}
```

### Function with arguments
When registering a function, the first argument should be the number of arguments you expect for it.

You can get the arguments from the `args` array that is made available by `registerFn`. Keep in mind the arguments you receive will be JS types so you have to convert to Nim types if you want to use them.
```nim
module.registerFn(1, "hello"):
  let toGreet = args[0].getStr; # Getting the first and only argument as a string
  echo "Hello " & toGreet
```

## Low level API
For the things that the high level API might not support yet there's the option to use the lower level functions and types provided
by the node_api header.
You can see in the rest of the files in `napi` like `napi/jsNativeApi.nim` the wrappers which are just Nim type definitions equivalent to the header files from the n-api.

Check the original docs here: https://nodejs.org/api/n-api.html#n_api_basic_n_api_data_types

One function to mention is `assessStatus`. It checks that a low level api function returns a success, and if not throws an error.
You could also use `discard` instead to ignore the returned status, but it's not recommended.

```nim
var
  obj: napi_value
  value: napi_value
assessStatus module.env.napi_create_string_utf8("level", 5, addr value) # create a js string and put it in value
assessStatus module.env.napi_create_object(addr lowObj); # create a js object and put it in obj
assessStatus module.env.napi_set_named_property(obj, "low", value) # Set the property low to be the value string
```



## Roadmap
The project is still new and unfinished.
It can already be used to create add-ons but it is missing the following features/nice-to-haves:

- [ ] Examples folder to show how to use.
- [ ] In-depth explanation of the code-base.
- [ ] Collaboration guide.
- [ ] `napi-nim init` should include bundling and publishing an add-on out of the box. (Right now you have to figure it out yourself 😕)

Credit to https://github.com/AjBreidenbach/napibindings which this project is heavily based on. I opted for a new repository instead of PR since it seems that the project is completely abandoned.
