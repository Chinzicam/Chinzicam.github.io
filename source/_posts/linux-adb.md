---
title: ubuntu和ADB系统命令考题
author: 橙子草
date: 2024-08-14 12:03:46
tags:
- Linux
- ADB
categories: 
- 教程
top_img: https://pic.imgdb.cn/item/64db67d3661c6c8e545b2aa8.jpg
cover: https://pic.imgdb.cn/item/64db67d3661c6c8e545b2aa8.jpg
---

# ubuntu系统命令考题

**一、常用命令**

1. 安装哪个软件包可以打开服务器的22端口实现远程连接?

```sh
apt install opensever-ssh
```

2. 用什么命令查看cpu信息？

```sh
lscpu
```

3. 用什么命令查看内存大小？

```sh
free -l
```

4. 用什么命令查看硬盘空间及分区？

```sh
df -h
```

5. 用什么命令查看网卡以及网卡配置的IP地址？

```sh
ifconfig
```

6. 显示内存中的所有进程用什么命令？

```sh
top
```

7. 修改当前用户的密码为123。

```sh
sudo passwd <用户名>
```

8. 关机和重启系统的命令是什么？

```
sudo reboot 重启系统
sudo shutdown now 关机
```

9. 修改文件（夹）权限的命令是什么？

```
chmod 777 文件（夹）名
```

10. 查看当前系统时间用什么命令？

```sh
date
```

11. 查看当前所在的路径用什么命令？

```sh
pwd
```

12. 持续查看某个日志文件的输出用什么命令？

 ```sh
 tail -f 文件名
 ```

13. 查看docker版本、运行中的容器、mongodb服务日志等命令？

 ```sh
 docker -version
 docker ps
 docker logs mongodb
 ```

14. 4.0平台重启docker中相关服务的命令，按docker2.0版本的命令来书写。

 ```sh
 docker-compose restart
 docker compose restart
 ```

**二、具体应用习题**

1. 在home目录下创建一个叫myTest的文件夹。

 ```sh
 mkdir myTest
 ```

2. 安装vim软件包。

 ```sh
 sudo apt update
 sudo apt install vim
 ```

3. 在myTest文件夹中创建五个demo1、demo2、demo3、demo4、demo5的文件。

 ```sh
 touch demo1.txt demo2.txt demo3.txt demo4.txt demo5.txt
 ```

4. 编辑demo1文件并写入hello world!。

 ```sh
 echo "hello world!" > myTest/demo1
 ```

5. 使用查看文件内容命令查看demo1文件内容。

 ```sh
 cat myTest/demo1
 ```

6. 在/root目录下创建二个rootTest1、rootTest2的文件夹。

 ```sh
 mkdir /root/rootTest1 /root/rootTest2
 ```

7. 将myTest文件夹拷贝到rootTest1。

 ```sh
 cp -r myTest /root/rootTest1
 ```

8. 删除home目录下的myTest文件夹（使用绝的路径删除）。

 ```sh
 rm -r myTest
 ```

9. 将myTest中的5个文件重命名为testdemo1,testdemo2,testdemo3,testdemo4,testdemo5并且移动到rootTest2中。

 ```sh
 mv /root/rootTest1/myTest/demo1 /root/rootTest2/testdemo1
 mv /root/rootTest1/myTest/demo2 /root/rootTest2/testdemo2
 mv /root/rootTest1/myTest/demo3 /root/rootTest2/testdemo3
 mv /root/rootTest1/myTest/demo4 /root/rootTest2/testdemo4
 mv /root/rootTest1/myTest/demo5 /root/rootTest2/testdemo5
 ```

10. 给rootTest2这个文件夹以及文件夹内的文件赋予执行权限。

 ```sh
 chmod -R +x /root/rootTest2
 ```

11. 将/root下rootTest1文件打包压缩（分别用zip和tar各打包压缩一份）。

 ```sh
 zip /root/rootTest1.zip /root/rootTest1
 tar -czvf /root/rootTest1.tar.gz /root/rootTest1
 ```

12. 将前面打包的文件分别解压。

 ```sh
 unzip /root/rootTest1.zip
 tar -xzvf /root/rootTest1.tar.gz
 ```

13. 上传一个文件到ubuntu系统桌面上，可以使用任意方法。

> xftp等等



# 终端系统命令考题

**一、请写出以下操作对应的命令**

1. 切换终端到 loader 模式

> 这个操作通常不是通过ADB命令完成的，而是通过特定的硬件按钮或者设备制造商提供的命令。

2. 获取电脑已连接设备

```bash
adb devices
```

3. 开启终端端口

```bash
adb forward tcp:5555 localabstract:shell
```

4. 通过ip连接终端 

```bash
telnet <设备IP> 5555
```

5. 终端按键命令

```bash
adb shell input keyevent <keycode>，其中<keycode>是按键的代码
```

6. 给终端安装应用

```bash
adb install <apk文件路径>
```

7. 获取终端内部文件

```bash
adb pull <设备路径> <本地路径>
```

8. 将文件传输到终端内部

```bash
adb push <本地路径> <设备路径>
```

9. 查看设备分辨率

```bash
adb shell wm size
```

10. 查看终端版本号

```bash
adb shell getprop ro.build.version.release
```

11. 查看终端类型

```bash
adb shell getprop ro.product.model
```

12. 查看终端应用列表

```bash
adb shell pm list packages
```

13. 查看终端应用进程

```bash
adb shell ps
```

14. 查看当前终端日志

```bash
adb logcat
```

15. 查看终端端口使用

```bash
adb shell netstat
```

​    

**二、操作题**  

1. 升级面板-打开安卓设置-使用命令返回

> 这个操作通常不是通过ADB命令完成的，而是通过特定的硬件按钮或者设备制造商提供的命令。

2. 查看终端 nto1、appServer、内核日志

```bash
adb logcat | grep nto1
adb logcat | grep appServer
adb shell dmesg  需要root权限
```
3. 远程开启终端 5555 端口-远程连接终端-拷出 appServer 日志目录下的文件

> adb forward tcp:5555 localabstract:shell 连接终端，
> 然后使用telnet或ssh连接到设备，使用adb pull命令拷贝文件。

4. 确认终端 appServer 的 md5 值，替换 appServer，再次确认 md5 值确保成功替换

> 首先使用adb push将新版本的appServer推送到设备上，然后使用adb shell执行替换操作，
>
> 例如 adb shell mv /path/to/new/appServer /path/to/original/appServer，然后使用adb shell md5sum /path/to/original/appServer来确认md5值。

5. 卸载面板 m10/m8/m210 应用

```bash
adb uninstall <包名>
```
