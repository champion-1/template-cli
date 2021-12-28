#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("../utils");
const app = new commander_1.Command();
app.parse(process.argv);
const params = app.args;
const [command] = params;
const configPath = path_1.default.resolve(__dirname, "./tm-config.json");
const isExitConfigFile = fs_1.default.existsSync(configPath);
const configs = isExitConfigFile ? JSON.parse(fs_1.default.readFileSync(configPath)
    .toString("utf-8")) : {};
const isAllQS = [
    {
        type: "confirm",
        message: "would you update all templates",
        name: "isAll"
    }
];
if (!isExitConfigFile) {
    console.log("There is not found templates, please add a template first");
    shelljs_1.default.exit(1);
}
if (!command) {
    console.log("A template name is required by this command");
    shelljs_1.default.exit(1);
}
if (command === "all") {
    Object.keys(configs).map(item => {
        const tarPath = path_1.default.join(__dirname, `../template/${item}`);
        const templatePath = path_1.default.join(__dirname, `../remote-template/${item}`);
        shelljs_1.default.cd(templatePath);
        shelljs_1.default.exec(`git pull`, (code, stdin, stderr) => {
            if (code !== 0) {
                console.log(stderr);
            }
            else {
                (0, utils_1.rmDirFile)(tarPath, () => {
                    (0, utils_1.copyDir)(templatePath, tarPath);
                });
            }
        });
    });
}
else if (!Object.keys(configs).includes(command)) {
    console.log(`There is not found the template ${command}!`);
    shelljs_1.default.exit(1);
}
else {
    const tarPath = path_1.default.join(__dirname, `../template/${command}`);
    const templatePath = path_1.default.join(__dirname, `../remote-template/${command}`);
    shelljs_1.default.cd(templatePath);
    shelljs_1.default.exec(`git pull`, (code, stdin, stderr) => {
        if (code !== 0) {
            console.log(stderr);
        }
        else {
            (0, utils_1.rmDirFile)(tarPath, () => {
                (0, utils_1.copyDir)(templatePath, tarPath);
            });
        }
    });
}
