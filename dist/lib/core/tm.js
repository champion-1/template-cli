#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const process_1 = __importDefault(require("process"));
const app = new commander_1.Command();
// const pa1 = path.join(__filename, "./remote-change.js")
// const pa2 = path.resolve(__dirname, "remote-change")
// const paths =  __dirname.split(process.cwd())
// const  relativePath =  paths[paths.length - 1];
// const basePath = relativePath.split("\\").join("/");
// const reg = /\\/
// console.log(pa1, pa2,basePath);
// const appBasePath = path
app
    .command("init [projectName]", "init projectname", { executableFile: __dirname + "/tm-init" }).alias("i")
    .command("generate <filename>", "generate something", { executableFile: __dirname + "/tm-generate" }).alias("g")
    .command("remote <method, template> [origin]", "generate something", { executableFile: __dirname + "/remote-change" }).alias("r");
app.parse(process_1.default.argv);
exports.default = app;
