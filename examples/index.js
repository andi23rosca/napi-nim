const addon = require("bindings")("main");
addon.hello("world");
console.log(addon.someProperty);
