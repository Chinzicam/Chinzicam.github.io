---
title: MyBatis-Plus公共字段自动填充
author: 橙子草
date: 2023-05-21 10:40:40
tags:
- MybatisPlus
- sql
category:
- 后端

top_img: https://pic.imgdb.cn/item/64d8933f1ddac507ccbf839f.webp
cover: https://pic.imgdb.cn/item/64d8933f1ddac507ccbf839f.webp

---

## 1.问题分析

> 我们在开发中经常遇到多个实体类有共同的属性字段，例如在新增员工时需要设置创建时间、创建人、修改时间、修改人等字段，在编辑员工时需要设置修改时间和修改人等字段。这些字段属于公共字段，也就是很多表中都有这些字段，能不能对于这些公共字段在某个地方统一处理，来简化开发呢？

{% asset_img image-20220725172038979.png %}

答案就是使用`Mybatis Plus`提供的[公共字段自动填充功能]([自动填充功能 | MyBatis-Plus (baomidou.com)](https://baomidou.com/pages/4c6bcf/))。

## 2.实现步骤

> Mybatis Plus公共字段自动填充，也就是在插入或者更新的时候为指定字段赋予指定的值，使用它的好处就是可以统一对这些字段进行处理，避免了重复代码。

**实现步骤：**

- 在实体类的属性上加入`@TableField`注解，指定自动填充的策略

  ```java
  @TableField(fill = FieldFill.INSERT)//插入时填充字段
  private LocalDateTime createTime;
   
  @TableField(fill = FieldFill.INSERT_UPDATE)//插入、更新时填充字段
  private LocalDateTime updateTime;
   
  @TableField(fill = FieldFill.INSERT)//插入时填充字段
  private Long createUser;
  
  @TableField(fill = FieldFill.INSERT_UPDATE)//插入、更新时填充字段
  private Long updateUser;
  ```

- 按照框架要求编写元数据对象处理器，在此类中统一为公共字段赋值，此类需要实现`MetaObjectHandler`接口

  ```
  package com.czc.common;
  
  import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
  import lombok.extern.slf4j.Slf4j;
  import org.apache.ibatis.reflection.MetaObject;
  import org.springframework.stereotype.Component;
  
  import java.time.LocalDateTime;
  
  /**
   * mybatis-plus字段处理自动填充
   * @author czc
   */
  @Component
  @Slf4j
  public class MyMetaObjectHandler implements MetaObjectHandler {
      /**
       * 插入时公共字段自动填充
       * @param metaObject
       */
      @Override
      public void insertFill(MetaObject metaObject) {
          log.info("公共字段自动填充(insert)...");
          long id = Thread.currentThread().getId();
  //        log.info("updateFill的线程id为：{}", id);
          metaObject.setValue("createTime", LocalDateTime.now());
          metaObject.setValue("updateTime", LocalDateTime.now());
          //添加设置添加人id
          metaObject.setValue("updateUser", BaseContext.getCurrentId());
          metaObject.setValue("createUser", BaseContext.getCurrentId());
      }
  
      /**
       *更新时公共字段自动填充
       * @param metaObject
       */
      @Override
      public void updateFill(MetaObject metaObject) {
          log.info("公共字段自动填充(update)...");
          long id = Thread.currentThread().getId();
  //        log.info("updateFill的线程id为：{}", id);
          metaObject.setValue("createTime", LocalDateTime.now());
          metaObject.setValue("updateTime", LocalDateTime.now());
          //添加设置修改人id
          metaObject.setValue("updateUser", BaseContext.getCurrentId());
          metaObject.setValue("createUser", BaseContext.getCurrentId());
      }
  }
  ```
