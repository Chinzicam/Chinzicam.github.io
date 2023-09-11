---
title: RabbitMQ
date: 2023-08-22 19:44:08
author: 橙子草
tags:
- RabbitMQ
- 微服务
- MessageQueue
category:
- 后端
top_img: https://pic.imgdb.cn/item/64e49ff9661c6c8e54c9c55c.jpg
cover: https://pic.imgdb.cn/item/64e49ff9661c6c8e54c9c55c.jpg
---

> 本文档需对应此课程-[黑马程序员](https://www.bilibili.com/video/BV1LQ4y127n4)食用~

> 本文对应的我的[GitHub仓库地址](https://github.com/Chinzicam/RabbitMQ_Project)

{% btns rounded grid5 %}
{% cell GitHub仓库, https://github.com/Chinzicam/RabbitMQ_Project, anzhiyufont anzhiyu-icon-book %}
{% endbtns %}

# 初识MQ

## 同步和异步通讯

- 微服务间通讯有同步和异步两种方式
  - 同步通讯：就像打电话，需要实时响应，而且通话期间，不能响应其他的电话，当有其他妹子给你打电话的时候，就容易错失`良机`。时效性强
  - 异步通讯：就像发邮件，QQ/微信聊天，不需要马上回复。可以同时给多个妹子发消息，支持多线操作，`时间`管理大师的必备技能。时效性弱
- 两种方式各有优劣，打电话可以立即得到响应，但是却不能与多个人同时通话，发送邮件可以同时与多个人收发邮件，但是往往响应会有延迟

### 同步通讯

- 之前学习的Feign调用就属于同步方式，虽然调用可以实时得到结果，但是存在一些问题。订单服务，仓储服务，短信服务是和我们的支付服务耦合在一起的。

  ```JAVA
  public void PaymentService() {
      orderService.doSth();
      storageService.doSth();
      messageService.doSth();
      ...
  }
  ```
  
- 例如产品经理一拍脑门，让加一个业务，然后你就需要去支付服务中改动代码，让你删除某个服务，也需要去支付服务中改动代码，耦合度太高了

- 同时，性能也是一个问题，例如支付服务需要50ms，另外三个服务各需要150ms，那么一个完整的支付服务就需要恐怖的0.5s，也就是一秒只能完成两个请求，这么低的并发，还玩个锤子。

- 支付服务在等待订单服务完成的时候，也在占用着CPU和内存，却啥也不干，浪费系统资源。

- 假如这时仓储服务还挂掉了，那么请求就会卡在这里，如果积压了很多的请求，支付服务就会将系统资源耗尽，从而整个支付服务都挂掉了

- 综上所述，同步调用存在以下问题

  1. 耦合度高：每次加入新的请求，都需要修改原来的代码
  2. 性能下降：调用者需要等待服务提供者响应，如果调用链过长，则响应时间等于每次调用服务的时间之和
  3. 资源浪费：调用链中的每个服务在等待响应过程中，不能释放请求占用资源，高并发场景下会极度浪费系统资源
  4. 级联失败：如果服务提供者出现问题，那么调用方都会跟着出现问题，就像多米诺骨牌一样，迅速导致整个微服务故障

### 异步通讯

- 异步调用可以避免上述问题
  - 我们以购买商品为例，用户支付后需要调用订单服务完成订单状态修改，调用物流服务，从仓库分配响应的库存并准备发货
  - 在事件模式中，支付服务是事件发布者(publisher)，在支付完成后只需要发布一个支付成功的事件(event)，事件中带上订单id，
  - 订单服务和物流服务是事件订阅者(Consumer)，订阅支付成功的事件，监听到事件后完成自己的业务即可
- 为了解除事件发布者与订阅者之间的耦合，两者并不是直接通信，而是由一个中间人(Broker)来代理。发布者发布事件到Broker，不关心谁来订阅的事件。而订阅者从Broker订阅事件，不关心是谁发布的事件
- 那么此时产品经理让你添加一个新服务时，你只需要让新服务来订阅事件就好了，而取消一个服务，也只需要让其取消订阅事件，并不需要修改订单服务，这样就解除了服务之间的耦合
- 同时也能带来性能上的提升，之前我们完成一个支付服务，需要耗时500ms，而现在支付服务只需要向Broker发布一个支付成功的事件，剩下的就不用它管了，这样只需要60ms就能完成支付服务
- 服务没有强依赖，不用担心级联失败问题。在之前，如果仓储服务挂掉了，那么支付服务无法完成，占用资源。此时更多的请求过来，支付服务就会耗尽系统资源，从而整个支付服务都瘫痪了。但是现在，仓储服务就算挂掉了，也丝毫不会影响到我们的支付服务，同时支付服务也不需要等待存储服务完成，期间也不会占用无意义的系统资源。
- 流量削峰：不管发布事件的流量波动多大，都由Broker接收，订阅者可以按照自己的速度去处理事件。
- 我们发现整个异步通讯过程中，所有东西都是依赖于Broker来实现的，那么如果Broker挂了，整个微服务也完蛋了。
- 异步通讯的优点
  - 耦合度低
  - 吞吐量提升
  - 故障隔离
  - 流量削峰
- 异步通讯的缺点
  - 依赖于Broker的可靠性、安全性、吞吐能力
  - 架构复杂时，业务没有明确的流程线，不好追踪管理（出了bug都不好找）
- 好在现在开源平台上的 Broker 的软件是非常成熟的，比较常见的一种就是我们这里要学习的MQ技术。

## 技术对比

- MQ(MessageQueue)中文是消息队列，字面意思就是存放消息的队列，也就是事件驱动中的Broker
- 比较常见的MQ实现
  - ActiveMQ
  - RabbitMQ
  - RockerMQ
  - Kafka
- 几种常见的MQ对比

|            |      **RabbitMQ**       |          **ActiveMQ**          | **RocketMQ** | **Kafka**  |
| :--------: | :---------------------: | :----------------------------: | :----------: | :--------: |
| 公司/社区  |         Rabbit          |             Apache             |     阿里     |   Apache   |
|  开发语言  |         Erlang          |              Java              |     Java     | Scala&Java |
|  协议支持  | AMQP，XMPP，SMTP，STOMP | OpenWire,STOMP，REST,XMPP,AMQP |  自定义协议  | 自定义协议 |
|   可用性   |           高            |              一般              |      高      |     高     |
| 单机吞吐量 |          一般           |               差               |      高      |   非常高   |
|  消息延迟  |         微秒级          |             毫秒级             |    毫秒级    |  毫秒以内  |
| 消息可靠性 |           高            |              一般              |      高      |    一般    |

- 追求可用性：Kafka、RockerMQ、RabbitMQ
- 追求可靠性：RabbitMQ、RocketMQ
- 追求吞吐能力：RocketMQ、Kafka
- 追求消息低延迟：RabbitMQ、Kafka

# 快速入门

## 安装RabbitMQ

- 这里是在CentOS 7虚拟机中使用Docker安装的

- 拉取镜像

  ```BASH
  docker pull rabbitmq:3-management
  ```

- 使用docker images查看是否已经成功拉取，之后启动一个RabbitMQ容器

  ```BASH
  docker run \
    -e RABBITMQ_DEFAULT_USER=root \
    -e RABBITMQ_DEFAULT_PASS=root \
    --net=host
    --name mq \
    --hostname mq1 \
    -p 15672:15672 \
    -p 5672:5672 \
    -d \
    rabbitmq:3-management
  ```

- 其中：两个环境变量分别配置登录用户和密码，15672是rabbitMQ的管理平台的端口，5672是将来做消息通信的端口

- 容器启动成功之后，我们输入`虚拟机ip:15672`访问RabbitMQ的管理平台
  {% asset_img image.png%}

- RabbitMQ中的一些角色：
  - publisher：生产者
  - consumer：消费者
  - exchange：交换机，负责消息路由
  - queue：队列，存储消息
  - virtualHost：虚拟主机，隔离不同租户的exchange、queue、消息的隔离

![](https://s1.ax1x.com/2022/12/22/zXht8U.png)

## RabbitMQ消息类型

- RabbitMQ官方提供了5个不同的Demo实例，对应了不同的消息模型

  1. 基本消息类型(BasicQueue)
  2. 工作消息队列(WorkQueue)

  - 其中发布订阅(Publish、Subscribe)，又根据交换机类型不同，分为三种
    1. 广播(Fanout Exchange)
    2. 路由(Direct Exchange)
    3. 主题(Topic Exchange)

## 导入Demo工程

- 包括三部分：
  - mq-demo：父工程，管理项目依赖
  - publisher：消息的发送者
  - consumer：消息的消费者

## 入门案例



![](https://rabbitmq.com/favicon.ico) [RabbitMQ官网入门案例](https://rabbitmq.com/tutorials/tutorial-one-java.html)


> RabbitMQ 是一个消息代理：它接受和转发消息。您可以把它想象成一个邮局：当您将要投寄的邮件放入邮箱时，您可以确定邮递员最终会将邮件投递给您的收件人。在这个类比中，RabbitMQ 是一个邮箱、一个邮局和一个邮递员。
> RabbitMQ 和邮局之间的主要区别在于它不处理纸张，而是接受、存储和转发`二进制`数据块——消息。

- 官方的HelloWorld是基于最基础的消息队列模型来实现的，只包括三个角色：
  - publisher：消息发布者，将消息发送到队列queue
  - queue：消息队列，负责接受并缓存消息
  - consumer：订阅队列，处理队列中的消息

![](https://s1.ax1x.com/2022/12/22/zX4kM4.md.png)

### publisher实现

1. 建立连接
2. 创建Channel
3. 声明队列
4. 发送消息
5. 关闭连接和Channel

```JAVA
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.junit.Test;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class PublisherTest {
    @Test
    public void testSendMessage() throws IOException, TimeoutException {
        // 1.建立连接
        ConnectionFactory factory = new ConnectionFactory();
        // 1.1.设置连接参数，分别是：主机名、端口号、vhost、用户名、密码
        factory.setHost("192.168.244.129");
        factory.setPort(5672);
        factory.setVirtualHost("/");
        factory.setUsername("root");
        factory.setPassword("root");
        // 1.2.建立连接
        Connection connection = factory.newConnection();

        // 2.创建通道Channel
        Channel channel = connection.createChannel();

        // 3.声明队列
        String queueName = "simple.queue";
        channel.queueDeclare(queueName, false, false, false, null);

        // 4.发送消息
        String message = "hello, rabbitmq!";
        channel.basicPublish("", queueName, null, message.getBytes());
        System.out.println("发送消息成功：【" + message + "】");

        // 5.关闭通道和连接
        channel.close();
        connection.close();

    }
}
```

### consumer实现

1. 建立连接
2. 创建Channel
3. 声明队列
4. 订阅消息

```JAVA
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class ConsumerTest {

    public static void main(String[] args) throws IOException, TimeoutException {
        // 1.建立连接
        ConnectionFactory factory = new ConnectionFactory();
        // 1.1.设置连接参数，分别是：主机名、端口号、vhost、用户名、密码
        factory.setHost("192.168.244.129");
        factory.setPort(5672);
        factory.setVirtualHost("/");
        factory.setUsername("root");
        factory.setPassword("root");
        //factory.setHandshakeTimeout(300000000);//如果连接超时的话，需要设置握手超时时间
        // 1.2.建立连接
        Connection connection = factory.newConnection();

        // 2.创建通道Channel
        Channel channel = connection.createChannel();

        // 3.声明队列，声明一个队列是幂等的——只有当它不存在时才会被创建，我们在这里再次声明队列可以防止队列为null
        String queueName = "simple.queue";
        channel.queueDeclare(queueName, false, false, false, null);

        // 4.订阅消息
        channel.basicConsume(queueName, true, new DefaultConsumer(channel){
            @Override
            public void handleDelivery(String consumerTag, Envelope envelope,
                                       AMQP.BasicProperties properties, byte[] body) throws IOException {
                // 5.处理消息
                String message = new String(body);
                System.out.println("接收到消息：【" + message + "】");
            }
        });
        System.out.println("等待接收消息。。。。");
    }
}
```

- 但是这种写法，看着就很麻烦，其中设置连接参数时，和我们之前学JDBC一样，手动在代码中设置连接四要素，但是后来我们数据库的连接参数都是写在yml文件中来简化代码的，这里同理，所以我们继续往下学SpringAMQP

## 总结

- 基本消息队列的消息发送流程
  1. 建立connection
  2. 创建channel
  3. 使用channel声明队列
  4. 使用channel向队列发送消息
- 基本消息队列的消息接收流程
  1. 建立connection
  2. 创建channel
  3. 使用channel声明队列
  4. 定义consumer的消费行为handleDelivery()，也就是接收到消息后要执行的业务逻辑
  5. 利用channel将消费者与队列绑定


  ## 未完待续