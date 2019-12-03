"use strict"

const {
    getId,
    getMd5,
    createRandom,
    buildExpire
} = require("./tools");
const Session = require("./session.class");

let options = {};

module.exports = function (config) {
    options = config;
    return hander;
}

/**
 * 处理session
 * 
 * @param {Object} req
 * @param {Object} res
 */
async function hander (req, res) {   
    const session = checkSession(req.headers.cookie);
    if (session) {
        const expire = await options.store.hget(options.storeKey, buildExpireKey(session));
        options.DEBUG && console.log("1");
        if (expire) {
            const leftTime = expire - new Date().getTime();
            if (leftTime <= 0) {
                options.DEBUG && console.log("2");
                await options.store.hdel(options.storeKey, buildExpireKey(session));
                await options.store.hdel(options.storeKey, session);
                await mountSession(req, res);
            } else {
                options.DEBUG && console.log("3");
                //更新过期时间
                await options.store.hset(options.storeKey, buildExpireKey(session), buildExpire(options.expire));
                req.session = new Session(options.store, options.storeKey, session);
            }
        } else {
            options.DEBUG && console.log("4");
            //删除旧的session，然后新建session
            await options.store.hdel(options.storeKey, session);
            await mountSession(req, res);
        }
    }  else {
        console.log("5");
        //创建新的session
        await mountSession(req, res);
    }
}

/**
 * 创建新的session并挂载
 * 
 * @param {Object} req
 * @param {Object} res
 */
async function mountSession (req, res) {
    const session = buildSession();
    await options.store.hset(options.storeKey, buildExpireKey(session.split("_")[0]), buildExpire(options.expire));
    res.setHeader("Set-Cookie", `${options.idname}=${session}; path=/; HTTPOnly`);
    req.session = new Session(options.store, options.storeKey, session.split("_")[0]);
}

/**
 * 生成记录session过期时间的key
 * 为了key名字的统一和好维护，这里专门定义了此函数
 * 
 * @return {String} 
 */
function buildExpireKey (session) {
    return session + "-expire";
}

/**
 * 生成session字符串 
 * 
 * @return {String}
 */
function buildSession () {
    let 
    str = `session-${new Date().getTime()}-${createRandom(10)}`,
    mask = options.sign ? getMd5(str) : '';
    if (mask) {
        str += `_${mask}`;
    }
    return str;
}

/**
 * 解析并校验session 
 * 
 * @param {String} cookie
 * @param {String} 校验或解析失败返回空字符
 */
function checkSession (cookie) {
    if (!cookie) return "";
    const session = getId(cookie, options.idname);
    if (!session) return "";
    if (options.sign) {
        if (!~session.indexOf("_")) return "";
        const 
        str = session.split("_")[0],
        mask = session.split("_")[1],
        buildMask = getMd5(str);
        if (mask !== buildMask) return "";
        return str;
    } else {
        return session;
    }
}