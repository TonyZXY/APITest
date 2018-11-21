const data = require('../game/gameDailyUpdate');
const corn = require('node-cron');



// use this function to set up delay
const delay = amount => {
    return new Promise(resolve => {
        setTimeout(resolve, amount);
    });
};



// update competition ranking every day at every hour 59:20
let task = corn.schedule('20 59 * * * *', () => {
    data.checkWeekNumber((err, number) => {
        if (err) {
            console.log(err);
        } else {
            // update competition data
            data.updateCompetition();
            delay(5000);
            // add new competition ranking data
            data.updateCompetitionRanking(number);
        }
    })
}, {
    scheduled: false
});



// update competition ranking every day at 11:59:20
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


// update competition ranking every day at 11:59:20
let task3 = corn.schedule('20 59 17 * * *', () => {
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



// start competition by modify this schedule
//             ss mm hh dd MM day-of-week
corn.schedule('14 59 17 20 11 *',()=>{
    // start competition by setting things to default value
    data.startCompetition();
    data.checkWeekNumber((err,number)=>{
        if (err){
            console.log(err);
        } else {
            // add blank
            data.competitionRankingClean(number)
        }
    });
    // start competition update ranking tasks.
    task.start();
    // task2.start();
    // task3.start();
});


// set this schedule to stop trading competition
//             ss mm hh dd MM day-of-week
corn.schedule('59 59 17 21 11 *',()=>{
    task.stop();
    // task2.stop();
    // task3.stop();
});



