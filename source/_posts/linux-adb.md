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
opensever-ssh
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
chmod
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
 mkdir -p /home/myTest
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

8. 删除home目录下的myTest文件夹（使用绝对路径删除）。

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
>  或者for循环

```bash
touch a.sh
写入以下内容
for i in {1..5} do mv demo$i testdemo$i done
./a.sh
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

---

# 终端系统命令考题（第二版）

一、请写出以下操作对应的命令

1.	下面哪些场景用到ADB命令。（`ABCDG`）
   A：切换终端到loader模式
   B：获取电脑已连接设备
   C：推送拉取终端文件
   D：安装APK（文件在电脑中）
   E：安装APK（文件在终端中）
   F：查看终端版本、类型等
   G：开启终端远程端口（接USB线的情况）
   H：开启终端远程端口（网络连接的情况）
2.	下面哪些场景用到ADB SHELL或者XSHELL执行命令。 (`EFH`)
   A：切换终端到loader模式
   B：获取电脑已连接设备
   C：推送拉取终端文件
   D：安装APK（文件在电脑中）
   E：安装APK（文件在终端中）
   F：查看终端版本、类型等
   G：开启终端远程端口（接USB线的情况）
   H：开启终端远程端口（网络连接的情况）
3.	填写切换终端到loader模式的命令

```BASH
adb reboot loader
```


4.	填写获取电脑已连接设备的命令。

```bash
adb devices
```

5.	开启终端远程ADB连接的方法请在下面中勾选出来（多选）。 (`BC`)
   A：用USB线直连在CMD窗口中输入setprop service.adb.tcp.port 5555 && setprop ctl.restart adbd
   B：通过网络连接在xshell窗口中输入setprop service.adb.tcp.port 5555 && setprop ctl.restart adbd
   C：用USB线直连在CMD窗口中输入adb tcpip 5555
   D：通过网络连接在CMD窗口中输入adb tcpip 5555

6.	终端开启远程端口后用什么命令连接终端？（只需要写出命令即可，不用加具体终端IP）

```bash
adb connect
```

7. 网络连接终端的远程端口号是什么？

> 2223

8. 终端安装APK包用什么命令？（只需要写出命令即可，不用加具体包名）

```bash
adb install
```

9. 拉取终端内部文件用什么命令？（只需要写出命令即可，不用加具体路径）

```bash
adb pull
```

10. 推送文件到终端内部用什么命令？（只需要写出命令即可，不用加具体路径）

```bash
adb push
```

11. 查看终端版本号命令是哪个？ (`A`)
    A：getprop | grep ro.product.version
    B：setprop sys.display.timeline 1
    C：setprop persist.sys.resolution
    D：getprop | grep ro.vendor.product.model

12. 查看终端类型是哪个命令？ (`D`)
    A：getprop | grep ro.product.version
    B：setprop sys.display.timeline 1
    C：setprop persist.sys.resolution
    D：getprop | grep ro.vendor.product.model

13. 查看终端应用列表用哪个命令？

```BASH
pm list package
```

14. 查看终端NTO1进程命令。

```bash
ps -ef | grep NTO1
```

15. 查看当前终端某个服务的即时日志命令？（只需要写出命令即可，不用加具体服务名）。

```bash
logcats -s + 服务名
```


16.	查看终端当前有哪些端口在使用？

```bash
netstat -nlp
```


二、操作题
1.	给10寸面板安装apk.

```bash
adb install -r -d  本地apk路径
```


2.	卸载10面板APK。

```bash
adb root
adb pm list package
adb shell pm path com.ruihe.M10
adb shell rm 上面获取的包路径
```


3.	导出终端appServer日志目录下的某个文件（提示：appServer日志所在路径/data/rk3288/log/）

```bash
adb pull /data/rk3288/log/ D:/
```

4.	替换终端appServer，并对比前后的MD5值确认已经替换（提示：记得先查看原来的MD5值，appServer文件所在路径/data/rk3288/log/）

```bash
adb shell md5sum /data/rk3288/log/appServer
adb root
adb push 本地appServer路径 /data/rk3288/log/appServer
adb shell md5sum /data/rk3288/log/appServer
```



---



# 终端系统命令考题

**一、请写出以下操作对应的命令**

1. 切换终端到 loader 模式

```bash
adb reboot loader
```

2. 获取电脑已连接设备

```bash
adb devices
```

3. 开启终端端口

```bash
setprop service.adb.tcp.port 5555 && setprop ctl.restart adbd
```

4. 通过ip连接终端 

```bash
adb connect <设备ip>
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
wm size
```

10. 查看终端版本号

```bash
getprop | grep ro.product.version
```

11. 查看终端类型

```bash
getprop | grep ro.vendor.product.model
```

12. 查看终端应用列表

```bash
pm list package
```

13. 查看终端应用进程

```bash
ps -ef | grep 应用
```

14. 查看当前终端日志

```bash
adb logcat
```

15. 查看终端端口使用

```bash
netstat -nlp
```

​    

**二、操作题**  

1. 升级面板-打开安卓设置-使用命令返回

```bash
adb install apk
am start com.android.settings/com.android.settings.Settings
input 4
```

2. 查看终端 nto1、appServer、内核日志

```bash
logcat -s INNO
logcat -s appServer
dmesg
```
3. 远程开启终端 5555 端口-远程连接终端-拷出 appServer 日志目录下的文件

```bash
ssh root:123@ip 2223
setprop service.adb.tcp.prot 5555 && setprop ctl.restart.adbd
使用adb
adb connect ip
adb root
adb pull /data/rk3288/log/ d:\
```

4. 确认终端 appServer 的 md5 值，替换 appServer，再次确认 md5 值确保成功替换

```bash
adb shell md5sum /vendor/bin/appServer
adb root
adb push 本地appServer路径 /vendor/bin/appServer
adb shell md5sum /vendor/bin/appServer
```

5. 卸载面板 m10/m8/m210 应用

```bash
adb root
adb shell pm list package
adb shell pm path com.ruihe.m8
adb shell rm 获取的路径
```
