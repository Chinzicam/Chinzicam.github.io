---
title: Mybatis-Plus常用的查询方法
date: 2023-05-15 21:12:03
author: 橙子草草
tags:
- MybatisPlus
category:
- 笔记

top_img: https://pic.imgdb.cn/item/64d892d01ddac507ccbe8d48.webp
cover: https://pic.imgdb.cn/item/64d892d01ddac507ccbe8d48.webp

---

### Mybatis-Plus常用的查询方法

Mybatis-Plus作为Mybatis的增强，自己封装了很多简单还用的方法，来解脱自己写sql！

#### 根据主键id去查询单个结果 selectById

	/**
	 * 方法一： 根据主键id去查询单个结果
	 * T selectById(Serializable id); ---参数为主键类型
	 */
	 
	User user1 = userMapper.selectById(1);
	
	返回值结果
	{"id": 1,"name": "czc","age": 222}


#### 查询多条数据库中的记录 selectList

	/**
	* 方法二：  查询多条数据库中的记录
	* List<T> selectList(@Param("ew") Wrapper<T> queryWrapper);  
	* ---参数为Wrapper可以为空说明没有条件的查询
	*/
	
	List<User> users1 = userMapper.selectList(null);
	
	运行结果集
	{"id": 1,"name": "df","age": 222},{"id": 2,"name": "wang","age": 22}]

#### 查询多条数据库中的记录—条件查询 selectList(wrapper)

	/**
	 * 方法三：查询多条数据库中的记录---条件查询
	 * List<T> selectList(@Param("ew") Wrapper<T> queryWrapper);
	 */
	 
	//首先构造QueryWrapper来进行条件的添加
	QueryWrapper wrapper = new QueryWrapper();
	wrapper.eq("id",1);//相当于where id=1
	
	List<User> list = userMapper.selectList(wrapper);


​	
	返回值结果
	{"id": 1,"name": "df","age": 222}


#### 条件构造器QueryWrapper常用方法

	/**
	  *附加条件构造器QueryWrapper常用方法 ---这几个肯定够用了
	  */
	  
	 wrapper.eq("数据库字段名", "条件值"); //相当于where条件
	 wrapper.between("数据库字段名", "区间一", "区间二");//相当于范围内使用的between
	 wrapper.like("数据库字段名", "模糊查询的字符"); //模糊查询like
	 wrapper.groupBy("数据库字段名");  //相当于group by分组
	 wrapper.in("数据库字段名", "包括的值,分割"); //相当于in
	 wrapper.orderByAsc("数据库字段名"); //升序
	 wrapper.orderByDesc("数据库字段名");//降序
	 wrapper.ge("数据库字段名", "要比较的值"); //大于等于
	 wrapper.le("数据库字段名", "要比较的值"); //小于等于

#### 根据主键的id集合进行多条数据的查询 selectBatchIds

	/**
	 * 方法四：  根据主键的id集合进行多条数据的查询
	 * List<T> selectBatchIds(@Param("coll") Collection<? extends Serializable> idList);   
	 * --条件为集合
	 */
	 
	List list1 = Arrays.asList(1,2);
	List<User> list2 = userMapper.selectBatchIds(list1);
	
	运行结果集
	[{"id": 1,"name": "df","age": 222},{"id": 2,"name": "wang","age": 22}]


#### 分页查询 selectPage

	/**
	 * 方法五：  分页查询
	 * IPage<T> selectPage(IPage<T> page, @Param("ew") Wrapper<T> queryWrapper);  
	 * ---参数为分页的数据+条件构造器
	 */
	 
	IPage<User> page = new Page<>(1,2);//参数一：当前页，参数二：每页记录数
	//这里想加分页条件的可以如方法三自己构造条件构造器
	IPage<User> userIPage = userMapper.selectPage(page, null);


​	
	运行结果集
	{"records":[{"id": 1,"name": "df","age": 222},{"id": 2,"name": "wang","age": 22}],
	"total": 0,"size": 2,"current": 1,"searchCount": true,"pages": 0 }
