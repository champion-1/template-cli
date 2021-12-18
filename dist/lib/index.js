#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tm_1 = __importDefault(require("./core/tm"));
function main() {
    tm_1.default
        .version("0.1.0", "-v, --version")
        .description("常用模板脚手架")
        .option("-i, --install", "init template for react-scripts")
        .option("-g, --generate", "generate template")
        .option("-r, --remove", "remove templte");
}
main();
