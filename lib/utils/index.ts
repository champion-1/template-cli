import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
/**
 * 删除文件夹
 */
export const rmDirFile = (path: string, cb?: () => void ) => {
    let files = [];
    console.log("开始删除");
    if (fs.existsSync(path)) {
        const count = 0;
        const checkEnd = () => {
            console.log(`当前进度${count}`)
        }
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
        let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()){
                rmDirFile(curPath, checkEnd)
            } else {
                fs.unlinkSync(curPath);
                checkEnd()
            }
        });
        /**有条件可以判断当前的路径 是否是不可删除的路径 */
        fs.rmdirSync(path);
        files.length === 0 && cb && cb()
    } else {
        cb && cb();
    }
    
}

/**
 * 复制文件到当前目录
 */
export const copyFile = (srcPath: string, tarPath: string, cb?: () => void) => {
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
            console.log(tarPath, "tarPath")
            console.log(chalk.red(err));
        }
        cb && cb();
    })
    readStream.pipe(writeStream);
}


/**
 * 复制当前目录
 */
 export const copyDir = (srcDir: string, tarDir: string, cb?: () => void) => {
    if (fs.existsSync(tarDir)) {
        fs.readdir(srcDir, (err:any, files:any) => {
            let count = 0;
            const checkend = () => {
                console.log(`${(count / files.length) * 100}%`, srcDir, tarDir)
                ++count == files.length && cb && cb();
            }
            if (err) {
                console.log(err, "err")
                checkend()
                return ;
            }
            files.forEach((file:any) => {
                const srcPath = path.join(srcDir, file);
                const tarPath = path.join(tarDir, file);
                fs.stat(srcPath, (err, status) => {
                    if (status.isDirectory()) {
                        fs.mkdir(tarPath, error => {
                            if (error) {
                                console.log(error);
                                return;
                            }
                            copyDir(srcPath, tarPath, checkend)
                        })
                    } else {
                        copyFile(srcPath, tarPath, checkend)
                    }
                })
            })
            files.length === 0 && cb && cb();
        })
    } else {
        fs.mkdir(tarDir, (error: any) => {
            if (error) {
                console.log(error);
                return ;
            }
            copyDir(srcDir, tarDir, cb)
        })
    }
}
export const InitSuccessConsole = (filename: string, templateName: string) => {
    console.log(
        `The template has been initialized. Now you can start a project with the template${templateName}.
            cd ${chalk.green(filename)}..
        `
    );
}
