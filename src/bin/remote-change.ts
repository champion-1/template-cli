#!/usr/bin/env node
import { Command } from "commander";
import fs, { constants } from "fs";
import path from "path";
import download from "download-git-repo";
import which from "which";
import { exec } from "child_process";
import chalk from "chalk";
import LogSymbols from "log-symbols";
import shell from "shelljs";
import { prompt } from "inquirer";
import {copyDir, rmDirFile} from "../util";
import logSymbols from "log-symbols";
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
const tarPath = path.resolve(__dirname, `../template/${template}`);
const repo = ["github", "gitlab"];
/**
 * 终端问题
 */
const isAllQS = [
    {
        type: "confirm",
        message: "would you update all templates",
        name: "isAll"
    }
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

if (!isExitConfigFile && command === "change") {
    console.log(`Please Add a template's url before change it!`);
    shell.exit(1);
}

if (command === "add") {
    const _config = {...configs, [template]: remoteUrl }
    fs.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            const origin = repo.find(item => remoteUrl.includes(item));
            const reg = /http(s):\/\/\S+?\//g;
            const filePath = remoteUrl.split(reg);
            const finalPath = filePath[filePath.length - 1].slice(0,-4);
            if (fs.existsSync(templatePath)) {
                download(`direct:${remoteUrl}#master`, path.join(__dirname, `../remote-template/${template}`) , {clone: true}, (error: any) => {
                    if (error) {
                        shell.cd(path.join(__dirname, `../remote-template/${template}`))
                        if(shell.exec(`git clone ${remoteUrl}`).code !== 0) {
                            console.log(error);
                        } else {
                            copyDir(templatePath, tarPath, () => {
                                rmDirFile(path.join(tarPath, "./.git"))
                                console.log("Add a template successfully！");
                            })
                        }
                    } else {
                        copyDir(templatePath, tarPath, () => {
                            rmDirFile(path.join(tarPath, "./.git"))
                            console.log("Add a template successfully！");
                        })
                    }
                });
            } else {
                fs.mkdir(templatePath, error => {
                    if (!error) {
                        download(`direct:${remoteUrl}#master`, path.join(__dirname, `../remote-template/${template}`), { clone: true }, (error: any) => {
                            if (error) {
                                console.log(error);
                            } else {
                                copyDir(templatePath, tarPath, () => {
                                    console.log("Add a template successfully！");
                                    rmDirFile(path.join(tarPath, "./.git"))
                                })
                            }
                        });
                    } else {
                        console.log(error)
                    }
                })
            }
            
        } else {
            console.log(err)
        }
    })
} else {
    const _config = {...configs, [template]: remoteUrl }
    fs.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            rmDirFile(templatePath,() => {
                download(remoteUrl, `../remote-template/${template}`, {}, (error: any) => {
                    if (error) {
                        console.log(error);
                    } else {
                        copyDir(templatePath, tarPath, () => {
                            console.log("Add a template successfully！");
                        })
                    }
                });
            })
            
        } else {
            console.log(err)
        }
    })
}
/**处理新增模板远程分支 */
function remoteUrlHandler() {
    if (command === "add") {
        fs.access(path.resolve(__dirname, "./tm-config.json"), err => {
            if (!err) {
                const config = {
                    demo1: remoteUrl
                }
                fs.writeFile(path.resolve(__dirname, "./tm-config.json"), JSON.stringify(config), "utf-8", err => {
                    if (!err) {
                        console.log(chalk.green("remote url change successfullhbnnnnnny"))
                    } else {
                        console.log(chalk.red(err))
                    }
                })
            } else {
                const config = {
                    demo1: remoteUrl
                }
                console.log(err, "err---->")
                fs.writeFile(path.resolve(__dirname, "./tm-config.json") , JSON.stringify(config), "utf-8", err => {
                    if (!err) {
                        console.log(`remote url has changed as ${chalk.bgGreen(remoteUrl)}`)
                    } else {
                        console.log(chalk.red(err))
                    }
                })
            }
        });
    
    }
}


