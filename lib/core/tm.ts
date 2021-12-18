#!/usr/bin/env node

import { Command, createCommand, CommandOptions, ExecutableCommandOptions } from "commander";
import path from "path";
import process from "process";
const app = new Command();   
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
.command("remote <method, template> [origin]", "generate something", { executableFile:        __dirname + "/remote-change"}).alias("r")
app.parse(process.argv)

export default app;