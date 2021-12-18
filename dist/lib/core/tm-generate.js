#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const app = new commander_1.Command();
app.parse(process.argv);
const pkgs = app.args;
console.log(pkgs, "66666----->");
