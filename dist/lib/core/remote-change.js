#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyDir = exports.addTemplate = void 0;
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const shelljs_1 = __importDefault(require("shelljs"));
const inquirer_1 = require("inquirer");
const index_1 = require("../utils/index");
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
const baseTemplatePath = path_1.default.resolve(__dirname, `../remote-template`);
const baseTarPath = path_1.default.resolve(__dirname, `../template/`);
const tarPath = path_1.default.resolve(__dirname, `../template/${template}`);
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
];
/**配置文件 */
const configPath = path_1.default.resolve(__dirname, "./tm-config.json");
const isExitConfigFile = fs.existsSync(configPath);
const configs = isExitConfigFile ? JSON.parse(fs.readFileSync(configPath)
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
 * 增加模块
 */
const onAddModule = () => {
    const _config = Object.assign(Object.assign({}, configs), { [template]: remoteUrl });
    fs.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            // const origin = repo.find(item => remoteUrl.includes(item));
            const reg = /http(s):\/\/\S+?\//g;
            const filePath = remoteUrl.split(reg);
            // const finalPath = filePath[filePath.length - 1].slice(0,-4);
            if (fs.existsSync(templatePath) && (0, exports.isEmptyDir)(templatePath)) {
                (0, exports.addTemplate)(template, remoteUrl);
            }
            else if (fs.existsSync(templatePath) && !(0, exports.isEmptyDir)(templatePath)) {
                (0, index_1.rmDirFile)(templatePath, () => {
                    if (fs.existsSync(tarPath)) {
                        (0, index_1.rmDirFile)(tarPath, () => {
                            (0, exports.addTemplate)(template, remoteUrl);
                        });
                    }
                    else {
                        (0, exports.addTemplate)(template, remoteUrl);
                    }
                });
            }
            else {
                fs.mkdir(templatePath, error => {
                    if (!error) {
                        (0, exports.addTemplate)(template, remoteUrl);
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
};
/**
 * 改模板
 */
const onChangeModule = () => {
    const _config = Object.assign(Object.assign({}, configs), { [template]: remoteUrl });
    fs.writeFile(configPath, JSON.stringify(_config), err => {
        if (!err) {
            (0, index_1.rmDirFile)(templatePath, () => {
                (0, index_1.rmDirFile)(tarPath, () => {
                    (0, exports.addTemplate)(template, remoteUrl);
                    console.log(chalk_1.default.green(`template ${template}'s remote address have been changed!`));
                });
            });
        }
        else {
            console.log(err);
        }
    });
};
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
if (!isExitConfigFile) {
    fs.writeFile(configPath, JSON.stringify({}), error => {
        if (error) {
            shelljs_1.default.exit(1);
        }
    });
}
if (!fs.existsSync(baseTemplatePath)) {
    fs.mkdir(baseTemplatePath, err => {
        if (err) {
            console.log(chalk_1.default.red("Something errored when create remote dir"));
        }
    });
}
if (!fs.existsSync(baseTarPath)) {
    fs.mkdir(baseTarPath, err => {
        if (err) {
            console.log(chalk_1.default.red("Something errored when create remote dir"));
        }
    });
}
if (command === "add" && !Object.keys(configs).includes(template)) {
    onAddModule();
}
else if (command === "add" && Object.keys(configs).includes(template)) {
    (0, inquirer_1.prompt)(sureChange).then(res => {
        if (res.sureChange) {
            onChangeModule();
        }
        else {
            shelljs_1.default.exit(1);
        }
    }).catch(err => {
        console.log(err);
        shelljs_1.default.exit(1);
    });
    // onChangeModule()
}
else if (command === "change" && Object.keys(configs).includes(template)) {
    onChangeModule();
}
else if (!Object.keys(configs).includes(template) && command === "change") {
    (0, inquirer_1.prompt)(addQS).then(res => {
        console.log(res, "res====>");
        if (res.sureAdd) {
            onAddModule();
        }
        else {
            console.log(res, "res===>error");
            shelljs_1.default.exit(1);
        }
    }).catch(err => {
        console.log(err);
        shelljs_1.default.exit(1);
    });
}
/**
 *
 * @param templateName 模板名称
 * @param tar  目标w
 * @param remotePath
 */
const addTemplate = (templateName, remotePath) => {
    const templateDir = path_1.default.resolve(__dirname, `../remote-template/${templateName}`);
    const tarDir = path_1.default.resolve(__dirname, `../template/${templateName}`);
    shelljs_1.default.cd(`${templateDir}`);
    shelljs_1.default.exec(`git clone ${remotePath}`, (code, stdout, stderr) => {
        if (code !== 0) {
            console.log(`something error: ${stderr}`);
        }
        else {
            (0, index_1.copyDir)(templateDir, tarDir, () => {
                (0, index_1.rmDirFile)(path_1.default.join(tarDir, "./.git"), () => {
                    console.log("Add a template successfully！");
                    return;
                });
            });
        }
    });
};
exports.addTemplate = addTemplate;
const isEmptyDir = (dirPath) => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.log(err);
            shelljs_1.default.exit(1);
        }
        else {
            return files.length === 0;
        }
    });
};
exports.isEmptyDir = isEmptyDir;
