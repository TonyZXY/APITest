const db = require('../functions/postgredb');

let list = [{
    status:'buy',
    coinName:'Bitcoin',
    coinAddName:'BTC',
    exchangeName:'BTCMarket',
    tradingPairName:'ETH',
    singlePrice:150.123,
    amount: 40.0123,
    currencyAUD:12323.123123,
    currencyUSD:12000.231231,
    currencyJPY:124142414,
    currencyEUR:10000.123123,
    currencyCNY:12123231,
    date:'2018-08-21T19:19:40.058Z',
    note:'note 1'
},{
    status:'buy',
    coinName:'Bitcoin',
    coinAddName:'BTC',
    exchangeName:'BTCMarket',
    tradingPairName:'ETH',
    singlePrice:150.123,
    amount: 40.0123,
    currencyAUD:12323.123123,
    currencyUSD:12000.231231,
    currencyJPY:124142414,
    currencyEUR:10000.123123,
    currencyCNY:12123231,
    date:'2018-08-21T19:19:50.058Z',
    note:'note 2'
},{
    status:'buy',
    coinName:'Bitcoin',
    coinAddName:'BTC',
    exchangeName:'BTCMarket',
    tradingPairName:'ETH',
    singlePrice:150.123,
    amount: 40.0123,
    currencyAUD:12323.123123,
    currencyUSD:12000.231231,
    currencyJPY:124142414,
    currencyEUR:10000.123123,
    currencyCNY:12123231,
    date:'2018-08-21T19:19:54.058Z',
    note:'note 3'
}];


// db.addTransactionList(100003,list,(err,msg)=>{
//     if (err){
//         console.log(err);
//     }else {
//         console.log(msg.rows);
//     }
// });


let coin = {
    transactionID:100000004,
    status:'buy',
    coinName:'Bitcoin',
    coinAddName:'BTC',
    exchangeName:'BTCMarket',
    tradingPairName:'ETH',
    singlePrice:150.123,
    amount: 40.0123,
    currencyAUD:12323.123123,
    currencyUSD:12000.231231,
    currencyJPY:124142414,
    currencyEUR:10000.123123,
    currencyCNY:12123231,
    date:'2018-08-21T19:19:54.058Z',
    note:'note 3'
};

db.updateTransaction(coin,(err,msg)=>{
    if (err){
        console.log(err)
    } else {
        console.log(msg.rows);
    }
});



// db.getAllTransaction((err,msg)=>{
//     if (err){
//         console.log(err);
//     } else {
//         console.log(msg.rows);
//     }
// });