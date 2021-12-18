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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSuccessConsole = exports.copyDir = exports.copyFile = exports.rmDirFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chalk = __importStar(require("chalk"));
/**
 * 删除文件夹
 */
const rmDirFile = (path, cb) => {
    let files = [];
    console.log("开始删除");
    if (fs.existsSync(path)) {
        const count = 0;
        const checkEnd = () => {
            console.log(`当前进度${count}`);
        };
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                (0, exports.rmDirFile)(curPath, checkEnd);
            }
            else {
                fs.unlinkSync(curPath);
                checkEnd();
            }
        });
        /**有条件可以判断当前的路径 是否是不可删除的路径 */
        fs.rmdirSync(path);
        files.length === 0 && cb && cb();
    }
    else {
        cb && cb();
    }
};
exports.rmDirFile = rmDirFile;
/**
 * 复制文件到当前目录
 */
const copyFile = (srcPath, tarPath, cb) => {
    const readStream = fs.createReadStream(srcPath);
    const writeStream = fs.createWriteStream(tarPath);
    readStream.on("error", err => {
        if (err) {
            console.log(chalk.red(err));
        }
        cb && cb();
    });
    writeStream.on("error", err => {
        if (err) {
            console.log(tarPath, "tarPath");
            console.log(chalk.red(err));
        }
        cb && cb();
    });
    readStream.pipe(writeStream);
};
exports.copyFile = copyFile;
/**
 * 复制当前目录
 */
const copyDir = (srcDir, tarDir, cb) => {
    if (fs.existsSync(tarDir)) {
        fs.readdir(srcDir, (err, files) => {
            let count = 0;
            const checkend = () => {
                console.log(`${(count / files.length) * 100}%`, srcDir, tarDir);
                ++count == files.length && cb && cb();
            };
            if (err) {
                console.log(err, "err");
                checkend();
                return;
            }
            files.forEach((file) => {
                const srcPath = path.join(srcDir, file);
                const tarPath = path.join(tarDir, file);
                fs.stat(srcPath, (err, status) => {
                    if (status.isDirectory()) {
                        fs.mkdir(tarPath, error => {
                            if (error) {
                                console.log(error);
                                return;
                            }
                            (0, exports.copyDir)(srcPath, tarPath, checkend);
                        });
                    }
                    else {
                        (0, exports.copyFile)(srcPath, tarPath, checkend);
                    }
                });
            });
            files.length === 0 && cb && cb();
        });
    }
    else {
        fs.mkdir(tarDir, (error) => {
            if (error) {
                console.log(error);
                return;
            }
            (0, exports.copyDir)(srcDir, tarDir, cb);
        });
    }
};
exports.copyDir = copyDir;
const InitSuccessConsole = (filename, templateName) => {
    console.log(`The template has been initialized. Now you can start a project with the template${templateName}.
            cd ${chalk.green(filename)}..
        `);
};
exports.InitSuccessConsole = InitSuccessConsole;
