---
title: Hexo的基本使用及博客的备份迁移
author: 橙子草
date: 2022-09-10 12:36:37
top_img: https://pic.imgdb.cn/item/64d889b01ddac507cca8156c.webp
cover: https://pic.imgdb.cn/item/64d889b01ddac507cca8156c.webp
tags:
- Hexo
category:
- 教程
---

## 常用命令

- 生成新文章

>hexo new "文章名"     英文标点符号
>
>- 会生成再sourse/_posts之下

- 本地预览命令  
>hexo s

- 上传命令
> hexo g
>
> hexo d
>
> - 这两个命令执行后，网页会自动刷新
> - 或者直接 hexo g -d
- 生成新文章
> hexo new "文章名"
## 博客的迁移

### 建立分支hexo

- 在本地目录下（位置任意）右键Git bash here，执行以下指令，把chiznicam.github.io项目文件克隆到本地：

>  git clone https://github.com/Chinzicam/Chinzicam.github.io.git
- 进入Chinzicam.github.io.git，删除文件夹里除了.git的其他所有文件
- 把你的blog文件夹内的所有文件全部复制到Chinzicam.github.io.git/下
- 里面应该有个叫.gitignore的文件，没有的话就自己创建一个
- **内容如下**
- ![.gitignore](https://pic.imgdb.cn/item/631db41016f2c2beb1303521.jpg)

-创建一个叫hexo（或者blog，名字随意）的分支，并切换到这个分支
> git checkout -b hexo
- 添加所有文件到暂存区,并进行提交
> git add .
> git commit -m ""
- 推送hexo分支的文件到github仓库
> git push --set-upstream origin hexo

**至此成功搞定**

---

### 发表博客，更新博客
- 把你写好的博客.md文件放到Chinzicam.github.io\source\_posts中
- 然后执行指令，然后就可以去网站查看效果了。
> ps：如果要删除文章，直接本地删除，然后再次执行以下两句指令就行了。
> 如果不行就先执行一下 hexo clean，再执行下面语句 

	- hexo g #生成
	-  hexo d #部署 
	-  或者直接 hexo g -d
- 博客发表了，你的网站更新了（是因为chinzicam.github.io的master下的文件更新了）,接下来我们备份的blog也应该要更新
- 执行以下指令(git 提交三部曲)
> - git add . #添加所有文件到暂存区
> - git commit -m "提交一篇博客"  #提交
> - git push origin hexo 推送hexo分支到github
- 注意，以上所有的步骤都已经执行过本地关联远程仓库操作了。
- 最后
> git remote add origin git@github.com:Chinzicam/chinzicam.github.io.git
> - -b就是branch分支的意思，hexo就是hexo分支，后面的地址就是你自己的repository地址
---

### 总结

**新建博客hexo new post "你好，hexo" ，然后去source\\_posts 编辑文章，以后每次写完博客**

**通过**

> **hexo g -d**

**发布博客**

**然后通过git三部曲**
> **git add . ; git commit -m "这是注释" ; git push origin hexo** 

**更新备份github的hexo分支即可**

文件目录结构如下

![目录结构](https://pic.imgdb.cn/item/631dd63016f2c2beb151e5d7.jpg)

![](https://pic.imgdb.cn/item/631dd63616f2c2beb151ede1.jpg)

