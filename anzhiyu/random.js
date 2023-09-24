var posts=["2023/08/19/Docker/","2022/09/11/Git/","2023/08/13/Hexo加装Algolia/","2023/09/02/ElasticSearch/","2023/05/29/Linux_Remote_development/","2022/10/06/Markdown-TyporaVSCode教程/","2022/10/31/Mount&BladeConsole/","2023/05/21/MyBatis-Plus公共字段自动填充/","2023/05/15/Mybatis-Plus常用的查询方法/","2023/05/07/MybatisPlus快速上手/","2023/08/22/RabbitMQ/","2023/07/26/RedisCache/","2023/07/18/Redis入门/","2023/08/20/Ubuntu无法访问nginx/","2023/08/15/SpringCloud/","2022/09/10/hexo/","2023/08/28/SpringSecurity/","2022/09/27/oracle初体验/","2023/09/10/job-interviews/","2023/04/13/springboot&mybatis/"];function toRandomPost(){pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);};var friend_link_list=[{"name":"Hexo","hundredSuffix":"","link":"https://hexo.io/zh-tw/","avatar":"https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg","descr":"快速、简单且强大的网站框架"},{"name":"anzhiyu主题","link":"https://blog.anheyu.com/","avatar":"https://img02.anheyu.com/adminuploads/1/2022/09/15/63232b7d91d22.jpg","descr":"生活明朗，万物可爱","siteshot":"https://npm.elemecdn.com/anzhiyu-blog@1.1.6/img/post/common/anzhiy.cn.jpg"},{"name":"SQL之父","hundredSuffix":"","link":"http://sqlfather.yupi.icu/","avatar":"data:image/png;base64,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","descr":"快速生成 SQL 和模拟数据，大幅提高开发测试效率！","siteshot":"https://pic.imgdb.cn/item/64db337c1ddac507cc5b6215.jpg"},{"name":"nonebot","hundredSuffix":"","link":"https://nonebot.dev/store","avatar":"https://nonebot.dev/logo.png","descr":"一个好用的QQ机器人框架","siteshot":"https://pic.imgdb.cn/item/64db355c1ddac507cc60067f.jpg"},{"name":"异常教程","hundredSuffix":"","link":"https://www.exception.site/","descr":"一个包括各种破解教程的网站","siteshot":"https://pic.imgdb.cn/item/64db37731ddac507cc6539df.jpg"},{"name":"聚合图床","hundredSuffix":"","link":"https://www.superbed.cn/","avatar":"https://www.superbed.cn/favicon.ico","descr":"我最近在用的一个图床","siteshot":"https://pic.imgdb.cn/item/64db33091ddac507cc5a4706.jpg"},{"name":"熊猫图片压缩","hundredSuffix":"","link":"https://tinypng.com/","avatar":"https://p.zhheo.com/1e6a15e791e40bb7808be13232144ee2fb1e1349.png!cover_mini","descr":"热门的图片压缩工具","siteshot":"https://pic.imgdb.cn/item/64e04262661c6c8e5437af90.png"},{"name":"菜鸟教程","hundredSuffix":"","link":"https://www.runoob.com/","avatar":"https://www.runoob.com/favicon.ico","descr":"非常实用的教程","siteshot":"https://pic.imgdb.cn/item/64e1e8fc661c6c8e542ae3ec.jpg"},{"name":"HelloGitHub","hundredSuffix":"","link":"https://hellogithub.com/","avatar":"https://hellogithub.com/favicon.ico","descr":"一个发现和分享有趣、入门级开源项目的平台","siteshot":"https://pic.imgdb.cn/item/64ec2573661c6c8e54c08c5e.jpg"},{"name":"奶牛快传","hundredSuffix":"","link":"https://cowtransfer.com/","avatar":"https://cowtransfer.com/favicon.ico","descr":"实用文件上传与下载","siteshot":"https://pic.imgdb.cn/item/64e5f662661c6c8e542aeb1e.jpg"},{"name":"安知鱼","hundredSuffix":"","link":"https://blog.anheyu.com","avatar":"https://img02.anheyu.com/adminuploads/1/2022/09/15/63232b7d91d22.jpg","descr":"生活明朗，万物可爱"},{"name":"Moeyy","hundredSuffix":"","link":"https://moeyy.cn/","avatar":"https://moeyy.cn/favicon.ico","descr":"一条有远大理想的咸鱼"},{"name":"张洪heo","hundredSuffix":"","link":"https://blog.zhheo.com/","avatar":"https://zhheo.com/img/icon.webp","descr":"分享设计与科技生活"},{"name":"Kyle","hundredSuffix":"","link":"https://cyborg2077.github.io/","avatar":"https://cyborg2077.github.io/favicon.ico","descr":"实习中，可能要停更很久了"}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      const randomIndex = Math.floor(Math.random() * friend_link_list.length);
      const { name, link } = friend_link_list.splice(randomIndex, 1)[0];
      Snackbar.show({
        text:
          "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
        duration: 8000,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (element) {
          element.style.opacity = 0;
          window.open(link, "_blank");
        },
      });
    }
    function addFriendLinksInFooter() {
      var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
      if(!footerRandomFriendsBtn) return;
      footerRandomFriendsBtn.style.opacity = "0.2";
      footerRandomFriendsBtn.style.transitionDuration = "0.3s";
      footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
      const finalLinkList = [];
  
      let count = 0;

      while (friend_link_list.length && count < 3) {
        const randomIndex = Math.floor(Math.random() * friend_link_list.length);
        const { name, link, avatar } = friend_link_list.splice(randomIndex, 1)[0];
  
        finalLinkList.push({
          name,
          link,
          avatar,
        });
        count++;
      }
  
      let html = finalLinkList
        .map(({ name, link }) => {
          const returnInfo = "<a class='footer-item' href='" + link + "' target='_blank' rel='noopener nofollow'>" + name + "</a>"
          return returnInfo;
        })
        .join("");
  
      html += "<a class='footer-item' href='/link/'>更多</a>";

      document.getElementById("friend-links-in-footer").innerHTML = html;

      setTimeout(()=>{
        footerRandomFriendsBtn.style.opacity = "1";
      }, 300)
    };