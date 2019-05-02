"use strict"

/*
* 生成session然后写入到返回头
*/

module.exports = function(req, res)
{   
    let str = getId(req.headers.cookie) || `session-${new Date().getTime()}-${createRandom(10)}`;
    !getId(req.headers.cookie) && res.setHeader("Set-Cookie", `sessionid=${str};path=/`);//这里就简单的生成了sessionid， 没有经过md5等计算签名
    return str;
}

/*
* 指定位数随机数
*/
function createRandom(num = 5)
{
    let str = "";
    for (let i of new Array(num)) {
        const random = Math.floor(Math.random() * 10);
        str += random;
    }
    return str;
}
/*
* 获取cookie字符串中的id的值
*/
function getId(cookieStr)
{
    let arr = [];
    if (!cookieStr) {
        return false;
    }
    if (cookieStr.indexOf("; ") > -1) {
        arr = cookieStr.split("; ");
    }
    else {
        arr = [cookieStr];
    }
    const reg = new RegExp(`^sessionid=\.+`, "ig");
    for (let v of arr) {
        if (reg.test(v)) {
            const arr2 = v.split("=");
            return arr2[1];
        }
    }
    return false;
}