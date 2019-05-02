/*
*
* lilin-session-redis
* @param req <Object> request对象
*/

//引入redis模块
const Session = require("./session.class");
const handler = require("./handler");
const hash = "lilin-session";

module.exports = async function(req, res, store)
{   
    if(!req && !res && !store)
    {
        throw "[lilin-session] 初始化参数传入错误";
    }
    req.session = new Session(store, hash);
    req.session.id = handler(req, res);
}