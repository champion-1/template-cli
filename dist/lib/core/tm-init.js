#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const inquirer_1 = require("inquirer");
const utils_1 = require("../utils");
const app = new commander_1.Command();
/**
 * 解析参数必须放在前面，不然接收不到参数
*/
app.parse(process.argv);
/**
 * 选择列表
 * @param { choices }
 */
const configs = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "./tm-config.json"))
    .toString("utf-8"));
const choices = Object.keys(configs).map(item => ({ name: item, value: item }));
/**
 * 解析拿到的参数
 * @param { params, projectName }
*/
const params = app.args;
const [projectName, ...rest] = params;
/**
 * 初始化模板前问题
 * 默认 ---> myProject
 */
const defaultDirQuestion = [{
        type: "confirm",
        name: "isDefaultName",
        message: "would you init your project that name is myProject?"
    }];
const templateQuestion = [{
        type: "rawlist",
        name: "template",
        message: "Select your template",
        choices,
    }];
const promptQuestions = projectName ? templateQuestion : defaultDirQuestion.concat(templateQuestion);
/**
 * 逻辑处理
 */
if (!projectName) {
    (0, inquirer_1.prompt)(defaultDirQuestion).then(res => {
        if (res.isDefaultName) {
            (0, inquirer_1.prompt)(templateQuestion).then(tem => {
                initHandler(tem.template);
            });
        }
    });
}
else {
    (0, inquirer_1.prompt)(templateQuestion).then(tem => {
        initHandler(tem.template, projectName);
    });
}
// prompt(promptQuestions).then(res => {
//     const { isDefaultName, template } = res;
//     if (!isDefaultName && !projectName) {
//     console.log(isDefaultName, !projectName, template, "template")
//         // throw new Error("");
//         return 0
//     } 
// }).catch(err => {
//     console.log(chalk.red(err));
// })
// if (params.length === 0) {
//     prompt([
//         {
//         }, 
//         {
//             type: "rawlist",
//             name: "template",
//             message: "Select your template",
//             choices,
//         }
//     ])
//     .then (res => {
//         if (res) {
//             const baseDirname = projectName ? path.resolve(projectName) : path.resolve("myProject")
//             console.log(`Start to init a project in ${chalk.green(baseDirname)}`)
//         }
//     })
// }
function initHandler(tem, basepath = "myProject") {
    const baseDir = path_1.default.resolve(basepath);
    console.log(`Start to init a project in ${chalk_1.default.green(baseDir)}`);
    const temPath = path_1.default.join(__dirname, `../template/${tem}`);
    (0, utils_1.copyDir)(temPath, baseDir);
}
