const db = require('../functions/postgredb');


// db.gameUpdateAccountAmount('10000001','sell',10.20,'eth',100,(err,msg)=>{
//     if (err) {
//         console.log(err.code);
//         if (err.code === '23514'){
//             console.log("out of limit");
//         }
//     } else {
//         console.log(msg.rows);
//     }
// });


let coinRecord = {
    status: 'buy',
    coinName: 'Bitcoin',
    coinAddName: 'btc',
    exchangeName: 'Huobi Australia',
    tradingPairName: 'aud',
    singlePrice: 100,
    amount: 10,
    date: new Date(),
    note: 'test for note'
};


// db.gameUpdateAccountAmount('10000001',coinRecord.status,coinRecord.amount,coinRecord.coinAddName,coinRecord.singlePrice*coinRecord.amount,(err,msg)=>{
//     if (err) {
//         if (err.code === '23514'){
//             console.log("out of limit");
//         } else {
//             console.log(err);
//         }
//     } else {
//         db.gameAddTransactionList('10000001',coinRecord,(err,msg2)=>{
//             if (err){
//                 console.log(err);
//             } else {
//                 console.log({
//                     transaction:msg2.rows[0],
//                     account:msg.rows[0]
//                 });
//             }
//         })
//     }
// });

// // Check if user can add new set
// function test() {
//     db.gameSelectSetLimitNumber('10000001',(err,msg1)=>{
//         if (err) {
//             console.log(err);
//         } else {
//             // console.log(msg1.rows[0].sets);
//             db.gameGetSetsWithCoin('10000001','btc',(err,msg2)=>{
//                 if (err){
//                     console.log(err);
//                 } else {
//                     // console.log(msg2.rows);
//                     // console.log(msg2.rows.length);
//                     if (msg2.rows.length<msg1.rows[0].sets){
//                         console.log(true);
//                     } else {
//                         console.log(false);
//                     }
//                 }
//             })
//         }
//     })
// }


// function test(){
//     let date = new Date();
//
//     db.gameCompleteStopLossSet(2000000,date,(err,msg)=>{
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(msg.rows);
//         }
//
//     })
// }

// function test() {
//     let alerts = [{
//         alert_id: 2000000000,
//         user_id: 10000001,
//         coin_name: 'btc',
//         price: 200,
//         status: true,
//         isgreater: 2
//     },
//         {
//             alert_id: 2000000001,
//             user_id: 10000001,
//             coin_name: 'eth',
//             price: 200,
//             status: false,
//             isgreater: 2
//         }];
//
//     db.gameUpdateAlertStatus(alerts, (err, msg) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(msg.rows);
//         }
//     })
//
//     // db.gameGetAlert(10000001,(err,msg)=>{
//     //     console.log(msg.rows);
//     // })
//
// }

function test(){
    db.gameGetAlertWithNotification((err,msg)=>{
        console.log(msg.rows);
    })
}


test();