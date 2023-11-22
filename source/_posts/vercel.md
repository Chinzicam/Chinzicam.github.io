---
title: 更新Vercel构建时使用的Nodejs版本 
date: 2023-11-07 19:26:38
author: 橙子草
tags:
- vercel
- nodejs
category:
- 教程
top_img: https://pic.imgdb.cn/item/64f4929b661c6c8e54191648.webp
cover: https://pic.imgdb.cn/item/64f4929b661c6c8e54191648.webp
---

## 错误日志

项目使用了Node.js 16.x版本，而这个版本已经到了官方维护的终点。
Vercel提醒你，如果在2024年2月6日或之后创建的部署将无法构建。

建议你在项目设置中将Node.js版本更新到18.x，以便在部署时使用最新的Node.js版本。这样做可以确保你的项目能够正常构建和部署，同时也能避免使用已经终止维护的Node.js版本带来的安全和稳定性问题。

{% asset_img a.png %}

## 解决方法：更新 Vercel 中 Node.js 的版本

1. 打开你的项目
2. 选择项目设置（Settings）
3. 选择通用设置（General）
4. 找到 Node.js 版本设置（Node.js Version）
5. 点击版本，选择 18.x
6. 点击保持（Save）

{% asset_img b.png %}


## 重新部署（Redeploy）

1. 打开你的项目
2. 选择部署（Deployments）
3. 找到失败的记录，选择更多菜单（三个点的图标）
4. 选择重新构建（Redeploy）
5. 弹窗对话框，直接点击右下角重新构建（Redeploy）

{% asset_img c.png %}