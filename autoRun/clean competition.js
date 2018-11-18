const data = require('../game/gameDailyUpdate');




data.checkWeekNumber((err,number)=>{
    if (err){
        console.log(err);
    } else {
        // add blank
        data.competitionRankingClean(number)
    }
});