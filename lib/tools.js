"use strict"

/**
 * 通用的纯函数全部抽到这里来 
 */

const crypto = require("crypto");

module.exports = {

    /**
     * 获取md5
     * 
     * @param {String} str
     * @param {String}
     */
    getMd5 (str) {
        if (!str) return "";
        const hash = crypto.createHash("MD5");
        hash.update(str);
        return hash.digest("hex");
    },

    /**
     * 创建指定位数随机数
     * 
     * @param {Number} num
     * @return {String}
     */
    createRandom(num = 5) {
        let str = "";
        for (let i of new Array(num)) {
            const random = Math.floor(Math.random() * 10);
            str += random;
        }
        return str;
    },

    /**
     * 获取cookie字符串中的id的值
     *
     * @param {String} cookie字符串
     * @param {String} cookie名字
     * @return {String|Boolean}
     */
    getId(cookieStr, idname) {
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
        const reg = new RegExp(`^${idname}=\.+`, "ig");
        for (let v of arr) {
            if (reg.test(v)) {
                const arr2 = v.split("=");
                return arr2[1];
            }
        }
        return false;
    },

    /**
     * 获取指定分钟后的时间戳
     * 
     * @param {Number} time 分钟
     * @return {String}
     */
    buildExpire (time) {
        const stamp = new Date().getTime();
        return String(stamp + (time * 60 * 1000));
    }

}