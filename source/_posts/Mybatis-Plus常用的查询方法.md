---
title: Mybatis-Plus常用的查询方法
date: 2023-05-15 21:12:03
author: 橙子草
tags:
- MybatisPlus
- sql
category:
- 后端

top_img: https://pic.imgdb.cn/item/64d892d01ddac507ccbe8d48.webp
cover: https://pic.imgdb.cn/item/64d892d01ddac507ccbe8d48.webp

---

# Mybatis-Plus常用的查询方法

Mybatis-Plus作为Mybatis的增强，自己封装了很多简单还用的方法，来解脱自己写sql！

更多内容请查看 [官网]([CRUD 接口 | MyBatis-Plus (baomidou.com)](https://baomidou.com/pages/49cc81/#service-crud-接口))

---

## AbstractWrapper

> 说明:
>
> QueryWrapper(LambdaQueryWrapper) 和 UpdateWrapper(LambdaUpdateWrapper) 的父类
> 用于生成 sql 的 where 条件, entity 属性也用于生成 sql 的 where 条件
> 注意: entity 生成的 where 条件与 使用各个 api 生成的 where 条件**没有任何关联行为**

### eq

```java
eq(R column, Object val)
eq(boolean condition, R column, Object val)
```

- 等于 =
- 例: **eq("name", "老王")**--->**name = '老王'**

---

### gt

```java
gt(R column, Object val)
gt(boolean condition, R column, Object val)
```

- 大于 >
- 例: **gt("age", 18)**--->**age > 18**

---

### lt

```java
lt(R column, Object val)
lt(boolean condition, R column, Object val)
```

- 小于 <
- 例: **lt("age", 18)**--->**age < 18**

---

### between

```java
between(R column, Object val1, Object val2)
between(boolean condition, R column, Object val1, Object val2)
```

- BETWEEN 值1 AND 值2
- 例: **between("age", 18, 30)**--->**age between 18 and 30**

---

### like

```java
like(R column, Object val)
like(boolean condition, R column, Object val)
```

- LIKE '%值%'
- 例: **like("name", "王")**--->**name like '%王%'**

---

### in

```java
in(R column, Collection<?> value)
in(boolean condition, R column, Collection<?> value)
```

- 字段 IN (value.get(0), value.get(1), ...)
- 例: **in("age",{1,2,3})**--->**age in (1,2,3)**

```java
in(R column, Object... values)
in(boolean condition, R column, Object... values)
```

- 字段 IN (v0, v1, ...)
- 例: **in("age", 1, 2, 3)**--->**age in (1,2,3)**

---

###  inSql

```java
inSql(R column, String inValue)
inSql(boolean condition, R column, String inValue)
```

- 字段 IN ( sql语句 )
- 例: **inSql("age", "1,2,3,4,5,6")**--->**age in (1,2,3,4,5,6)**
- 例: **inSql("id", "select id from table where id < 3")**--->**id in (select id from table where id < 3)**

---

### groupBy

```java
groupBy(R... columns)
groupBy(boolean condition, R... columns)
```

- 分组：GROUP BY 字段, ...
- 例: **groupBy("id", "name")**--->**group by id,name**

---

###  orderByDesc

```java
orderByDesc(R... columns)
orderByDesc(boolean condition, R... columns)
```

- 排序：ORDER BY 字段, ... DESC
- 例: **orderByDesc("id", "name")**--->**order by id DESC,name DESC**

---

## 使用 Wrapper 自定义SQL

---

### 用注解

```java
@Select("select * from mysql_data ${ew.customSqlSegment}")
List<MysqlData> getAll(@Param(Constants.WRAPPER) Wrapper wrapper);
```

---

### 用XML

Mapper接口：

```java
List<MysqlData> getAll(Wrapper ew);
```

mapper.xml

```xml
<select id="getAll" resultType="MysqlData">
	SELECT * FROM mysql_data ${ew.customSqlSegment}
</select>
```