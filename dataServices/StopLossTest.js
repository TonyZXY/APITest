const db = require('../functions/postgredb');
const mongoose = require('mongoose');
const GameCoin = require('../module/GameCoin');
const config = require('../config');

mongoose.connect(config.database,config.options);



// db.gameGetAllStopLossSet((err,dbmsg)=>{
//     if (err){
//         console.log(err);
//     } else {
//         console.log(dbmsg.rows);
//     }
// });



function comparePrice(set, coin, callback) {
    if (set.price_greater <= coin.current_price){
        return callback(null,{action:'higher'},null);
    } else if (set.price_lower >= coin.current_price){
        return callback(null,null,{action:'lower'});
    } else {
        return callback({action:'no'},null,null);
    }
}

function getData() {
    db.gameGetAllActiveStopLossSet((err,dbmsg)=>{
        if (err){
            console.log(err);
        } else {
            let dbData = dbmsg.rows;
            GameCoin.getCoinList((err,msg)=>{
                if (err){
                    console.log(err);
                } else {
                    let coinData = msg;
                    coinData.forEach(coin =>{
                        if (dbData[0]===null || dbData[0] === undefined){
                            console.log("no set found");
                        } else {
                            dbData.forEach( set =>{
                                if (coin.coin_name === set.coin_name){
                                    comparePrice(set,coin,(none,higher,lower)=>{
                                        if (none){

                                        } else if (higher){
                                            coin.note="reach high price limit";
                                            porformTransaction(set,coin);
                                        } else {
                                            coin.note = 'touch low price limit';
                                            porformTransaction(set,coin);
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


function porformTransaction(set,coin){
    let coinTo = {
        status: 'sell',
        coinName: coin.coin_fullname,
        coinAddName:coin.coin_name,
        exchangeName: coin.exchangeName,
        tradingPairName: coin.tradingPairName,
        singlePrice:coin.current_price,
        amount:set.amount,
        date: new Date(),
        note: 'Stop Loss Function Auto Generate: ' + coin.note,
    };
    db.gameUpdateAccountAmount(set.user_id,coinTo.status,coinTo.amount,coinTo.coinAddName,coinTo.singlePrice*coinTo.amount,(err,dbmsg1)=>{
        if (err){
            if (err.code === '23514'){
                console.log('no enough fund');
                db.gameFailToCompleteStopLossSet(set,(err,failmsg)=>{
                    if (err){
                        console.log(err);
                    } else {
                        console.log(failmsg);
                    }
                })
            } else {
                console.log(err);
            }
        } else {
            console.log(dbmsg1.rows);
            db.gameAddTransactionListAuto(set.user_id,coinTo,(err,dbmsg)=>{
                if (err){
                    console.log(err);
                } else {
                    console.log(dbmsg.rows);
                    console.log("send notification");
                    db.gameCompleteStopLossSet(set.set_id,coinTo.date,(err,dbmsg2)=>{
                        if (err){
                            console.log(err);
                        } else {
                            console.log(dbmsg2.rows[0]);
                        }
                    })
                }
            });
        }
    });
}



getData();














