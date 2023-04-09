"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/commands/hello.ts
var hello_exports = {};
__export(hello_exports, {
  builder: () => builder,
  command: () => command,
  desc: () => desc,
  handler: () => handler
});
module.exports = __toCommonJS(hello_exports);
var command = "hello <name>";
var desc = "Greet <name> with Hello";
var builder = (yargs) => yargs.options({
  upper: { type: "boolean" }
}).positional("name", { type: "string", demandOption: true });
var handler = (argv) => {
  const { name } = argv;
  const greeting = `Gm, ${name}!`;
  console.log(greeting);
  process.exit(0);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder,
  command,
  desc,
  handler
});
