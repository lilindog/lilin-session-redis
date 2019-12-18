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
 * @param {Number} expire 可选， 多少秒后过期
 */
Session.prototype.set = async function (key, value, expire) {
    let 
    id = this._id,
    res = await this._redis.hget(this._hash, id);
    if (res) {
        
        let __ = JSON.parse(res);
        if (__[key]) {
            if (__[this._buildOnceKey(key)]) delete __[this._buildOnceKey(key)];
            if (__[this._buildExpireKey(key)]) delete __[this._buildExpireKey(key)];
        }
        __[key] = value;
        expire && (__[this._buildExpireKey(key)] = this._buildExpire(expire));
        await this._redis.hset(this._hash, id, JSON.stringify(__));

    } else {

        let obj = {
            [key]: value
        }
        expire && (obj[this._buildExpireKey(key)] = this._buildExpire(expire));
        await this._redis.hset(this._hash, id, JSON.stringify(obj));

    }

}

/**
 * 设置会话中的值， 在读取后失效
 * 
 * @param {String}  key
 * @param {*} value
 */
Session.prototype.setOnce = async function (key, value) {
    let _ = await this._redis.hget(this._hash, this._id);
    if (_) {

        _ = JSON.parse(_);
        if (_[key] && _[this._buildExpireKey(key)]) delete _[key], delete _[this._buildExpireKey(key)];
        _[key] = value;
        _[this._buildOnceKey(key)] = true;
        await this._redis.hset(this._hash, this._id, JSON.stringify(_));

    } else {

        _ = {
            [key]: value,
            [this._buildOnceKey(key)]: true
        };
        await this._redis.hset(this._hash, this._id, JSON.stringify(_));

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
            const 
            expire = __[this._buildExpireKey(key)],
            once = __[this._buildOnceKey(key)];
            //过期
            if (expire) {
                if (Number(expire) < new Date().getTime()) {
                    await this.del(key);
                    return null;
                }
            }
            //一次性
            if (once) {
                await this.del(key);
            }
            return __[key];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

/**
 * 删除会话key， 包含其expire key 和 once key; 如果有。
 * 
 * @param {String} key
 */
Session.prototype.del = async function (key) {
    let _ = await this._redis.hget(this._hash, this._id);
    _ = JSON.parse(_);
    if (_[key]) delete _[key];
    if (_[this._buildExpireKey(key)]) delete _[this._buildExpireKey(key)];
    if (_[this._buildOnceKey(key)]) delete _[this._buildOnceKey(key)];
    await this._redis.hset(this._hash, this._id, JSON.stringify(_));
}

/**
 * 构建expire的key, 方便统一管理key命名
 * 
 * @param {String} key 
 * @return {String}
 */
Session.prototype._buildExpireKey = function (key) {
    return `${key}-expire`;
}

/**
 * 构建once的key
 * 
 * @param {String}  key
 * @return {String}
 */
Session.prototype._buildOnceKey = function (key) {
    return `${key}-once`;
}

/**
 * 获取指定秒数后的时间戳
 * 
 * @param {Number} s
 * @return {Number}
 */
Session.prototype._buildExpire = function (s) {
    return new Date().getTime() + (s * 1000);
}