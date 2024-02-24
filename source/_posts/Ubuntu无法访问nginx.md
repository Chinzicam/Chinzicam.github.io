---
title: Ubuntu虚拟机docker配置镜像服务--无法访问
date: 2023-08-20 18:12:54
author: 橙子草
tags:
- Docker
- 微服务
category:
- 教程
top_img: https://pic.imgdb.cn/item/64e453d6661c6c8e54ae04b5.jpg
cover: https://pic.imgdb.cn/item/64e453d6661c6c8e54ae04b5.jpg
---

> 参考链接：
https://paperen.com/post/docker-net-settings;
https://www.cnblogs.com/shawhe/p/11209678.html;

在VMWare中创建了一个Ubuntu20.04虚拟机，重新复习一下docker命令，随便搞个nginx镜像玩玩，但是出现了标题所说的问题。

### 复现步骤：

```bash
docker pull nginx  #拉取一下nginx镜像
```

```bash
docker images  #查看所有镜像
```

{% asset_img image.png %}

```bash
docker run --name mn -p 80:80 -d nginx # 启动nginx容器
```
```bash
docker ps # 查看正在运行的容器
```

{% asset_img image1.png %}

--- 

但是此时使用命令 `docker ps` 可以看见容器已经成功运行，但是无论是外部使用 `虚拟机ip＋端口` ，还是内部 `localhost:80` 都无法成功访问ngin页面。

### 解决方法:

添加参数 `--net=host`

```bash
docker run --name mn --net=host -p 80:80 -d nginx
```
最重要的就是`--net=host`参数，如果不指定host会默认使用bridge桥接方式进行网络连接，这样在虚拟机中的浏览器是无法访问nginx欢迎界面的

在虚拟机的浏览器中输入`locolhost`就可以访问啦

{% asset_img image2.png %}

{% asset_img image3.png %}

### 最后

总结一下，若宿主机无法访问到容器的端口一般有以下几个排查思路：

- 宿主机的防火墙
- 容器中的相关服务是否已经开启（比如nginx、apache）
- 通过netstat看看宿主机相关端口是否listen中
- 容器中netstat与尝试curl一下自身的服务端口
- 如果上面都没发现问题，尝试使用host连接类型，让容器直接使用宿主机的端口