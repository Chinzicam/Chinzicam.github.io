---
title: 骑砍二控制台教程
author: 橙子草草
date: 2022-10-31 10:40:40
tags:
- 骑砍
categories: 
- 其他

top_img: https://pic.imgdb.cn/item/64d8c1821ddac507cc24012f.png
cover: https://pic.imgdb.cn/item/64d8c1821ddac507cc24012f.png

---

> 对应视频教程 [骑砍二控制台教程](https://www.bilibili.com/video/BV1iY411f76m)

> 本文档创建日期为`2022-10-31 10:40:40`，不保证时效性~


##  **骑砍2 控制台整理**

### 必要步骤(只要弄一次就行)

```java
在文档 > “ Mount and Blade II Bannerlord”>“ engine_config.txt”用记事本打开
查找到这一行：cheat_mode = 0
把0改成1 然后保存文件
```

### 1. 开启/关闭作弊

```java
~在tab上面，Esc的下面，alt+~两个一起按才能呼出控制台
打开游戏在任意界面Alt+~呼出控制台，输入config.cheat_mode 1,然后回车确认
想要关闭作弊模式的话输入config.cheat_mode 0就行
```

### 2. 个人常用快捷键

- 大地图

```java
ctrl+鼠标左键           传送
```

- 战斗场景

```java
ctrl+k                开启上帝视角

ctrl+h                玩家满血

ctrl+shift+h          坐骑满血

ctrl+F4               击晕战场上随机一名敌人

ctrl+alt+F4           击晕战场上所有敌人

ctrl+F3               击晕自己

ctrl+alt+F3           击晕所有友军
```



### 3.常用控制台代码

#### 配置相关命令

```java
输入help可获取全部控制台命令
```

####  游戏相关

- add系列

```java
加钱  --> campaign.add_gold_to_hero 数字
加科西亚马 --> campaign.add_horse 数量 
加属性点 -->	campaign.add_attribute_points_to_hero 英文全名 数字  		(不打名字只写数字就是给主角加)
加专精点 --> campaign.add_focus_points_to_hero 英文全名 数字		(不打名字就是给主角加)
加特定技能经验 --> campaign.add_skill_xp_to_hero 技能名字 经验数值 英文全名 	(不打名字就是给主角加)
加影响力 --> campaign.add_influence 数字
加家族声望 --> campaign.add_renown_to_clan 数字
加一级定居点工程等级 --> campaign.add_building_level 定居点英文名 | 建筑英文名 	( |两边一定要打空格)
随机得到一个同伴 --> campaign.add_companion
随机得到n个同伴 --> campaign.add_companions 数量 (可突破数量限制,但同伴会渐渐失踪直到伙伴限制)
获得所有打造材料100个 --> campaign.add_crafting_materials
```

- set系列

```java
主角指定技能等级 --> campaign.set_skill_main_hero 等级数值 技能英文名
主角所有技能等级 --> campaign.set_all_skills_main_hero 等级数值
所有同伴特定技能等级 --> campaign.set_skill_companion 等级数值 技能英文名
所有同伴所有技能等级 --> campaign.set_all_companion_skills 等级数值
指定人的所有技能等级 --> campaign.set_skills_of_hero 等级数值 英文全名
设置定居点的忠诚度 --> campaign.set_loyalty_of_settlement 城池名字 数值
改关系，好感度 --> campaign.change_hero_relation 数字 对方名字		（打all就是所有人）
恢复锻造体力 --> campaign.set_hero_crafting_stamina 数值 名字
```

- 控制ai指令

```java
让xx去攻击某人 --> campaign.ai_attack_party  被攻击英雄名 | 英雄名 	( |两边一定要打空格)
让xx去保护某个建筑 --> campaign ai_defend_settlement  英雄名 | 建筑英文名 	( |两边一定要打空格)
让xx去某个建筑 --> campaign ai_goto_settlement  英雄名 | 建筑英文名 	( |两边一定要打空格)
让xx去烧村 --> campaign ai_raid_village  英雄名 | 建筑英文名 	( |两边一定要打空格)
让xx去围攻xx --> campaign ai_siege_settlement  英雄名 | 建筑英文名 	( |两边一定要打空格)
```

- 杂项

```java
杀死指定hero -> campaign.kill_hero 英雄名
显示藏身处 -> campaign.show_hideouts 数字 (只能填1或者2,2是显示全部)
显示电脑内存使用情况 -> show_memory
与所有国家开战 -> campaign.start_world_war
与所有国家和平 -> campaign.start_world_peace  (？俘虏不会释放)
别人向你休战 -> campaign.start_player_vs_world_truce
别人向你开战 -> campaign.start_player_vs_world_war
```

- 评论区补充内容

> 解锁全部部件：campaign.unlock_all_crafting_pieces

> 加交易经验：campaign.add_skill_xp_hexo trade+数值

> 获取特定物品：campaign.give_item_to_main_party 物品英文名 数量 

> 改指定英雄的文化：campaign.set_hero_culture+英雄名+文化名

> 修改好感度 campaign.change_hero_relation+数值+名字或者all

> 直接给俘虏加xp（相当于加速招募俘虏）Campaign.give_prisoners_xp+数值

> 修改主角年龄 campaign.set_main_hero_age+年龄
