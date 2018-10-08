const gameCoin = require('../dataServices/gameCoinList');
const gameStopLoss = require('../dataServices/gameStopLoss');
const gameAlert = require('../dataServices/gameAlert');


function run() {
    gameCoin.run();
    gameStopLoss.run();
    gameAlert.run();
}


run();
