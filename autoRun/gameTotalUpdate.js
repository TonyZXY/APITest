const db = require('../functions/postgredb');
const data = require('../game/gameDailyUpdate');
const corn = require('node-cron');



const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};


// update total every day at 23:59:00
function run() {
    corn.schedule('0 59 * * * *', ()=>{
        data.checkWeekNumber((err,number)=>{
            if (err){
                console.log(err);
            } else {
                let dateNumber = number;
                data.updateTotal();
                delay(5000);
                data.updateTotalRanking(dateNumber);
                db.gameUpdateWeekNumber(dateNumber,(err,msg)=>{
                    if (err){
                        console.log(err);
                    } else {
                        console.log(msg.rows[0].value);
                    }
                })
            }
        })
    })
}


run();