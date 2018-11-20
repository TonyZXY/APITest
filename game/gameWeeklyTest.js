const db = require('../functions/postgredb');
const mongoose = require('mongoose');
const Ranking = require('./Ranking');
const CoinData = require('./gameCoinList');
const config = require('../config');
const GameCoin = require('./GameCoin');

mongoose.connect(config.database, config.options);

// this file is not used

// CoinData.runOneTime();
// GameCoin.getCoinList((err,monmsg)=>{
//     if (err){
//         console.log(err);
//     } else {
//         console.log(monmsg);
//     }
// });


async function start() {
    // CoinData.runOneTime();
    // await delay(1000*10);
    db.gameCheckWeekNumber((err,week)=>{
        if (err) {
            console.log(err);
        } else {
            let Number = parseInt(week.rows[0].value);
            GameCoin.getCoinList((err,monmsg)=>{
                if (err){
                    console.log(err);
                } else {
                    let btc = monmsg.find(e=> e.coin_name.toLowerCase() === 'btc').current_price;
                    let bch = monmsg.find(e=> e.coin_name.toLowerCase() === 'bch').current_price;
                    let ltc = monmsg.find(e=> e.coin_name.toLowerCase() === 'ltc').current_price;
                    let ctxc = monmsg.find(e=> e.coin_name.toLowerCase() === 'ctxc').current_price;
                    let powr = monmsg.find(e=> e.coin_name.toLowerCase() === 'powr').current_price;
                    let eth = monmsg.find(e=> e.coin_name.toLowerCase() === 'eth').current_price;
                    let iost = monmsg.find(e=> e.coin_name.toLowerCase() === 'iost').current_price;
                    let elf = monmsg.find(e=> e.coin_name.toLowerCase() === 'elf').current_price;
                    let etc = monmsg.find(e=> e.coin_name.toLowerCase() === 'etc').current_price;
                    let dta = monmsg.find(e=> e.coin_name.toLowerCase() === 'dta').current_price;

                    db.gameGetAllAccount((err,dbmsg)=>{
                        if (err){
                            console.log(err);
                        } else {
                            let accounts = dbmsg.rows;
                            accounts.forEach(account=>{
                                let weekly_total = parseFloat(account.aud) + parseFloat(account.btc)*btc +
                                    parseFloat(account.eth)*eth + parseFloat(account.bch)*bch + parseFloat(account.ltc)*ltc+
                                    parseFloat(account.ctxc)*ctxc + parseFloat(account.powr)*powr + parseFloat(account.iost)*iost+
                                    parseFloat(account.elf)*elf + parseFloat(account.etc)*etc + parseFloat(account.dta)*dta;

                                let lastWeek = parseFloat(account.last_week);
                                if (account.last_week === null) {
                                    lastWeek = 10000;
                                }
                                let this_week = (weekly_total/lastWeek)*100;
                                let data = {
                                    user_id: account.user_id,
                                    last_week: lastWeek,
                                    this_week: this_week,
                                    total:weekly_total,
                                    reset:account.reset,
                                };
                                // console.log(data);
                                if(account.reset === true){
                                    db.gameUpdateWeeklyAmount(account.user_id,data,(err,dbmsg4)=>{
                                        if (err){
                                            console.log(err);
                                        } else {
                                            // console.log(dbmsg4.rows);
                                            // console.log(account.user_id + ' will be reset');
                                            db.gameResetAccountAmount(account.user_id,(err,dbmsg2)=>{
                                                if (err){
                                                    console.log(err);
                                                } else {
                                                    // console.log(dbmsg2.rows);
                                                }
                                            })
                                        }
                                    })
                                }else {
                                    db.gameUpdateWeeklyAmount(account.user_id,data,(err,dbmsg7)=>{
                                        if (err){
                                            console.log(err);
                                        } else {
                                            // console.log(dbmsg7);
                                        }
                                    })
                                }
                            });
                            delay(10*1000);

                            db.gameGetAllAccount((err,dbmsg5)=>{
                                if (err){
                                    console.log(err);
                                } else {
                                    let list = dbmsg5.rows;
                                    generateRank(list,Number);
                                }
                            })
                        }
                    })
                }
            });
        }
    });

}


function generateRank(list,number) {
    let date = new Date();
    let rank = {
        title: 'Week'+ number +'rank',
        time: date,
        time_string: date.toISOString(),
        week_number: number,
    };
    let data=[];
    let weekrank = 1;
    list.sort(compareWeek);
    list.forEach( week =>{
        let user = {
            user_id:week.user_id,
            user_nickname:week.nick_name,
            week_rank:weekrank++,
            week_percentage: week.this_week,
        };
        data.push(user);
    });
    list.sort(compareTotal);
    let totalrank = 1;
    list.forEach( total=>{
        let index = data.findIndex(e=> e.user_id === total.user_id);
        data[index].total_rank = totalrank;
        totalrank++;
        data[index].total = total.total;
    });
    rank.data = data;
    Ranking.addRanking(rank,(err,monmsg)=>{
        if (err){
            console.log(err);
        } else {
        }
    })
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


function compareWeek(a,b) {
    if (a.this_week > b.this_week)
        return -1;
    if (a.this_week < b.this_week)
        return 1;
    return 0;
}

function compareTotal(a,b) {
    if (parseFloat(a.total) > parseFloat(b.total))
        return -1;
    if (parseFloat(a.total) < parseFloat(b.total))
        return 1;
    return 0;
}


module.exports.run = ()=>{
    start();
};