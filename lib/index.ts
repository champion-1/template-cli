#!/usr/bin/env node

import app from "./core/tm";
function main() {
    app
    .version("0.1.0", "-v, --version")
    .description("常用模板脚手架")
    .option("-i, --install", "init template for react-scripts")
    .option("-g, --generate", "generate template")
    .option("-r, --remove", "remove templte")
}
main()