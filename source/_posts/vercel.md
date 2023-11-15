---
title: 更新Vercel构建时使用的Nodejs版本 
date: 2023-11-10 19:26:38
author: 橙子草
tags:
- vercel
- nodejs
category:
- 教程
top_img: https://pic.imgdb.cn/item/64e453d6661c6c8e54ae04b5.jpg
cover: https://pic.imgdb.cn/item/64e453d6661c6c8e54ae04b5.jpg
---

## Vercel Node 版本的说明

官方参考：意思是设置了 engines.node 后，如果与项目的 node 版本不一致，则使用前者

> Defining the node property inside engines of a package.json file will override the selection made in the Project Settings and print a Build Step warning if the version does not match. Please avoid greater than ranges, such as >14.x or >=14, because this will match semver major versions of Node.js once available which contains breaking changes.
> For example, the range >16.2.0 would match the versions 16.2.5, 16.3.0, and 18.0.0.

