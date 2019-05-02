"use strict"

module.exports = Session;

function Session(redis, hash)
{
    this._redis = redis;
    this._hash = hash;
}
/*
* 向redis设置指定id用户数据
* @param id <String> 用户session id
* @param key <String> 存储的key
* @param value <Object|string> 数据
* 
*/
Session.prototype.set = async function(key, value){
    let id = this.id;
    let res = await this._redis.hget(this._hash, id);
    if(res)
    {
        let __ = JSON.parse(res);
        __[key] = value;
        await this._redis.hset(this._hash, id, JSON.stringify(__));
    }
    else
    {
        let obj = {
            [key]: value
        }
        await this._redis.hset(this._hash, id, JSON.stringify(obj));
    }

}
/*
* 获取指定id用户的key及其数据
* @param id <String> 用户的session id
* @param key <String> 需要删除的key
*/
Session.prototype.get = async function(key)
{   
    let id = this.id;
    let _ = await this._redis.hget(this._hash, id);
    if(_)
    {
        let __ = JSON.parse(_);
        if(__[key])
        {
            return __[key];
        }
        else
        {
            return null;
        }
    }
    else
    {
        return null;
    }
}