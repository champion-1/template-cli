/**
 * 删除文件夹
 */
export declare const rmDirFile: (path: string, cb?: (() => void) | undefined) => void;
/**
 * 复制文件到当前目录
 */
export declare const copyFile: (srcPath: string, tarPath: string, cb?: (() => void) | undefined) => void;
/**
 * 复制当前目录
 */
export declare const copyDir: (srcDir: string, tarDir: string, cb?: (() => void) | undefined) => void;
