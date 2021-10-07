#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const chalk_1 = __importDefault(require("chalk"));
const shelljs_1 = __importDefault(require("shelljs"));
const util_1 = require("../util");
const app = new commander_1.Command();
/**解析 */
app.parse(process.argv);
/**
 * 处理命令参数
 */
const params = app.args;
const [command, template, remoteUrl, ...rest] = [...params];
const opreation = ["change", "add"];
const isGitUrl = remoteUrl ? remoteUrl.includes(".git") : false;
const name = command && command === "change" ? "更改" : "新增";
const templatePath = path_1.default.resolve(__dirname, `../remote-template/${template}`);
const tarPath = path_1.default.resolve(__dirname, `../template/${template}`);
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
];
/**配置文件 */
const configPath = path_1.default.resolve(__dirname, "./tm-config.json");
const isExitConfigFile = fs_1.default.existsSync(configPath);
const configs = isExitConfigFile ? JSON.parse(fs_1.default.readFileSync(configPath)
    .toString("utf-8")) : {};
/**
 * 需要判断是否安装git
 */
if (!shelljs_1.default.which("git")) {
    shelljs_1.default.echo(`Sorry, this script requires ${chalk_1.default.bgRed("git")}`);
    shelljs_1.default.exit(1);
}
;
/**
 * 判断是否没有输入命令
 */
if (!command || !opreation.includes(command)) {
    console.log(`Unexpected token which command error, Did you inputed ${chalk_1.default.yellow("add")} or ${chalk_1.default.yellow("change")}?`);
    shelljs_1.default.exit(1);
}
if (!isGitUrl || !remoteUrl) {
    console.log(chalk_1.default.red("Unexpected token on git url"));
    shelljs_1.default.exit(1);
}
if (!isExitConfigFile && command === "change") {
    console.log(`Please Add a template's url before change it!`);
    shelljs_1.default.exit(1);
}
if (command === "add") {
    const _config = Object.assign(Object.assign({}, configs), { [template]: remoteUrl });
    fs_1.default.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            const origin = repo.find(item => remoteUrl.includes(item));
            const reg = /http(s):\/\/\S+?\//g;
            const filePath = remoteUrl.split(reg);
            const finalPath = filePath[filePath.length - 1].slice(0, -4);
            if (fs_1.default.existsSync(templatePath)) {
                (0, download_git_repo_1.default)(`direct:${remoteUrl}#master`, path_1.default.join(__dirname, `../remote-template/${template}`), { clone: true }, (error) => {
                    if (error) {
                        shelljs_1.default.cd(path_1.default.join(__dirname, `../remote-template/${template}`));
                        if (shelljs_1.default.exec(`git clone ${remoteUrl}`).code !== 0) {
                            console.log(error);
                        }
                        else {
                            (0, util_1.copyDir)(templatePath, tarPath, () => {
                                (0, util_1.rmDirFile)(path_1.default.join(tarPath, "./.git"));
                                console.log("Add a template successfully！");
                            });
                        }
                    }
                    else {
                        (0, util_1.copyDir)(templatePath, tarPath, () => {
                            (0, util_1.rmDirFile)(path_1.default.join(tarPath, "./.git"));
                            console.log("Add a template successfully！");
                        });
                    }
                });
            }
            else {
                fs_1.default.mkdir(templatePath, error => {
                    if (!error) {
                        (0, download_git_repo_1.default)(`direct:${remoteUrl}#master`, path_1.default.join(__dirname, `../remote-template/${template}`), { clone: true }, (error) => {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                (0, util_1.copyDir)(templatePath, tarPath, () => {
                                    console.log("Add a template successfully！");
                                    (0, util_1.rmDirFile)(path_1.default.join(tarPath, "./.git"));
                                });
                            }
                        });
                    }
                    else {
                        console.log(error);
                    }
                });
            }
        }
        else {
            console.log(err);
        }
    });
}
else {
    const _config = Object.assign(Object.assign({}, configs), { [template]: remoteUrl });
    fs_1.default.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            (0, util_1.rmDirFile)(templatePath, () => {
                (0, download_git_repo_1.default)(remoteUrl, `../remote-template/${template}`, {}, (error) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        (0, util_1.copyDir)(templatePath, tarPath, () => {
                            console.log("Add a template successfully！");
                        });
                    }
                });
            });
        }
        else {
            console.log(err);
        }
    });
}
/**处理新增模板远程分支 */
function remoteUrlHandler() {
    if (command === "add") {
        fs_1.default.access(path_1.default.resolve(__dirname, "./tm-config.json"), err => {
            if (!err) {
                const config = {
                    demo1: remoteUrl
                };
                fs_1.default.writeFile(path_1.default.resolve(__dirname, "./tm-config.json"), JSON.stringify(config), "utf-8", err => {
                    if (!err) {
                        console.log(chalk_1.default.green("remote url change successfullhbnnnnnny"));
                    }
                    else {
                        console.log(chalk_1.default.red(err));
                    }
                });
            }
            else {
                const config = {
                    demo1: remoteUrl
                };
                console.log(err, "err---->");
                fs_1.default.writeFile(path_1.default.resolve(__dirname, "./tm-config.json"), JSON.stringify(config), "utf-8", err => {
                    if (!err) {
                        console.log(`remote url has changed as ${chalk_1.default.bgGreen(remoteUrl)}`);
                    }
                    else {
                        console.log(chalk_1.default.red(err));
                    }
                });
            }
        });
    }
}
//# sourceMappingURL=remote-change.js.map