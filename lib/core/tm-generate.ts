#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import fs from "fs";
import shell from "shelljs";
import { addTemplate,  } from "./remote-change";
import { rmDirFile, copyDir } from "../utils";
const app = new Command();

app.parse(process.argv);
const params = app.args;
const [ command ] = params;
const configPath = path.resolve(__dirname, "./tm-config.json");
const isExitConfigFile = fs.existsSync(configPath);
const configs = isExitConfigFile ? JSON.parse(
    fs.readFileSync(
        configPath
    )
    .toString("utf-8")
    ) : {};

const isAllQS = [
    {
        type: "confirm",
        message: "would you update all templates",
        name: "isAll"
    }
]

if (!isExitConfigFile) {
    console.log("There is not found templates, please add a template first");
    shell.exit(1);
}

if (!command) {
    console.log("A template name is required by this command");
    shell.exit(1);
}


if (command === "all") {
    Object.keys(configs).map(item => {
        const tarPath = path.join(__dirname, `../template/${item}`);
        const templatePath = path.join(__dirname, `../remote-template/${item}`);
        shell.cd(templatePath);
        shell.exec(`git pull`, (code, stdin, stderr) => {
            if (code !== 0) {
                console.log(stderr);
            } else {
                rmDirFile(tarPath, () => {
                    copyDir(templatePath, tarPath);
                })
            }
        })
    })
} else if (!Object.keys(configs).includes(command)) {
    console.log(`There is not found the template ${command}!`);
    shell.exit(1);
} else {
    const tarPath = path.join(__dirname, `../template/${command}`);
    const templatePath = path.join(__dirname, `../remote-template/${command}`);
    shell.cd(templatePath);
    shell.exec(`git pull`, (code, stdin, stderr) => {
        if (code !== 0) {
            console.log(stderr);
        } else {
            rmDirFile(tarPath, () => {
                copyDir(templatePath, tarPath);
            })
        }
    })
}

