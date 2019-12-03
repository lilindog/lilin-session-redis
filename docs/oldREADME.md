# 简单实现的session模块

*需要使用lilin-redis配合*

## 使用
```js
//必须引入lilin-redis并实例化
const Redis = require("./lilin-redis/redis");
let redis = new Redis(host, port, pass);

//引入session模块
const session = require("./lilin-session-redis/index");

//这里使用express
const express = require("express");
let app = express();

//使用session
app.use((req, res, next)=>
{
	session(req, res, redis);//这里必须要传入redis实例
	next();
});
app.get("/test", async (req, res)=>{
    await req.session.set("isLogin", true);
    res.send(await req.session.get("isLogin"));
});


```

## tips/bug
* 没有考虑对sessionid的防篡改
* 没有session过期功能
* 更多没想到。。。