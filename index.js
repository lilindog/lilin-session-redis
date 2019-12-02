/**
 * 默认配置文件
 * 这里边的值均为缺省默认值 
 */
const defaultOptions = {
    //redis实例（兼容npm上的 redis 和 lilin-redis）
    store: null,
    //session在cookei中的key名
    idname: "sessionid",
    //session过期时间(单位为分钟)
    expires: 15,
    //session信息保存在redis中所使用的key名
    storeKey: "lilin-redis-session"
}

module.exports = function createSession (options) {
    checkOptions(options);
    Object.assign(defaultOptions, options);
    return function (req, res) {
        if (!req || !res) throw new Error("req, res 都不能缺失！");
        
    }
}

/**
 * 检查必要参数
 * 不合规会抛错
 * 
 * @param {Object} options
 */
function checkOptions (options) {
    if (!options.store || !options.__proto__.set || options.__proto__.get) throw new Error("传递的options中没有redis实例！");
    if (options.idname && typeof options.idname !== "string") throw new Error("传递的options中idname必须为string！");
    if (options.expires && typeof options.expires !== "number") throw new Error("传递的options中expires必须为number！");
    if (options.storeKey && typeof options.storeKey !== "string") throw new Error("传递的options中estoreKey必须为string！");
}