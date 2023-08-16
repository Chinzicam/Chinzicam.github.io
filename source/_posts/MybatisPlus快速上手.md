---
title: MybatisPlus快速上手
date: 2023-05-07 15:04:56
author: 橙子草
tags:
- Mybatis
- sql
categories: 
- 后端
top_img: https://pic.imgdb.cn/item/64d88e291ddac507ccb3415e.webp
cover: https://pic.imgdb.cn/item/64d88e291ddac507ccb3415e.webp
---

## Mybatis_Plus简单使用

### 简介

MyBatis-Plus （简称 MP）是一个 **MyBatis**的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

官网([快速测试 | MyBatis-Plus (baomidou.com)](https://baomidou.com/pages/b7dae0/))

### 如何使用

1. 准备数据库和表

  ```sql
  CREATE TABLE user
  (
   id BIGINT(20) NOT NULL COMMENT '主键ID',
   name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
   age INT(11) NULL DEFAULT NULL COMMENT '年龄',
   email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
   PRIMARY KEY (id)
  );
  ```

  ```sql
  INSERT INTO user (id, name, age, email) VALUES
  (1, '张三', 18, 'test1@baomidou.com'),
  (2, '李四', 20, 'test2@baomidou.com'),
  (3, '王五', 28, 'test3@baomidou.com'),
  (4, '赵六', 21, 'test4@baomidou.com'),
  (5, '赵二狗', 24, 'test5@baomidou.com');
  ```

2. 创建springboot项目

{% asset_img image-20230607140951825.png %}

{% asset_img image-20230607141044587.png %}

   

3. 配置pom.xml

   ```java
   //mybatis-plus-boot-starter mybatis_plus依赖
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-boot-starter</artifactId>
       <version>3.5.2</version>
   </dependency>
       
   //spring-boot-starter-web springMVC Web启动器
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   
   //mysql-connector-j mysql连接
   <dependency>
       <groupId>com.mysql</groupId>
       <artifactId>mysql-connector-j</artifactId>
       <scope>runtime</scope>
   </dependency>
       
   //lombok 
   <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
       <optional>true</optional>
   </dependency>
      
   //spring-boot-starter-test
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
   </dependency>
   ```

   

4. 配置yml

   ```yml
   spring:
     datasource:
       username: root
       password: czc123
       url: jdbc:mysql:///mybatis_plus
   
   logging:
     level:
       com.example: debug
   
   mybatis-plus:
     global-config:
       db-config:
         logic-delete-field: deleted       # 全局逻辑删除的实体字段名,配置后可不用@TableLogic注解
         logic-delete-value: 1             # 逻辑已删除
         logic-not-delete-value: 0         # 逻辑已删除
   ```

5. entity
  ```java
  package com.example.mybatisplus.entity;
  
   import com.baomidou.mybatisplus.annotation.*;
   import lombok.AllArgsConstructor;
   import lombok.Data;
   import lombok.NoArgsConstructor;
  
   import java.io.Serializable;
  
   @Data
   @AllArgsConstructor  //全参构造
   @NoArgsConstructor     //无参构造
   //@TableName("User") //表名映射，默认与类名相同
   public class User implements Serializable {
  
       @TableId(type = IdType.AUTO) //实现主键自增
       private Long id;
       private String name;
       private Integer age;
  
       @TableField(value = "email") // value =>字段映射，当这个和表名不同时可以使用
  
       private String email;
  
       @TableField(exist = false)  //默认是true，如果表里没有这个字段，可以使用
       private String status;
  
       @TableField(select = true)   // select =>是否查询这个字段，默认是true
   //    @TableLogic   //.yml有配置全局，所以这里不用写TableLogic =>逻辑删除
       private String deleted;
   }
  ```

6. mapper
  ```java
  package com.example.mybatisplus.mapper;
  
   import com.baomidou.mybatisplus.core.mapper.BaseMapper;
   import com.example.mybatisplus.entity.User;
   import org.apache.ibatis.annotations.Mapper;
  
   //@Mapper  // 这里如果不加该注解，需要在启动类上加@MapperScan("com.example.mybatisplus.mapper")
   public interface UserMapper extends BaseMapper<User> {
  
   }
  ```

7. 配置分页查询拦截器

   ```java
   package com.example.mybatisplus.config;
   
   import com.baomidou.mybatisplus.annotation.DbType;
   import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
   import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
   import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   
   @Configuration
   public class MPconfig {
       @Bean
       public MybatisPlusInterceptor mybatisPlusInterceptor() {
           MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();//mybatisplus拦截器
           interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor()); //乐观锁
           interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));//分页插件
           return interceptor;
       }
   }
   ```

8. 测试

   ```java
   package com.example.mybatisplus;
   
   import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
   import com.baomidou.mybatisplus.core.metadata.IPage;
   import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
   import com.example.mybatisplus.entity.User;
   import com.example.mybatisplus.mapper.UserMapper;
   import org.junit.jupiter.api.Test;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.test.context.SpringBootTest;
   
   import javax.annotation.Resource;
   import java.util.List;
   
   @SpringBootTest
   
   public class UserMapperTest {
       @Resource
       private UserMapper userMapper;
   
       @Test
       public void selectAll() {
           List<User> users = userMapper.selectList(null);
           users.forEach(System.out::println);
       }
       @Test
       public void selectById() {
           User user = userMapper.selectById(1);
           System.out.println(user);
       }
       @Test
       public void insert() {
           User user=new User(null,"肥大美",20,"123456@qq.com","null","0");
           userMapper.insert(user);
       }
       @Test
       public void update(){
           User user=new User(null,"肥大美",22,"123456@qq.com","null","null");
           userMapper.updateById(user);
       }
       @Test
       public void delete(){
           userMapper.deleteById(7L);
       }
       @Test
       public void pageSelect(){
           IPage<User> page = new Page<>(2, 3);//第几页，每页长度
           userMapper.selectPage(page, null);
           System.out.println(page.getTotal()); //总共长度
           System.out.println(page.getCurrent()); //getCurrent（）,获取当前页
           System.out.println(page.getSize()); //getCurrent（）,获取当前页
           List<User> records = page.getRecords(); //getRecords（）,获取查询数据
           records.forEach(System.out::println);
       }
   
       @Test
       public void constructorSelect() {
           LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
           wrapper
                   .lt(User::getAge,24)
                   .likeRight(User::getName,"赵")
                   .orderByDesc(User::getId);
           List<User> users = userMapper.selectList(wrapper);
           users.forEach(System.out::println);
       }
   }
   ```

### 代码生成器

1. 配置pom.xml

   ```java
   //freemarker
   <dependency>
       <groupId>org.freemarker</groupId>
       <artifactId>freemarker</artifactId>
   </dependency>
       
   //mybatis-plus-generator 代码生成器
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-generator</artifactId>
       <version>3.5.2</version>
   </dependency>
   ```

2. java

   ```java
   package com.example.mybatisplus;
   
   import com.baomidou.mybatisplus.generator.FastAutoGenerator;
   import com.baomidou.mybatisplus.generator.config.OutputFile;
   import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
   import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
   
   import java.sql.Types;
   import java.util.Collections;
   
   public class CodeGenerator {
       public static void main(String[] args) {
           FastAutoGenerator.create("jdbc:mysql:///mybatis_plus", "root", "czc123")
                   .globalConfig(builder -> {
                       builder.author("czc") // 设置作者
                               //.enableSwagger() // 开启 swagger 模式
   //                            .fileOverride() // 覆盖已生成文件
                               .outputDir("E:\\Learnfiles\\MybatisPlus\\src\\main\\java"); // 指定输出目录
                   })
                   .packageConfig(builder -> {
                       builder.parent("com.example") // 设置父包名
                               .moduleName("MP_GeneratorTest") // 设置父包模块名
                               .pathInfo(Collections.singletonMap(OutputFile.xml, "E:\\Learnfiles\\MybatisPlus\\src\\main\\resources\\com\\example\\MP_GeneratorTest\\mapper" )); // 设置mapperXml生成路径
                   })
                   .strategyConfig(builder -> {
                       builder.addInclude("x_user,x_role") // 设置需要生成的表名
                               .addTablePrefix("x_"); // 设置过滤表前缀
                   })
                   .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
                   .execute();
   
       }
   }
   ```

### 总结

1. 全部配置文件

   ```
   //freemarker
   <dependency>
       <groupId>org.freemarker</groupId>
       <artifactId>freemarker</artifactId>
   </dependency>
       
   //mybatis-plus-generator 代码生成器
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-generator</artifactId>
       <version>3.5.2</version>
   </dependency>
   
   //mybatis-plus-boot-starter mybatis_plus依赖
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-boot-starter</artifactId>
       <version>3.5.2</version>
   </dependency>
       
   //spring-boot-starter-web springMVC Web启动器
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   
   //mysql-connector-j mysql连接
   <dependency>
       <groupId>com.mysql</groupId>
       <artifactId>mysql-connector-j</artifactId>
       <scope>runtime</scope>
   </dependency>
       
   //lombok 
   <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
       <optional>true</optional>
   </dependency>
      
   //spring-boot-starter-test
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
   </dependency>
   ```

2. 目录结构
{% asset_img image-20230607143537593.png %}
