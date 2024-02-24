---
title: Linux远程开发
date: 2023-05-29 21:22:35
author: 橙子草
tags:
- Linux
- Java
category:
- 教程
top_img: https://pic.imgdb.cn/item/64e74de0661c6c8e54ba7635.jpg
cover: https://pic.imgdb.cn/item/64e74de0661c6c8e54ba7635.jpg

---

# Linux远程开发



以下是我这边本次教程的环境信息，可作为参考

> - IDEA：2022.2.3
>
> - 本地电脑操作系统：Win 11
>
> - 服务器：Ubuntu 20.04

## 环境准备

### 获取虚拟机的ip地址

- 首先我们需要能在我们本地电脑能够访问虚拟机，因此需要获取虚拟机的ip地址

打开你的Linux服务器，通过`ifconfig`查看服务器的ip地址

{% asset_img image-20230824152845261.png %}

如果发现命令没有安装，可以输入对应的那一行命令

```bash
sudo apt install net-tools
```

- 按下Windows键，搜索ip关键字，点击网络，这样也能看见ip地址

{% asset_img image-20230824153406957.png%}

{% asset_img image-20230824153446799.png%}

- 然后回到Windows系统，按下win+r，输入cmd打开控制台，`ping`一下刚刚复制的的ip地址，如果没有包丢失，那就表示当前Windows电脑已经可以访问到虚拟机内部了

{% asset_img image-20230824153758338.png %}

### 提供SSH支持和Java环境

- 首先我们需要在Linux的服务器内提供SSH支持，因此需要安装一个SSH服务器.

```bash
sudo apt-get install openssh-server
```

安装完成后，检查一下SSH服务是否启动成功

```bash
ps -ef | grep ssh
```

- 安装maven和Java环境

首先更新一下本地的软件包的安装信息

```bash
sudo apt update
```

安装maven，Java8的jdk，同时查看一下版本，来检验是否安装成功

```bash
sudo apt install maven

mvn -v

sudo apt install openjdk-8-jdk

java -version
```

## 远程部署

### 配置文件同步

- 创建一个远程服务的配置

{% asset_img image-20230824154926686.png %}

- 选择SFTP协议，配置一下SSH

{% asset_img image-20230824155250812.png %}

- 测试连接成功后，应用

{% asset_img image-20230824155608635.png%}

#### 将Windows文件同步到Linux

- 点击工具->部署->配置，再次进入刚刚的配置界面

{% asset_img image-20230824161049412.png%}

这样就完成了Windows与Linux文件的映射.

- 此时Linux的code目录内是没有文件的

{% asset_img image-20230824161234355.png%}

- 此时将本地文件上传到Linux上去

{% asset_img image-20230824161451023.png%}

{% asset_img image-20230824161610986.png%}

- 此时我们再次查看code目录下的文件，显然同步成功

{% asset_img image-20230824161709255.png%}

### 运行项目

- 在idea里面打开虚拟机的终端

{% asset_img image-20230824161940709.png %}

- 项目的部署上线

```bash
maven package
```

`注意：`pom.xml文件必须将此项改成false，默认为true。否则会报 `没有主清单配置` 这个错误

{% asset_img image-20230824202430940.png%}

- 找到生成的jar包

```bash
java -jar demo.jar
```

- 启动成功后，输入ip+端口+接口地址来访问项目

{% asset_img image-20230824201540580.png %}
