---
title: Hexo加装Algolia实现增加搜索文章功能
date: 2023-08-15 19:52:18
tags:
- hexo
- Algolia
category:
- 教程
top_img: https://pic.imgdb.cn/item/64db67d3661c6c8e545b2aa8.jpg
cover: https://pic.imgdb.cn/item/64db67d3661c6c8e545b2aa8.jpg

---

### Algolia介绍

- 优点：可以白嫖

- 缺点：配置完成后，如果想要搜索系统对更新后的博客都有所记录，更新博客后需要使用 hexo algolia 将内容索引到 Algolia 搜索 API 中。

### 注册并配置Algolia

无论如何，我们必须要先注册并配置好Algolia，否则我们的网站将没有Algolia的使用权限，即使开启了对Algolia的支持，也只是一片空白

[Algolia官网](https://www.algolia.com/)

只要填好邮箱和密码，然后再验证一下邮箱就可以注册完成

{% asset_img QQ截图20230815200920.jpg %}

### 新建Indices

在左侧栏的**Products**有个**Search**，我们点进去

{% asset_img image-20230815201547558.png %}

一打开就是Indices了，我们点击**Create Index**,创建了一个名为`hexo`的索引

> `Index`(索引)也就是搜索引擎中的数据库，我们所有的搜索相关信息都存在里面。

{%asset_img image-20230815201625387.png %}

这样就可以了

### 配置API Key

> 接下来我们需要配置 Algolia——API Keys 到我们自己的 hexo 站点中，关联两者，使得 Algolia 能够搜集我们 hexo 站点的数据通过 API 发送给 Aloglia

进到Algolia的[设置]([Settings | Algolia](https://dashboard.algolia.com/account/overview?searchMode=search))，点API Keys

{%asset_img image-20230815201756450.png %}

这里便可以看见appId和密钥了

{% asset_img image-20230815202003881.png %}

### 安装

需要安装 `Hexo Aloglia` 扩展，这个扩展的功能是搜集站点的内容并通过 API 发送给 Aloglia

> npm install --save hexo-algolia

安装完成后，在 hexo 站点根目录下执行hexo algolia 来搜集数据更新到我们刚创建的 Index 中

### 修改Hexo的配置文件

在`_config.yml`加上这一段：

```yml
algolia搜索: https://github.com/LouisBarranqueiro/hexo-algoliasearch
algolia:
  appId:  "xxxxxxxxxxxxxxx" # see email
  apiKey: "xxxxxxxxxxxxxxxxxxx"  # see email
  adminApiKey: "xxxxxxxxxxxxxxxxxxx"
  chunkSize: 5000
  indexName: "hexo"
  fields:
    - content:strip:truncate,0,200
    - excerpt:strip
    - gallery
    - permalink
    - photos
    - slug
    - tags
    - title
```

### 修改主题配置文件

在`_config.anzhiyu.yml`文件中修改下段内容

```yml
# Algolia search
algolia_search:
  enable: true
  hits:
    per_page: 6
```

### 上传数据至Algolia

运行以下命令

> ```bash
> hexo algolia
> ```

这样理论来说Algolia就会新增索引了

{% asset_img image-20230815203003236.png %}

### 结尾

最后运行

> hexo cl
>
> hexo g
>
> hexo s

快点去体验一下吧

{% asset_img image-20230815203052396.png %}