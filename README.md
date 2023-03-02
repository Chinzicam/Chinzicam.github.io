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