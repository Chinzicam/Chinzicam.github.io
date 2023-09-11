---
title: SpringSecurity
date: 2023-08-28 13:26:49
author: 橙子草
tags:
- SpringSecurity
- 跨域
- 自定义异常处理
- jwt
category:
- 后端
top_img: https://pic.imgdb.cn/item/64f4929c661c6c8e5419167e.webp
cover: https://pic.imgdb.cn/item/64f4929c661c6c8e5419167e.webp
---

> 本文档对应我的GitHub项目地址:[SpringSecurity](https://github.com/Chinzicam/SpringSecurity_Project)

> 本文档需对应此[课程](https://www.bilibili.com/video/BV1mm4y1X7Hc/?spm_id_from=333.337.search-card.all.click)食用~

{% btns rounded grid5 %}
{% cell GitHub仓库, https://github.com/Chinzicam/SpringSecurity_Project, anzhiyufont anzhiyu-icon-book %}
{% endbtns %}

## 快速入门

### 1. 介绍

​	**Spring Security** 是 Spring 家族中的一个安全管理框架。相比与另外一个安全框架**Shiro**，它提供了更丰富的功能，社区资源也比Shiro丰富。

​	一般来说中大型的项目都是使用**SpringSecurity** 来做安全框架。小项目有Shiro的比较多，因为相比与SpringSecurity，Shiro的上手更加的简单。

​	 一般Web应用的需要进行**认证**和**授权**。

​		**认证：验证当前访问系统的是不是本系统的用户，并且要确认具体是哪个用户**

​		**授权：经过认证后判断当前用户是否有权限进行某个操作**

​	而认证和授权也是SpringSecurity作为安全框架的核心功能。

### 2. 环境搭建

- 打开idea，新建maven项目，设置父工程 添加依赖

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.5.0</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

- 创建启动类

```java
package com.czc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author czc
 */
@SpringBootApplication
public class SecurityApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecurityApplication.class,args);
    }
}

```

- 创建Controller

```java
package com.czc.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author czc
 */
@RestController
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping("/world")
    public String hello(){
        return "欢迎，开始你新的学习旅程吧";
    }

}
```

- 运行SecurityApplication引导类，然后浏览器访问如下，这里我修改了端口为13848，测试SpringBoot工程有没有搭建成功

> http://localhost:13848/hello/world

{% asset_img image-20230828162004943.png %}

### 3. Boot整合Security

- 在pom.xml添加如下

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

>  引入依赖后我们在尝试去访问之前的接口就会自动跳转到一个SpringSecurity的默认登录页面，默认用户名是user,密码会输出在控制台。

`必须登录之后才能对接口进行访问`

- 重新运行SecurityApplication引导类，浏览器访问如下

> http://localhost:13848/hello/world

访问时会自动被下面的链接拦截

> http://localhost:13848/login

- 在idea控制台查看登录的密码，用户名是user

{% asset_img image-20230828202551316.png%}

登录之后，就会自动跳到并访问下面的地址

```plain
http://localhost:13848/hello/world
```

- 默认的退出登录接口如下

```plain
http://localhost:13848/logout
```

{% asset_img image-20230828202641402.png %}
## 认证

springsecurity的权限管理，是`先授权后认证`

流程图如下

{% asset_img 1689586875709-6eb3d7ed-ee86-4245-9b5f-5bbe49b7144b.jpg %}

### 1. springsecurity原理

SpringSecurity的原理其实就是一个过滤器链，内部包含了提供各种功能的过滤器。这里我们可以看看入门案例中的过滤器。

> 监听器 -> 过滤器链 -> dispatcherservlet(前置拦截器 -> mapperHandle -> 后置拦截器 -> 最终拦截器)

{% asset_img 1689586875966-f65f8796-6a23-4978-bfe1-ee7bc9eb3f8c.jpg %}

图中只展示了核心过滤器，其它的非核心过滤器并没有在图中展示。

- **UsernamePasswordAuthenticationFilter**:负责处理我们在登陆页面填写了用户名密码后的登陆请求。入门案例的认证工作主要有它负责。

- **ExceptionTranslationFilter：**处理过滤器链中抛出的任何AccessDeniedException和AuthenticationException 。

- **FilterSecurityInterceptor：**负责权限校验的过滤器。

注意，橙色部分表示认证，黄色部分表示异常处理，红色部分表示授权

### 2. 认证流程

概念速查:

- Authentication接口: 它的实现类，表示当前访问系统的用户，封装了用户相关信息。

- AuthenticationManager接口：定义了认证Authentication的方法 

- UserDetailsService接口：加载用户特定数据的核心接口。里面定义了一个根据用户名查询用户信息的方法。

- UserDetails接口：提供核心用户信息。通过UserDetailsService根据用户名获取处理的用户信息要封装成UserDetails对象返回。然后将这些信息封装到Authentication对象中。

{% asset_img 1689586876374-c2b3efaa-da08-48b1-85b9-f862639ddf9d.jpg %}

### 3. 自定义认证思路

> 登录
>
> ​	①自定义登录接口  
>
> ​				调用ProviderManager的方法进行认证 如果认证通过生成jwt
>
> ​				把用户信息存入redis中
>
> ​	②自定义UserDetailsService 
>
> ​				在这个实现类中去查询数据库
>
> 校验：
>
> ​	①定义Jwt认证过滤器
>
> ​				获取token
>
> ​				解析token获取其中的userid
>
> ​				从redis中获取用户信息
>
> ​				存入SecurityContextHolder

### 4. 准备工作

新建一个maven项目 TokenDemo，修改pom.xml文件为如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.czc</groupId>
    <artifactId>TokenDemo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.0</version>
    </parent>


    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--springboot整合springsecurity-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!--redis依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!--fastjson依赖-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.33</version>
        </dependency>

        <!--jwt依赖-->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.0</version>
        </dependency>

        <!--引入Lombok依赖，方便实体类开发-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <!--引入MybatisPuls依赖-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.4.3</version>
        </dependency>

        <!--引入mysql驱动的依赖-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <!--引入Junit，用于测试-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>

    </dependencies>


    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```

##### 准备工具类

- 新建启动类TokenApplication

```java
/**
 * @author czc
 */
@SpringBootApplication
@MapperScan("com.czc.mapper")
public class TokenApplication {
    public static void main(String[] args) {
        SpringApplication.run(TokenApplication.class,args);
    }
}

```

- 新建Controller类HelloController

```java
/**
 * @author czc
 */
@RestController
@RequestMapping()
public class HelloController {

    @RequestMapping("/hello")
    public String hello(){
        return "欢迎，开始你新的学习旅程吧";
    }

}
```

- 目录下新建 utils.FastJsonRedisSerializer 类

```java
/**
 * @author czc
 */
//Redis使用FastJson序列化
public class FastJsonRedisSerializer<T> implements RedisSerializer<T> {

    public static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

    private final Class<T> clazz;

    static
    {
        ParserConfig.getGlobalInstance().setAutoTypeSupport(true);
    }

    public FastJsonRedisSerializer(Class<T> clazz)
    {
        super();
        this.clazz = clazz;
    }

    @Override
    public byte[] serialize(T t) throws SerializationException
    {
        if (t == null)
        {
            return new byte[0];
        }
        return JSON.toJSONString(t, SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException
    {
        if (bytes == null || bytes.length <= 0)
        {
            return null;
        }
        String str = new String(bytes, DEFAULT_CHARSET);

        return JSON.parseObject(str, clazz);
    }


    protected JavaType getJavaType(Class<?> clazz)
    {
        return TypeFactory.defaultInstance().constructType(clazz);
    }
}

```

- 目录新建 config.RedisConfig 类

```java
/**
 * @author 35238
 * @date 2023/7/11 0011 15:40
 */
@Configuration
public class RedisConfig {

    @Bean
    @SuppressWarnings(value = { "unchecked", "rawtypes" })
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        FastJsonRedisSerializer serializer = new FastJsonRedisSerializer(Object.class);

        // 使用StringRedisSerializer来序列化和反序列化redis的key值
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);

        // Hash的key也采用StringRedisSerializer的序列化方式
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}

```

- 目录新建 common.ResponseResult 类

```java
/**
 * @author czc
 */
//响应类
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseResult<T> {
    /**
     * 状态码
     */
    private Integer code;
    /**
     * 提示信息，如果有错误时，前端可以获取该字段进行提示
     */
    private String msg;
    /**
     * 查询到的结果数据，
     */
    private T data;

    public ResponseResult(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public ResponseResult(Integer code, T data) {
        this.code = code;
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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ResponseResult(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}

```

- 在 utils 目录新建 JwtUtil 类

```java
/**
 * @author czc
 */
public class JwtUtil {

    //有效期为
    public static final Long JWT_TTL = 60 * 60 * 1000L;// 60 * 60 *1000  一个小时
    //设置秘钥明文, 注意长度必须大于等于6位
    public static final String JWT_KEY = "czc";


    public static String getUUID() {
        String token = UUID.randomUUID().toString().replaceAll("-", "");
        return token;
    }

    /**
     * 生成jwt
     *
     * @param subject token中要存放的数据（json格式）
     * @return
     */
    public static String createJWT(String subject) {
        JwtBuilder builder = getJwtBuilder(subject, null, getUUID());// 设置过期时间
        return builder.compact();
    }

    /**
     * 生成jwt
     *
     * @param subject   token中要存放的数据（json格式）
     * @param ttlMillis token超时时间
     * @return
     */
    public static String createJWT(String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, getUUID());// 设置过期时间
        return builder.compact();
    }

    private static JwtBuilder getJwtBuilder(String subject, Long ttlMillis, String uuid) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        SecretKey secretKey = generalKey();
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        if (ttlMillis == null) {
            ttlMillis = JwtUtil.JWT_TTL;
        }
        long expMillis = nowMillis + ttlMillis;
        Date expDate = new Date(expMillis);
        return Jwts.builder()
                .setId(uuid)              //唯一的ID
                .setSubject(subject)   // 主题  可以是JSON数据
                .setIssuer("czc")     // 签发者
                .setIssuedAt(now)      // 签发时间
                .signWith(signatureAlgorithm, secretKey) //使用HS256对称加密算法签名, 第二个参数为秘钥
                .setExpiration(expDate);
    }

    /**
     * 创建token
     *
     * @param id
     * @param subject
     * @param ttlMillis
     * @return
     */
    public static String createJWT(String id, String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, id);// 设置过期时间
        return builder.compact();
    }

    /**
     * 生成加密后的秘钥 secretKey
     *
     * @return
     */
    public static SecretKey generalKey() {
        byte[] encodedKey = Base64.getDecoder().decode(JwtUtil.JWT_KEY);
        SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
        return key;
    }

    /**
     * 解析
     *
     * @param jwt
     * @return
     * @throws Exception
     */
    public static Claims parseJWT(String jwt) throws Exception {
        SecretKey secretKey = generalKey();
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(jwt)
                .getBody();
    }

}

```

- 在 utils 目录新建 RedisCache 类

```java
/**
 * redis工具类
 *
 * @author czc
 */
@SuppressWarnings(value = {"unchecked", "rawtypes"})
@Component
public class RedisCache {
    @Autowired
    public RedisTemplate redisTemplate;

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key   缓存的键值
     * @param value 缓存的值
     */
    public <T> void setCacheObject(final String key, final T value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 缓存基本的对象，Integer、String、实体类等
     *
     * @param key      缓存的键值
     * @param value    缓存的值
     * @param timeout  时间
     * @param timeUnit 时间颗粒度
     */
    public <T> void setCacheObject(final String key, final T value, final Integer timeout, final TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout) {
        return expire(key, timeout, TimeUnit.SECONDS);
    }

    /**
     * 设置有效时间
     *
     * @param key     Redis键
     * @param timeout 超时时间
     * @param unit    时间单位
     * @return true=设置成功；false=设置失败
     */
    public boolean expire(final String key, final long timeout, final TimeUnit unit) {
        return Boolean.TRUE.equals(redisTemplate.expire(key, timeout, unit));
    }

    /**
     * 获得缓存的基本对象。
     *
     * @param key 缓存键值
     * @return 缓存键值对应的数据
     */
    public <T> T getCacheObject(final String key) {
        ValueOperations<String, T> operation = redisTemplate.opsForValue();
        return operation.get(key);
    }

    /**
     * 删除单个对象
     *
     * @param key
     */
    public boolean deleteObject(final String key) {
        return Boolean.TRUE.equals(redisTemplate.delete(key));
    }

    /**
     * 删除集合对象
     *
     * @param collection 多个对象
     * @return
     */
    public long deleteObject(final Collection collection) {
        return redisTemplate.delete(collection);
    }

    /**
     * 缓存List数据
     *
     * @param key      缓存的键值
     * @param dataList 待缓存的List数据
     * @return 缓存的对象
     */
    public <T> long setCacheList(final String key, final List<T> dataList) {
        Long count = redisTemplate.opsForList().rightPushAll(key, dataList);
        return count == null ? 0 : count;
    }

    /**
     * 获得缓存的list对象
     *
     * @param key 缓存的键值
     * @return 缓存键值对应的数据
     */
    public <T> List<T> getCacheList(final String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    /**
     * 缓存Set
     *
     * @param key     缓存键值
     * @param dataSet 缓存的数据
     * @return 缓存数据的对象
     */
    public <T> BoundSetOperations<String, T> setCacheSet(final String key, final Set<T> dataSet) {
        BoundSetOperations<String, T> setOperation = redisTemplate.boundSetOps(key);
        Iterator<T> it = dataSet.iterator();
        while (it.hasNext()) {
            setOperation.add(it.next());
        }
        return setOperation;
    }

    /**
     * 获得缓存的set
     *
     * @param key
     * @return
     */
    public <T> Set<T> getCacheSet(final String key) {
        return redisTemplate.opsForSet().members(key);
    }

    /**
     * 缓存Map
     *
     * @param key
     * @param dataMap
     */
    public <T> void setCacheMap(final String key, final Map<String, T> dataMap) {
        if (dataMap != null) {
            redisTemplate.opsForHash().putAll(key, dataMap);
        }
    }

    /**
     * 获得缓存的Map
     *
     * @param key
     * @return
     */
    public <T> Map<String, T> getCacheMap(final String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 往Hash中存入数据
     *
     * @param key   Redis键
     * @param hKey  Hash键
     * @param value 值
     */
    public <T> void setCacheMapValue(final String key, final String hKey, final T value) {
        redisTemplate.opsForHash().put(key, hKey, value);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key  Redis键
     * @param hKey Hash键
     * @return Hash中的对象
     */
    public <T> T getCacheMapValue(final String key, final String hKey) {
        HashOperations<String, String, T> opsForHash = redisTemplate.opsForHash();
        return opsForHash.get(key, hKey);
    }

    /**
     * 删除Hash中的数据
     *
     * @param key
     * @param hkey
     */
    public void delCacheMapValue(final String key, final String hkey) {
        HashOperations hashOperations = redisTemplate.opsForHash();
        hashOperations.delete(key, hkey);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key   Redis键
     * @param hKeys Hash键集合
     * @return Hash对象集合
     */
    public <T> List<T> getMultiCacheMapValue(final String key, final Collection<Object> hKeys) {
        return redisTemplate.opsForHash().multiGet(key, hKeys);
    }

    /**
     * 获得缓存的基本对象列表
     *
     * @param pattern 字符串前缀
     * @return 对象列表
     */
    public Collection<String> keys(final String pattern) {
        return redisTemplate.keys(pattern);
    }
}
```

- 在 utils 目录新建 WebUtils 类

```java
/**
 * @author czc
 */
public class WebUtils {
    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
     * @param string 待渲染的字符串
     * @return null
     */
    public static String renderString(HttpServletResponse response, String string) {
        try
        {
            response.setStatus(200);
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(string);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return null;
    }
}
```

- 在 entity目录新建 User类

```java
/**
 * @author czc
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("sys_user")
public class User implements Serializable {
    private static final long serialVersionUID = -40356785423868312L;

    /**
     * 主键
     */
    @TableId
    private Long id;
    /**
     * 用户名
     */
    private String userName;
    /**
     * 昵称
     */
    private String nickName;
    /**
     * 密码
     */
    private String password;
    /**
     * 账号状态（0正常 1停用）
     */
    private String status;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 手机号
     */
    private String phonenumber;
    /**
     * 用户性别（0男，1女，2未知）
     */
    private String sex;
    /**
     * 头像
     */
    private String avatar;
    /**
     * 用户类型（0管理员，1普通用户）
     */
    private String userType;
    /**
     * 创建人的用户id
     */
    private Long createBy;
    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 更新人
     */
    private Long updateBy;
    /**
     * 更新时间
     */
    private Date updateTime;
    /**
     * 删除标志（0代表未删除，1代表已删除）
     */
    private Integer delFlag;
}
```

以上均为工具类，之后会用上，最后的代码结构如下

{% asset_img image-20230831151606054.png %}

##### 准备数据库

从之前的分析我们可以知道，我们可以自定义一个UserDetailsService,让SpringSecurity使用我们的UserDetailsService。我们自己的UserDetailsService可以从数据库中查询用户名和密码。

注意: 要想让用户的密码是明文存储，需要在密码前加{noop}，作用是例如等下在浏览器登陆的时候就可以用huanf作为用户名，112233作为密码来登陆了

```sql
/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80031
 Source Host           : localhost:3306
 Source Schema         : czc_security

 Target Server Type    : MySQL
 Target Server Version : 80031
 File Encoding         : 65001

 Date: 31/08/2023 15:19:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'NULL' COMMENT '用户名',
  `nick_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'NULL' COMMENT '昵称',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'NULL' COMMENT '密码',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '0' COMMENT '账号状态（0正常 1停用）',
  `email` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `phonenumber` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `sex` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户性别（0男，1女，2未知）',
  `avatar` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `user_type` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1' COMMENT '用户类型（0管理员，1普通用户）',
  `create_by` bigint(0) NULL DEFAULT NULL COMMENT '创建人的用户id',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` bigint(0) NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `del_flag` int(0) NULL DEFAULT 0 COMMENT '删除标志（0代表未删除，1代表已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', '管理员', '{noop}123456', '0', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, 0);
INSERT INTO `sys_user` VALUES (2, 'czc', '橙子草', '$2a$10$eFuPitt7q0SiFjIJVfCP1.jmdFD264axKxmXLwMkYTRn/Dh.q3V0C', '0', NULL, NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;

```

在pom.xml添加如下

```xml
<!--引入MybatisPuls依赖-->
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus-boot-starter</artifactId>
	<version>3.4.3</version>
</dependency>

<!--引入mysql驱动的依赖-->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
</dependency>
```

在 src/main/resources 目录新建File，文件名为application.yml，写入如下

```yaml
server:
  port: 13848
spring:
  datasource:
    username: root
    password: czc123
    url: jdbc:mysql:///czc_security
```

新建 mapper.UserMapper 接口，写入如下

```java
/**
 * @author czc
 */
@Service
public interface UserMapper extends BaseMapper<User> {
}
```

在TokenApplication启动类添加注解

```java
@MapperScan("com.czc.mapper")
```

新建MapperTest测试类，写入如下。作用是测试mybatis-plus是否正常

```java
@SpringBootTest
public class MapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testUserMapper(){
        //查询所有用户
        List<User> users = userMapper.selectList(null);
        System.out.println(users);
    }
}
```

运行MapperTest类的testUserMapper方法，看是否能查到数据库的所有用户。

> 2023-08-31 15:22:58.152  INFO 17264 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
> 2023-08-31 15:22:59.005  INFO 17264 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
> [User(id=1, userName=admin, nickName=管理员, password={noop}123456, status=0, email=null, phonenumber=null, sex=null, avatar=null, userType=0, createBy=null, createTime=null, updateBy=null, updateTime=null, delFlag=0), User(id=2, userName=czc, nickName=橙子草, password=$2a$10$eFuPitt7q0SiFjIJVfCP1.jmdFD264axKxmXLwMkYTRn/Dh.q3V0C, status=0, email=null, phonenumber=null, sex=null, avatar=null, userType=1, createBy=null, createTime=null, updateBy=null, updateTime=null, delFlag=0)]

到此，可以确定数据库是没问题的，环境到此就准备好了

### 5. 自定义security的认证实现

准备工作做好了，包括搭建、代码、数据库。

接下来我们会实现让security在认证的时候，根据我们数据库的用户和密码进行认证，也就是被security拦截业务接口，出现登录页面之后，我们需要通过`输入数据库里的用户和密码来登录，而不是使用security默认的用户和密码进行登录`

思路: 只需要新建一个实现类，在这个实现类里面实现Security官方的UserDetailsService接口，然后重写里面的loadUserByUsername方法

- 在common目录新建LoginUser类，作为UserDetails接口(Security官方提供的接口)的实现类

```java
package com.huanf.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * @author czc
 */
@Data //get和set方法
@NoArgsConstructor //无参构造
@AllArgsConstructor  //带参构造
//实现UserDetails接口之后，要重写UserDetails接口里面的7个方法
public class LoginUser implements UserDetails {
    
    private User xxuser;
    
    @Override
    //用于返回权限信息。现在我们正在学'认证'，'权限'后面才学。所以返回null即可
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    //用于获取用户密码。由于使用的实体类是User，所以获取的是数据库的用户密码
    public String getPassword() {
        return xxuser.getPassword();
    }

    @Override
    //用于获取用户名。由于使用的实体类是User，所以获取的是数据库的用户名
    public String getUsername() {
        return xxuser.getUserName();
    }

    @Override
    //判断登录状态是否过期。把这个改成true，表示永不过期
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    //判断账号是否被锁定。把这个改成true，表示未锁定，不然登录的时候，不让你登录
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    //判断登录凭证是否过期。把这个改成true，表示永不过期
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    //判断用户是否可用。把这个改成true，表示可用状态
    public boolean isEnabled() {
        return true;
    }
}
```

第二步:新建 service.impl.MyUserDetailServiceImpl 类，写入如下

```java
/**
 * 重写登录认证
 * @author czc
 */
@Service
public class MyUserDetailServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private MenuMapper menuMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //查询用户
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        //没有查询到用户就抛出异常
        if(user==null){
            throw new RuntimeException("用户名或者密码错误");
        }
        //把查询到的user结果，封装成UserDetails类型，然后返回。
        //由于UserDetails是个接口，需要新建LoginUser类，作为UserDetails的实现类
        return new LoginUser(user,list);
    }
}
```

- 测试。运行TokenApplication引导类，浏览器输入如下，输入一下登录的用户名和密码，判断根据数据库来进行认证

```plain
http://localhost:13848/hello
```

发现登陆成功

### 6. 密码加密校验问题

上面我们实现了自定义Security的认证机制，让Security根据数据库的数据，来认证用户输入的数据是否正确。

但是当时存在一个问题，就是我们在数据库存入用户表的时候，插入的czc用户的密码是 {noop}czc123，为什么用czc123不行呢

原因: 

> SpringSecurity默认使用的PasswordEncoder要求数据库中的密码格式为：{加密方式}密码。对应的就是{noop}czc123，实际表示的是czc123

但是我们在数据库直接暴露密码，会造成安全问题，所以我们需要把加密后的密文当作密码.

此时用户在浏览器登录时输入czc123，我们如何确保用户能够登录进去呢，

>  答案是SpringSecurity默认的密码校验，替换为SpringSecurity为我们提供的BCryptPasswordEncoder

我们只需要使用把BCryptPasswordEncoder对象注入Spring容器中，SpringSecurity就会使用该PasswordEncoder来进行密码校验。

我们可以定义一个SpringSecurity的配置类，SpringSecurity要求这个配置类要继承WebSecurityConfigurerAdapter。

---

- 在config目录新建 SecurityConfig 类，写入如下。作用是根据原文，生成一个密文

```java
package com.huanf.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * @author czc
 */
@Configuration
//实现Security提供的WebSecurityConfigurerAdapter类，就可以改变密码校验的规则了
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
```

- 测试。在MapperTest类，添加如下，然后运行 TestBCryptPasswordEncoder 方法

```java
@SpringBootTest
public class PasswordEncoderTest {

    //如果不想在下面那行new的话，那么就在该类注入PasswordEncoder，例如如下
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void TestBCryptPasswordEncoder(){

//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        //模拟用户输入的密码
        String encode1 = passwordEncoder.encode("czc123");
        //再模拟一次用户输入的密码
        String encode2 = passwordEncoder.encode("1234");
        //虽然这两次的密码都是一样的，但是加密后是不一样的。每次运行，对同一原文都会有不同的加密结果
        //原因:会添加随机的盐，加密结果=盐+原文+加密。达到每次加密后的密文都不相同的效果
        System.out.println(encode1);
        System.out.println(encode2);
    }
    @Test
    public void TestBCryptPasswordEncoder(){
//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        boolean result = passwordEncoder.matches("czc123", "$2a$10$eFuPitt7q0SiFjIJVfCP1.jmdFD264axKxmXLwMkYTRn/Dh.q3V0C");

        //看一下比对结果
        System.out.println(result);

    }
}
```

通过调用`passwordEncoder`的加密解密方法，我们可以轻松做到两者之间的转换

---

以下是本小节的一些gpt回答

```text
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}以上代码的作用是什么？使用passwordEncoder.encode和passwordEncoder.matches不写上面的代码有什么后果？
```

```text
以上代码是一个 Spring Security 的配置类，其作用是向 Spring 容器中注册一个名为 "passwordEncoder" 的 Bean，该 Bean 的类型是 PasswordEncoder，具体实现是 BCryptPasswordEncoder。PasswordEncoder 是 Spring Security 提供的接口，用于加密和校验密码。

通过 passwordEncoder.encode(rawPassword) 可以将原始密码进行加密处理，返回加密后的密码。而 passwordEncoder.matches(rawPassword, encodedPassword) 可以用于比较原始密码和已加密密码是否匹配。

如果不写上述代码，意味着没有向 Spring 容器中注册一个 PasswordEncoder 的 Bean。在实际使用时，可能会导致以下后果：

缺乏密码加密功能：没有合适的密码编码器，无法对用户密码进行安全的加密存储。这样，存储在数据库中的密码很容易被恶意获取，造成安全风险。

验证问题：没有 PasswordEncoder，无法进行密码的正确性校验。例如，在用户登录验证时，无法比对用户输入的密码和数据库中存储的加密密码是否一致，从而导致认证失败。

综上所述，注册一个 PasswordEncoder Bean 是非常重要的，它提供了密码加密和校验的功能，对于保障用户密码的安全性以及用户认证过程的正确性至关重要。
```

---

```text
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}不继承WebSecurityConfigurerAdapter有什么关系？
```

```text
SecurityConfig 类不继承 WebSecurityConfigurerAdapter 并不会直接产生任何关系，但这取决于你的具体需求和项目的配置。

WebSecurityConfigurerAdapter 是 Spring Security 提供的一个方便的基类，它实现了 WebSecurityConfigurer 接口并提供了一些默认的安全配置。通过继承 WebSecurityConfigurerAdapter，你可以覆盖其中的方法来自定义安全配置。

如果你的项目中没有需要特殊处理的安全需求，并且只需要使用默认的安全配置，那么不继承 WebSecurityConfigurerAdapter 并没有实质性的影响。在这种情况下，Spring Security 仍然会使用默认的安全配置，如禁用 CSRF、使用 HTTP Basic 认证等。

但如果你需要自定义安全配置，例如添加额外的过滤器、配置身份验证提供者、定义 URL 权限等，那么继承 WebSecurityConfigurerAdapter 就非常有用了。通过继承 WebSecurityConfigurerAdapter，你可以重写其中的方法来覆盖默认的安全配置，以满足你的特定需求。

总结起来，不继承 WebSecurityConfigurerAdapter 不会直接产生关系，对于默认的安全配置而言，应用程序将使用默认配置。但如果需要自定义安全配置，则需要通过继承 WebSecurityConfigurerAdapter 并重写相关方法来实现。
```

### 7. jwt工具类实现加密校验

下面学习如何使用jwt工具类实现密码的加密解密

新建一个jwtTest测试类,通过调用工具类运行两个测试方法，达成加密解密的转换

```java
@SpringBootTest
public class JwtTest {
    @Test
    public void CreateJwtTest() throws Exception {
        //加密指定字符串
        String xxjwt = createJWT("czc123");
        System.out.println(xxjwt);
    }

    @Test
    public void ParseJwtTest() throws Exception {
        //解密字符串
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyYmNiMTU2NDAyMjA0NTlhODhhZmI3NDliZDYzODVkNSIsInN1YiI6ImN6YzEyMyIsImlzcyI6ImN6YyIsImlhdCI6MTY5MzM5NDY1NywiZXhwIjoxNjkzMzk4MjU3fQ.rqP94vTgHV0rU35oC0aiKfkjnaL21ifWroSjNNYxEYo";
        Claims claims = parseJWT(token);
        System.out.println(claims);
        //  {jti=2bcb15640220459a88afb749bd6385d5, sub=czc123, iss=czc, iat=1693394657, exp=1693398257}
    }
}
```

### 8. 登录接口的分析

​	接下我们需要自定义登陆接口，然后让SpringSecurity对这个接口放行,让用户访问这个接口的时候不用登录也能访问。

​	在接口中我们通过AuthenticationManager的authenticate方法来进行用户认证,所以需要在SecurityConfig中配置把AuthenticationManager注入容器。

​	认证成功的话要生成一个jwt，放入响应中返回。并且为了让用户下回请求时能通过jwt识别出具体的是哪个用户，我们需要把用户信息存入redis，可以把用户id作为key。

### 9. 登录接口的实现

- 修改数据库的czc用户的密码，把czc123明文修改为对应的密文。

密文可以用jwt工具类加密czc123进行转换

- 在 SecurityConfig 类添加如下

```java
@Bean
@Override
public AuthenticationManager authenticationManagerBean() throws Exception {
	return super.authenticationManagerBean();
}

@Override
protected void configure(HttpSecurity http) throws Exception {
	http
		//由于是前后端分离项目，所以要关闭csrf
		.csrf().disable()
		//由于是前后端分离项目，所以session是失效的，我们就不通过Session获取SecurityContext
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		.and()
		//指定让spring security放行登录接口的规则
		.authorizeRequests()
		// 对于登录接口 anonymous表示允许匿名访问
		.antMatchers("/user/login").anonymous()
		// 除上面外的所有请求全部需要鉴权认证
		.anyRequest().authenticated();
}
```

- 在service目录新建 LoginService 接口，写入如下

```java
/**
 * @author czc
 */
@Service
public interface LoginService {
    ResponseResult login(User user);
}
```

- 在service目录新建 impl.LoginServiceImpl 类，写入如下

```java
/**
 * @Author : chinzicam
 * @create 2023/8/30 16:12
 */
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private RedisCache redisCache;

    /**
     * 登录
     * 判断是否认证，利用userId生成jwt，存入redis，当作token存入redis，同时返回给前端
     * @param user
     * @return
     */
    @Override
    public ResponseResult login(User user) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getUserName(), user.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        //如果用户认证不存在
        if (Objects.isNull(authenticate)) {
            throw new RuntimeException("登录失败");
        }
        //反之，存在,获取User对象
        LoginUser loginUser = (LoginUser) authenticate.getPrincipal();
        //利用userId生成jwt，存入redis，当作token
        String userId = loginUser.getUser().getId().toString();
        String jwt = JwtUtil.createJWT(userId);

        //存入redis
        redisCache.setCacheObject("login:"+userId,loginUser);
        //把token响应给前端
        HashMap<String,String> map = new HashMap<>();
        map.put("token",jwt);

        return new ResponseResult(200,"登陆成功",map);
    }
}
```

- 在controller目录新建 LoginController 类，写入如下

```java
/**
 * @Author : chinzicam
 * @create 2023/8/30 16:08
 */
@RestController
@RequestMapping
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/user/login")
    public ResponseResult login(@RequestBody User user){
        return loginService.login(user);
    }
```

- 进行postman测试，观察authenticate的存储结构

{% asset_img image-20230830163940627.png %}



- 添加redis连接，我这里使用了第一个数据库

```yaml
  redis:
    port: 6379
    host: localhost
    password: 123456
    database: 1
```

- 运行TokenApplication引导类

- 测试。打开你的postman，发送下面的POST请求

```plain
localhost:13848/user/login
```

{% asset_img image-20230831154920591.png %}

- 登录成功，测试通过



### 10. 认证过滤器


我们需要自定义一个过滤器，这个过滤器会去获取请求头中的token，对token进行解析取出其中的userid。

使用userid去redis中获取对应的LoginUser对象。

然后封装Authentication对象存入SecurityContextHolder

为什么要有redis参与: 

> 是为了防止过了很久之后，浏览器没有关闭，拿着token也能访问，这样不安全

认证过滤器的作用是什么: 

>  上面我们实现登录接口的时，当某个用户登录之后，该用户就会有一个token值，我们可以通过认证过滤器，由于有token值，并且token值认证通过，也就是证明是这个用户的token值，那么该用户访问我们的业务接口时，就不会被Security拦截。简单理解作用就是登录过的用户可以访问我们的业务接口，拿到对应的资源

---

- 定义过滤器。新建 filter.JwtAuthenticationTokenFilter 类，写入如下

```java
/**
 * jwt认证过滤器
 * @Author : chinzicam
 * @create 2023/8/30 16:50
 */
@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    @Autowired
    private RedisCache redisCache;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = request.getHeader("token");
        //如果请求没有携带token，那么就不需要解析token，不需要获取用户信息，直接放行就可以
        if(!StringUtils.hasText(token)){
            filterChain.doFilter(request, response);
            //return之后，就不会走下面那些代码
            return;
        }
        //解析token是否非法
        String userId;
        try {
            Claims claims = JwtUtil.parseJWT(token);
            userId=claims.getSubject();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("token非法");
        }
        //从redis获取用户信息
        String redisKey="login:"+userId;
        LoginUser loginUser = redisCache.getCacheObject(redisKey);

        //判断获取到的用户信息是否为空，因为redis里面可能并不存在这个用户信息，例如缓存过期了
        if(Objects.isNull(loginUser)){
            throw new RuntimeException("用户未登录");
        }

        //将LoginUser用户信息，通过setAuthentication方法，存入SecurityContextHolder
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUser,null,loginUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        //放行
        filterChain.doFilter(request,response);
    }
}
```

- 修改SecurityConfig类,在configure方法加了一点代码,并且注入了JwtAuthenticationTokenFilter类

```java
        //配置token校验过滤器
        //第一个参数是上面注入的我们在filter目录写好的类，第二个参数表示你想添加到哪个过滤器之前
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
```

- 运行TokenApplication引导类

- 测试。打开你的postman，发送如下的POST请求，作用是先登录一个用户，这样就能生成这个用户对应的token值

```plain
localhost:13848/user/login
```

- 测试。继续在你的postman，发送如下GET请求，复制刚刚的token值，去访问我们的业务接口，看会不会被Security拦截，如果不会拦截，那么就说明认证过滤器生效了，使用场景就是简单理解就是登录过的用户可以访问我们的业务接口，拿到对应的资源


{% asset_img image-20230830195633181.png %}


本节的gpt问答（这是JwtAuthenticationTokenFilter 类里的）

```text
@Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {

    }介绍一下这几个参数
```

```text
这个方法是在实现`Filter`接口时需要实现的方法，用于在请求被处理之前或之后对请求进行过滤和处理。下面是对这几个参数的介绍：

1. `HttpServletRequest httpServletRequest`：表示HTTP请求对象，包含了客户端发送的请求信息，如请求头、请求体、请求参数等。

2. `HttpServletResponse httpServletResponse`：表示HTTP响应对象，用于向客户端发送响应信息，如响应头、响应体等。

3. `FilterChain filterChain`：过滤器链对象，用于按照配置的顺序依次调用其他过滤器和Servlet来处理请求。通过调用`filterChain.doFilter()`方法可以将请求传递给下一个过滤器或Servlet。

在`doFilterInternal`方法中，可以根据需求对请求进行处理，如修改请求参数、验证权限、记录日志等。处理完成后，可以选择调用`filterChain.doFilter()`方法将请求传递给下一个过滤器或Servlet，或者直接返回响应结果。
```

### 11. 退出登录

上面我们既测试了登录认证，又实现了基于密文的token认证

那么，我们怎么退出登录呢，也就是让某个用户的登录状态消失，也就是让token失效 ?

实现起来也比较简单，只需要定义一个登陆接口，然后获取SecurityContextHolder中的认证信息，删除redis中对应的数据即可

注意: 我们的token其实就是用户密码的密文，token是存在redis里面

- LoginService类

```java
    ResponseResult logout();
```

- LoginServiceImpl实现类

```java
    /**
     * 退出登录
     * @return
     */
    @Override
    public ResponseResult logout() {
        //获取loginUser
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        //从redis删除key
        String redisKey ="login:"+ loginUser.getUser().getId().toString();
        redisCache.deleteObject(redisKey);
        return new ResponseResult(200,"注销成功");
    }
```

- LoginController类

```java
    /**
     * 退出登录
     * @return
     */
    @RequestMapping("/user/logout")
    public ResponseResult logout(){
        return loginService.logout();
    }
```

- 运行TokenApplication引导类

- 测试。打开你的postman，发送如下的POST请求，作用是先登录一个用户，这样就能生成这个用户对应的token值

```plain
localhost:13848/user/login
```

- 测试。继续在你的postman，发送如下GET请求，作用是拿着刚刚的token值，去访问我们的业务接口，看在有登录状态的情况下，能不能访问

```plain
http://localhost:13848/hello
```

注意还要带上你刚刚复制的token值，粘贴到消息头的Value输入框

- 测试。继续在你的postman，发送如下GET请求，作用是退出登录，然后去访问我们的业务接口，看在没有登录状态的情况下，能不能访问

```plain
http://localhost:8080/user/logout
```

注意还要带上你刚刚复制的token值，粘贴到消息头的Value输入框

{% asset_img image-20230830200601321.png %}

- 注销账号后，再次访问hello/world接口，报错

{% asset_img image-20230830200626122.png %}

------

## 授权

### 1. 权限系统的作用

例如一个学校图书馆的管理系统，如果是普通学生登录就能看到借书还书相关的功能，不可能让他看到并且去使用添加书籍信息，删除书籍信息等功能。但是如果是一个图书馆管理员的账号登录了，应该就能看到并使用添加书籍信息，删除书籍信息等功能。

​	总结起来就是**不同的用户可以使用不同的功能**。这就是权限系统要去实现的效果。

​	我们不能只依赖前端去判断用户的权限来选择显示哪些菜单哪些按钮。因为如果只是这样，如果有人知道了对应功能的接口地址就可以不通过前端，直接去发送请求来实现相关功能操作。

​	所以我们还需要在后台进行用户权限的判断，判断当前用户是否有相应的权限，必须具有所需权限才能进行相应的操作。

### 2. 授权的基本流程

​	在SpringSecurity中，会使用默认的FilterSecurityInterceptor来进行权限校验。在FilterSecurityInterceptor中会从SecurityContextHolder获取其中的Authentication，然后获取其中的权限信息。当前用户是否拥有访问当前资源所需的权限。

​	所以我们在项目中只需要把当前登录用户的权限信息也存入Authentication。

​	然后设置我们的资源所需要的权限即可。

{% asset_img 1689586875966-f65f8796-6a23-4978-bfe1-ee7bc9eb3f8c.jpg %}

### 3. 自定义访问路径的权限

SpringSecurity为我们提供了基于注解的权限控制方案，这也是我们项目中主要采用的方式。我们可以使用注解去指定访问对应的资源所需的权限

- 在SecurityConfig配置类添加如下，作用是开启相关配置

```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
```

- 开启了相关配置之后，就能使用@PreAuthorize等注解了。在HelloController类的hello方法，添加如下注解，其中test表示自定义权限的名字

```java
@RestController
public class HelloController {

    @RequestMapping("/hello")
    @PreAuthorize("hasAuthority('test')")
    public String hello(){
        return "hello";
    }
}
```

### 4. 带权限访问的实现

权限信息: 有特殊含义的字符串

我们前面在登录时，会调用到MyUserDetailServiceImpl类的loadUserByUsername方法，当时我们写loadUserByUsername方法时，只写了查询用户数据信息的代码，还差查询用户权限信息的代码。

在登录完之后，因为携带了token，所以需要在JwtAuthenticationTokenFilter类添加 '获取权限信息封装到Authentication中' 的代码，添加到UsernamePasswordAuthenticationToken的第三个参数里面，我们当时第三个参数传的是null。

- 把MyUserDetailServiceImpl类修改为如下，主要是增加了查询用户权限信息的代码

```java
/**
 * 重写登录认证
 * @author czc
 */
@Service
public class MyUserDetailServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private MenuMapper menuMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //查询用户
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName,username);
        User user = userMapper.selectOne(wrapper);
        //没有查询到用户就抛出异常
        if(user==null){
            throw new RuntimeException("用户名或者密码错误");
        }
        //自定义了3个权限，用List集合存储
        List<String> list = new ArrayList<>(Arrays.asList("test","adminAuth","czcAuth"));

        //把查询到的user结果，封装成UserDetails类型，然后返回。
        //由于UserDetails是个接口，需要新建LoginUser类，作为UserDetails的实现类
        return new LoginUser(user,list);
    }
}
```

- 封装权限信息。把LoginUser类修改为如下，主要是添加了permissions变量，然后重写了loginUser的全参构造，还有getAuthorities

```java
**
 * @author czc
 */
@Data
@NoArgsConstructor
//实现UserDetails接口
public class LoginUser implements UserDetails {

    private User user;

    private List<String> permissions;

    @JSONField(serialize = false) //这个注解的作用是不让下面那行的成员变量序列化存入redis，避免redis不支持而报异常
    private List<SimpleGrantedAuthority> authorities;

    public LoginUser(User user, List<String> permissions) {
        this.user = user;
        this.permissions = permissions;
    }

    /**
     *  用于返回权限信息
     * @return
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        //严谨来说这个if判断是避免整个调用链中security本地线程变量在获取用户时的重复解析
        if(authorities != null){
            return authorities;
        }
        authorities = new ArrayList<>();
        for (String permission : permissions) {
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(permission);
            authorities.add(authority);
        }

        return authorities;
    }

    @Override
    //用于获取用户密码。由于使用的实体类是User，所以获取的是数据库的用户密码
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    //用于获取用户名。由于使用的实体类是User，所以获取的是数据库的用户名
    public String getUsername() {
        return user.getUserName();
    }

    @Override
    //判断登录状态是否过期。把这个改成true，表示永不过期
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    //判断账号是否被锁定。把这个改成true，表示未锁定，不然登录的时候，不让你登录
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    //判断登录凭证是否过期。把这个改成true，表示永不过期
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    //判断用户是否可用。把这个改成true，表示可用状态
    public boolean isEnabled() {
        return true;
    }
}
```

- 把JwtAuthenticationTokenFilter类修改为如下，主要是补充了前面没写的第三个参数，写成第三步封装好的权限信息

```java
        //把最终的LoginUser用户信息，通过setAuthentication方法，存入SecurityContextHolder
        UsernamePasswordAuthenticationToken authenticationToken =
                //第一个参数是LoginUser用户信息，第二个参数是凭证(null)，第三个参数是权限信息(null)
                //在学习封装权限信息时，就要把下面的第三个参数补充完整，getAuthorities是我们在loginUser写的方法
                new UsernamePasswordAuthenticationToken(loginUser,null,loginUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

```

-  运行TokenApplication引导类

-  测试。打开你的postman，发送如下的POST请求，作用是先登录一个用户，这样就能生成这个用户对应的token值。
-  继续在你的postman，发送如下GET请求，作用是拿着刚刚的token值，去访问我们的业务接口，看在有登录状态的情况下，能不能访问

```plain
http://localhost:13848/hello
```

注意还要带上你刚刚复制的token值，粘贴到消息头的Value输入框

- 测试。修改HelloController类的@PreAuthorize注解的权限字符串，我们把test改为test111。然后重新运行Application引导类

- 测试。把第八步的测试再做一遍，看还能访问吗

{% asset_img 1689586881656-f2ae9ef0-3b4a-4925-a1e8-4703f823dd64.jpg %}

{% asset_img 1689586881827-d78fcba9-cba0-4438-b785-34d0198df16f.jpg %}

## 授权-RBAC权限模型

### 1. 介绍

RBAC权限模型（Role-Based Access Control）即：基于角色的权限控制。这是目前最常被开发者使用也是相对易用、通用权限模型。

{% asset_img image-20211222110249727.png %}

该模型由以下五个主要组成部分构成:

一、用户: 在系统中代表具体个体的实体，可以是人员、程序或其他实体。用户需要访问系统资源

二、角色: 角色是权限的集合，用于定义一组相似权限的集合。角色可以被赋予给用户，从而授予用户相应的权限

三、权限: 权限表示系统中具体的操作或功能，例如读取、写入、执行等。每个权限定义了对系统资源的访问规则

四、用户-角色映射: 用户-角色映射用于表示用户与角色之间的关系。通过为用户分配适当的角色，用户可以获得与角色相关联的权限

五、角色-权限映射: 角色-权限映射表示角色与权限之间的关系。每个角色都被分配了一组权限，这些权限决定了角色可执行的操作

### 2.数据库表的创建

- 在你数据库的czc_security 库，新建 sys_menu权限表、sys_role角色表、sys_role_menu中间表、sys_user_role中间表，并插入数据

```sql
create database if not exists czc_security;
use czc_security;
CREATE TABLE `sys_menu` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `menu_name` varchar(64) NOT NULL DEFAULT 'NULL' COMMENT '菜单名',
  `path` varchar(200) DEFAULT NULL COMMENT '路由地址',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `visible` char(1) DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) DEFAULT '#' COMMENT '菜单图标',
  `create_by` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_by` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `del_flag` int(11) DEFAULT '0' COMMENT '是否删除（0未删除 1已删除）',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

CREATE TABLE `sys_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `role_key` varchar(100) DEFAULT NULL COMMENT '角色权限字符串',
  `status` char(1) DEFAULT '0' COMMENT '角色状态（0正常 1停用）',
  `del_flag` int(1) DEFAULT '0' COMMENT 'del_flag',
  `create_by` bigint(200) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_by` bigint(200) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

CREATE TABLE `sys_role_menu` (
  `role_id` bigint(200) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `menu_id` bigint(200) NOT NULL DEFAULT '0' COMMENT '菜单id',
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sys_user_role` (
  `user_id` bigint(200) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `role_id` bigint(200) NOT NULL DEFAULT '0' COMMENT '角色id',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

insert into sys_user_role values (2,1);
insert into sys_role values
(1,'经理','ceo',0,0,default,default,default,default,default),
(2,'程序员','coder',0,0,default,default,default,default,default);
insert into sys_role_menu values (1,1),(1,2);
insert into sys_menu values
(1,'部门管理','dept','system/dept/index',0,0,'system:dept:list','#',default,default,default,default,default,default),
(2,'测试','test','system/test/index',0,0,'system:test:list','#',default,default,default,default,default,default)
```

- 测试SQL语句，也就是确认一下你的建表、插入数据是否达到要求

```sql
# 通过用户id去查询这个用户具有的权限列表。也就是根据userid查询perms，并且限制条件为role和menu都必须正常状态么也就是等于0
SELECT 
	DISTINCT m.`perms`
FROM
	sys_user_role ur
	LEFT JOIN `sys_role` r ON ur.`role_id` = r.`id`
	LEFT JOIN `sys_role_menu` rm ON ur.`role_id` = rm.`role_id`
	LEFT JOIN `sys_menu` m ON m.`id` = rm.`menu_id`
WHERE
	user_id = 2
	AND r.`status` = 0
	AND m.`status` = 0
```

- 可以查到两条数据，这两条数据就是等下数据库返回给我们的权限字符串

### 3. 查询数据库的权限信息

- 在 entity目录新建 Menu 实体类，写入如下

```java
/**
 * @Author : chinzicam
 * @create 2023/8/31 10:21
 */
@TableName(value="sys_menu")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Menu implements Serializable {
    private static final long serialVersionUID = -54979041104113736L;

    @TableId
    private Long id;
    /**
     * 菜单名
     */
    private String menuName;
    /**
     * 路由地址
     */
    private String path;
    /**
     * 组件路径
     */
    private String component;
    /**
     * 菜单状态（0显示 1隐藏）
     */
    private String visible;
    /**
     * 菜单状态（0正常 1停用）
     */
    private String status;
    /**
     * 权限标识
     */
    private String perms;
    /**
     * 菜单图标
     */
    private String icon;

    private Long createBy;

    private Date createTime;

    private Long updateBy;

    private Date updateTime;
    /**
     * 是否删除（0未删除 1已删除）
     */
    private Integer delFlag;
    /**
     * 备注
     */
    private String remark;
}
```

- 在 mapper 目录新建 MenuMapper 接口。作用是定义mapper，其中提供一个方法可以根据userid查询权限信息

```java
/**
 * @Author : chinzicam
 * @create 2023/8/31 10:24
 */
//BaseMapper是mybatisplus官方提供的接口，里面提供了很多单表查询的方法
@Service
public interface MenuMapper extends BaseMapper<Menu> {
    List<String> selectPermsByUserId(Long id);
}
```

- 在 resources 目录新建 mapper目录，接着在这个mapper目录新建File，名字叫 MenuMapper.xml，写入如下

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.huanf.mapper.MenuMapper">

    <select id="selectPermsByUserId" resultType="java.lang.String">
        SELECT
            DISTINCT m.`perms`
        FROM
            sys_user_role ur
                LEFT JOIN `sys_role` r ON ur.`role_id` = r.`id`
                LEFT JOIN `sys_role_menu` rm ON ur.`role_id` = rm.`role_id`
                LEFT JOIN `sys_menu` m ON m.`id` = rm.`menu_id`
        WHERE
            user_id = #{userid}
          AND r.`status` = 0
          AND m.`status` = 0
    </select>

</mapper>
```

> 解析每行SQL的含义如下：
>
> 1. `SELECT DISTINCT m.perms`：从数据库中选择不重复的`m.perms`列，即获取所有权限。
>
> 2. `FROM sys_user_role ur`：从`sys_user_role`表开始查询。
>
> 3. `LEFT JOIN sys_role r ON ur.role_id = r.id`：左连接`sys_role`表，通过`ur.role_id`和`r.id`进行关联。
>
> 4. `LEFT JOIN sys_role_menu rm ON ur.role_id = rm.role_id`：左连接`sys_role_menu`表，通过`ur.role_id`和`rm.role_id`进行关联。
>
> 5. `LEFT JOIN sys_menu m ON m.id = rm.menu_id`：左连接`sys_menu`表，通过`m.id`和`rm.menu_id`进行关联。
>
> 6. `WHERE user_id = #{userid}`：筛选条件，限定`user_id`等于指定的`userid`。
>
> 7. `AND r.status = 0`：筛选条件，限定`r.status`等于0，即角色状态为有效。
>
> 8. `AND m.status = 0`：筛选条件，限定`m.status`等于0，即菜单状态为有效。
>
> 综上所述，这条SQL语句的作用是获取指定`userid`用户所拥有的所有有效权限。通过多个表的联接查询，获取用户-角色-菜单-权限的关联信息，并根据角色和菜单的状态进行筛选，最终返回不重复的权限列表。

- 把application.yml修改为如下，作用是告诉mybatisplus，刚刚写的MenuMapper.xml文件是在哪个地方

```yaml
mybatis-plus:
  mapper-locations: classpath*:/mapper/**/*.xml
```

- 测试。这里只是检查mybatismlus能不能拿到数据库的权限字符串。在MapperTest类添加如下

```java
@Autowired
private MenuMapper menuMapper;

@Test
public void testSelectPermsByUserId(){
	//L表示Long类型
	List<String> list = menuMapper.selectPermsByUserId(2L);
	System.out.println(list);
}
```

### 4. RBAC权限模型的实现

数据库设计好之后就很简单了，使用mybatis-plus,去查询数据库表的权限字符串，然后把你查到的数据去替换死数据就好了。

- 把MyUserDetailServiceImpl类修改为如下，我们只是增加了查询来自数据库的权限信息的代码

```java
        //自定义了3个权限，用List集合存储
//        List<String> list = new ArrayList<>(Arrays.asList("test","adminAuth","czcAuth"));
        //取消上面固定的写法，权限信息查询来自数据库的
        List<String> list = menuMapper.selectPermsByUserId(user.getId());
```

- 测试。

由于我们知道数据库传过来的权限字符串是 system:dept:list 和 system:test:list，所以我们要把HelloController类的权限字符串修改为如下`system:test:list`或者`system:dept:list`

```java
    @RequestMapping("/hello")
    @PreAuthorize("hasAuthority('system:dept:list')")
    public String hello(){
        return "欢迎，开始你新的学习旅程吧";
    }
```

- 运行TokenApplication引导类

- 测试。打开你的postman，发送如下的POST请求，作用是先登录一个用户，这样就能生成这个用户对应的token

- 测试。继续在你的postman，发送如下GET请求，作用是拿着刚刚的token值，去访问我们的业务接口，看在有登录状态的情况下，能不能访问`http://localhost:8080/hello`

注意还要带上你刚刚复制的token值，粘贴到消息头的Value输入框

- 测试。修改HelloController类的@PreAuthorize注解的权限字符串，我们改为 xxxsystem:test:list。然后重新运行Application引导类

- 再次测试，看还能访问吗

## 自定义异常处理

​	我们还希望在认证失败或者是授权失败的情况下也能和我们的接口一样返回相同结构的json，这样可以让前端能对响应进行统一的处理。要实现这个功能我们需要知道SpringSecurity的异常处理机制。

​	在SpringSecurity中，如果我们在认证或者授权的过程中出现了异常会被ExceptionTranslationFilter捕获到。在ExceptionTranslationFilter中会去判断是认证失败还是授权失败出现的异常。

​	如果是认证过程中出现的异常会被封装成AuthenticationException然后调用**AuthenticationEntryPoint**对象的方法去进行异常处理。

​	如果是授权过程中出现的异常会被封装成AccessDeniedException然后调用**AccessDeniedHandler**对象的方法去进行异常处理。

​	所以如果我们需要自定义异常处理，我们只需要自定义`AuthenticationEntryPoint`和`AccessDeniedHandler`然后配置给SpringSecurity即可。

{% asset_img 1689586875966-f65f8796-6a23-4978-bfe1-ee7bc9eb3f8c.jpg %}

---



- 新建 handler.AuthenticationEntryPointImpl类，写入如下，作用是自定义认证的实现类

```java
/**
 * 认证异常
 * 调用AuthenticationEntryPoint对象的方法去进行异常处理。
 * @Author : chinzicam
 * @create 2023/8/31 12:04
 */
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        ResponseResult result = new ResponseResult(HttpStatus.UNAUTHORIZED.value(), "认证失败请重新登录");
        String json = JSON.toJSONString(result);
        WebUtils.renderString(response,json);
    }
}

```

- AccessDeniedHandlerImpl 类，写入如下，作用是自定义授权的实现类

```java
/**
 * 授权异常
 * 调用AccessDeniedHandler对象的方法去进行异常处理
 * @Author : chinzicam
 * @create 2023/8/31 11:58
 */
@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        ResponseResult result = new ResponseResult(HttpStatus.FORBIDDEN.value(), "权限不足");
        String json = JSON.toJSONString(result);
        WebUtils.renderString(response,json);
    }
}
```

- 把 SecurityConfig 类添加以下内容，作用是把刚刚两个异常处理的实现类配置在Spring Security里面

```java
        //配置异常处理器
        http.exceptionHandling()
                //配置认证失败处理器
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler);
```

- 运行TokenApplication引导类

- 测试认证异常。
  - 打开你的postman，发送如下的POST请求，作用是登录一个不存在的用户，模拟认证异常

```plain
localhost:13848/user/login
```

注意还要带上如下JSON类型的Body数据

```json
{
    "userName":"xxhuanf",
    "password":"czc123"
}
```

- 测试授权异常。
  - 先在HelloController类修改PreAuthorize注解的权限字符串，修改成czc用户不存在的权限字符串
  - 接着重新运行TokenApplication引导类，然后去正常登录一个用户并访问 /hello 业务接口，必然会报权限异常，然后我们看一下响应回来的数据格式，是不是我们定义的json格式

```java
@RestController
public class HelloController {

    @RequestMapping("/hello")
    @PreAuthorize("hasAuthority('testxxxxx')")
    public String hello(){
        return "hello";
    }
}
```

## 跨域

### 跨域的后端解决

​	浏览器出于安全的考虑，使用 XMLHttpRequest对象发起 HTTP请求时必须遵守同源策略，否则就是跨域的HTTP请求，默认情况下是被禁止的。 同源策略要求源相同才能正常进行通信，即协议、域名、端口号都完全一致。 

​	前后端分离项目，前端项目和后端项目一般都不是同源的，所以肯定会存在跨域请求的问题。

​	所以我们就要处理一下，让前端能进行跨域请求。

我们要实现如下两个需求

1、开启SpringBoot的允许跨域访问

2、开启SpringSecurity的允许跨域访问

- 开启SpringBoot的允许跨域访问。在 config 目录新建 CorsConfig 类，写入如下

```java
/**
 * @Author : chinzicam
 * @create 2023/8/31 12:54
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 设置允许跨域的路径
        registry.addMapping("/**")
                // 设置允许跨域请求的域名
                .allowedOriginPatterns("*")
                // 是否允许cookie
                .allowCredentials(true)
                // 设置允许的请求方式
                .allowedMethods("GET", "POST", "DELETE", "PUT")
                // 设置允许的header属性
                .allowedHeaders("*")
                // 跨域允许时间
                .maxAge(3600);
    }
}

```

- 开启SpringSecurity的允许跨域访问。在把 SecurityConfig 添加以下代码

```java
        //允许跨域
        http.cors();
```

- 由于没有前端项目，所以我们下面会跑一个前端项目，然后测试后端的跨域功能

### 前端项目的搭建

- 下载项目源码，并运行这个vue项目，如果没有项目可以去[我的项目](https://github.com/Chinzicam/SpringSecurity_Project)里面下载

```shell
cd sg_security_demo
npm install
npm run serve
```

- 访问前端的项目

```plain
http://localhost:8080/#/login
```

很明显，出错了，出现跨域CROS错误

### 后端解决跨域的演示

- 由于这个前端项目的要求后端服务的端口是8888，记得修改一下前端项目的端口为13848

- 运行TokenApplication引导类

通过前后的对比，发现添加跨域代码后，可以成功登录。

注释掉跨域代码后，登录失败

由此可得，跨域代码成功生效~

## 授权

### 权限校验的方法

我们前面都是使用@PreAuthorize注解，然后在在其中使用的是hasAuthority方法进行校验。SpringSecurity还为我们提供了其它方法例如: hasAnyAuthority，hasRole，hasAnyRole等

{% asset_img 1689586885641-4820f97f-07ee-45af-b4a4-286ca3831125.jpg %}

@PreAuthorize注解是Spring Security提供的一种基于表达式的权限控制注解，用于在方法上进行权限校验。它可以在方法执行前对用户的权限进行校验，只有满足指定条件的用户才能执行该方法。

@PreAuthorize注解的使用方式是在方法上添加注解，并在注解中指定权限表达式。权限表达式可以使用Spring Security提供的一些预定义的方法，也可以自定义。

除了@PreAuthorize注解，Spring Security还提供了其他一些方法用于权限控制，包括：

- hasAnyAuthority：
  - 判断当前用户是否具有指定的任意权限。示例：@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")。

- hasRole：
  - 判断当前用户是否具有指定的角色。示例：@PreAuthorize("hasRole('ROLE_ADMIN')")。

- hasAnyRole：
  - 判断当前用户是否具有指定的任意角色。示例：@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")。

这些方法可以在@PreAuthorize注解中使用，用于对用户的权限进行校验。可以根据实际需求选择合适的方法进行权限控制。

需要注意的是，这些方法都是基于用户的权限信息进行校验的，用户的权限信息需要事先配置好，并且需要在Spring Security的配置中进行相应的配置，才能正确地进行权限校验。

```java
/**
 * @author czc
 */
@RestController
@RequestMapping()
public class HelloController {
    @RequestMapping("/hello")

    //hasAnyAuthority：判断当前用户是否具有指定的任意权限。示例：@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")。

    //hasRole：判断当前用户是否具有指定的角色。示例：@PreAuthorize("hasRole('ROLE_ADMIN')")。

    //hasAnyRole：判断当前用户是否具有指定的任意角色。示例：@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")。

    //@PreAuthorize("hasAuthority('system:dept:list')")
    //@PreAuthorize("hasAnyAuthority('aaa','czc','system:dept:list')")
    //@PreAuthorize("hasRole('system:dept:list')")
    //@PreAuthorize("hasAnyRole('aaa','czc','system:dept:list')")

    //自定义权限校验的方法，czcHasAuthority
    @PreAuthorize("hasAuthority('system:dept:list')")

    public String hello(){
        return "欢迎，开始你新的学习旅程吧";
    }

```

### 自定义权限校验的方法

在上面的源码中，我们知道security校验权限的PreAuthorize注解，其实就是获取用户权限，然后跟业务接口的权限进行比较，最后返回一个布尔类型。自定义一个权限校验方法的话，就需要新建一个类，在类里面定义一个方法，按照前面学习的三种方法的定义格式，然后返回值是布尔类型。如下

- 新建 expression.HuanfExpressionRoot 类，写入如下

```java
@Component()
public class czcExpressionRoot {

    //自定义权限校验的方法
    public boolean czcHasAuthority(String authority){

        //获取用户具有的权限字符串，有可能用户具有多个权限字符串，所以获取后是一个集合
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //LoginUser是我们在domain目录写好的实体类
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        List<String> permissions = loginUser.getPermissions();

        //判断用户权限集合中，是否存在跟业务接口(业务接口的权限字符串会作为authority形参传进来)一样的权限
        return permissions.contains(authority);
    }

}
```

- 刚刚在第一步自定义了huanfHasAuthority方法，用于权限校验，那么如何让 `@PreAuthorize` 注解去使用`czcHasAuthority`方法，只需要在SPEL表达式来获取容器中bean的名字。修改HelloController类为如下 

```java
/**
 * @author czc
 */
@RestController
@RequestMapping()
public class HelloController {
    @RequestMapping("/hello")

    //hasAnyAuthority：判断当前用户是否具有指定的任意权限。示例：@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")。

    //hasRole：判断当前用户是否具有指定的角色。示例：@PreAuthorize("hasRole('ROLE_ADMIN')")。

    //hasAnyRole：判断当前用户是否具有指定的任意角色。示例：@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")。

    //@PreAuthorize("hasAuthority('system:dept:list')")
    //@PreAuthorize("hasAnyAuthority('aaa','czc','system:dept:list')")
    //@PreAuthorize("hasRole('system:dept:list')")
    //@PreAuthorize("hasAnyRole('aaa','czc','system:dept:list')")

    //自定义权限校验的方法，czcHasAuthority
    @PreAuthorize("@czcExpressionRoot.czcHasAuthority('system:dept:list')")

    public String hello(){
        return "欢迎，开始你新的学习旅程吧";
    }

```

---

`本章gpt问答`

> 介绍一下@PreAuthorize注解，还有SpringSecurity的其它方法例如: hasAnyAuthority，hasRole，hasAnyRole等

@PreAuthorize 注解是 Spring Security 框架提供的一种用于方法级别的访问控制注解。通过在方法上添加 @PreAuthorize 注解，我们可以定义一个 SpEL (Spring Expression Language) 表达式来进行权限验证。只有满足 SpEL 表达式条件的用户才能够调用该方法。

以下是 @PreAuthorize 注解的使用示例：

```java
@PreAuthorize("hasRole('ROLE_ADMIN')")
public void deleteArticle(int articleId) {
    // 删除文章的业务逻辑
}
```
在上述示例中，deleteArticle() 方法被 @PreAuthorize 注解修饰，并指定了一个 SpEL 表达式 "hasRole('ROLE_ADMIN')"。这个表达式表示只有拥有 "ROLE_ADMIN" 角色的用户才能够调用该方法。

除了 @PreAuthorize 注解，Spring Security 还提供了其他常用的权限验证方法，包括：

hasAnyAuthority：检查用户是否具有给定权限中的任意一个。
```java
@PreAuthorize("hasAnyAuthority('PERM_READ', 'PERM_WRITE')")
public void performAction() {
    // 执行操作的业务逻辑
}
```
hasRole：检查用户是否具有指定角色。
```java
@PreAuthorize("hasRole('ROLE_ADMIN')")
public void deleteArticle(int articleId) {
    // 删除文章的业务逻辑
}
```
hasAnyRole：检查用户是否具有给定角色中的任意一个。
```java
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_EDITOR')")
public void createArticle(Article article) {
    // 创建文章的业务逻辑
}
```
这些方法都可以接受一个或多个参数，并支持对应角色或权限的表达式。

需要注意的是，使用这些注解进行权限控制前，请确保已经正确配置了 Spring Security，并且用户、角色、权限等相关信息已经存储在合适的地方（如数据库），并且进行了正确的认证和授权配置。

---

### 基于配置的权限控制

前面学习的权限控制是基于@PreAuthorize注解来完成的，如何使用配置的方式，也就是在配置类当中，来实现权限控制，如下

- 在HelloController类添加如下，作用是新增一个接口

```java
    /**
     * 基于配置的权限控制
     * @return
     */
    @RequestMapping("/configAuth")
    public ResponseResult configAuth(){
        return new ResponseResult(200,"访问成功");
    }
```

- 把SecurityConfig类添加以下内容，主要就是添加权限控制相关的配置

```java
.antMatchers("/configAuth").hasAuthority("system:dept:list")
```

## 防护CSRF攻击

在SecurityConfig类里面的configure方法里面，有一个配置如下，下面就来了解一下

```java
http..csrf().disable(); //关闭csrf，可防护csrf攻击。如果不关闭的话
```

CSRF是指跨站请求伪造（Cross-site request forgery），是web常见的攻击之一，如图

{% asset_img 1689586888852-2edfebdb-9d54-4bce-8501-6f698d2e29ab.jpg %}

可以参考以下文章：[CSRF攻击与防御](https://blog.csdn.net/freeking101/article/details/86537087)

防护: SpringSecurity去防止CSRF攻击的方式就是通过csrf_token。后端会生成一个csrf_token，前端发起请求的时候需要携带这个csrf_token,后端会有过滤器进行校验，如果没有携带或者是伪造的就不允许访问

我们可以发现CSRF攻击依靠的是cookie中所携带的认证信息。但是在前后端分离的项目中我们的认证信息其实是token，而token并不是存储中cookie中，并且需要前端代码去把token设置到请求头中才可以，所以CSRF攻击也就不用担心了，前后端分离的项目，在配置类关闭csrf就能防范csrf攻击

## 认证-自定义处理器

上面我们已经完整学习了认证和授权的完成流程，如果自己待的公司不是用上面学习的那一套认证和授权的流程，那么就是使用的自定义处理器，下面是认证的3个自定义处理器，学完之后就会发现自定义处理器的操作其实都是大同小异

### 自定义successHandler

successHandler表示 '登录认证成功的处理器'

实际上在UsernamePasswordAuthenticationFilter进行登录认证的时候，如果登录成功了是会调用AuthenticationSuccessHandler的方法进行认证成功后的处理的。AuthenticationSuccessHandler就是登录成功处理器。我们也可以自己去自定义成功处理器进行成功后的相应处理

{% asset_img 1689586875966-f65f8796-6a23-4978-bfe1-ee7bc9eb3f8c.jpg %}

具体操作如下

- 回到最开始的quickstart项目
- 新建 handler.MySuccessHandler 类，然后实现security官方提供的AuthenticationSuccessHandler接口

```java
/**
 * @Author : chinzicam
 * @create 2023/8/31 14:41
 */
//官方提供的AuthenticationSuccessHandler接口的实现类，用于自定义'登录成功的处理器'
public class MySuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("自定义登录认证成功");
    }
}
```

### 自定义failureHandler

在 handler 目录新建 MyFailureHandler 类，写入如下

```java
/**
 * @Author : chinzicam
 * @create 2023/8/31 14:52
 */
@Component
//官方提供的AuthenticationFailureHandler接口的实现类，用于自定义'登录失败的处理器'
public class MyFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        System.out.println("登录认证失败了*_*，请检查用户名或密码");
    }
}
```

### 自定义LogoutSuccessHandler

在 handler 目录新建 MyLogoutSuccessHandler 类，写入如下

```java
/**
 * @Author : chinzicam
 * @create 2023/8/31 14:54
 */
@Component
//官方提供的LogoutSuccessHandler接口的实现类，用于自定义'登出成功的处理器'
public class MyLogoutSuccessHandler implements LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("退出登录成功");
    }
}

```



- 把MySuccessHandler实现类,MyFailureHandler实现类,MyLogoutSuccessHandler实现类，配置给security。
  - 新建 config.SecurityConfig 类，写入如下

```java
/**
 * @Author : chinzicam
 * @create 2023/8/31 14:43
 */
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    //注入security官方提供的AuthenticationSuccessHandler接口
    private AuthenticationSuccessHandler successHandler;

    @Autowired
    //注入security官方提供的AuthenticationSuccessHandler接口
    private AuthenticationFailureHandler failureHandler;
    @Autowired
    //注入security官方提供的LogoutSuccessHandler接口
    private LogoutSuccessHandler logoutSuccessHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
//        super.configure(http);
        //把刚刚在MySuccessHandler类里面的"自定义'登录成功的处理器'"，配置给security
        http.formLogin()
                //登录认证成功的处理器
                .successHandler(successHandler)
                //登录认证失败的处理器
                .failureHandler(failureHandler);
        //登出成功的处理器的配置
        http.logout()
                //登出成功的处理器
                .logoutSuccessHandler(logoutSuccessHandler);

        //其它默认的认证接口，例如业务接口的认证限制，要配，因为你重写自定义了之后，原有的配置都被覆盖，不写的话业务接口就没有security认证拦截的功能了
        http.authorizeRequests().anyRequest().authenticated();
    }
}
```

- 运行SecurityApplication引导类，浏览器访问如下，作用是发送登录请求

```shell
http://localhost:13848/logout # 先退出登录，避免对测试造成影响
http://localhost:13848/login # 登录的用户名是security默认的user，密码在控制台
http://localhost:13848/hello # 我们就在跳之后的页面测试。
```

- 通过成功登录，登录失败，退出登录操作，关注控制台的情况
  - 自此，自定义处理器大功告成