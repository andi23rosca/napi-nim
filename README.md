# Write NodeJS native extensions in Nim

## Prerequisites
Since we're building a NodeJS extension in Nim you should install both from:
- NodeJS:  https://nodejs.org/en/
- Nim:     https://nim-lang.org/install.html

Make sure you have `node-gyp` installed globally by doing `npm i -g node-gyp`.

## Installation
Install napi-nim globally
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
3. `node --napi-modules index.js` will run the JS file. the --napi-modules flag ensures that node knows to look for a n-api add-on.


Running the last command should output `Hello world` in the command line.

## Roadmap
The project is still new and unfinished.
It can already be used to create add-ons but it is missing the following features/nice-to-haves:

- [ ] Examples folder to show how to use.
- [ ] In-depth explanation of the code-base.
- [ ] Collaboration guide.
- [ ] `napi-nim init` should include bundling and publishing an add-on out of the box. (Right now you have to figure it out yourself 😕)