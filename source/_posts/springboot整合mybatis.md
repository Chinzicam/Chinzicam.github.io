---
title: SpringBoot整合Mybatis
date: 2023-04-13 22:39:41
author: 橙子草草
top_img: https://pic.imgdb.cn/item/64d8f4c31ddac507cca353d6.png
cover: https://pic.imgdb.cn/item/64d8f4c31ddac507cca353d6.png
tags:
- springboot
- mybatis
categories: 
- 后端
---

# SpringBoot整合MyBatis

## 回顾Spring整合MyBatis

之前Spring整合MyBatis时，需要定义很多配置类

- SpringConfig配置类

  ```JAVA
  @Configuration
  @ComponentScan("com.blog")
  @PropertySource("jdbc.properties")
  @Import({JdbcConfig.class, MyBatisConfig.class})
  public class SpringConfig {
  }
  ```

- 导入JdbcConfig配置类

  ```
  public class JdbcConfig {
      @Value("${jdbc.driver}")
      private String driver;
      @Value("${jdbc.url}")
      private String url;
      @Value("${jdbc.username}")
      private String username;
      @Value("${jdbc.password}")
      private String password;
  
      @Bean
      public DataSource dataSource() {
          DruidDataSource dataSource = new DruidDataSource();
          dataSource.setDriverClassName(driver);
          dataSource.setUrl(url);
          dataSource.setUsername(username);
          dataSource.setPassword(password);
          return dataSource;
      }
  }
  ```

- 导入MyBatisConfig配置类

  - 定义 `SqlSessionFactoryBean`

  - 定义映射配置

    ```JAVA
    public class MyBatisConfig {
    
        //定义bean，SqlSessionFactoryBean，用于产生SqlSessionFactory对象
        @Bean
        public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource) {
            SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
            //设置模型类的别名扫描
            sqlSessionFactory.setTypeAliasesPackage("com.blog.domain");
            //设置数据源
            sqlSessionFactory.setDataSource(dataSource);
            return sqlSessionFactory;
        }
        //定义bean，返回MapperScannerConfigurer对象
        @Bean
        public MapperScannerConfigurer mapperScannerConfigurer() {
            MapperScannerConfigurer msc = new MapperScannerConfigurer();
            msc.setBasePackage("com.blog.dao");
            return msc;
        }
    }
    ```

## SpringBoot整合MyBatis

- 创建一个新的模块
  注意选择技术集的时候，要勾选`MyBatis Framework`和`MySQL Driver`

- 建库建表

  ```SQL
  CREATE DATABASE springboot_db;
  USE springboot_db;
  
  CREATE TABLE tbl_book
  (
      id          INT PRIMARY KEY AUTO_INCREMENT,
      `type`      VARCHAR(20),
      `name`      VARCHAR(50),
      description VARCHAR(255)
  );
  
  INSERT INTO `tbl_book`(`id`, `type`, `name`, `description`)
  VALUES (1, '计算机理论', 'Spring实战 第五版', 'Spring入门经典教程，深入理解Spring原理技术内幕'),
         (2, '计算机理论', 'Spring 5核心原理与30个类手写实践', '十年沉淀之作，手写Spring精华思想'),
         (3, '计算机理论', 'Spring 5设计模式', '深入Spring源码刨析Spring源码中蕴含的10大设计模式'),
         (4, '计算机理论', 'Spring MVC+Mybatis开发从入门到项目实战',
          '全方位解析面向Web应用的轻量级框架，带你成为Spring MVC开发高手'),
         (5, '计算机理论', '轻量级Java Web企业应用实战', '源码级刨析Spring框架，适合已掌握Java基础的读者'),
         (6, '计算机理论', 'Java核心技术 卷Ⅰ 基础知识(原书第11版)',
          'Core Java第11版，Jolt大奖获奖作品，针对Java SE9、10、11全面更新'),
         (7, '计算机理论', '深入理解Java虚拟机', '5个纬度全面刨析JVM,大厂面试知识点全覆盖'),
         (8, '计算机理论', 'Java编程思想(第4版)', 'Java学习必读经典，殿堂级著作！赢得了全球程序员的广泛赞誉'),
         (9, '计算机理论', '零基础学Java(全彩版)', '零基础自学编程的入门图书，由浅入深，详解Java语言的编程思想和核心技术'),
         (10, '市场营销', '直播就这么做:主播高效沟通实战指南', '李子柒、李佳奇、薇娅成长为网红的秘密都在书中'),
         (11, '市场营销', '直播销讲实战一本通', '和秋叶一起学系列网络营销书籍'),
         (12, '市场营销', '直播带货:淘宝、天猫直播从新手到高手', '一本教你如何玩转直播的书，10堂课轻松实现带货月入3W+');
  ```

- 定义实体类

  ```JAVA
  public class Book {
      private Integer id;
      private String type;
      private String name;
      private String description;
  
      public Integer getId() {
          return id;
      }
  
      public void setId(Integer id) {
          this.id = id;
      }
  
      public String getType() {
          return type;
      }
  
      public void setType(String type) {
          this.type = type;
      }
  
      public String getName() {
          return name;
      }
  
      public void setName(String name) {
          this.name = name;
      }
  
      public String getDescription() {
          return description;
      }
  
      public void setDescription(String description) {
          this.description = description;
      }
  
      @Override
      public String toString() {
          return "Book{" +
                  "id=" + id +
                  ", type='" + type + '\'' +
                  ", name='" + name + '\'' +
                  ", description='" + description + '\'' +
                  '}';
      }
  }
  ```

- 定义dao接口

  在com.blog.dao包下定义BookDao接口

  ```java
  public interface BookDao {
      @Select("select * from tbl_book where id = #{id}")
      Book getById(Integer id);
  }
  ```

- 定义测试类

  ```java
  @SpringBootTest
  class Springboot03MybatisApplicationTests {
  
      @Autowired
      private BookDao bookDao;
  
      @Test
      void contextLoads() {
          Book book = bookDao.getById(1);
          System.out.println(book);
      }
  
  }
  ```

- 编写配置

  ```YML
  spring:
    datasource:
      driver-class-name: com.mysql.jdbc.Driver
      url: jdbc:mysql://localhost:3306/springboot_db?serverTimezone=UTC
      username: root
      password: czc123
  ```

- 测试

  运行测试方法，会报错 `No qualifying bean of type 'com.blog.dao.BookDao'`，没有类型为`“com.blog.dao.BookDao”`的限定bean

  为什么会出现这种情况呢？之前我们在配置MyBatis时，配置了如下内容
  
  ```JAVA
  @Bean
  public MapperScannerConfigurer mapperScannerConfigurer() {
      MapperScannerConfigurer msc = new MapperScannerConfigurer();
      msc.setBasePackage("com.blog.dao");
      return msc;
  }
  ```
  
  Mybatis会扫描接口并创建接口的代码对象交给Spring管理，但是现在并没有告诉Mybatis哪个是dao接口。
  
  而我们要解决这个问题需要在BookDao接口上使用@Mapper


  BookDao接口修改为

  ```JAVA
  @Mapper
  public interface BookDao {
      @Select("select * from tbl_book where id = #{id}")
      Book getById(Integer id);
  }
  ```

  注意：
  `SpringBoot` 版本低于2.4.3(不含)，Mysql驱动版本大于8.0时，需要在url连接串中配置时
`jdbc:mysql://localhost:3306/springboot_db?serverTimezone=UTC`，或在MySQL数据库端配置时区解决此问题

- 使用Druid数据源

  现在我们并没有指定数据源，SpringBoot有默认的数据源，我们也可以指定使用Druid数据源，按照以下步骤实现

  ```XML
  <dependency>
      <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
      <version>1.1.12</version>
</dependency>
  ```

- 在application.yml修改配置文件配置可以通过 spring.datasource.type 来配置使用什么数据源。配置文件内容可以改进为

  ```YML
  spring:
    datasource:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/springboot_db?serverTimezone=UTC
      username: root
      password: czc123
      type: com.alibaba.druid.pool.DruidDataSource
  ```

# 复盘

## 流程分析

1. 创建工程
   - 创建一个SpringBoot工程
   - 需要勾选`Spring Web`，`MyBatis Framework`和`MySQL Driver`
2. SpringBoot整合
   - 整合MyBatis
     - 添加Druid数据源依赖
     - 编写数据库配置文件（application.yml），配置数据库连接四要素
     - 对于Dao层的包扫描，使用`@Mapper`注解
   - 整合Junit
     - 使用`@SpringBootTest`注解
3. 功能模块
   - 创建数据库和表
   - 根据数据表来创建对应的模型类
   - 通过`Dao`层完成数据库的增删改
   - 编写`Service`层（Service接口+实现类）
   - 编写Controller层
     - 接收请求 `@RequestMapping`、`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`
     - 接收数据 简单类型、POJO类型、嵌套POJO类型、数组类型、JSON数据类型
       - `@RequestParam`
       - `@PathVariable`
       - `@RequestBody`
     - 转发业务层
       - 使用`@Autowired`自动装配
     - 响应结果
       - `@ResponseBody`

## 整合配置

分析完毕之后，那我们现在就开始来完成SpringBoot的整合

- `步骤一：`创建一个SpringBoot工程
  注意要勾选`Spring Web`，`MyBatis Framework`和`MySQL Driver`

- `步骤二：`创建项目包结构

  - `com.blog.controller` 编写Controller类
  - `com.blog.dao` 存放的是Dao层的接口，注意要使用`@Mapper`注解
  - `com.blog.service` 存放的是Service层接口，
  - `com.blog.service.impl` 存放的是Service的实现类
  - `com.blog.domain` 存放的是pojo类
  - `resources/static` 存放静态资源HTML，CSS，JS等
  - `test/java` 存放测试类

- `步骤三：`编写application.yml

  导入Druid的坐标，并在配置文件中编写数据库连接四要素

  ```YML
  server:
    port: 80
  spring:
    datasource:
      type: com.alibaba.druid.pool.DruidDataSource
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/springboot_db?serverTimezone=UTC
      username: root
      password: czc123
  ```
  
  ## 功能模块开发
  
- `步骤一：`创建数据库和表

  ```SQL
   create database springboot_db;
  use springboot_db;
  create table tbl_book
  (
      id          int primary key auto_increment,
      type        varchar(20),
      `name`      varchar(50),
      description varchar(255)
  );
  
  insert into `tbl_book`(`id`, `type`, `name`, `description`)
  values (1, '计算机理论', 'Spring实战 第五版', 'Spring入门经典教程，深入理解Spring原理技术内幕'),
         (2, '计算机理论', 'Spring 5核心原理与30个类手写实践', '十年沉淀之作，手写Spring精华思想'),
         (3, '计算机理论', 'Spring 5设计模式', '深入Spring源码刨析Spring源码中蕴含的10大设计模式'),
         (4, '计算机理论', 'Spring MVC+Mybatis开发从入门到项目实战',
          '全方位解析面向Web应用的轻量级框架，带你成为Spring MVC开发高手'),
         (5, '计算机理论', '轻量级Java Web企业应用实战', '源码级刨析Spring框架，适合已掌握Java基础的读者'),
         (6, '计算机理论', 'Java核心技术 卷Ⅰ 基础知识(原书第11版)',
          'Core Java第11版，Jolt大奖获奖作品，针对Java SE9、10、11全面更新'),
         (7, '计算机理论', '深入理解Java虚拟机', '5个纬度全面刨析JVM,大厂面试知识点全覆盖'),
         (8, '计算机理论', 'Java编程思想(第4版)', 'Java学习必读经典，殿堂级著作！赢得了全球程序员的广泛赞誉'),
         (9, '计算机理论', '零基础学Java(全彩版)', '零基础自学编程的入门图书，由浅入深，详解Java语言的编程思想和核心技术'),
         (10, '市场营销', '直播就这么做:主播高效沟通实战指南', '李子柒、李佳奇、薇娅成长为网红的秘密都在书中'),
         (11, '市场营销', '直播销讲实战一本通', '和秋叶一起学系列网络营销书籍'),
         (12, '市场营销', '直播带货:淘宝、天猫直播从新手到高手', '一本教你如何玩转直播的书，10堂课轻松实现带货月入3W+');
  ```
  
- `步骤二：`编写模型类

  ```JAVA
  public class Book {
      private Integer id;
      private String type;
      private String name;
      private String description;
  
      public Integer getId() {
          return id;
      }
  
      public void setId(Integer id) {
          this.id = id;
      }
  
      public String getType() {
          return type;
      }
  
      public void setType(String type) {
          this.type = type;
      }
  
      public String getName() {
          return name;
      }
  
      public void setName(String name) {
          this.name = name;
      }
  
      public String getDescription() {
          return description;
      }
  
      public void setDescription(String description) {
          this.description = description;
      }
  
      @Override
      public String toString() {
          return "Book{" +
                  "id=" + id +
                  ", type='" + type + '\'' +
                  ", name='" + name + '\'' +
                  ", description='" + description + '\'' +
                  '}';
      }
  }
  ```

- `步骤三：`编写dao接口

  注意使用`@Mapper`注解

  ```JAVA
  @Mapper
  public interface BookDao {
      @Select("select * from tbl_book where id=#{id}")
      Book getById(Integer id);
  
      @Select("select * from tbl_book")
      List<Book> getAll();
  
      @Update("update tbl_book set type=#{type}, `name`=#{name}, `description`=#{description} where id=#{id}")
      int update(Book book);
  
      @Delete("delete from tbl_book where id=#{id}")
      int delete(Integer id);
  
      @Insert("insert into tbl_book values (null, #{type}, #{name}, #{description})")
      int save(Book book);
  }
  ```

- `步骤四：`编写service接口及其实现类

  - BookService
  - BookServiceImpl

  ```JAVA
  public interface BookService {
      boolean save(Book book);
  
      boolean update(Book book);
  
      boolean delete(Integer id);
  
      Book getById(Integer id);
  
      List<Book> getAll();
  }
  ```

  

- `步骤五：`编写Controller类
  注意响应pojo类型要加`@RequestBody`注解，某人忘加了，调试了半天

  ```JAVA
  @RestController
  @RequestMapping("/books")
  public class BookController {
      @Autowired
      private BookService bookService;
  
      @GetMapping("/{id}")
      public Book getById(@PathVariable Integer id) {
          return bookService.getById(id);
      }
  
      @GetMapping
      public List<Book> getAll() {
          return bookService.getAll();
      }
  
      @PostMapping
      public boolean save(@RequestBody Book book) {
          return bookService.save(book);
      }
  
      @PutMapping
      public boolean update(@RequestBody Book book) {
          return bookService.update(book);
      }
  
      @DeleteMapping("/{id}")
      public boolean delete(@PathVariable Integer id) {
          return bookService.delete(id);
      }
  }
  ```

- `步骤六：`使用PostMan进行测试
  将增删改查全部测试完毕之后，就可以继续往下做了

## 统一结果封装

- 创建一个返回结果类

  我这里暂时只需要返回的结果，状态码和异常信息，如果还有别的需求，可以自行删改

  ```JAVA
  public class Result {
      private Object data;
      private Integer code;
      private String msg;
  
      public Object getData() {
          return data;
      }
  
      public void setData(Object data) {
          this.data = data;
      }
  
      public Integer getCode() {
          return code;
      }
  
      public void setCode(Integer code) {
          this.code = code;
      }
  
      public String getMsg() {
          return msg;
      }
  
      public void setMsg(String msg) {
          this.msg = msg;
      }
  
      @Override
      public String toString() {
          return "Result{" +
                  "data=" + data +
                  ", code=" + code +
                  ", msg='" + msg + '\'' +
                  '}';
      }
  }
  ```

- 定义状态码Code类

  状态码也可以根据自己的需求来自定义

  ```JAVA
  public class Code {
      public static final Integer SAVE_OK = 20011;
      public static final Integer SAVE_ERR = 20010;
  
      public static final Integer UPDATE_OK = 20021;
      public static final Integer UPDATE_ERR = 20020;
  
      public static final Integer DELETE_OK = 20031;
      public static final Integer DELETE_ERR = 20030;
  
      public static final Integer GET_OK = 20041;
      public static final Integer GET_ERR = 20040;
  
      public static final Integer SYSTEM_ERR = 50001;
      public static final Integer SYSTEM_TIMEOUT_ERR = 50002;
      public static final Integer SYSTEM_UNKNOW_ERR = 59999;
  
      public static final Integer BUSINESS_ERR = 60001;
  }
  ```

- 修改Controller类的返回值

  ```JAVA
  @RestController
  @RequestMapping("/books")
  public class BookController {
      @Autowired
      private BookService bookService;
  
      @GetMapping("/{id}")
      public Result getById(@PathVariable Integer id) {
          Book book = bookService.getById(id);
          Integer code = book == null ? Code.GET_ERR : Code.GET_OK;
          String msg = book == null ? "数据查询失败，请重试！" : "";
          return new Result(code, book, msg);
      }
  
      @GetMapping
      public Result getAll() {
          List<Book> books = bookService.getAll();
          Integer code = books == null ? Code.GET_ERR : Code.GET_OK;
          String msg = books == null ? "数据查询失败，请重试！" : "";
          return new Result(code, books, msg);
      }
  
      @PostMapping
      public Result save(@RequestBody Book book) {
          boolean flag = bookService.save(book);
          return new Result(flag ? Code.SAVE_OK : Code.SAVE_ERR, flag);
      }
  
      @PutMapping
      public Result update(@RequestBody Book book) {
          boolean flag = bookService.update(book);
          return new Result(flag ? Code.UPDATE_OK : Code.UPDATE_ERR, flag);
      }
  
      @DeleteMapping("/{id}")
      public Result delete(@PathVariable Integer id) {
          boolean flag = bookService.delete(id);
          return new Result(flag ? Code.DELETE_OK : Code.DELETE_ERR, flag);
      }
  }
  ```
  
- 如果不放心自己改的对不对，可以继续用PostMan再将每个方法测试一遍

## 统一异常处理

- 将异常进行分类

  这里只将其划分为了业务异常和系统异常

  在com.blog.exception包下新建两个异常类

  - BusinessException
  - SystemException

  ```JAVA
  public class BusinessException extends RuntimeException {
      private Integer code;
  
      public Integer getCode() {
          return code;
      }
  
      public void setCode(Integer code) {
          this.code = code;
      }
  
      public BusinessException(Integer code) {
          super();
          this.code = code;
      }
  
      public BusinessException(Integer code, String message) {
          super(message);
          this.code = code;
      }
  
      public BusinessException(Integer code, String message, Throwable cause) {
          super(message, cause);
          this.code = code;
      }
  }
  ```

  ```java
  public class SystemException extends RuntimeException {
      private Integer code;
  
      public Integer getCode() {
          return code;
      }
  
      public void setCode(Integer code) {
          this.code = code;
      }
  
      public SystemException(Integer code) {
          this.code = code;
      }
  
      public SystemException(Integer code, String message) {
          super(message);
          this.code = code;
      }
  
      public SystemException(Integer code, String message, Throwable cause) {
          super(message, cause);
          this.code = code;
      }
  }
  ```

  

- 同时再增加几个状态码

  ```JAVA
  public static final Integer SYSTEM_ERR = 50001;
  public static final Integer SYSTEM_TIMEOUT_ERR = 50002;
  public static final Integer SYSTEM_UNKNOW_ERR = 59999;
  public static final Integer BUSINESS_ERR = 60001;
  ```
  
- 编写自定义异常处理类

  ```JAVA
  @RestControllerAdvice
  public class ProjectExceptionAdvice {
  
      //处理系统异常
      @ExceptionHandler(SystemException.class)
      public Result doSystemException(SystemException exception){
          return new Result(exception.getCode(),null,exception.getMessage());
      }
  
      //处理业务异常
      @ExceptionHandler(BusinessException.class)
      public Result doBusinessException(BusinessException exception){
          return new Result(exception.getCode(),null,exception.getMessage());
      }
  
      //处理未知异常
      @ExceptionHandler(Exception.class)
      public Result doException(Exception exception){
          return new Result(Code.SYSTEM_UNKNOW_ERR,null,"系统繁忙，请稍后再试");
      }
  }
  ```
  
- 测试异常

  可以getById方法中来进行测试，当id为1时，错误码为`BUSINESS_ERR`，错误信息为`不让你瞅`，当查询其他id时，均为`SYSTEM_UNKNOW_ERR`，错误提示信息为`服务器访问超时，请稍后再试`

  ```JAVA
  @Service
  public class BookServiceImpl implements BookService {
  
      @Autowired
      private BookDao bookDao;
  
      @Override
      public boolean save(Book book) {
          int cnt = bookDao.save(book);
          return cnt > 0;
      }
  
      @Override
      public boolean update(Book book) {
          int cnt = bookDao.update(book);
          return cnt > 0;
      }
  
      @Override
      public boolean delete(Integer id) {
          return bookDao.delete(id) > 0;
      }
  
      @Override
      public Book getById(Integer id) {
          if (id == 1){
              throw new BusinessException(Code.BUSINESS_ERR,"不让你瞅");
          }
          try {
              int a = 1 / 0;
          } catch (Exception e) {
              throw new SystemException(Code.SYSTEM_UNKNOW_ERR, "服务器访问超时，请稍后再试");
          }
          return bookDao.getById(id);
      }
  
      @Override
      public List<Book> getAll() {
          return bookDao.getAll();
      }
  }
  ```