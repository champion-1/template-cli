# Template Cli

## 介绍

`tm-cli` 具有 `git`命令的特点，可以快速的集成自己的`cli`工具,可以把平时常用的模板集成到自己的cli当中。

## 开始

执行以下代码全局安装`tm-cli`。

```markdown
npm install tm-cli -g
```

## 命令

### tm  origin  [add | change] [template url]

我们可以通过这个命令来添加远程源模板，以react地址为例：

在终端输入以下命令：

 `tm remote add demo-react https://github.com/facebook/react.git`

等命令执行结束就可以添加成功一个模板。

### tm init [dirname]

输入当前的文本目录名称并选择要生成的模板就可以初始化一个项目。

eg: ` tm init demo=project`

###  tm genetate [template name]

执行当前目录可以更新当前模板

eg: ` tm generate demo-react`





