---
title:  oracle建表和基本操作
author: 橙子草草
date: 2022-09-27 13:20:40
tags:
- Oracle
- sql
categories: 
- 学习笔记
sidebar: [blogger, category, toc] # 放置任何你想要显示的侧边栏部件
---

### 数据库基本操作
#### 1. Oracle基本命令

以管理员身份登录sql

```sql
sqlpuls /nolog
```

连接数据库

```sql
conn / as sysdba
```

创建用户user6374 ，密码user6374   
```sql
create user  user6374 identified by user6374 
```

查询数据字典
```sql
select user_name from dba_tables
desc dba_users
```

查询user6374 
```sql
select username  from dba_users
```
给user0923授权,赋予connect,resource 两个角色
```sql
grant connect,resource to user6374 
```
以user6374帐号登陆
```sql
conn user6374/user6374   
```
展示用户
```sql
show user
```
建表
```sql
 create table tbl_student(
 	 stu_id int primary key,
	 stu_name varchar2(30) not null,
	 stu_sex char(1) default 'm',
	 stu_birth date not null
 )
```
查看表结构
```sql
desc tbl_student
```
查看用户创建的表的信息的数据字典
```sql
desc user_tables
```
查看user_tables 确认表的存在
```sql
select table_name from user_tables
select count(*) from user_tables
```

查看user_constraints确认约束的存在

```sql
desc user_constraints //约束表
select owner table_name,constraint_name.constraint_type from user_constraints//查询本表约束
select count(*) from user_constraints//查询约束条数
```

---

- 增删改查实践

创建一个序列

```sql
create sequence seq_stu_id
```

 显示用户序列表

```sql
desc user_sequences
```
显示序列
 ```sql
 select sequence_name,min_value,max_value from user_sequences
 ```

插入一条数据

```aql
insert into tbl_student values(seq_stu_id.nextval,'mary',default,sysdate)//id为2，姓名marry，生日为系统时间
insert into tbl_student values(seq_stu_id.nextval,'mike','m',to_date('2002-10-29'),'yyyy-mm-dd')
```

查询表

```sql
select * from tbl_student
select stu_id,stu_name from tbl_student
```

修改表

```sql
update tbl_student set stu_name='tom' where stu_id=2 //修改marry的名字为tom
update tbl_student set stu_name='john',stu_sex='f' where stu_id='3'//修改id为3的人姓名性别
```

删除记录

```sql
delete from tbl_student where stu_id=2 //删除id为2的数据
delete from tbl_student //全删除
drop table tbl_student//删除表
```

退出系统，删除用户

```sql
exit //退出
conn / as sysdba //以管理员身登录
drop user user6374 cascade //删除用户及所有内容
```
#### 2. Sqlplus

建用户名和密码oracle ,oracle 

```sql
create user username identified by password
```
授权 grant connect,resource,dba,sysdba to username; 
```sql
grant connect,resource,dba to username
```
进入
```sql
connect username/password
```
输出语句
```sql
dbms_output_putline('输出的内容')
```
显示PLsql输出结果
```sql
set serveroutput on
```




