const db = require('../functions/postgredb');
const data = require('../dataServices/gameWeeklyTest');
const corn = require('node-cron');

let weekNumber = 1;





function run() {
    db.gameCheckWeekNumber((err,msg)=>{
        if (err){
            console.log(err);
        } else {
            weekNumber = parseInt(msg.rows[0].value);
            console.log(weekNumber);
        }
    });

    corn.schedule('59 23 * * Sunday',()=>{
        data.run(weekNumber);
        db.gameUpdateWeekNumber(weekNumber,(err,dbmsg)=>{
            if (err){
                console.log(err);
            } else {
                weekNumber = parseInt(dbmsg.rows[0].value);
                console.log(weekNumber);
            }
        });
    })

}


run();




module.exports.weekNumber = weekNumber;