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

// src/commands/bulkupload.ts
var bulkupload_exports = {};
__export(bulkupload_exports, {
  builder: () => builder,
  command: () => command,
  desc: () => desc,
  handler: () => handler
});
module.exports = __toCommonJS(bulkupload_exports);
var importExeca = eval('import("execa")');
var command = "bulkupload";
var desc = "Uploads the provided ECS state to the provided World";
var builder = (yargs) => yargs.options({
  statePath: { type: "string", demandOption: true, desc: "Path to the ECS state to upload" },
  worldAddress: { type: "string", demandOption: true, desc: "Contract address of the World to upload to" },
  rpc: { type: "string", demandOption: true, desc: "JSON RPC endpoint" }
});
var handler = async (argv) => {
  const { execa } = await importExeca;
  const { statePath, worldAddress, rpc } = argv;
  console.log("Uploading state at ", statePath, "to", worldAddress, "on", rpc);
  const url = __dirname + "/../../src/contracts/BulkUpload.sol";
  console.log("Using BulkUpload script from", url);
  try {
    await execa("forge", [
      "script",
      "--sig",
      '"run(string, address)"',
      "--rpc-url",
      rpc,
      `${url}:BulkUpload`,
      statePath,
      worldAddress
    ]);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder,
  command,
  desc,
  handler
});
