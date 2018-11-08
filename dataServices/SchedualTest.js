let corn = require('node-cron');
let weekly = require('../dataServices/gameWeeklyTest');
let CoinData = require('../dataServices/gameCoinList');

let weekNumber = 9;
// let task = corn.schedule('37-59 13 * * Friday',()=>{
//     weekly.run(weekNumber);
//     weekNumber ++;
//
//     loginConsole("run" + weekNumber);
// });






// let weekNumber2 = 9;
//
// let coinDataTask = corn.schedule('* * * * *',()=>{
//
//     CoinData.runOneTime();
//     loginConsole('run for '+weekNumber2+' times');
//     weekNumber2++;
//     loginConsole('next Time will be '+weekNumber2);
// });
//
//
// function loginConsole(msg) {
//     console.log(
//         new Date(Date.now()).toLocaleString() + " " + msg
//     );
// }
//
//
// function run(){
//     task.start();
//     coinDataTask.start();
//
// }

//
// run();

let task = corn.schedule('* * * * * *',()=>{
    console.log(new Date());
},{
    scheduled: false
});


corn.schedule('37 15 * * *',()=>{
    task.start();
});

corn.schedule('15 16 * * *',() =>{
    task.stop();
});