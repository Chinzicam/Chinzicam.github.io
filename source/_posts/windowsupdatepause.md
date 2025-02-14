---
title:  win10 11系统暂停更新
date: 2024-12-13 19:52:18
author: 橙子草
tags:
- WindowsUpdate
category:
- 教程
top_img: https://pic.imgdb.cn/item/64d8f4c31ddac507cca353d6.png
cover: https://pic.imgdb.cn/item/64dc65cd661c6c8e548aae6a.jpg
---

# win10 11系统更新 暂停100年

步骤一：

> 任务栏搜索注册表编辑器

步骤二：

> 在注册表编辑器中，打开以下目录 计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings

步骤三：

> 右键——【新建】——【DWORD (32 位)值】，将新建项命名为：FlightSettingsMaxPauseDays

步骤四：

> 双击新建的【FlightSettingsMaxPauseDays】项进入编辑状态，点击【十进制】，在【数值数据】输入自己想暂停系统更新的时长（单位：天），比如40000（100年以上），点击【确定】

步骤五：

> 关闭注册表编辑器，点击【设置】——【更新和安全】——【高级选项】，在【暂停更新】功能可看到，现在可暂停更新 40000 天

步骤六：

> 选择日期，用鼠标拖动滚动条，可看到最长可暂停许多周之后

步骤七：

> 在此时间点前，Windows 系统不会自动更新，除非在系统更新页面点击 【继续更新】
