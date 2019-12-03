"use strict"

module.exports = Session;

/**
 * 暴露给开发者的session操作类
 *  
 * @param {Object} redis redis实例
 * @param {String} hash session存储于redis的 hash表的 key
 * @param {String} id 用户的sessionid， 用于在redis hash表中存储会话信息
 */
function Session (redis, hash, id) {
    this._redis = redis;
    this._hash = hash;
    this._id = id;
}

/**
 * 设置会话中的值
 * 
 * @param {String}  key
 * @param {*} value
 */
Session.prototype.set = async function (key, value) {
    let 
    id = this._id,
    res = await this._redis.hget(this._hash, id);
    if (res) {
        
        let __ = JSON.parse(res);
        __[key] = value;
        await this._redis.hset(this._hash, id, JSON.stringify(__));

    } else {

        let obj = {
            [key]: value
        }
        await this._redis.hset(this._hash, id, JSON.stringify(obj));

    }

}

/**
 * 获取会话中的值
 * 
 * @param {String} key
 * @return {*}
 */
Session.prototype.get = async function (key) {   
    let 
    id = this._id,
    _ = await this._redis.hget(this._hash, id);
    if (_) {
        let __ = JSON.parse(_);
        if (__[key]) {
            return __[key];
        } else {
            return null;
        }
    } else {
        return null;
    }
}