const db = require('../functions/postgredb');
const data = require('../dataServices/gameDailyUpdate');
const corn = require('node-cron');

const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};


let task = corn.schedule('20 */5 * * * *', () => {
    data.checkWeekNumber((err, number) => {
        if (err) {
            console.log(err);
        } else {
            data.updateCompetition();
            delay(5000);
            data.updateCompetitionRanking(number);
        }
    })
}, {
    scheduled: false
});


corn.schedule('40 25 10 8 11 *',()=>{
    data.startCompetition();
    task.start();
});


corn.schedule('59 59 23 10 11 *',()=>{
    task.stop();
});



