#!/usr/bin/env node
import { Command } from "commander";
const app = new Command();

app.parse(process.argv);
const pkgs = app.args;
console.log(pkgs, "66666----->")
