const {Pool} = require('pg');
const config = require('../config');
const postgre = config.postgre;

const pool = new Pool(postgre);

module.exports = {
    // get add user info with their trading pair from db
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


    // get user info
    getUser: (email, callback) => {
        let param = [email];
        let text = 'select user_id as _id,password,salt,email,nick_name,verify from users where email=$1';
        return pool.query(text, param, callback)
    },


    // register user
    registerUser: (firstName, lastName, email, password, title, language, salt, callback) => {
        let param = [firstName, lastName, email, password, title, language, salt];
        let text = 'INSERT INTO "public"."users" ("first_name", "last_name", "email", "password", "title", "language", "salt")\n' +
            'VALUES ($1, $2,$3, $4, $5, $6, $7) RETURNING *;';
        return pool.query(text, param, callback)
    },


    // get list of alert setting for one user
    getInterests: (email, callback) => {
        let param = [email];
        let query = 'select coins."from",coins."to",coins.available,interests.price,interests.interest_id as _id,interests.isGreater,interests.status,coins.market\n' +
            'from ((interests join coins on interests.interest_coin_id = coins.coin_id)\n' +
            '  join users on interests.interest_user_id = users.user_id)\n' +
            'where users.email=$1;';
        return pool.query(query, param, callback)
    },


    // get notification status for user
    getInterestStatus: (email, callback) => {
        let param = [email];
        let query = 'select interest, flash from users where email=$1;';
        return pool.query(query, param, callback)
    },


    // get trading pair data for adding or not adding new trading pair
    getTradingPair: (from, to, market, callback) => {
        let param = [from, to, market];
        let query = 'select "from","to",market,coin_id as _id from coins where "from"=$1 and "to"=$2 and market=$3;';
        return pool.query(query, param, callback)
    },


    // add trading pair data for store into db and perpare to compare
    addTradingPair: (from, to, market, callback) => {
        let param = [from, to, market];
        let query = 'insert into coins ("from", "to", market) values ($1,$2,$3) returning coin_id as _id;';
        return pool.query(query, param, callback)
    },


    // add new interest with out adding new trading pair
    addInterestWithOutTradingPair: (email, coinID, price, isGreater, callback) => {
        let param = [email, coinID, price, isGreater];
        let query = 'insert into interests (interest_user_id, interest_coin_id, price, isGreater) values ((SELECT user_id from users where email=$1),$2,$3,$4) returning *;';
        return pool.query(query, param, callback)
    },


    // add new interest with adding new trading pair
    addInterestWithTradingPair: (email, coinID, price, isGreater, callback) => {
        let param = [email, coinID, price, isGreater];
        let query = 'insert into interests (interest_user_id, interest_coin_id, price, isGreater) values ((SELECT user_id from users where email=$1),$2,$3,$4) returning *;';
        return pool.query(query, param, callback)
    },


    // change list of interest notification status
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


    // update users notification status
    updateNotificationStatus: (email, flash, interest, callback) => {
        let param = [flash, interest, email];
        let query = 'update users set flash=$1,interest=$2 where email=$3 returning interest,flash;';
        return pool.query(query, param, callback);
    },


    // delete list of interest
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


    // get list of interest for one user
    getInterest: (id, callback) => {
        let param = [id];
        let query = 'select coins."from",coins."to",coins.market,interests.interest_id,interests.price,interests.isgreater,interests.frequence\n' +
            'from (interests join coins on interests.interest_coin_id = coins.coin_id)\n' +
            'where interest_id=$1;';
        return pool.query(query, param, callback);
    },


    // update the price of interest that user want to set
    updateInterestPrice: (id, price, isGreater, callback) => {
        let param = [price, isGreater, id];
        let query = 'Update interests set (price,isgreater) = ($1,$2) where interest_id=$3 returning *;';
        return pool.query(query, param, callback);
    },


    // update users selected interest to database
    updateInterestCoin: (id, coinID, price, isGreater, callback) => {
        let param = [price, isGreater, coinID, id];
        let query = 'Update interests set (price,isgreater,interest_coin_id) = ($1,$2,$3) where interest_id=$4 returning *;';
        return pool.query(query, param, callback);
    },


    // add ios device into db with user id
    addIOSDevice: (email, token, callback) => {
        let param = [email, token];
        let query = 'insert into iosdevices (device_user_id, device_token) VALUES ((SELECT user_id from users where email=$1),$2) returning *;';
        return pool.query(query, param, callback);
    },


    // delete device token
    deleteIOSDevice: (token, callback) => {
        let param = [token];
        let query = 'DELETE FROM iosdevices where device_token=$1;';
        return pool.query(query, param, callback);
    },


    // add number that display when push notification
    addIOSDeviceNumber: (token, callback) => {
        let param = [token];
        let query = 'update iosdevices set number = number+1 where device_token=$1 returning device_token,number;';
        return pool.query(query, param, callback);
    },


    // clear number display when push notification
    setIOSDeviceNumberToZero: (token, callback) => {
        let param = [token];
        let query = 'update iosdevices set number = 0 where device_token=$1 returning device_token,number;';
        return pool.query(query, param, callback);
    },


    // get the number that need to display
    getIOSDeviceNumber: (token, callback) => {
        let query = 'select number from iosdevices where device_token = $1;';
        let param = [token];
        return pool.query(query, param, callback)
    },


    // get number of news flash
    getIOSNewsNumber: (token, callback) => {
        let query = 'select number from ios_newsflash where device_token = $1;';
        let param = [token];
        return pool.query(query, param, callback);
    },


    // updateFlashNotificationStatus:(email,status,callback)=>{
    //     let param = [email,status];
    //     let query = 'update users set flash=$2 where email=$1 returning user_id,flash;';
    //     return pool.query(query,param,callback);
    // },

    // update trading pair list
    updateTradingPair: (id, price, callback) => {
        let param = [price, id];
        let query = 'update coins set price=$1 where coin_id=$2 returning *;';
        return pool.query(query, param, callback);
    },

    // get all list of trading pair
    getAllTradingPair: (callback) => {
        let param = [];
        let query = 'Select * from coins;';
        return pool.query(query, param, callback);
    },

    // get all ios devices token with user data
    getAllIOSDeviceForFlashNotification: (callback) => {
        let param = [];
        let query = 'SELECT iosdevices.device_token, users.flash\n' +
            'from (users join iosdevices on users.user_id=iosdevices.device_user_id) \n' +
            'where users.flash = true;';
        return pool.query(query, param, callback);
    },

    // add value into verify user
    addIntoVerifyTable: (user_id, verifyToken, callback) => {
        let param = [verifyToken, user_id];
        let query = 'insert into verify_user (token, verify_user_id) VALUES ($1, $2) returning *;';
        return pool.query(query, param, callback);
    },


    // remove value from verify user table
    removeFromVerifyTable: (token, callback) => {
        let param = [token];
        let query = 'delete from verify_user where token=$1 returning verify_user_id as user;';
        return pool.query(query, param, callback);
    },


    // select values from verify table
    selectFromVerifyTable: (token, callback) => {
        let param = [token];
        let query = 'select * from verify_user where token=$1;';
        return pool.query(query, param, callback);
    },


    // verify user status
    verifyUser: (userID, callback) => {
        let param = [userID];
        let query = 'update users set verify=true where user_id=$1 returning *';
        return pool.query(query, param, callback);
    },


    // after reset password, delete verify from verify table
    removeVerifyByReset: (id, callback) => {
        let param = [id];
        let query = 'DELETE FROM verify_user WHERE verify_user_id=$1 returning *;';
        return pool.query(query, param, callback);
    },


    // reset password
    updatePassword: (id, password, salt, callback) => {
        let param = [id, password, salt];
        let query = 'UPDATE users set password=$2,salt=$3 where user_id=$1 returning *;';
        return pool.query(query, param, callback);
    },


    // resend password for users
    resendVerifyEmail: (email, callback) => {
        let param = [email];
        let query = 'Select * from verify_user where verify_user_id=(select user_id from users where email=$1);';
        return pool.query(query, param, callback);
    },


    // set coin available or not
    setCoinAvailable: (coinSymbol, available, callback) => {
        let param = [available, coinSymbol];
        let query = 'UPDATE coins SET available=$1 WHERE "from"=$2;';
        return pool.query(query, param, callback);
    },


    // get all transactions for one user
    getAllTransaction: (email, callback) => {
        let param = [email];
        let query = 'select * from transactions where transaction_user_id=(select user_id from users where email=$1)';
        return pool.query(query, param, callback)
    },


    // add list of transaction into transaction list
    addTransactionList: (userID, coinList, callback) => {
        let param = [userID];
        let query = 'insert into transactions (transaction_user_id, status, coin_name, coin_add_name, exchange_name, ' +
            'trading_pair_name, single_price, amount, currency_aud, currency_usd, currency_jpy, currency_eur, ' +
            'currency_cny, date, note) values';
        let str = '';
        coinList.forEach(coin => {
            str += '(' + userID + ',\'' + coin.status + '\',\'' + coin.coinName + '\',\'' + coin.coinAddName + '\',\'' + coin.exchangeName + '\',\'' +
                coin.tradingPairName + '\',' + coin.singlePrice + ',' + coin.amount + ',' + coin.currencyAUD + ',' + coin.currencyUSD + ',' +
                coin.currencyJPY + ',' + coin.currencyEUR + ',' + coin.currencyCNY + ',\'' + coin.date + '\',\'' + coin.note + '\'),';
        });
        query += str.substring(0, str.length - 1);
        query += ' returning * ;';
        return pool.query(query, [], callback);
    },


    // delete transaction by id
    deleteTransaction: (coinID, callback) => {
        let query = 'delete from transactions where transaction_id in (';
        let str = '';
        coinID.forEach(element => {
            str += element + ',';
        });
        query += str.substring(0, str.length - 1);
        query += ') returning *;';
        return pool.query(query, [], callback);
    },


    // update one transaction by id
    updateTransaction: (coin, callback) => {
        let query = 'UPDATE transactions\n' +
            'SET\n' +
            '    (status, coin_name, coin_add_name, exchange_name, trading_pair_name,\n' +
            '    single_price, amount, currency_aud, currency_usd, currency_jpy, currency_eur, currency_cny,\n' +
            '    date, note) =\n' +
            '    (\'' + coin.status + '\',\'' + coin.coinName + '\',\'' + coin.coinAddName + '\',\'' + coin.exchangeName + '\',\'' + coin.tradingPairName + '\',\n' +
            '        ' + coin.singlePrice + ',' + coin.amount + ',' + coin.currencyAUD + ',' + coin.currencyUSD + ',' + coin.currencyJPY + ',' + coin.currencyEUR + ',' + coin.currencyCNY + ',\n' +
            '        \'' + coin.date + '\',\'' + coin.note + '\')\n' +
            'WHERE transaction_id = ' + coin.transactionID + ' returning *;';
        return pool.query(query, [], callback);
    },


    // add like to news flash
    addLike: (newsID, callback) => {
        let query = 'update like_dislike set likes = likes+1 where news_id = $1 returning * ;';
        let param = [newsID];
        return pool.query(query, param, callback);
    },

    // remove like from news flash
    removeLike: (newsID, callback) => {
        let query = 'update like_dislike set likes = likes - 1 where news_id = $1 returning *;';
        let param = [newsID];
        return pool.query(query, param, callback);
    },

    // add dislike to news flash
    addDislike: (newsID, callback) => {
        let query = 'update like_dislike set dislikes = dislikes +1 where news_id = $1 returning * ;';
        let param = [newsID];
        return pool.query(query, param, callback);
    },

    // remove dislike from news flash
    removeDislike: (newsID, callback) => {
        let query = 'update like_dislike set dislikes = dislikes -1 where news_id = $1 returning * ;';
        let param = [newsID];
        return pool.query(query, param, callback);
    },

    // get number of like of news flash
    getLikesNumber: (newsID, callback) => {
        let query = 'select * from like_dislike where news_id=$1;';
        let param = [newsID];
        return pool.query(query, param, callback);
    },

    // add news flash id into like dislike list
    addNewsIntoList: (newsID, callback) => {
        let param = [newsID];
        let query = 'insert into like_dislike (news_id) values ($1) returning *;';
        return pool.query(query, param, callback);
    },

    // get list number of like and dislike news flash
    getLikesNumberList: (newsIDs, callback) => {
        let query = 'select * from like_dislike where news_id in (';
        let str = '';
        newsIDs.forEach(e => {
            str += '\'' + e + '\',';
        });
        query += str.substring(0, str.length - 1);
        query += ');';

        return pool.query(query, [], callback);
    },

    // add ios device token into all list of news flash notification list
    addIOSNewsFlash: (device, callback) => {
        let query = 'insert into ios_newsflash (device_token) values ($1) returning *;';
        let param = [device];

        return pool.query(query, param, callback);
    },


    //get list of device token
    getIOSNewsFlash: (callback) => {
        let query = 'SELECT device_token from ios_newsflash;';

        return pool.query(query, [], callback);
    },


    // add display number
    addIOSNewsFlashNumber: (token, callback) => {
        let param = [token];
        let query = 'update ios_newsflash set number = number+1 where device_token=$1 returning device_token,number;';
        return pool.query(query, param, callback);
    },

    // clean display number
    setIOSNewsFlashNumberToZero: (token, callback) => {
        let param = [token];
        let query = 'update ios_newsflash set number = 0 where device_token=$1 returning device_token,number;';
        return pool.query(query, param, callback);
    },

    // get nick name for trading game
    gameGetNickName: (email, callback) => {
        let param = [email];
        let query = "SELECT nick_name from users where email=$1;";
        return pool.query(query, param, callback);
    },


    // set nick name for trading game
    gameSetNickName: (email, nickName, callback) => {
        let param = [email, nickName];
        let query = "Update users set nick_name=$2 where email=$1 returning * ;";
        return pool.query(query, param, callback);
    },


    // setup trading game account
    gameSetUpAccount: (user_id, callback) => {
        let param = [user_id];
        let query = "insert into game_account (user_id) values ($1) returning *;";
        return pool.query(query, param, callback);
    },


    // get trading game account
    gameGetAccountData: (user_id, callback) => {
        let param = [user_id];
        let query = "Select * from game_account where user_id=$1;";
        return pool.query(query, param, callback);
    },

    // add transaction into game transactions
    gameAddTransactionList: (userID, coinList, callback) => {
        let query = 'insert into game_transactions (user_id, status, coin_name, coin_add_name, exchange_name, ' +
            ' trading_pair_name, single_price, amount, date, note, auto,transaction_fee) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)' +
            ' returning *;';
        let param = [userID, coinList.status, coinList.coinName, coinList.coinAddName.toLowerCase(), coinList.exchangeName,
            coinList.tradingPairName, Math.round(coinList.singlePrice * 100000000) / 100000000, Math.round(coinList.amount * 100000000) / 100000000, coinList.date, coinList.note, false, coinList.transaction_fee];
        return pool.query(query, param, callback);
    },

    // add transaction into game account by stop loss func
    gameAddTransactionListAuto: (userID, coin, callback) => {
        let query = 'insert into game_transactions (user_id, status, coin_name, coin_add_name, exchange_name, ' +
            ' trading_pair_name, single_price, amount, date, note, auto, transaction_fee) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)' +
            ' returning *;';
        let param = [userID, coin.status, coin.coinName, coin.coinAddName.toLowerCase(), coin.exchangeName,
            coin.tradingPairName, Math.round(coin.singlePrice * 100000000) / 100000000, Math.round(coin.amount * 100000000) / 100000000, coin.date, coin.note, true, coin.transaction_fee];
        return pool.query(query, param, callback);
    },


    // get all game transactions for one user
    gameGetAllTransactionForUser: (user_id, callback) => {
        let query = 'select * from game_transactions where user_id = $1;';
        let param = [user_id];
        return pool.query(query, param, callback);
    },

    // update game account by buy or sell coins
    gameUpdateAccountAmount: (userID, status, coinAmount, coinName, audAmount, callback) => {
        let query = '';
        if (status.toLowerCase() === "sell") {
            // add transaction fee
            query = 'update game_account set (aud,' + coinName + ') = (aud+' + Math.round(audAmount * 0.998 * 100000000) / 100000000 + ',' + coinName.toLowerCase() + '-' + Math.round(coinAmount * 100000000) / 100000000 + ') where user_id=' + userID + ' returning *;';
        } else {
            query = 'update game_account set (aud,' + coinName + ') = (aud-' + Math.round(audAmount / 0.998 * 100000000) / 100000000 + ',' + coinName.toLowerCase() + '+' + Math.round(coinAmount * 100000000) / 100000000 + ') where user_id=' + userID + ' returning *;';
        }
        return pool.query(query, [], callback);
    },


    // get game stop loss set by coin name
    gameGetSetsWithCoin: (userID, coinName, callback) => {
        let query = 'Select * from game_stop_loss_sets where user_id = $1 And coin_name=$2 and actived =true;';
        let param = [userID, coinName];
        return pool.query(query, param, callback);
    },


    // get game stop loss set limit for a user
    gameSelectSetLimitNumber: (userID, callback) => {
        let query = 'select sets from game_account where user_id = $1;';
        let param = [userID];
        return pool.query(query, param, callback);
    },


    // add game stop loss set
    gameAddStopLossSet: (userID, set, callback) => {
        let query = 'insert into game_stop_loss_sets (user_id, coin_name, price_greater, price_lower, amount) values ($1,$2,$3,$4,$5) returning *;';
        let param = [userID, set.coinName.toLowerCase(), set.priceGreater, set.priceLower, set.amount];
        return pool.query(query, param, callback);
    },


    // edit game stop loss set
    gameEditStopLossSet: (userID, set, callback) => {
        let query = 'update game_stop_loss_sets set (price_greater, price_lower, amount, code)=($1,$2,$3,null) where set_id = $4 returning *;';
        let param = [set.priceGreater, set.priceLower, set.amount, set.set_id];
        return pool.query(query, param, callback);
    },


    // get game stop loss set of user
    gameGetStopLossSet: (userID, callback) => {
        let query = 'select * from game_stop_loss_sets where user_id =$1;';
        let param = [userID];
        return pool.query(query, param, callback);
    },


    // get all stop loss set ready for compare
    gameGetAllActiveStopLossSet: (callback) => {
        let query = 'select * from game_stop_loss_sets where actived = true and code is null;';
        return pool.query(query, [], callback);
    },


    gameGetAllStopLossSet: (callback) => {
        let query = 'select * from game_stop_loss_sets;';
        return pool.query(query, [], callback);
    },


    // set game stop loss set into deactive
    gameCompleteStopLossSet: (setID, date, callback) => {
        let query = 'update game_stop_loss_sets set (actived,complete_date)=(false,$1) where set_id=$2 returning *;';
        let param = [date, setID];
        return pool.query(query, param, callback);
    },


    // set game alert
    gameSetAlert: (user_id, alert, callback) => {
        let query = 'insert into game_alert (user_id, coin_name, price, isgreater) values ($1,$2,$3,$4) returning *;';
        let param = [user_id, alert.coinName.toLowerCase(), alert.price, alert.isGreater];
        return pool.query(query, param, callback);
    },


    // get game alert
    gameGetAlert: (user_id, callback) => {
        let query = 'select * from game_alert where user_id = $1;';
        let param = [user_id];
        return pool.query(query, param, callback);
    },

    gameFinishAlert: (alert_id, callback) => {
        let query = 'update game_alert set status = false where alert_id=$1 returning *;';
        let param = [alert_id];
        return pool.query(query, param, callback);
    },


    // game update alert status
    gameUpdateAlertStatus: (alerts, callback) => {
        let query = "update game_alert set status = c.status from (values ";
        let str = '';
        alerts.forEach(e => {
            str += '(' + e.alert_id + ',' + e.status + '),';
        });
        query += str.substring(0, str.length - 1);
        query += ') as c(alert_id,status) where c.alert_id = game_alert.alert_id returning game_alert.alert_id, game_alert.status;';
        return pool.query(query, [], callback);
    },


    // game update alert data
    gameUpdateAlert: (alert, callback) => {
        let query = 'update game_alert set (coin_name,price,isgreater,status) = ($1,$2,$3,$4) where alert_id = $5 returning *;';
        let param = [alert.coinName.toLowerCase(), alert.price, alert.isGreater, alert.status, alert.alert_id];
        return pool.query(query, param, callback);
    },


    // use to generate list to send notification in game for alert coin price
    gameGetAlertWithNotification: (callback) => {
        let query = 'select iosdevices.device_token, iosdevices.number , game_alert.alert_id, game_alert.user_id, game_alert.coin_name, ' +
            'game_alert.price, game_alert.isgreater from ( game_alert join iosdevices on game_alert.user_id = ' +
            'iosdevices.device_user_id) where game_alert.status=true ;';
        return pool.query(query, [], callback);
    },


    // game reset account by id
    gameSetAccountReset: (user_id, callback) => {
        let query = 'update game_account set reset=true where user_id = $1 returning *;';
        let param = [user_id];
        return pool.query(query, param, callback);
    },


    // game do not reset account
    gameWithdrawResetAccount: (user_id, callback) => {
        let query = 'update game_account set reset=false where user_id = $1 returning *;';
        let param = [user_id];
        return pool.query(query, param, callback);
    },


    // can not complete stop loss set
    gameFailToCompleteStopLossSet: (set, callback) => {
        let query = 'update game_stop_loss_sets set code = 400 where set_id =$1 returning *;';
        let param = [set.set_id];
        return pool.query(query, param, callback);
    },


    // get devices token when game need to push notification
    gameGetIOSDeviceForNotification: (callback) => {
        let query = 'select distinct iosdevices.device_token, game_alert.coin_name, game_alert.price,game_alert.isgreater,game_alert.user_id,game_alert.alert_id from (game_alert join iosdevices on game_alert.user_id = iosdevices.device_user_id) where game_alert.status = true;';
        let param = [];
        return pool.query(query, param, callback);
    },


    // get all game account
    gameGetAllAccount: (callback) => {
        let query = 'select game_account.*,users.nick_name from (game_account join users on game_account.user_id = users.user_id);';
        let param = [];
        return pool.query(query, param, callback);
    },

    // game, update account table
    gameUpdateWeeklyAmount: (user_id, data, callback) => {
        let query = 'update game_account set (last_week,this_week,total) = ($2,$3,$2) where user_id = $1 returning *;';
        let param = [user_id, data.total, data.this_week];
        return pool.query(query, param, callback);
    },

    // game, start competition setting
    gameStartCompetition: (user_id, this_week, last_week, callback) => {
        let query = 'update game_account set (last_week, this_week) = ($2,$3) where user_id = $1 returning *;';
        let param = [user_id, last_week, this_week];
        return pool.query(query, param, callback);
    },

    // game update total amount
    gameDailyUpdateTotal: (user_id, weekly_total, callback) => {
        let query = 'update game_account set total = $2 where user_id = $1 returning *;';
        let param = [user_id, weekly_total];
        return pool.query(query, param, callback);
    },

    // game update daily percentage
    gameDailyUpdateCompetition: (user_id, this_week, callback) => {
        let query = 'update game_account set this_week = $2 where user_id = $1 returning *;';
        let param = [user_id, this_week];
        return pool.query(query, param, callback);
    },

    // get user device id
    getDeviceTokenByID: (user_id, callback) => {
        let query = 'select device_token from iosdevices where device_user_id = $1;';
        let param = [user_id];
        return pool.query(query, param, callback);
    },


    // game reset account to default
    gameResetAccountAmount: (user_id, callback) => {
        let query = 'update game_account set (aud,btc,eth,bch,ltc,powr,elf,ctxc,dta,iost,etc,last_week,reset) = (10000,0,0,0,0,0,0,0,0,0,0,null,false) where user_id = $1 returning *;';
        let param = [user_id];
        return pool.query(query, param, callback);
    },

    // get game account information
    gameCheckAccount: (email, callback) => {
        let query = 'select users.nick_name,users.email,users.user_id,game_account.* from (users join game_account on users.user_id = game_account.user_id) where users.email =$1;';
        let param = [email];
        return pool.query(query, param, callback);
    },


    // check game config number
    gameCheckWeekNumber: (callback) => {
        let query = 'select "value" from config where "key" = \'weekNumber\';';
        let param = [];
        return pool.query(query, param, callback);
    },


    // update game config number
    gameUpdateWeekNumber: (number, callback) => {
        number = number + 1;
        let query = 'update config set "value" = $1 where "key" = \'weekNumber\' returning *;';
        let param = [number];
        return pool.query(query, param, callback);
    },


    // get average history of game
    gameGetAverageHistory: (user_id, callback) => {
        let query = 'select coin_add_name,status, sum(single_price*amount) as total_value, sum(amount) as total_amount from game_transactions where user_id=$1 group by coin_add_name,status;';
        let param = [user_id];
        return pool.query(query, param, callback);
    },

    // game delete alert
    gameDeleteAlert: (interest, callback) => {
        let query = 'Delete from game_alert where alert_id = $1;';
        let param = [interest.alert_id];
        return pool.query(query, param, callback);
    },

    // game cancel stop loss
    gameCancelStopLoss: (user_id, coinName, callback) => {
        let query = 'UPDATE game_stop_loss_sets set (actived,code)=(false,500) where user_id=$1 and coin_name=$2 and actived=true returning *;';
        let param = [user_id, coinName.toLowerCase()];
        return pool.query(query, param, callback);
    }

};
































