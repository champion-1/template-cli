#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const app = new commander_1.Command();
app
    .version("0.1.0", "-v, --version")
    .description("常用模板脚手架")
    .option("-i, --install", "init template for react-scripts")
    .option("-g, --generate", "generate template")
    .option("-r, --remove", "remove templte");
app
    .command("init [projectName]", "init projectname").alias("i")
    .command("generate <filename>", "generate something").alias("g")
    .command("remote <method, template> [origin]", "generate something", { executableFile: "remote-change" }).alias("r");
app.parse(process.argv);
//# sourceMappingURL=tm.js.map