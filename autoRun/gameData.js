const gameCoin = require('../game/gameCoinList');
const gameStopLoss = require('../game/gameStopLoss');
const gameAlert = require('../game/gameAlert');


function run() {
    gameCoin.run();
    gameStopLoss.run();
    gameAlert.run();
}


run();
