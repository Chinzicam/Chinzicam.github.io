---
title: 解决Docker镜像无法拉取问题
author: 橙子草
date: 2024-06-25 11:03:46
tags:
- Docker
categories: 
- 教程
top_img: https://pic.imgdb.cn/item/64e042c7661c6c8e5438a700.jpg
cover: https://pic.imgdb.cn/item/64e042c7661c6c8e5438a700.jpg
---

##  Docker Hub 镜像加速

> 前景提要：[解决Docker镜像无法拉取问题 | 牛马知识 (aabcc.top)](https://www.aabcc.top/archives/m7NPfx1D)，下面是我给出的方法，相对来说比较简单。

- 以下镜像站来源于互联网，可能出现宕机、转内网、关停等情况，建议同时配置多个镜像源。

#### 目前我查询的可用镜像加速

| 镜像                                                         | 镜像加速地址                              | 说明            | 其它加速                    |
| ------------------------------------------------------------ | ----------------------------------------- | --------------- | --------------------------- |
| [网友](https://gitee.com/link?target=https%3A%2F%2Fdo.nark.eu.org) | `https://do.nark.eu.org`                  |                 | Docker Hub                  |
| [阿里云](https://gitee.com/link?target=https%3A%2F%2Fcr.console.aliyun.com%2F) | `https://<your_code>.mirror.aliyuncs.com` | 需登录 系统分配 | Docker Hub 未同步最新源镜像 |

- 使用阿里云镜像进行配置时，需要登录获取。

{% asset_img 1.png %}

之后执行以下操作

1. 创建目录

```shell
sudo mkdir -p /etc/docker
```

2. 导入配置文件及其内容

```shell
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["你的镜像加速地址"]
}
EOF
```

3. 重启服务

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 配置前后对比

- 配置前:拉取镜像失败,显示连接被拒绝

{% asset_img 2.png %}

- 配置后:可成功拉取镜像

{% asset_img 3.png %}
