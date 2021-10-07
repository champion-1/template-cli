"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDir = exports.copyFile = exports.rmDirFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * 删除文件夹
 */
const rmDirFile = (path, cb) => {
    let files = [];
    console.log("开始删除");
    if (fs_1.default.existsSync(path)) {
        const count = 0;
        const checkEnd = () => {
            console.log(`当前进度${count}`);
        };
        files = fs_1.default.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs_1.default.statSync(curPath).isDirectory()) {
                (0, exports.rmDirFile)(curPath, checkEnd);
            }
            else {
                fs_1.default.unlinkSync(curPath);
                checkEnd();
            }
        });
        /**有条件可以判断当前的路径 是否是不可删除的路径 */
        fs_1.default.rmdirSync(path);
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
    const readStream = fs_1.default.createReadStream(srcPath);
    const writeStream = fs_1.default.createWriteStream(tarPath);
    readStream.on("error", err => {
        if (err) {
            console.log(chalk_1.default.red(err));
        }
        cb && cb();
    });
    writeStream.on("error", err => {
        if (err) {
            console.log(tarPath, "tarPath");
            console.log(chalk_1.default.red(err));
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
    if (fs_1.default.existsSync(tarDir)) {
        fs_1.default.readdir(srcDir, (err, files) => {
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
            files.forEach(file => {
                const srcPath = path_1.default.join(srcDir, file);
                const tarPath = path_1.default.join(tarDir, file);
                fs_1.default.stat(srcPath, (err, status) => {
                    if (status.isDirectory()) {
                        fs_1.default.mkdir(tarPath, error => {
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
        fs_1.default.mkdir(tarDir, error => {
            if (error) {
                console.log(error);
                return;
            }
            (0, exports.copyDir)(srcDir, tarDir, cb);
        });
    }
};
exports.copyDir = copyDir;
//# sourceMappingURL=index.js.map