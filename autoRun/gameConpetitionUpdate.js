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


let task2 = corn.schedule('20 59 11 * * *', () => {
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


corn.schedule('14 59 16 16 11 *',()=>{
    data.startCompetition();
    data.checkWeekNumber((err,number)=>{
        if (err){
            console.log(err);
        } else {
            data.competitionRankingClean(number)
        }
    });
    task.start();
    task2.start();
});


corn.schedule('59 59 23 18 11 *',()=>{
    task.stop();
    task2.stop();
});



