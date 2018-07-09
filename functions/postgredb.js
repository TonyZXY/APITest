const { Pool } = require('pg');

const pool = new Pool({
    user:'tonyzheng',
    host:'localhost',
    database:'tonyzheng',
    password:'bcgtest',
    port:5432
});

module.exports = {
    getDevices: (params, callback) => {
        let text = 'select distinct coins."from",coins."to",interests.price,interests.interest_id,coins.\\n\' +\n' +
            '        \'market,users.user_id,interests.status, devices.device_token\\n\' +\n' +
            '        \'from (((interests join coins on interests.interest_coin_id = coins.coin_id)\\n\' +\n' +
            '        \'  join users on interests.interest_user_id = users.user_id)\\n\' +\n' +
            '        \'  join devices on users.user_id = devices.user_id)\\n\' +\n' +
            '        \'where status = true and users.interest=true;';
        return pool.query(text, params, callback)
    },
    getUser: (param, callback)=>{
        let text = 'select user_id as _id,password,salt,email from users where email=$1';
        return pool.query(text,param,callback)
    },
    registerUser:(param,callback)=>{
        let text = 'INSERT INTO "public"."users" ("first_name", "last_name", "email", "password", "title", "language", "salt")\n' +
            'VALUES ($1, $2,$3, $4, $5, $6, $7) RETURNING *;';
        return pool.query(text,param,callback)
    },
    getInterest:(param,callback)=>{
        let query = 'select coins."from",coins."to",interests.price,interests.interest_id as _id,interests.isGreater,interests.status,coins.market\n' +
            'from ((interests join coins on interests.interest_coin_id = coins.coin_id)\n' +
            '  join users on interests.interest_user_id = users.user_id)\n' +
            'where users.email=$1;';
        return pool.query(query,param,callback)
    },
    getInterestStatus:(param,callback)=>{
        let query = 'select interest as status from users where email=$1';
        return pool.query(query,param,callback)
    }
};