---
title: Docker
date: 2023-08-19 12:12:54
author: 橙子草
tags:
- Docker
- 微服务
- Linxu
- Dockerfile
category:
- 后端
top_img: https://pic.imgdb.cn/item/64e042c7661c6c8e5438a700.jpg
cover: https://pic.imgdb.cn/item/64e042c7661c6c8e5438a700.jpg
swiper_index: 2
---

> 在此特别感谢[黑马程序员](https://www.bilibili.com/video/BV1LQ4y127n4)提供的课程

> 本文档需对应此课程食用~

> [Docker中文文档](https://yeasy.gitbook.io/docker_practice/install/ubuntu)


# 初识Docker

## 什么是Docker

- Docker如何解决大型项目依赖关系复杂，不同组件依赖的兼容性问题？

- - Docker允许开发中将应用、依赖、函数库、配置一起`打包`，形成可移植镜像
  - Docker应用运行在容器中，使用沙箱机制，相互`隔离`
- Docker如何解决开发、测试、生产环境有差异的问题？
  - Docker景象中包含完整运行环境，包括系统函数库，仅依赖系统的Linux内核，因此可以在任意Linux操作系统上运行
- Docker是一个快速交付应用、运行应用的技术，具备以下优势
  1. 可将程序及其依赖、运行环境一起打包为一个镜像，可以迁移到任意Linux操作系统
  2. 运行时利用沙箱机制形成隔离容器，各个应用互不干扰
  3. 启动、移除都可以通过一行命令完成，方便快捷

## Docker与虚拟机的区别

- Docker可以让一个应用在任何操作系统中都十分方便的运行，而我们以前接触的虚拟机，也能在一个操作系统中，运行另外一个操作系统，保护系统中的任何应用
- 二者有什么差异呢？
  - 虚拟机(virtual machine)是在操作系统中`模拟`硬件设备，然后运行另一个操作系统。例如在Windows系统中运行CentOS系统，就可以运行任意的CentOS应用了
  - Docker仅仅是封装函数库，并没有模拟完整的操作系统

![](https://pic.imgdb.cn/item/63988f31b1fccdcd36c4c5e0.jpg)

  - 对比来看

|   特性   |  Docker  |  虚拟机  |
| :------: | :------: | :------: |
|   性能   | 接近原生 | 性能较差 |
| 硬盘占用 | 一般为MB | 一般为GB |
|   启动   |   秒级   |  分钟级  |

- 小结：Docker和虚拟机的差异
  - Docker是一个系统进程；虚拟机是在操作系统中操作系统
  - Docker体积小、启动速度快、性能好；虚拟机体积大、启动速度慢、性能一般

## Docker架构

### 镜像和容器

- Docker中有几个重要的概念
  - `镜像(Image)`：Docker将应用程序及其所需要的依赖、函数库、环境、配置等文件打包在一起，称为镜像
  - `容器(Container)`：镜像中的应用程序形成后的进程就是`容器`，只是Docker会给容器进程做隔离，对外不可见
- 一切应用最终都是代码组成，都是硬盘中的一个个字节形成的文件，只有运行时，才会加载到内存，形成进程
- 而`镜像`，就是吧一个应用在硬盘上的文件、机器运行环境、部分系统函数库文件一起打包成的文件包。这个文件包是只读的（防止你对镜像文件进行修改/污染，从而导致镜像不可用，容器从镜像中拷贝一份文件到自己的空间里来写数据）
- 而`容器`呢，就是把这些文件中编写的程序、函数加载到内存中允许形成进程，只不过要隔离起来。因此一个镜像可以启动多次，形成多个容器进程。

![](https://pic.imgdb.cn/item/63995dc9b1fccdcd36eb6a10.jpg)

### DockerHub

- 开源应用程序非常多，打包这些应用往往都是重复性劳动，为了避免这些重复劳动，人们就会将自己打包的应用镜像，例如Redis、MySQL镜像放到网络上来共享使用，就像GitHub的代码共享一样
  - DockerHub：DockerHub是一个官方的Docker镜像托管平台，这样的平台称为Docker Registry。
  - 国内也有类似于DockerHub的公开服务，例如[网易云镜像服务](https://c.163yun.com/hub)、[阿里云镜像库](https://cr.console.aliyun.com/)等
- 我们一方面可以将自己的镜像共享到DockerHub，另一方面也可以从DockerHub拉取镜像

### Docker架构

- 我们要使用Docker来操作镜像、容器，那就必须安装Docker
- Docker是一个CS架构的程序，由两部分组成
  - 服务端(server)：Docker守护进程，负责处理Docker指令，管理镜像、容器等
  - 客户端(client)：通过命令或RestAPI向Docker服务端发送指令，可以在本地或远程向服务端发送指令

![](https://pic.imgdb.cn/item/63996080b1fccdcd36efbb66.jpg)

### 小结

- `镜像：`

  - 将应用程序及其依赖、环境、配置打包在一起

- `容器：`

  - 镜像运行起来就是容器，一个镜像可以运行多个容器

- `Docker结构：`

  - 服务端：接受命令或远程请求，操作镜像或容器
  - 客户端：发送命令或者请求到Docker服务端

- `DockerHub：`
- 一个镜像托管的服务器，类似的还有阿里云镜像服务，统称为DockerRegistry

# 安装Docker

参考各大百度百科 [docker安装]([Ubuntu Docker 安装 | 菜鸟教程 (runoob.com)](https://www.runoob.com/docker/ubuntu-docker-install.html))

# Docker指令

### 常用指令

```bash
#info|version
docker info       #显示docker的系统信息，包括镜像和容器的数量
docker version    #显示docker的版本信息。
#帮助命令
docker 命令 --help #帮助命令
#镜像命令
docker images #查看所有本地主机上的镜像 可以使用docker image ls代替
docker search #搜索镜像
docker pull #下载镜像 docker image pull
docker rmi #删除镜像 docker image rm
#容器命令
docker run 镜像id #新建容器并启动
docker ps 列出所有运行的容器
docker rm 容器id #删除指定容器

#启动和停止容器
docker start 容器id	#启动容器
docker restart 容器id	#重启容器
docker stop 容器id	#停止当前正在运行的容器
docker kill 容器id	#强制停止当前容器
#退出容器
exit 		#容器直接退出
ctrl +P +Q  #容器不停止退出 	---注意：这个很有用的操作
#其他常用命令
docker run -d 镜像名  #后台启动命令
docker logs 		#查看日志
docker exec 		#进入当前容器后开启一个新的终端，可以在里面操作。（常用）
```

### 全部指令

#### **docker信息**

```bash
systemctl start docker		#启动docker服务

systemctl status docker		#查看docker服务状态

docker version				#查看docker版本

docker info					#查看docker容器信息

docker --help				#查看docker容器帮助
```

#### **镜像管理命令**

##### 1.查看本地所有镜像

```bash
docker images
```

> - REPOSITORY：镜像来自哪个仓库
> - TAG：镜像的标签信息，版本之类的信息
> - IMAGE ID：镜像创建时的id
> - CREATED：镜像创建的时间
> - SIZE：镜像文件大小

##### 2.查看具体镜像命令

```bash
docker images -a			#含中间映像层

docker images -q			#只显示镜像ID

docker images -qa			#含中间映像层

docker images --digests			#显示镜像摘要信息(DIGEST列)

docker history -H ${镜像名}			#显示指定镜像的历史创建；-H：镜像大小和日期
```

##### 3.镜像搜索

```bash
docker search Oracle			#搜索仓库Oracle镜像

docker search --filter=stars=600 Oracle			# --filter=stars=600：只显示 stars>=600 的镜像

docker search --no-trunc Oracle				# --no-trunc 显示镜像完整 DESCRIPTION 描述

docker search  --automated Oracle			# --automated ：只列出 AUTOMATED=OK 的镜像
```

##### 4.镜像下载

```bash
docker pull redis				#下载Redis官方最新镜像，相当于：docker pull redis:latest

docker pull -a redis			#下载仓库所有Redis镜像

docker pull bitnami/redis			#下载私人仓库镜像
```

##### 5.镜像删除

```bash
docker rmi redis			#单个镜像删除，相当于：docker rmi redis:latest

docker rmi -f redis			#强制删除(针对基于镜像有运行的容器进程)

docker rmi -f redis tomcat nginx		#多个镜像删除，不同镜像间以空格间隔
```

#### **容器管理**

>  对于容器的操作可使用CONTAINER ID 或 NAMES

##### 1.运行容器

```text
docker run -d --name=redis redis:latest
```

• run：代表启动容器
• -d：以后台方式运行
• --name：指定一个容器的名字，此后操作都需要使用这个名字来定位容器。
• redis:latest：容器所使用的镜像名字

##### 2.容器启动

```bash
docker start redis			#启动一个或多个已经被停止的容器

docker restart redis		#重启容器
```

##### 3.查看容器

```bash
docker ps						#查看正在运行的容器

docker ps -q					#查看正在运行的容器的ID

docker ps -a					#查看正在运行+历史运行过的容器

docker ps -s					#显示运行容器总文件大小
```

- CONTAINER ID：容器启动的id
- IMAGE：使用哪个镜像启动的容器
- COMMAND：启动容器的命令
- CREATED：创建容器的时间
- STATUS：容器启动时间
- PORTS：容器映射到宿主机的端口
- NAMES：容器启动的名字

##### 4.容器的停止与删除

```bash
docker stop redis					#停止一个运行中的容器

docker kill redis					#杀掉一个运行中的容器

docker rm redis						#删除一个已停止的容器

docker rm -f redis					#删除一个运行中的容器

docker rm -f $(docker ps -a -q)			#删除多个容器
docker ps -a -q | xargs docker rm 

docker rm -v redis					# -v 删除容器，并删除容器挂载的数据卷
```

##### 5.容器的进入与退出

```bash
docker run -it redis /bin/bash				#使用run方式在创建时进入

docker exec -it redis /bin/bash				#使用交互模式进入容器

exit			#关闭容器并退出
```

##### 6.容器与主机间数据拷贝（容器外操作）

```bash
docker cp Redis:/${container_path} ${local_path}		#将Redis容器中的文件copy至本地路径

docker cp ${local_path} Redis:/${container_path}/		#将主机文件copy至Redis容器
```

##### 7.查看容器日志

```bash
docker logs Redis					#查看redis容器日志

docker logs --since="2023-08-21" --tail=2 redis		#查看容器redis从2021年09月15日后的最新2条日志

docker logs -f -t --tail=2 redis	#查看redis最新容器日志
```

- -f ：跟踪日志输出
- -t ：显示时间戳
- --tail ：仅列出最新N条容器日志


# Docker的基本操作

## 镜像制作

### 镜像名称

- 首先来看下镜像的名称组成：

  - 镜像名称一般分为两部分：[repository]:[tag]

    例如`mysql:5.7`，这里的mysql就是repository，5.7就是tag，合在一起就是镜像名称，代表5.7版本的MySQL镜像

  - 在没有指定tag时，默认是latest，代表最新版本的镜像，例如`mysql:latest`

### 镜像命令

- 常见的镜像命令如下图
  [](https://pic.imgdb.cn/item/639ee11bb1fccdcd3673fdf8.jpg)

### 去DockerHub中搜索并拉取一个Redis镜像

1. 去DockerHub中搜索Redis镜像
2. 查看Redis镜像的名称和版本
3. 利用`docker pull`命令拉取镜像
4. 使用`docker save`命令，将`redis:latest`打包成一个`redis.tar`包
5. 使用`docker rmi`删除本地的`redis:latest`
6. 利用`docker load`重新加载`redis.tar`文件

## 容器操作

### 容器相关命令

- 容器操作命令如图
![](https://pic.imgdb.cn/item/639fddd8b1fccdcd36f5c90b.jpg)
- 容器保护三个状态
  - 运行：进程正常运行
  - 暂停：进程暂停，CPU不再运行，不释放内存
  - 停止：进程终止，回收进程占用的内存、CPU等资源
    - 暂停和停止的操作系统的处理方式不同，暂停是操作系统将容器内的进程挂起，容器关联的内存暂存起来，然后CPU不再执行这个进程，但是使用`unpause`命令恢复，内存空间被恢复，程序继续运行。
    - 停止是直接将进程杀死，容器所占的内存回收，保存的仅剩容器的文件系统，也就是那些静态的资源
    - `docker rm` 是将文件系统也彻底删除，也就是将容器彻底删除掉了
- `docker run`：创建并运行一个容器，处于运行状态
- `docker pause`：让一个运行的容器暂停
- `docker unpause`：让一个容器从暂停状态恢复运行
- `docker stop`：停止一个运行的容器
- `docker start`：让一个停止的容器再次运行
- `docker rm`：删除一个容器

### 案例一

- 创建并运行nginx容器的命令

  ```BASH
  docker run --name containerName -p 80:80 -d nginx
  ```
  
- 命令解读

  - `docker run`：创建并运行一个容器
  - `--name`：给容器起一个名字，例如叫做myNginx
  - `-p`：将宿主机端口与容器端口映射，冒号左侧是宿主机端口，右侧是容器端口
  - `-d`：后台运行容器
  - `nginx`：镜像名称，例如nginx

- 这里的`-p`参数，是将容器端口映射到宿主机端口

- 默认情况下，容器是隔离环境，我们直接访问宿主机的80端口，肯定访问不到容器中的nginx

- 现在，容器的80端口和宿主机的80端口关联了起来，当我们访问宿主机的80端口时，就会被映射到容器的80端口，这样就能访问nginx了

- 那我们再浏览器输入虚拟机ip:80就能看到nginx默认页面了

### 小结

- `docker run`命令常见的参数有哪些？
  - `--name`：指定容器名称
  - `-p`：指定端口映射
  - `-d`：让容器后台运行
- 查看容器日志的命令
  - `docker logs`
  - 添加`-f`参数可以持续查看日志
- 查看容器状态：
  - `docker ps`
  - `docker ps -a` 查看所有容器，包括已停止的

现在是不是感觉修改文件好麻烦，因为没给提供vi命令，不能直接编辑，所以这就要用到我们下面说的数据卷了

## 数据卷

- 在之前的nginx案例中，修改nginx的html页面时，需要进入nginx内部。并且因为没有编译器，修改文件也很麻烦，这就是容器与数据（容器内文件）耦合带来的后果，如果我们另外运行一台新的nginx容器，那么这台新的nginx容器也不能直接使用我们修改好的html文件，具有很多缺点
  1. 不便于修改：当我们要修改nginx的html内容时，需要进入容器内部修改，很不方便
  2. 数据不可服用：由于容器内的修改对外是不可见的，所有的修改对新创建的容器也是不可复用的
  3. 升级维护困难：数据在容器内，如果要升级容器必然删除旧容器，那么旧容器中的所有数据也跟着被删除了（包括改好的html页面）
- 要解决这个问题，必须将数据和容器解耦，这就要用到数据卷了

### 什么是数据卷

- 数据卷（volume）是一个虚拟目录，指向宿主机文件系统中的某个目录
![](https://pic.imgdb.cn/item/639fed1bb1fccdcd360dfed9.jpg)
- 一旦完成数据卷挂载，对容器的一切操作都会作用在对应的宿主机目录了。这样我们操作宿主机的/var/lib/docker/volumes/html目录，就等同于操作容器内的/usr/share/nginx/html目录了

### 数据集操作命令

- 数据卷操作的基本语法如下

  ```BASH
  docker volume [COMMAND]
  ```
  
- `docker volume`命令是数据卷操作，根据命令后跟随的`command`来确定下一步的操作

  - `create`：创建一个volume
  - `inspect`：显示一个或多个volume的信息
  - `ls`：列出所有的volume
  - `prune`：删除未使用的volume
  - `rm`：删除一个或多个指定的volume

### 创建和查看数据集

需求：创建一个数据卷，并查看数据卷在宿主机的目录位置

1. 创建数据卷

   ```BASH
   docker volume create html
   ```
   
2. 查看所有数据

   ```BASH
   docker volume ls
   ```
   
   结果
   
   ```
   [root@localhost ~]# docker volume ls
   DRIVER    VOLUME NAME
   local     html
   ```
   
3. 查看数据卷详细信息卷

   ```BASH
   docker volume inspect html
   ```
   
   结果
   
   ```BASH
   [root@localhost ~]# docker volume inspect html
   [
       {
           "CreatedAt": "2022-12-19T12:51:54+08:00",
           "Driver": "local",
           "Labels": {},
           "Mountpoint": "/var/lib/docker/volumes/html/_data",
           "Name": "html",
           "Options": {},
           "Scope": "local"
       }
   ]
   ```
   
   可以看到我们创建的html这个数据卷关联的宿主机目录为

   ```
   /var/lib/docker/volumes/html/_data
   ```

- 小结：
  - 数据卷的作用
    - 将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全
  - 数据卷操作：
    - `docker volume create`：创建数据卷
    - `docker volume ls`：查看所有数据卷
    - `docker volume inspect`：查看数据卷详细信息，包括关联的宿主机目录位置
    - `docker volume rm`：删除指定数据卷
    - `rocker volume prune`：删除所有未使用的数据卷

### 挂载数据卷

- 我们在创建容器时，可以通过-v参数来挂载一个数据卷到某个容器内目录，命令格式如下

  ```BASH
  docker run \
      -- name myNginx \
      -v html:/root/html \
      -p 8080:80 \
      nginx \
  ```
  
- 这里的-v就是挂载数据卷的命令

  - `-v html:/root/html`：把html数据卷挂载到容器内的/root/html这个目录中

### 小结

- `docker run`的命令中通过-v参数挂载文件或目录到容器中
  - `-v [volume名称]:[容器内目录]`
  - `-v [宿主机文件]:[容器内文件]`
  - `-v [宿主机目录]:[容器内目录]`
- 数据卷挂载与目录直接挂载的区别
  - 数据卷挂载耦合度低，由docker来管理目录，但是目录较深，不好找
  - 目录挂载耦合度高，需要我们自己管理目录，不过目录容易寻找查看

# Dockerfile自定义镜像

- 常见的镜像在DockerHub就能找到，但是我们自己写的项目就必须构建镜像了。而要自定义镜像，则必须先连接镜像的结构才行。

## 镜像结构

- 镜像是将应用程序及其需要的系统函数库，环境、配置、依赖打包而成
- 以MySQL为例，来看看它的镜像组成结构

![](https://pic.imgdb.cn/item/63a066c1b1fccdcd36f5cf01.jpg)
- 简单来说，镜像就是在系统函数库、运行环境的基础上，添加应用程序文件、配置文件、依赖文件等组合，然后编写好启动脚本打包在一起形成的文件
- 我们要构建镜像，其实就是实现上述打包的过程

## Dockerfile语法

- 构建自定义镜像时，并不需要一个个文件去拷贝，打包。
- 我们只需要告诉Docker我们的镜像组成，需要哪些BaseImage、需要拷贝什么文件、需要安装什么依赖、启动脚本是什么，将来Docker会帮助我们构建镜像
- 而描述上述信息的就是Dockerfile文件。
- Dockerfile就是一个文本文件，其中包含一个个指令(Instruction)，用指令说明要执行什么操作来构建镜像，每一个指令都会形成一层Layer。

|    指令    |                     说明                     |           示例            |
| :--------: | :------------------------------------------: | :-----------------------: |
|    FROM    |                 指定基础镜像                 |       FROM centos:6       |
|    ENV     |        设置环境变量，可在后面指令使用        |       ENV key value       |
|    COPY    |         拷贝本地文件到镜像的指定目录         | COPY ./mysql-5.7.rpm /tmp |
|    RUN     |  执行Linux的shell命令，一般是安装过程的命令  |    RUN yum install gcc    |
|   EXPOSE   | 指定容器运行时监听的端口，是给镜像使用者看的 |        EXPOSE 8080        |
| ENTRYPOINT |     镜像中应用的启动命令，容器运行时调用     | ENTRYPOINTjava -jar xxjar |

## 构建Java项目

### 基于Ubuntu构建Java项目

需求：基于Ubuntu镜像构建一个新镜像，运行一个Java项目

1. 创建一个空文件夹docker-demo

   ```BASH
   mkdir /tmp/docker-demo
   ```
   
2. 将docker-demo.jar文件拷贝到docker-demo这个目录

3. 拷贝jdk8.tar.gz文件到docker-demo这个目录

4. 在docker-demo目录下新建Dockerfile，并写入以下内容

   ```BASH
   # 指定基础镜像
   FROM ubuntu:16.04
   
   # 配置环境变量，JDK的安装目录
   ENV JAVA_DIR=/usr/local
   
   # 拷贝jdk的到JAVA_DIR目录下
   COPY ./jdk8.tar.gz $JAVA_DIR/
   
   # 安装JDK
   RUN cd $JAVA_DIR && tar -xf ./jdk8.tar.gz && mv ./jdk1.8.0_44 ./java8
   
   # 配置环境变量
   ENV JAVA_HOME=$JAVA_DIR/java8
   ENV PATH=$PATH:$JAVA_HOME/bin
   
   # 拷贝java项目的包到指定目录下，我这里是/tmp/app.jar
   COPY ./docker-demo.jar /tmp/app.jar
   
   # 暴露端口，注意这里是8090端口，如果你之前没有关闭防火墙，请关闭防火墙或打开对应端口，云服务器同理
   EXPOSE 8090
   
   # 入口，java项目的启动命令
   ENTERPOINT java -jar /tmp/app.jar
   ```
   
5. 在docker-demo目录下使用

   ```
   docker build
   ```

   命令构建镜像

   ```BASH
   docker build -t javaweb:1.0 .
   ```
   
6. 使用docker images命令，查看镜像

   ```bash
   ubuntu@ubuntu:~$ docker images
   REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
   javaweb      1.0       4a18ff6a03be   6 hours ago     660MB
   nginx        latest    605c77e624dd   20 months ago   141MB
   redis        latest    7614ae9453d1   20 months ago   113MB
   mysql        5.7.31    42cdba9f1b08   2 years ago     448MB
   ```
   
7. 创建并运行一个docker_demo容器

   ```BASH
   docker run --name testDemo -p 8090:8090 -d javaweb:1.0
   ```
   
8. 浏览器访问http://192.168.244.192:8090/hello/count，即可看到页面效果(注意修改虚拟机ip)
{%asset_img image.png%}

### 基于Java8构建Java项目

- 虽然我们可以基于Ubuntu基础镜像，添加任意自己需要的安装包来构建镜像，但是却比较麻烦。所以大多数情况下，我们都可以在一些安装了部分软件的基础镜像上做改造。
- 我们刚刚构建的Java项目有一个固定的死步骤，那就是安装JDK并配置环境变量，我们每次构建Java项目的镜像的时候，都需要完成这个步骤，所以我们可以找一个已经安装好了JDK的基础镜像，然后在其基础上来构建我们的Java项目的镜像

需求：基于java:8-alpine镜像，将一个Java项目构建为镜像

1. 新建一个空目录(或者继续使用`/tmp/docker-demo`目录)

2. 将docker-demo.jar复制到该目录下(继续使用刚刚的目录就不用管)

3. 在目录中新建一个文件，命名为Dockerfile，并编写该文件(修改为如下样子就好)

   ```BASH
   # 将openjdk:8作为基础镜像
   FROM openjdk:8
   # 拷贝java项目的包到指定目录下，我这里是/tmp/app.jar
   COPY ./docker-demo.jar /tmp/app.jar
   # 暴露端口
   EXPOSE 8090
   # 入口
   ENTRYPOINT java -jar /tmp/app.jar
   ```
   
4. 构建镜像

   ```BASH
   docker build -t docker_demo:2.0 .
   ```
   
5. 创建并运行一个docker_demo容器(在此之前停止之前的docker_demo容器)

   ```BASH
   docker run --name testDemo02 -p 8090:8090 -d docker_demo:2.0
   ```
   
6. 浏览器访问http://192.168.128.130:8090/hello/count，即可看到页面效果

## 小结

1. Dockerfile本质就是一个文件，通过指令描述镜像的构建过程
2. Dockerfile的第一行必须是FROM，从一个基础镜像来构建
3. 基础镜像可以使基本操作系统，如Ubuntu，也可以是其他人制作好的镜像，例如openjdk:8

# 总结


[{% asset_img favicon.vnd.microsoft.icon %}](https://static.zhihu.com/heifetz/favicon.ico) [什么是Docker--程序员小灰](https://zhuanlan.zhihu.com/p/187505981)

- 作为程序员我们应`怎样理解docker？`
  - 容器技术的`起源`
    - 假设公司正在秘密研发下一个“今日头条”APP，我们姑且称为明日头条，程序员自己从头到尾搭建了一套环境开始写代码，写完代码后程序员要把代码交给测试同学测试，这时测试同学开始从头到尾搭建这套环境，测试过程中出现问题程序员也不用担心，大可以一脸无辜的撒娇，“明明在人家的环境上可以运行的”。
    - 测试同学测完后终于可以上线了，这时运维同学又要重新从头到尾搭建这套环境，费了九牛二虎之力搭建好环境开始上线，糟糕，上线系统就崩溃了，这时心理素质好的程序员又可以施展演技了，“明明在人家的环境上可以运行的”。
    - 从整个过程可以看到，不但我们重复搭建了三套环境还要迫使程序员转行演员浪费表演才华，典型的浪费时间和效率，聪明的程序员是永远不会满足现状的，因此又到了程序员改变世界的时候了，容器技术应运而生。
    - 有的同学可能会说：“等等，先别改变世界，我们有虚拟机啊，VMware好用的飞起，先搭好一套虚拟机环境然后给测试和运维clone出来不就可以了吗？”
  - 在没有容器技术之前，这确实是一个好办法，只不过这个办法还`没有那么好。`
    - 先科普一下，现在云计算其底层的基石就是虚拟机技术，云计算厂商买回来一堆硬件搭建好数据中心后使用虚拟机技术就可以将硬件资源进行切分了，比如可以切分出100台虚拟机，这样就可以卖给很多用户了。
  - 那么这个办法`为什么不好`呢？
    - 因为操作系统`太笨重`了，操作系统运行起来是需要占用很多资源的，大家对此肯定深有体会，刚装好的系统还什么都没有部署，单纯的操作系统其磁盘占用至少几十G起步，内存要几个G起步。
    - 我们需要的只是一个简单的应用程序，不需要把内存浪费在对我们应用程序`无用`的操作系统上。
    - 此外，还有启动时间的问题，我们知道操作系统重启是非常慢的，因为操作系统要从头到尾把该检测的都检测了，该加载的都加载上，这个过程非常缓慢，动辄就得几分钟，所以操作系统终究还是太笨重了
- 那么有没有一种技术可以让我们获得虚拟机的好处又能克服这些缺点从而一举`实现鱼和熊掌的兼得`呢？
  - 答案是肯定的，这就是`容器技术。`
- `什么是容器`
  - 容器一词的英文是container，其实container还有集装箱的意思，集装箱绝对是商业史上了不起的一项发明，大大降低了海洋贸易运输成本。让我们来看看集装箱的好处：
    - 集装箱之间相互隔离
    - 长期反复使用
    - 快速装载和卸载
    - 规格标准，在港口和船上都可以摆放
  - 回到软件中的容器，其实容器和集装箱在概念上是很相似的。
  - 现代软件开发的一大目的就是隔离，应用程序在运行时相互独立互不干扰，这种隔离实现起来是很不容易的，其中一种解决方案就是上面提到的虚拟机技术，通过将应用程序部署在不同的虚拟机中从而实现隔离。
  - 但是虚拟机技术有上述提到的各种缺点，那么容器技术又怎么样呢？
  - 与虚拟机通过操作系统实现隔离不同，容器技术只隔离应用程序的运行时环境但容器之间可以共享同一个操作系统，这里的运行时环境指的是程序运行依赖的各种库以及配置。
  - 与操作系统动辄几G的内存占用相比，容器技术只需数M空间，因此我们可以在同样规格的硬件上大量部署容器，这是虚拟机所不能比拟的，而且不同于操作系统数分钟的启动时间容器几乎瞬时启动，容器技术为打包服务栈提供了一种更加高效的方式。
- `那么我们该怎么使用容器呢？`这就要讲到docker了。
  - 注意，容器是一种通用技术，docker只是其中的一种实现。

- `什么是docker`
  - docker是一个用Go语言实现的开源项目，可以让我们方便的创建和使用容器，docker将程序以及程序所有的依赖都打包到docker container，这样你的程序可以在任何环境都会有一致的表现，这里程序运行的依赖也就是容器就好比集装箱，容器所处的操作系统环境就好比货船或港口，程序的表现只和集装箱有关系(容器)，和集装箱放在哪个货船或者哪个港口(操作系统)没有关系。
  - 因此我们可以看到docker可以屏蔽环境差异，也就是说，只要你的程序打包到了docker中，那么无论运行在什么环境下程序的行为都是一致的，程序员再也无法施展表演才华了，不会再有“在我的环境上可以运行”，真正实现“build once, run everywhere”。
  - 此外docker的另一个好处就是快速部署，这是当前互联网公司最常见的一个应用场景，一个原因在于容器启动速度非常快，另一个原因在于只要确保一个容器中的程序正确运行，那么你就能确信无论在生产环境部署多少都能正确运行。
- `如何使用docker`
  - docker中有这样几个概念：
    - dockerfile
    - image
    - container
  - 实际上你可以简单的把image理解为可执行程序，container就是运行起来的进程。
  - 那么写程序需要源代码，那么“写”image就需要dockerfile，dockerfile就是image的源代码，docker就是”编译器”。
  - 因此我们只需要在dockerfile中指定需要哪些程序、依赖什么样的配置，之后把dockerfile交给“编译器”docker进行“编译”，也就是docker build命令，生成的可执行程序就是image，之后就可以运行这个image了，这就是docker run命令，image运行起来后就是docker container。
  - 具体的使用方法就不再这里赘述了，大家可以参考docker的官方文档，那里有更详细的讲解。
- `docker是如何工作的`
  - 实际上docker使用了常见的CS架构，也就是client-server模式，docker client负责处理用户输入的各种命令，比如docker build、docker run，真正工作的其实是server，也就是docker demon，值得注意的是，docker client和docker demon可以运行在同一台机器上。
- `接下来我们用几个命令来讲解一下docker的工作流程：`
  1. docker build
     - 当我们写完dockerfile交给docker“编译”时使用这个命令，那么client在接收到请求后转发给docker daemon，接着docker daemon根据dockerfile创建出“可执行程序”image。
  2. docker run
     - 有了“可执行程序”image后就可以运行程序了，接下来使用命令docker run，docker daemon接收到该命令后找到具体的image，然后加载到内存开始执行，image执行起来就是所谓的container。
  3. docker pull
     - 其实docker build和docker run是两个最核心的命令，会用这两个命令基本上docker就可以用起来了，剩下的就是一些补充。
     - 那么docker pull是什么意思呢？
     - 我们之前说过，docker中image的概念就类似于“可执行程序”，我们可以从哪里下载到别人写好的应用程序呢？很简单，那就是APP Store，即应用商店。与之类似，既然image也是一种“可执行程序”，那么有没有”Docker Image Store”呢？答案是肯定的，这就是Docker Hub，docker官方的“应用商店”，你可以在这里下载到别人编写好的image，这样你就不用自己编写dockerfile了。
     - docker registry 可以用来存放各种image，公共的可以供任何人下载image的仓库就是docker Hub。那么该怎么从Docker Hub中下载image呢，就是这里的docker pull命令了。
     - 因此，这个命令的实现也很简单，那就是用户通过docker client发送命令，docker daemon接收到命令后向docker registry发送image下载请求，下载后存放在本地，这样我们就可以使用image了。

- ```
  最后，让我们来看一下docker的底层实现
  ```

  。

  - docker基于Linux内核提供这样几项功能实现的：
    - NameSpace
      我们知道Linux中的PID、IPC、网络等资源是全局的，而NameSpace机制是一种资源隔离方案，在该机制下这些资源就不再是全局的了，而是属于某个特定的NameSpace，各个NameSpace下的资源互不干扰，这就使得每个NameSpace看上去就像一个独立的操作系统一样，但是只有NameSpace是不够。
    - Control groups
      虽然有了NameSpace技术可以实现资源隔离，但进程还是可以不受控的访问系统资源，比如CPU、内存、磁盘、网络等，为了控制容器中进程对资源的访问，Docker采用control groups技术(也就是cgroup)，有了cgroup就可以控制容器中进程对系统资源的消耗了，比如你可以限制某个容器使用内存的上限、可以在哪些CPU上运行等等。
    - 有了这两项技术，容器看起来就真的像是独立的操作系统了。

- ```
  总结
  ```

  - docker是目前非常流行的技术，很多公司都在生产环境中使用，但是docker依赖的底层技术实际上很早就已经出现了，现在以docker的形式重新焕发活力，并且能很好的解决面临的问题
