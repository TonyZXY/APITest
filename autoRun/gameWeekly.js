const db = require('../functions/postgredb');
const data = require('../dataServices/gameWeeklyTest');
const corn = require('node-cron');

let weekNumber = 1;





function run() {
    corn.schedule('0 0-23 * * *',()=>{
        db.gameCheckWeekNumber((err,msg)=>{
            if (err){
                console.log(err);
            } else {
                weekNumber = parseInt(msg.rows[0].value);
                data.run(weekNumber);
                db.gameUpdateWeekNumber(weekNumber,(err,dbmsg)=>{
                    if (err){
                        console.log(err);
                    } else {
                        weekNumber = parseInt(dbmsg.rows[0].value);
                        console.log(weekNumber);
                    }
                });
            }
        });
    })
}


run();



