#!/usr/bin/env node
import { Command } from "commander";
import * as fs from "fs";
import path from "path";
import download from "download-git-repo";
import which from "which";
import { exec } from "child_process";
import chalk from "chalk";
import LogSymbols from "log-symbols";
import shell from "shelljs";
import { prompt } from "inquirer";
import {copyDir, rmDirFile} from "../utils/index";
const app = new Command();
/**解析 */
app.parse(process.argv);
/**
 * 处理命令参数
 */
const params = app.args;
const [command, template, remoteUrl, ...rest ] = [...params];
const opreation = ["change", "add"];
const isGitUrl = remoteUrl ? remoteUrl.includes(".git") : false;
const name = command && command === "change" ? "更改" : "新增";
const templatePath = path.resolve(__dirname, `../remote-template/${template}`);
const baseTemplatePath = path.resolve(__dirname, `../remote-template`);
const baseTarPath = path.resolve(__dirname, `../template/`);
const tarPath = path.resolve(__dirname, `../template/${template}`);
const repo = ["github", "gitlab"];
/**
 * 终端问题
 */

const addQS = [
    {
        type: "confirm",
        name: "sureAdd",
        message: "Did you mean add ?",
    },
];

const sureChange = [
    {
        type: "confirm",
        name: "sureChange",
        message: "Did you mean change the template ?",
    },
]

/**配置文件 */
    const configPath = path.resolve(__dirname, "./tm-config.json");
    const isExitConfigFile = fs.existsSync(configPath);
const configs = isExitConfigFile ? JSON.parse(
    fs.readFileSync(
        configPath
    )
    .toString("utf-8")
    ) : {};
/**
 * 需要判断是否安装git
 */
if(!shell.which("git")) {
    shell.echo(`Sorry, this script requires ${chalk.bgRed("git")}`);
    shell.exit(1);
};

/**
 * 增加模块
 */
 const onAddModule = () => {
    const _config = {...configs, [template]: remoteUrl }
    fs.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            // const origin = repo.find(item => remoteUrl.includes(item));
            const reg = /http(s):\/\/\S+?\//g;
            const filePath = remoteUrl.split(reg);
            // const finalPath = filePath[filePath.length - 1].slice(0,-4);
            if (fs.existsSync(templatePath) && isEmptyDir(templatePath)) {
                addTemplate(template, remoteUrl)
            } else if (fs.existsSync(templatePath) && !isEmptyDir(templatePath)) {
                rmDirFile(templatePath,() => {
                    if (fs.existsSync(tarPath)) {
                        rmDirFile(tarPath, () => {
                            addTemplate(template, remoteUrl)
                        })
                    } else {
                        addTemplate(template, remoteUrl);
                    }
                })
            } else {
                fs.mkdir(templatePath, error => {
                    if (!error) {
                        addTemplate(template, remoteUrl);
                    } else {
                        console.log(error)
                    }
                })
            }
            
        } else {
            console.log(err)
        }
    })
}

/**
 * 改模板
 */
const onChangeModule = () => {
    const _config = {...configs, [template]: remoteUrl }
    fs.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            rmDirFile(templatePath,() => {
                rmDirFile(tarPath, () => {
                    addTemplate(template, remoteUrl);
                    console.log(chalk.green(`template ${template}'s remote address have been changed!`))
                })
            })
            
        } else {
            console.log(err)
        }
    })
}

/**
 * 判断是否没有输入命令
 */
if (!command || !opreation.includes(command)) {
    console.log(`Unexpected token which command error, Did you inputed ${chalk.yellow("add")} or ${chalk.yellow("change")}?`);
    shell.exit(1);
}

if (!isGitUrl || !remoteUrl) {
    console.log(chalk.red("Unexpected token on git url"))
    shell.exit(1);
}
if (!isExitConfigFile) {
    fs.writeFile(configPath, JSON.stringify({}), error => {
        if (error) {
            shell.exit(1);
        }
    })
}

if (!fs.existsSync(baseTemplatePath)) {
    fs.mkdir(baseTemplatePath, err => {
        if (err) {
            console.log( chalk.red("Something errored when create remote dir"));
        }
    })
}

if (!fs.existsSync(baseTarPath)) {
    fs.mkdir(baseTarPath, err => {
        if (err) {
            console.log( chalk.red("Something errored when create remote dir"));
        }
    })
}

if (command === "add" && !Object.keys(configs).includes(template)) {
    onAddModule();
} else if (command === "add" && Object.keys(configs).includes(template)) {
    prompt(sureChange).then(res => {
        if (res.sureChange) {
            onChangeModule()
        } else {
            shell.exit(1);
        }
    }).catch(err => {
        console.log(err);
        shell.exit(1);
    })
    // onChangeModule()
}else if(command === "change" && Object.keys(configs).includes(template)){
    onChangeModule();
} else if (!Object.keys(configs).includes(template) && command === "change") {
    prompt(addQS).then(res => {
        console.log(res, "res====>")
        if (res.sureAdd) {
            onAddModule();
        } else {
            console.log(res, "res===>error")
            shell.exit(1)
        }
    }).catch(err => {
        console.log(err);
        shell.exit(1);
    })
}

/**
 * 
 * @param templateName 模板名称
 * @param tar  目标w
 * @param remotePath 
 */
export const addTemplate = (templateName: string, remotePath: string) => {
    const templateDir = path.resolve(__dirname, `../remote-template/${templateName}`);
    const tarDir = path.resolve(__dirname, `../template/${templateName}`);
    shell.cd(`${templateDir}`);
    shell.exec(`git clone ${remotePath}`, (code, stdout, stderr) => {
        if (code !== 0) {
            console.log(`something error: ${stderr}`);
        } else {
            copyDir(templateDir, tarDir, () => {
                rmDirFile(path.join(tarDir, "./.git"), () => {
                    console.log("Add a template successfully！");
                    return;
                })
            });
        }
    });
}


export const isEmptyDir = (dirPath: string): Boolean | void => {
    fs.readdir(dirPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
            console.log(err);
            shell.exit(1);
        } else {
            return files.length === 0;
        }
    })
}

