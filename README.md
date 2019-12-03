## 简单实现的session模块

*需要使用lilin-redis配合*</br>
*[旧版本版本文档](./docs/oldREADME.md)*

#### 使用示例
```js
//redis实例（用于存储session）
const Redis = require("./lilin-redis/redis");
let redis = new Redis(host, port, pass);

//引入session模块
const session = require("./lilin-session-redis/index");

//这里使用express
const express = require("express");
let app = express();

//使用session
app.use(async (req, res, next)=>
{   
    //这里必须使用await异步写法
	await session({
        
        //以下这些配置选项中。除了store是必选项以外，其余全是可选。

        //redis实例（兼容npm上的 redis 和 lilin-redis）
        store: null,
        //session信息保存在redis中所使用的key名
        storeKey: "lilin-redis-session",
        //session在cookie中的key名
        idname: "sessionid",
        //session过期时间(单位为分钟)
        expire: 15,
        //校验签名，用于防止伪造sessionid
        sign: "$%%##*^^)_+(*&<>,.?",

    })(req, res);

	next();
});

//测试写入、读取session
app.get("/test", async (req, res)=>{
    await req.session.set("isLogin", true);
    res.send(await req.session.get("isLogin"));
});

app.listen(80);


```

#### 待实现

为session.set()方法提供生存时间参数，让设置的session字段有过期功能

