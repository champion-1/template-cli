#!/usr/bin/env node

import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Command } from "commander";
import { prompt } from "inquirer";
import { copyDir, rmDirFile, copyFile } from "../util";
const app = new Command();
/** 
 * 解析参数必须放在前面，不然接收不到参数
*/
app.parse(process.argv);
/**
 * 选择列表
 * @param { choices }
 */

const configs = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, "./tm-config.json")
    )
    .toString("utf-8")
    );
const choices = Object.keys(configs).map(item => ({name: item, value: item}));

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
}]
const templateQuestion = [{
    type: "rawlist",
    name: "template",
    message: "Select your template",
    choices,
}]
const promptQuestions = projectName ? templateQuestion : defaultDirQuestion.concat(templateQuestion);
/**
 * 逻辑处理
 */
if (!projectName) {
    prompt(defaultDirQuestion).then(res => {
        if (res.isDefaultName) {
            prompt(templateQuestion).then(tem => {
                initHandler(tem.template);
            })
        }
    })
} else {
    prompt(templateQuestion).then(tem => {
        initHandler(tem.template, projectName);
    })
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

function initHandler(tem: string, basepath: string = "myProject"): void {
    const baseDir = path.resolve(basepath);
    console.log(`Start to init a project in ${chalk.green(baseDir)}`)
    const temPath = path.join(__dirname, `../template/${tem}`);
    copyDir(temPath, baseDir)

}
