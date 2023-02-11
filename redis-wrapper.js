const { json } = require("express/lib/response");

const isJSON = val => {
    if (typeof val !== "string") {
        return false;
    }
    try {
        JSON.parse(val);
        return true;
    } catch (error) {
        return false;
    }
}

exports.set = (redisConnection, key, value, expire = null) => {
    if (value === null || value === undefined) value = '';
    else {
        const type = typeof value;
        if (type === 'object' || type === 'symbol' || type === 'function') {
            value = JSON.stringify(value);
        }
    }
    
    return new Promise((resolve, reject) => {
        redisConnection.set(key, value)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
}

exports.get = (redisConnection, key) => {
    // console.log(redisConnection, key);
    return new Promise((resolve, reject) => {
        redisConnection.get(key)
        .then(res => isJSON(res) ? resolve(JSON.parse(res)) : res)
        .catch(err => reject(err))
    });
}