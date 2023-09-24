---
title: ElasticSearch
date: 2023-09-02 21:54:41
author: 橙子草
tags:
- ElasticSearch
- 微服务
category:
- 后端
top_img: https://pic.imgdb.cn/item/64f4929c661c6c8e54191658.webp
cover: https://pic.imgdb.cn/item/64f4929c661c6c8e54191658.webp
---

> 笔记参考[ElasticSearch教程入门到精通](https://www.bilibili.com/video/BV1hh411D7sb?p=17&vd_source=de6e3fd84bab0d52350357a7ac19860b)的前17p所书写

> 对应的代码仓库[ElasticSearch_Project](https://github.com/Chinzicam/ElasticSearch_Project)

在[官网](https://elasticsearch.cn/download/)下载自己所需要的版本,找到bat文件以管理员启动即可



**ES概括**

Elaticsearch，简称为 ES， ES 是一个开源的高扩展的分布式全文搜索引擎，Elasticsearch 是面向文档型[数据库](https://cloud.tencent.com/solution/database?from_column=20065&from=20065)，一条数据在这里就是一个文档。

{% asset_img image-20210720194230265.png %}

## **基本要素**

ES是一个文档型数据库，在与传统的[关系型数据库](https://cloud.tencent.com/product/cdb-overview?from_column=20065&from=20065)上，存在着一定的差异。下面将ES里面涉及到的元素与关系型数据库进行一一对应。

| ElasticSearch | 索引(index)      | 类型(type)    | 文档(document) | 字段(field)    |
| :------------ | :--------------- | :------------ | :------------- | :------------- |
| MySQL         | 数据库(database) | 数据表(table) | 数据行(row)    | 数据列(column) |

## **索引操作**

### **创建索引**

向 ES 服务器发 PUT 请求 ： `http://127.0.0.1:9200/shopping`。创建索引只能使用 **PUT请求** ，PUT是幂等性的，也就是说不存在的时候就会创建，存在的时候就不会重新创建而是返回索引已经存在的信息。

```javascript
{
    "acknowledged": true,//响应结果
    "shards_acknowledged": true,//分片结果
    "index": "shopping"//索引名称
}
```

 

### **查询索引**

向 ES 服务器发 **GET 请求** ： `http://127.0.0.1:9200/shopping`。

```javascript
{
    "shopping": {//索引名
        "aliases": {},//别名
        "mappings": {},//映射
        "settings": {//设置
            "index": {//设置 - 索引
                "creation_date": "1617861426847",//设置 - 索引 - 创建时间
                "number_of_shards": "1",//设置 - 索引 - 主分片数量
                "number_of_replicas": "1",//设置 - 索引 - 主分片数量
                "uuid": "J0WlEhh4R7aDrfIc3AkwWQ",//设置 - 索引 - 主分片数量
                "version": {//设置 - 索引 - 主分片数量
                    "created": "7080099"
                },
                "provided_name": "shopping"//设置 - 索引 - 主分片数量
            }
        }
    }
}
```

 

### **查看所有索引**

向 ES 服务器发 **GET 请求** ： `http://127.0.0.1:9200/_cat/indices?v`。

这里请求路径中的_cat 表示查看的意思， indices 表示索引，所以整体含义就是查看当前 ES服务器中的所有索引，就好像 [MySQL](https://cloud.tencent.com/product/cdb?from_column=20065&from=20065) 中的 show tables 的感觉，服务器响应结果如下 :

```javascript
health status index    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   shopping J0WlEhh4R7aDrfIc3AkwWQ   1   1          0            0       208b           208b
```

 

### **删除索引**

向 ES 服务器发 **DELETE 请求** ： `http://127.0.0.1:9200/shopping`。

返回结果如下：

```javascript
{
    "acknowledged": true
}
```

 

## **文档操作**

### **文档创建**

假设索引已经创建好了，接下来我们来创建文档，并添加数据。这里的文档可以类比为关系型数据库中的表数据，添加的数据格式为 JSON 格式

在 Postman 中，向 ES 服务器发 **POST 请求** ： `http://127.0.0.1:9200/shopping/_doc`，请求体JSON内容为：

```javascript
{
    "title":"小米手机",
    "category":"小米",
    "images":"http://www.gulixueyuan.com/xm.jpg",
    "price":3999.00
}
```

 

返回结果

```javascript
{
    "_index": "shopping",//索引
    "_type": "_doc",//类型-文档
    "_id": "ANQqsHgBaKNfVnMbhZYU",//唯一标识，可以类比为 MySQL 中的主键，随机生成
    "_version": 1,//版本
    "result": "created",//结果，这里的 create 表示创建成功
    "_shards": {//
        "total": 2,//分片 - 总数
        "successful": 1,//分片 - 总数
        "failed": 0//分片 - 总数
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```

 

> 注意，此处发送文档创建请求的方式必须为 POST，不能是 PUT，否则会发生错误 。

上面的数据创建后，由于没有指定数据唯一性标识（ID），默认情况下， ES 服务器会随机生成一个。

如果想要自定义唯一性标识，需要在创建时指定： `http://127.0.0.1:9200/shopping/_doc/1`，请求体JSON内容为：

```javascript
{
    "title":"小米手机",
    "category":"小米",
    "images":"http://www.gulixueyuan.com/xm.jpg",
    "price":3999.00
}
```

 

返回结果如下：

```javascript
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1",//<-----自定义唯一性标识
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 1,
    "_primary_term": 1
}
```

 

### **文档查询**

查看文档时，需要指明文档的唯一性标识，类似于 MySQL 中数据的主键查询 在 Postman 中，向 ES 服务器发 **GET 请求** ： `http://127.0.0.1:9200/shopping/_doc/1` 。

返回结果如下：

```javascript
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1",
    "_version": 1,
    "_seq_no": 1,
    "_primary_term": 1,
    "found": true,
    "_source": {
        "title": "小米手机",
        "category": "小米",
        "images": "http://www.gulixueyuan.com/xm.jpg",
        "price": 3999
    }
}
```

 

查找不存在的内容，向 ES 服务器发 **GET 请求** ：`http://127.0.0.1:9200/shopping/_doc/1001` 。返回结果如下：

```javascript
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "found": false
}
```

 

查看索引下所有数据，向 ES 服务器发 **GET 请求** ： `http://127.0.0.1:9200/shopping/_search`。

返回结果如下：

```javascript
{
    "took": 133,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            }
        ]
    }
}
```

 

### **文档删除**

删除一个文档不会立即从磁盘上移除，它只是被标记成已删除（逻辑删除）。

在 Postman 中，向 ES 服务器发 **DELETE 请求** ： `http://127.0.0.1:9200/shopping/_doc/1` 返回结果：

```javascript
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1",
    "_version": 4,
    "result": "deleted",//<---删除成功
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 4,
    "_primary_term": 1
}
```

 

### **文档修改**

#### **全量修改**

和新增文档一样，输入相同的 URL 地址请求，如果请求体变化，会将原有的数据内容覆盖

在 Postman 中，向 ES 服务器发 **POST 请求** ： `http://127.0.0.1:9200/shopping/_doc/1` 请求体JSON内容为:

```javascript
{
    "title":"华为手机",
    "category":"华为",
    "images":"http://www.gulixueyuan.com/hw.jpg",
    "price":1999.00
}
```

 

修改成功后，服务器响应结果：

```javascript
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1",
    "_version": 2,
    "result": "updated",//<---updated 表示数据被更新
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 2,
    "_primary_term": 1
}
```

 

### **局部更新**

修改数据时，也可以只修改某一给条数据的局部信息

在 Postman 中，向 ES 服务器发 **POST 请求** ： `http://127.0.0.1:9200/shopping/_update/1`。

请求体JSON内容为:

```javascript
{
 "doc": {
  "title":"小米手机",
  "category":"小米"
 }
}
```

 

返回结果如下：

```javascript
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1",
    "_version": 3,
    "result": "updated",//<----updated 表示数据被更新
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 3,
    "_primary_term": 1
}
```

 

### **URL带条件查询**

查找category为小米的文档，在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search?q=category:小米`，返回结果如下：

```javascript
{
    "took": 94,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 1.3862942,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1.3862942,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
            ......
        ]
    }
}
```

 

上述为URL带参数形式查询，这很容易让不善者心怀恶意，或者参数值出现中文会出现乱码情况。为了避免这些情况，我们可用使用带JSON请求体请求进行查询。

### **请求体带参查询**

接下带JSON请求体，还是查找category为小米的文档，在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search`，附带JSON体如下：

```javascript
{
 "query":{
  "match":{
   "category":"小米"
  }
 }
}
```

 

返回结果如下：

```javascript
{
    "took": 3,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 1.3862942,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1.3862942,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
            ......
        ]
    }
}
```

 

#### **带请求体方式的查找所有内容**

查找所有文档内容，也可以这样，在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search`，附带JSON体如下

```javascript
{
 "query":{
  "match_all":{}
 }
}
```

 

则返回所有文档内容：

```javascript
{
    "took": 2,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
            ......
        ]
    }
}
```

 

### **查询指定字段**

如果你想查询指定字段，在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search`，附带JSON体如下：

```javascript
{
 "query":{
  "match_all":{}
 },
 "_source":["title"]
}
```

 

返回结果如下：

```javascript
{
    "took": 5,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1,
                "_source": {
                    "title": "小米手机"
                }
            },
            ......
        ]
    }
}
```

 

### **分页查询**

在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search`，附带JSON体如下：

```javascript
{
 "query":{
  "match_all":{}
 },
 "from":0,
 "size":2
}
```

> **from** 代表起始页， **size** 代表页的大小
>
> 计算公式： 起始页 =（页码-1）* 每页数据条数 ，即 from=（页码-1）* size

返回结果如下：

```javascript
{
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
        ]
    }
}
```

 

### **查询排序**

如果你想通过排序查出价格最高的手机，在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search`，附带JSON体如下：

```javascript
{
 "query":{
  "match_all":{}
 },
 "sort":{
  "price":{
   "order":"desc"
  }
 }
}
```

 

返回结果如下：

```javascript
{
    "took": 96,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": null,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": null,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                },
                "sort": [
                    3999
                ]
            },
            ......
        ]
    }
}
```

 

### **多条件查询**

假设想找出小米牌子，价格为3999元的。（must相当于数据库的&&）,在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search` ，附带JSON体如下：

```javascript
{
 "query":{
  "bool":{
   "must":[{
    "match":{
     "category":"小米"
    }
   },{
    "match":{
     "price":3999.00
    }
   }]
  }
 }
}
```

 

返回结果如下：

```javascript
{
    "took": 134,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 2.3862944,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 2.3862944,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            }
        ]
    }
}
```

 

假设想找出小米和华为的牌子。（should相当于数据库的||）在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search` ，附带JSON体如下：

```javascript
{
    "query": {
        "bool": {
            "should": [
                {
                    "match": {
                        "category": "小米"
                    }
                },
                {
                    "match": {
                        "category": "华为"
                    }
                }
            ],
            "filter": {
                "range": {
                    "price": {
                        "gt": 2000
                    }
                }
            }
        }
    }
}
```

 

返回结果如下：

```javascript
{
    "took": 8,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 1.3862942,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1.3862942,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
            .....
        ]
    }
}
```

 

### **范围查询**

假设想找出小米和华为的牌子，价格大于2000元的手机。在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search` ，附带JSON体如下：

```javascript
{
 "query":{
  "bool":{
   "should":[{
    "match":{
     "category":"小米"
    }
   },{
    "match":{
     "category":"华为"
    }
   }],
            "filter":{
             "range":{
                 "price":{
                     "gt":2000
                 }
             }
         }
  }
 }
}
```

 

返回结果如下：

```javascript
{
    "took": 72,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 1.3862942,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1.3862942,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            }
        ]
    }
}
```

 

### **全文检索**

这功能像搜索引擎那样，如品牌输入“小华”，返回结果带回品牌有“小米”和华为的。在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search` ，附带JSON体如下：

```javascript
{
 "query":{
  "match":{
   "category" : "小华"
  }
 }
}
```

 

返回结果如下：

```javascript
{
    "took": 7,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 0.6931471,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 0.6931471,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
            ......
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "BtR6sHgBaKNfVnMbX5Y5",
                "_score": 0.6931471,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                }
            },
            ......
        ]
    }
}
```

 

### **完全匹配**

在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search` ，附带JSON体如下：

```javascript
{
 "query":{
  "match_phrase":{
   "category" : "为"
  }
 }
}
```

 

返回结果如下：

```javascript
{
    "took": 2,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 0.6931471,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "BtR6sHgBaKNfVnMbX5Y5",
                "_score": 0.6931471,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                }
            },
            ......
        ]
    }
}
```

 

### **高亮查询**

在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search` ，附带JSON体如下：

```javascript
{
 "query":{
  "match_phrase":{
   "category" : "为"
  }
 },
    "highlight":{
        "fields":{
            "category":{}//<----高亮这字段
        }
    }
}
```

 

返回结果如下：

```javascript
{
    "took": 100,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 0.6931471,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "BtR6sHgBaKNfVnMbX5Y5",
                "_score": 0.6931471,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                },
                "highlight": {
                    "category": [
                        "华<em>为</em>"//<------高亮一个为字。
                    ]
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "B9R6sHgBaKNfVnMbZpZ6",
                "_score": 0.6931471,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                },
                "highlight": {
                    "category": [
                        "华<em>为</em>"
                    ]
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "CdR7sHgBaKNfVnMbsJb9",
                "_score": 0.6931471,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                },
                "highlight": {
                    "category": [
                        "华<em>为</em>"
                    ]
                }
            }
        ]
    }
}
```

 

#### **分组查询**

在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search` ，附带JSON体如下：

```javascript
{
 "aggs":{//聚合操作
  "price_group":{//名称，随意起名
   "terms":{//分组
    "field":"price"//分组字段
   }
  }
 }
}
```

 

返回结果如下：

```javascript
{
    "took": 63,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 1,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "ANQqsHgBaKNfVnMbhZYU",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "A9R5sHgBaKNfVnMb25Ya",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "BNR5sHgBaKNfVnMb7pal",
                "_score": 1,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "BtR6sHgBaKNfVnMbX5Y5",
                "_score": 1,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "B9R6sHgBaKNfVnMbZpZ6",
                "_score": 1,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "CdR7sHgBaKNfVnMbsJb9",
                "_score": 1,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 1999
                }
            }
        ]
    },
    "aggregations": {
        "price_group": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": 1999,
                    "doc_count": 5
                },
                {
                    "key": 3999,
                    "doc_count": 1
                }
            ]
        }
    }
}
```

 

上面返回结果会附带原始数据的。若不想要不附带原始数据的结果，在 Postman 中，向 ES 服务器发 **GET请求** ： `http://127.0.0.1:9200/shopping/_search`，附带JSON体如下：

```javascript
{
 "aggs":{
  "price_group":{
   "terms":{
    "field":"price"
   }
  }
 },
    "size":0
}
```

 

返回结果如下：

```javascript
{
    "took": 60,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": null,
        "hits": []
    },
    "aggregations": {
        "price_group": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": 1999,
                    "doc_count": 5
                },
                {
                    "key": 3999,
                    "doc_count": 1
                }
            ]
        }
    }
}
```

 

#### **查询平均值**

在 Postman 中，向 ES 服务器发 GET请求 ： `http://127.0.0.1:9200/shopping/_search`，附带JSON体如下：

```javascript
{
 "aggs":{
  "price_avg":{//名称，随意起名
   "avg":{//求平均
    "field":"price"
   }
  }
 },
    "size":0
}
```

 

返回结果如下：

```javascript
{
    "took": 14,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": null,
        "hits": []
    },
    "aggregations": {
        "price_avg": {
            "value": 2332.3333333333335
        }
    }
}
```

### **映射关系**

有了索引库，等于有了数据库中的 database。接下来就需要建索引库(index)中的映射了，类似于数据库(database)中的表结构(table)。创建数据库表需要设置字段名称，类型，长度，约束等；索引库也一样，需要知道这个类型下有哪些字段，每个字段有哪些约束信息，这就叫做映射(mapping)。先创建一个索引：

```javascript
# PUT http://127.0.0.1:9200/user
```

 

返回结果：

```javascript
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "user"
}
```

 

创建映射

```javascript
# PUT http://127.0.0.1:9200/user/_mapping

{
    "properties": {
        "name":{
         "type": "text",
         "index": true
        },
        "sex":{
         "type": "keyword",
         "index": true
        },
        "tel":{
         "type": "keyword",
         "index": false
        }
    }
}
```

 

返回结果如下：

```javascript
{
    "acknowledged": true
}
```

 

查询映射

```javascript
#GET http://127.0.0.1:9200/user/_mapping
```

 

返回结果如下：

```javascript
{
    "user": {
        "mappings": {
            "properties": {
                "name": {
                    "type": "text"
                },
                "sex": {
                    "type": "keyword"
                },
                "tel": {
                    "type": "keyword",
                    "index": false
                }
            }
        }
    }
}
```

增加数据

```javascript
#PUT http://127.0.0.1:9200/user/_create/1001
{
 "name":"小米",
 "sex":"男的",
 "tel":"1111"
}
```

返回结果如下：一切正常

```javascript
{
    "_index": "user",
    "_type": "_doc",
    "_id": "1001",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```

查找name含有”小“数据：

```javascript
#GET http://127.0.0.1:9200/user/_search
{
 "query":{
  "match":{
   "name":"小"
  }
 }
}
```

返回结果如下：

```javascript
{
    "took": 495,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.2876821,
        "hits": [
            {
                "_index": "user",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.2876821,
                "_source": {
                    "name": "小米",
                    "sex": "男的",
                    "tel": "1111"
                }
            }
        ]
    }
}
```

查找sex含有”男“数据：

```javascript
#GET http://127.0.0.1:9200/user/_search
{
 "query":{
  "match":{
   "sex":"男"
  }
 }
}
```

返回结果如下：

```javascript
{
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 0,
            "relation": "eq"
        },
        "max_score": null,
        "hits": []
    }
}
```

找不想要的结果，只因 **创建映射时"sex"的类型为"keyword"** 。

"sex"只能**完全**为”男的“，才能得出原数据。

```javascript
#GET http://127.0.0.1:9200/user/_search
{
 "query":{
  "match":{
   "sex":"男的"
  }
 }
}
```

返回结果如下：

```javascript
{
    "took": 2,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.2876821,
        "hits": [
            {
                "_index": "user",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.2876821,
                "_source": {
                    "name": "小米",
                    "sex": "男的",
                    "tel": "1111"
                }
            }
        ]
    }
}
```

查询电话

```javascript
# GET http://127.0.0.1:9200/user/_search
{
 "query":{
  "match":{
   "tel":"1111"
  }
 }
}
```

返回结果如下：

```javascript
{
    "error": {
        "root_cause": [
            {
                "type": "query_shard_exception",
                "reason": "failed to create query: Cannot search on field [tel] since it is not indexed.",
                "index_uuid": "ivLnMfQKROS7Skb2MTFOew",
                "index": "user"
            }
        ],
        "type": "search_phase_execution_exception",
        "reason": "all shards failed",
        "phase": "query",
        "grouped": true,
        "failed_shards": [
            {
                "shard": 0,
                "index": "user",
                "node": "4P7dIRfXSbezE5JTiuylew",
                "reason": {
                    "type": "query_shard_exception",
                    "reason": "failed to create query: Cannot search on field [tel] since it is not indexed.",
                    "index_uuid": "ivLnMfQKROS7Skb2MTFOew",
                    "index": "user",
                    "caused_by": {
                        "type": "illegal_argument_exception",
                        "reason": "Cannot search on field [tel] since it is not indexed."
                    }
                }
            }
        ]
    },
    "status": 400
}
```


> 报错是因创建映射时"tel"的"index"为false,所以不能被支持查询。