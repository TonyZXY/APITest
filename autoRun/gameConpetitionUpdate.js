const data = require('../game/gameDailyUpdate');
const corn = require('node-cron');

const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};


let task = corn.schedule('20 59 23 * * *', () => {
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


corn.schedule('14 00 10 8 11 *',()=>{
    data.startCompetition();
    task.start();
});


corn.schedule('59 59 23 13 11 *',()=>{
    task.stop();
});



