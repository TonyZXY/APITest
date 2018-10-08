const mongoose = require('mongoose');

const config = require('../config');
const data = require('../module/testData');

mongoose.connect(config.database,config.options);


const Ranking = require('../module/Ranking');



function test1() {
    let JSONData = data.data;
    JSONData.forEach( e =>{
        Ranking.addRanking(e,(err,msg)=>{
            if (err){
                console.log(err);
            } else {
                console.log(msg);
            }
        })
    })
}


// test1();

function compareWeek(a,b) {
    if (a.week_rank < b.week_rank)
        return -1;
    if (a.week_rank > b.week_rank)
        return 1;
    return 0;
}

function compareTotal(a,b) {
    if (a.total_rank < b.total_rank)
        return -1;
    if (a.total_rank > b.total_rank)
        return 1;
    return 0;
}

// objs.sort(compare);

function search() {
    Ranking.getRanking((err,msg)=>{
        if (err){
            console.log(err);
        } else {
            let rank = msg[0].data;
            console.log(msg[0]);
            rank.sort(compareTotal);
            let user = rank.find(e =>
                e.user_id === '1000005'
            );
            // console.log(user);
            let rankTotal = rank.slice(0,10);
            // console.log(rankTotal);
            rank.sort(compareWeek);
            let rankWeek = rank.slice(0,10);
            // console.log(rankWeek);
        }
    })
}


search();


function findUser() {
    Ranking.searchRanking(1000005,(err,msg)=>{
        if (err){
            console.log(err);
        } else {
            console.log(msg)
        }
    })
}

// findUser();