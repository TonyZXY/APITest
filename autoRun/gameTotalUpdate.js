const db = require('../functions/postgredb');
const data = require('../dataServices/gameDailyUpdate');
const corn = require('node-cron');



const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};

function run() {
    corn.schedule('0 */5 * * * *', ()=>{
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