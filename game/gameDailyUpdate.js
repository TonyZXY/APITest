const db = require('../functions/postgredb');
const mongoose = require('mongoose');
const config = require('../config');
const GameCoin = require('./GameCoin');
const TotalRanking = require('../module/TotalRanking');
const CompetitionRanking = require('../module/CompetitionRanking');

mongoose.connect(config.database, config.options);



function compareTotal(a,b) {
    if (parseFloat(a.total) > parseFloat(b.total))
        return -1;
    if (parseFloat(a.total) < parseFloat(b.total))
        return 1;
    return 0;
}


function compareWeek(a,b) {
    if (a.this_week > b.this_week)
        return -1;
    if (a.this_week < b.this_week)
        return 1;
    return 0;
}


module.exports = {


    startCompetition: ()=>{
        db.gameGetAllAccount((err,dbmsg1)=>{
            if (err) {
                console.log(err);
            } else {
                let accounts = dbmsg1.rows;
                accounts.forEach( account =>{
                    let this_week = 100;
                    let last_week = account.total;
                    db.gameStartCompetition(account.user_id,this_week,last_week,(err,dbmsg2)=>{
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Start Competition');
                        }
                    })
                })
            }
        })
    },


    updateCompetition: ()=>{
        db.gameGetAllAccount((err,dbmsg1)=>{
            if (err){
                console.log(err);
            } else {
                let accounts = dbmsg1.rows;
                accounts.forEach( account => {
                    let this_week = Math.round((account.total/account.last_week *100)*100)/100;
                    db.gameDailyUpdateCompetition(account.user_id,this_week,(err,dbmsg2)=>{
                        if (err){
                            console.log(err);
                        } else {
                            console.log('Update This Week percentage');
                        }
                    })
                })
            }
        })
    },



    updateTotal: () => {
        GameCoin.getCoinList((err, monmsg) => {
            if (err) {
                console.log(err);
            } else {
                let btc = monmsg.find(e => e.coin_name.toLowerCase() === 'btc').current_price;
                let bch = monmsg.find(e => e.coin_name.toLowerCase() === 'bch').current_price;
                let ltc = monmsg.find(e => e.coin_name.toLowerCase() === 'ltc').current_price;
                let ctxc = monmsg.find(e => e.coin_name.toLowerCase() === 'ctxc').current_price;
                let powr = monmsg.find(e => e.coin_name.toLowerCase() === 'powr').current_price;
                let eth = monmsg.find(e => e.coin_name.toLowerCase() === 'eth').current_price;
                let iost = monmsg.find(e => e.coin_name.toLowerCase() === 'iost').current_price;
                let elf = monmsg.find(e => e.coin_name.toLowerCase() === 'elf').current_price;
                let etc = monmsg.find(e => e.coin_name.toLowerCase() === 'etc').current_price;
                let dta = monmsg.find(e => e.coin_name.toLowerCase() === 'dta').current_price;

                db.gameGetAllAccount((err, dbmsg1) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let accounts = dbmsg1.rows;
                        accounts.forEach(account => {
                            let weekly_total = parseFloat(account.aud) + parseFloat(account.btc) * btc +
                                parseFloat(account.eth) * eth + parseFloat(account.bch) * bch + parseFloat(account.ltc) * ltc +
                                parseFloat(account.ctxc) * ctxc + parseFloat(account.powr) * powr + parseFloat(account.iost) * iost +
                                parseFloat(account.elf) * elf + parseFloat(account.etc) * etc + parseFloat(account.dta) * dta;

                            db.gameDailyUpdateTotal(account.user_id, weekly_total, (err, dbmsg2) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Update Total number');
                                }
                            })
                        })
                    }
                })
            }
        })
    },



    checkWeekNumber: (callback)=>{
        db.gameCheckWeekNumber((err, number) => {
            if (err) {
                console.log(err);
                return callback(err);
            } else {
                let dataNumber = parseInt(number.rows[0].value);
                return callback(null,dataNumber);
            }
        })
    },



    updateTotalRanking: (number) => {
        db.gameGetAllAccount((err,dbmsg1)=>{
            if (err) {
                console.log(err);
            } else {
                let list = dbmsg1.rows;
                let date = new Date();
                let rank = {
                    title: 'Total Rank, Date: '+date.toLocaleString(),
                    time: date,
                    time_string: date.toISOString(),
                    date_number: number,
                };
                let data = [];
                let dailyRank = 1;
                list.sort(compareTotal);
                list.forEach( item => {
                    let user = {
                        user_id:item.user_id,
                        user_nickname:item.nick_name,
                        total_rank:dailyRank++,
                        total:item.total
                    };
                    data.push(user);
                });
                rank.data = data;
                TotalRanking.addRanking(rank,(err,monmsg)=>{
                    if (err){
                        console.log(err);
                    }else {
                    }
                })
            }
        })
    },


    updateCompetitionRanking: (number)=>{
        db.gameGetAllAccount((err,dbmsg1)=>{
            if (err){
                console.log(err);
            }else {
                let list = dbmsg1.rows;
                let date = new Date();
                let rank = {
                    title: 'Trading Competition Rank, Date: '+ date.toLocaleString(),
                    time: date,
                    time_string: date.toISOString(),
                    date_number: number,
                };
                let data = [];
                let ranking = 1;
                list.sort(compareWeek);
                list.forEach( item => {
                    let user = {
                        user_id:item.user_id,
                        user_nickname: item.nick_name,
                        daily_rank: ranking++,
                        this_week: item.this_week,
                    };
                    data.push(user);
                });
                rank.data = data;
                CompetitionRanking.addRanking(rank,(err,monmsg)=>{
                    if (err){
                        console.log(err);
                    } else {
                    }
                })
            }
        })
    },

    competitionRankingClean: (number)=>{
        let date = new Date();
        let rank = {
            title: 'No data available',
            time: date,
            time_string: date.toISOString(),
            date_number: number,
            data: [],
        };
        CompetitionRanking.addRanking(rank,(err,monmsg)=>{
            if (err){
                console.log(err);
            } else {
            }
        })
    }

};


