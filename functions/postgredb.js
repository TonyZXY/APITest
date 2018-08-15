const {Pool} = require('pg');
const config = require('../config');
const postgre = config.postgre;

const pool = new Pool(postgre);

module.exports = {
    getIOSDevicesForCompare: (callback) => {
        let params = [];
        let text = 'select distinct users.user_id,coins."from",coins."to",interests.price as inPrice,coins.price as coPrice,\n' +
            '  interests.isgreater,coins.market,interests.status, iosdevices.device_token,iosdevices.number,interests.interest_id, interests.frequence, coins.coin_id as coinid\n' +
            'from (((interests join coins on interests.interest_coin_id = coins.coin_id)\n' +
            'join users on interests.interest_user_id = users.user_id)\n' +
            'join iosdevices on users.user_id = iosdevices.device_user_id)\n' +
            ' where status = true and users.interest=true;';
        return pool.query(text, params, callback)
    },


    getUser: (email, callback) => {
        let param = [email];
        let text = 'select user_id as _id,password,salt,email,verify from users where email=$1';
        return pool.query(text, param, callback)
    },


    registerUser: (firstName, lastName, email, password, title, language, salt, callback) => {
        let param = [firstName, lastName, email, password, title, language, salt];
        let text = 'INSERT INTO "public"."users" ("first_name", "last_name", "email", "password", "title", "language", "salt")\n' +
            'VALUES ($1, $2,$3, $4, $5, $6, $7) RETURNING *;';
        return pool.query(text, param, callback)
    },


    getInterests: (email, callback) => {
        let param = [email];
        let query = 'select coins."from",coins."to",coins.available,interests.price,interests.interest_id as _id,interests.isGreater,interests.status,coins.market\n' +
            'from ((interests join coins on interests.interest_coin_id = coins.coin_id)\n' +
            '  join users on interests.interest_user_id = users.user_id)\n' +
            'where users.email=$1;';
        return pool.query(query, param, callback)
    },


    getInterestStatus: (email, callback) => {
        let param = [email];
        let query = 'select interest, flash from users where email=$1;';
        return pool.query(query, param, callback)
    },


    getTradingPair: (from, to, market, callback) => {
        let param = [from, to, market];
        let query = 'select "from","to",market,coin_id as _id from coins where "from"=$1 and "to"=$2 and market=$3;';
        return pool.query(query, param, callback)
    },


    addTradingPair: (from, to, market, callback) => {
        let param = [from, to, market];
        let query = 'insert into coins ("from", "to", market) values ($1,$2,$3) returning coin_id as _id;';
        return pool.query(query, param, callback)
    },


    addInterestWithOutTradingPair: (email, coinID, price, isGreater, callback) => {
        let param = [email, coinID, price, isGreater];
        let query = 'insert into interests (interest_user_id, interest_coin_id, price, isGreater) values ((SELECT user_id from users where email=$1),$2,$3,$4) returning *;';
        return pool.query(query, param, callback)
    },


    addInterestWithTradingPair: (email, coinID, price, isGreater, callback) => {
        let param = [email, coinID, price, isGreater];
        let query = 'insert into interests (interest_user_id, interest_coin_id, price, isGreater) values ((SELECT user_id from users where email=$1),$2,$3,$4) returning *;';
        return pool.query(query, param, callback)
    },


    changeInterestStatus: (interests, callback) => {
        let query = 'update interests set\n' +
            '  status = c.status\n' +
            'from (values\n';
        let str = '';
        interests.forEach(element => {
            str += '(' + element.id + ',' + element.status + '),';
        });
        query += str.substring(0, str.length - 1);
        query += ') as c(id,status)\n' +

            'where c.id = interests.interest_id returning interest_id as _id,interests.status;';
        return pool.query(query, [], callback);
    },


    updateNotificationStatus: (email, flash,interest, callback) => {
        let param = [flash,interest, email];
        let query = 'update users set flash=$1,interest=$2 where email=$3 returning interest,flash;';
        return pool.query(query, param, callback);
    },


    deleteInterest: (interests, callback) => {
        let query = 'delete from interests\n' +
            'where interest_id in (';
        let str = '';
        interests.forEach(element => {
            str += element._id + ',';
        });
        query += str.substring(0, str.length - 1);
        query += ') returning interest_id as _id;';
        return pool.query(query, [], callback);
    },


    getInterest: (id, callback) => {
        let param = [id];
        let query = 'select coins."from",coins."to",coins.market,interests.interest_id,interests.price,interests.isgreater,interests.frequence\n' +
            'from (interests join coins on interests.interest_coin_id = coins.coin_id)\n' +
            'where interest_id=$1;';
        return pool.query(query, param, callback);
    },


    updateInterestPrice: (id, price, isGreater, callback) => {
        let param = [price,isGreater,id];
        let query = 'Update interests set (price,isgreater) = ($1,$2) where interest_id=$3 returning *;';
        return pool.query(query,param,callback);
    },


    updateInterestCoin:(id,coinID,price,isGreater,callback)=>{
        let param = [price,isGreater,coinID,id];
        let query = 'Update interests set (price,isgreater,interest_coin_id) = ($1,$2,$3) where interest_id=$4 returning *;';
        return pool.query(query,param,callback);
    },


    addIOSDevice:(email,token,callback)=>{
        let param = [email,token];
        let query = 'insert into iosdevices (device_user_id, device_token) VALUES ((SELECT user_id from users where email=$1),$2) returning *;';
        return pool.query(query,param,callback);
    },


    deleteIOSDevice:(token,callback)=>{
        let param = [token];
        let query = 'DELETE FROM iosdevices where device_token=$1;';
        return pool.query(query,param,callback);
    },


    addIOSDeviceNumber: (token,callback)=>{
        let param = [token];
        let query = 'update iosdevices set number = number+1 where device_token=$1 returning device_token,number;';
        return pool.query(query,param,callback);
    },


    setIOSDeviceNumberToZero: (token,callback)=>{
        let param = [token];
        let query = 'update iosdevices set number = 0 where device_token=$1 returning device_token,number;';
        return pool.query(query,param,callback);
    },


    // updateFlashNotificationStatus:(email,status,callback)=>{
    //     let param = [email,status];
    //     let query = 'update users set flash=$2 where email=$1 returning user_id,flash;';
    //     return pool.query(query,param,callback);
    // },
    updateTradingPair:(id,price,callback)=>{
        let param = [price,id];
        let query = 'update coins set price=$1 where coin_id=$2 returning *;';
        return pool.query(query,param,callback);
    },

    getAllTradingPair:(callback)=>{
        let param = [];
        let query = 'Select * from coins;';
        return pool.query(query,param,callback);
    },

    getAllIOSDeviceForFlashNotification:(callback)=>{
        let param = [];
        let query = 'SELECT iosdevices.device_token \n' +
            'from (users join iosdevices on users.user_id=iosdevices.device_user_id) \n' +
            'where users.flash = true;';
        return pool.query(query,param,callback);
    },

    addIntoVerifyTable:(user_id,verifyToken,callback)=>{
        let param = [verifyToken,user_id];
        let query = 'insert into verify_user (token, verify_user_id) VALUES ($1, $2) returning *;';
        return pool.query(query,param,callback);
    },


    removeFromVerifyTable:(token,callback)=>{
        let param = [token];
        let query = 'delete from verify_user where token=$1 returning verify_user_id as user;';
        return pool.query(query,param,callback);
    },


    selectFromVerifyTable:(token,callback)=>{
        let param = [token];
        let query = 'select * from verify_user where token=$1;';
        return pool.query(query,param,callback);
    },


    verifyUser:(userID,callback)=>{
        let param = [userID];
        let query = 'update users set verify=true where user_id=$1 returning *';
        return pool.query(query,param,callback);
    },


    removeVerifyByReset:(id,callback)=>{
        let param = [id];
        let query = 'DELETE FROM verify_user WHERE verify_user_id=$1 returning *;';
        return pool.query(query,param,callback);
    },


    updatePassword:(id,password,salt,callback)=>{
        let param = [id,password,salt];
        let query = 'UPDATE users set password=$2,salt=$3 where user_id=$1 returning *;';
        return pool.query(query,param,callback);
    },


    resendVerifyEmail:(email,callback)=>{
        let param = [email];
        let query = 'Select * from verify_user where verify_user_id=(select user_id from users where email=$1);';
        return pool.query(query,param,callback);
    },


    setCoinAvailable:(coinSymbol,available,callback)=>{
        let param = [available,coinSymbol];
        let query = 'UPDATE coins SET available=$1 WHERE "from"=$2;';
        return pool.query(query,param,callback);
    }
};
































