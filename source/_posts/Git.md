---
title: Git版本控制
author: 橙子草
date: 2022-09-11 10:40:40
tags:
- Git
categories: 
- 后端
top_img: https://pic.imgdb.cn/item/64d88a7d1ddac507ccaa08bf.webp
cover: https://pic.imgdb.cn/item/64d88a7d1ddac507ccaa08bf.webp
---

### 快速入门

#### 基础命令

- git init 初始化
- git status 查看仓库状态
- git add . 将所有文件添加到暂存区
- git commit -m"这里写注释"  将全部文件添加到本地仓库 
- git log 查看提交日志

- 版本回退
> git reset --hard commitID（使用git-log获取commitID）

- 查看本地分支
> 命令：git branch

- 创建本地分支
> 命令：git branch 分支名

- 切换分支(checkout)
> 命令：git checkout 分支名

- 我们还可以直接切换到一个不存在的分支（创建并切换）
> 命令：git checkout -b 分支名

- 合并分支(merge)
> 一个分支上的提交可以合并到另一个分支
命令：git merge 分支名称
退出时输入【:wq】

- 删除分支
> 不能删除当前分支，只能删除其他分支
git branch -d b1 删除分支时，需要做各种检查
git branch -D b1 不做任何检查，强制删除

- 远程仓库添加
> git remote add origin git@github.com:Chinzicam/chinzicam.github.io.git
- 查看对接好的远程仓库
> git remote
- 推送到远程仓库
> git push origin master
> 本地分支名master和远程分支名master同名，所以省略了远程分支名，完整的指令如下：
> - git push origin master:master

#### 取别名

- 用于输出git提交日志
> alias git-log='git log --pretty=oneline --all --graph --abbrev-commit'

- 
- 用于输出当前目录所有文件及基本信息
> alias ll='ls -al'


#### Pull Request:

- Fork 代码!
- 创建自己的分支: git checkout -b feat/xxxx
- 提交您的修改: git commit -am 'feat(function): add xxxxx'
- 推送您的分支: git push origin feat/xxxx
- 提交pull request


#### Git忽略文件
有些时候我们不想把某些文件纳入版本控制中，比如数据库文件，临时文件，设计文件等
解决:
在主目录下建立".gitignore"文件，此文件有如下规则：
1. 忽略文件中的空行或以并号（#）开始的行将会被忽略
2. 可以使用Linux通配符。例如：星号（*）代表任意多个学符，问号（?）代表一个学符，方括号（[abc]）代表可选字符范围大括号（{string1,string2,...}）代表可选的学符串
3. 如果名称的最前面有一个感叹号（!），表示例外规则，将不被忽略
4. 如果名称的最前面是一个路径分隔符（／），表示要忽略的文件在此自录下，而子自录中的文件不忽略
5. 如果名称的最后面是一个路径分隔符（／），表示要忽略的是此目录下该名称的子目录，而非文件（默认文件或目录都忽略）

例如:
```yml
*.txt       #忽略所有，txt结尾的文件
!lib.txt    #但lib.txt除外
/temp       #仅忽略项目根自录下的TODO文件，不包括其它自录temp
build/      #忽略bui1d/自录下的所有文件
doc/.txt    #会忽略doc/notes.txt但不包括doc/server/arch.txt
```
- 在上传到本地仓库时，被你忽略的文件就不会参与上传。上面是在".gitignore"文件里面写的内容示例

例如:
```yml
# 在java中，所有的class、log、lock文件不参与提交到仓库
*.class
*.log
*.lock

# 在包文件中，所有的jar、war、ear文件，以及target目录下的所有文件，都不参与提交到仓库
*.jar
*.war
*.ear
target/

# 在idea中，.idea目录下的所有文件，以及iml文件，都不参与提交到仓库
.idea/
*.iml

# 在idea中，以下全部都不参与提交到仓库
*.iml
*.ipr
*.iws
.idea
.classpath
.project
.settings/
bin/

# 还有一些杂七杂八的，也都不参与提交到仓库
tmp/
*rebel.xml*
*velocity.log*
.apt_generated
.factorypath
.springBeans
```



----
### 命令大全

##### 初始化本地git仓库（创建新仓库）

```bash
git init 
```

##### 配置用户名

```bash
git config --global user.name "xxx"
```

##### 配置邮件

```bash
git config --global user.email "xxx@xxx.com" 
```

##### git status等命令自动着色

```bash
git config --global color.ui true
git config --global color.status auto
git config --global color.diff auto
git config --global color.branch auto
git config --global color.interactive auto
```

##### 删除git上的代理配置

```bash
git config --global --unset http.proxy 
```

##### clone远程仓库

```bash
git clone git+ssh://git@192.168.53.168/VT.git
```

##### 查看当前版本状态（是否修改）

```bash
git status
```

##### 添加xyz文件至index

```bash
git add xyz  
```

##### 增加当前子目录下所有更改过的文件至index

```bahs
git add .
```

##### 提交

```bash
git commit -m 'xxx'
```

##### 合并上一次提交（用于反复修改）

```bash
git commit --amend -m 'xxx' 
```

##### 将add和commit合为一步

```bash
git commit -am 'xxx'
```

##### 删除index中的文件

```bash
git rm xxx
```

递归删除

```bash
git rm -r *
```

##### 显示提交日志

```bash
git log
```

##### 显示1行日志 -n为n行

```bash
git log -1
git log -5
```

##### 显示提交日志及相关变动文件

```bash
git log --stat
git log -p -m
```

##### 显示某个提交的详细内容

```bash
git show dfb02e6e4f2f7b573337763e5c0013802e392818
```

##### 可只用commitid的前几位

```bash
git show dfb02
```

##### 显示HEAD提交日志

```bash
git show HEAD 
```

##### 显示HEAD的父（上一个版本）的提交日志 ^^为上两个版本 ^5为上5个版本

```bash
git show HEAD^
```

##### 显示已存在的tag

```bash
git tag
```

##### 增加v2.0的tag

```bash
git tag -a v2.0 -m 'xxx'
```

##### 显示v2.0的日志及详细内容

```bash
git show v2.0
```

##### 显示v2.0的日志

```bash
git log v2.0
```

##### 显示所有未添加至index的变更

```bash
git diff
```

显示所有已添加index但还未commit的变更
```bash
git diff --cached
```

##### 比较与上一个版本的差异

```bash
git diff HEAD^
```

##### 比较与HEAD版本lib目录的差异

```bash
git diff HEAD -- ./lib
```

##### 比较远程分支master上有本地分支master上没有的

```bash
git diff origin/master..master
```

##### 只显示差异的文件，不显示具体内容

```bash
git diff origin/master..master --stat
```

##### 增加远程定义（用于push/pull/fetch

```bash
git remote add origin git+ssh://git@192.168.53.168/VT.git
```

##### 显示本地分支

```bash
git branch
```

##### 显示包含提交50089的分支

```bash
git branch --contains 50089
```

##### 显示所有分支

```bash
git branch -a
```

##### 显示所有原创分支

```bash
git branch -r
```

##### 显示所有已合并到当前分支的分支

```bash
git branch --merged
```

##### 显示所有未合并到当前分支的分支

```bash
git branch --no-merged
```

##### 本地分支改名

```bash
git branch -m master master_copy
```

##### 从当前分支创建新分支master_copy并检出

```bash
git checkout -b master_copy 
```

##### 上面的完整版

```bash
git checkout -b master master_copy
```

##### 检出已存在的features/performance分支

```bash
git checkout features/performance
```

##### 检出远程分支hotfixes/BJVEP933并创建本地跟踪分支

```bash
git checkout --track hotfixes/BJVEP933
```

##### 检出版本v2.0

```bash
git checkout v2.0
```

##### 从远程分支develop创建新本地分支devel并检出

```bash
git checkout -b devel origin/develop
```

##### 检出head版本的README文件（可用于修改错误回退）

```bash
git checkout -- README
```

###### 合并远程master分支至当前分支

```bash
git merge origin/master 
```

##### 合并提交ff44785404a8e的修改

```bash
git cherry-pick ff44785404a8e
```

##### 将当前分支push到远程master分支

```bash
git push origin master
```

##### 删除远程仓库的hotfixes/BJVEP933分支

```bash
git push origin :hotfixes/BJVEP933
```

##### 把所有tag推送到远程仓库

```bash
git push --tags
```

##### 获取所有远程分支（不更新本地分支，另需merge）

```bash
git fetch
```

##### 获取所有原创分支并清除服务器上已删掉的分支

```bash
git fetch --prune 
```

##### 获取远程分支master并merge到当前分支

```bash
git pull origin master
```

##### 重命名文件README为README2

```bash
git mv README README2
```

##### 将当前版本重置为HEAD（通常用于merge失败回退）

```bash
git reset --hard HEAD
git rebase
```

##### 删除分支hotfixes/BJVEP933（本分支修改已合并到其他分支）

```bash
git branch -d hotfixes/BJVEP933
```

##### 强制删除分支hotfixes/BJVEP933

```bash
git branch -D hotfixes/BJVEP933
```

##### 列出git index包含的文件

```bash
git ls-files
```

##### 图示当前分支历史

```bash
git show-branch
```

##### 图示所有分支历史

```bash
git show-branch --all
```

##### 显示提交历史对应的文件修改

```bash
git whatchanged
```

##### 撤销提交dfb02e6e4f2f7b573337763e5c0013802e392818

```bash
git revert dfb02e6e4f2f7b573337763e5c0013802e392818
```

##### 内部命令：显示某个git对象

```bash
git ls-tree HEAD  
```

##### 内部命令：显示某个ref对于的SHA1 HASH

```bash
git rev-parse v2.0
```

##### 显示所有提交，包括孤立节点

```bash
git reflog
git show HEAD@{5}
```

##### 显示master分支昨天的状态

```bash
git show master@{yesterday}
```

##### 图示提交日志

```bash
git log --pretty=format:'%h %s' --graph
git show HEAD~3
git show -s --pretty=raw 2be7fcb476
```

##### 暂存当前修改，将所有至为HEAD状态

```bash
git stash 
```

##### 查看所有暂存

```bash
git stash list
```

##### 参考第一次暂存

```bash
git stash show -p stash@{0}
```

##### 应用第一次暂存

```bash
git stash apply stash@{0} 
```

##### 文件中搜索文本“delete from”

```bash
git grep "delete from"
git grep -e '#define' --and -e SORT_DIRENT
git gc
git fsck
```