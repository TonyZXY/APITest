const db = require('../functions/postgredb');
const mongoose = require('mongoose');
const GameCoin = require('./GameCoin');
const config = require('../config');
const apn = require('apn');


mongoose.connect(config.database, config.options);


const optionsToFile = {
    token: {
        key: "../cert.p8",
        keyId: "PFYGPR25U8",
        teamId: "4SMWL7L89M"
    },
    production: true
};


function comparePrice(set, coin, callback) {
    if (parseFloat(set.price_greater) <= coin.current_price) {
        return callback(null, {action: 'higher'}, null);
    } else if (parseFloat(set.price_lower) >= coin.current_price) {
        return callback(null, null, {action: 'lower'});
    } else {
        return callback({action: 'no'}, null, null);
    }
}

function getData() {
    db.gameGetAllActiveStopLossSet((err, dbmsg) => {
        if (err) {
            console.log(err);
        } else {
            let dbData = dbmsg.rows;
            GameCoin.getCoinList((err, msg) => {
                if (err) {
                    console.log(err);
                } else {
                    msg.forEach(coin => {
                        if (dbData[0] === null || dbData[0] === undefined) {
                        } else {
                            dbData.forEach(set => {
                                if (coin.coin_name.toLowerCase() === set.coin_name.toLowerCase()) {
                                    comparePrice(set, coin, (none, higher, lower) => {
                                        if (none) {

                                        } else if (higher) {
                                            coin.note = "reach high price limit";
                                            porformTransaction(set, coin);
                                        } else {
                                            coin.note = 'touch low price limit';
                                            porformTransaction(set, coin);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
}


function porformTransaction(set, coin) {
    let coinTo = {
        status: 'sell',
        coinName: coin.coin_fullname,
        coinAddName: coin.coin_name,
        exchangeName: coin.exchangeName,
        tradingPairName: coin.tradingPairName,
        singlePrice: coin.current_price,
        amount: set.amount,
        date: new Date(),
        note: 'Stop Loss Function Auto Generate: ' + coin.note,
    };
    db.gameUpdateAccountAmount(set.user_id, coinTo.status, Math.round(parseFloat(coinTo.amount)*100000000)/100000000,
        coinTo.coinAddName.toLowerCase(), Math.round(coinTo.singlePrice * parseFloat(coinTo.amount) * 100000000)/100000000,
        (err, dbmsg1) => {
        if (err) {
            if (err.code === '23514') {
                console.log('no enough fund');
                db.gameFailToCompleteStopLossSet(set, (err, failmsg) => {
                    if (err) {
                        console.log(err);
                    } else {
                    }
                })
            } else {
            }
        } else {
            coinTo.transaction_fee = Math.round(coinTo.singlePrice * parseFloat(coinTo.amount) * 0.002 * 100000000)/100000000;
            db.gameAddTransactionListAuto(set.user_id, coinTo, (err, dbmsg) => {
                if (err) {
                    console.log(err);
                } else {
                    let message = 'Your Stop Loss Set '+ coinTo.coinName+" is performed due to price reach "+coinTo.singlePrice+" AUD.";
                    pushNotification(set.user_id,message);
                    db.gameCompleteStopLossSet(set.set_id, coinTo.date, (err, dbmsg2) => {
                        if (err) {
                            console.log(err);
                        } else {
                        }
                    })
                }
            });
        }
    });
}


const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};


function loginConsole(msg) {
    console.log(
        new Date(Date.now()).toLocaleString() + " " + msg
    );
}


async function runScript() {
    let time = 1;
    do {
        getData();
        loginConsole("Check Stop Loss Loop for " + time + " times.");
        time++;
        await delay(1000 * 60);
    } while (true)
}


function pushNotification(user_id,message){
    db.getDeviceTokenByID(user_id,(err,dbmsg)=>{
        if (err){
            console.log(err);
        } else {
            let list = dbmsg.rows;
            list.forEach( e =>{
                let apnProvider = new apn.Provider(optionsToFile);
                let notification = new apn.Notification();
                notification.badge = 0;
                notification.title = "Trading Stop Loss Notification";
                notification.body = message;
                notification.sound = 'default';
                notification.topic = "com.blockchainglobal.bglmedia";
                apnProvider.send(notification,e.device_token).then( res =>{
                    console.log(res);
                    res.failed.forEach(f=>{

                    })
                })
            })
        }
    });
}

module.exports.run = () => {
    runScript()
};


module.exports.runOneTime = () =>{
    getData();
};


