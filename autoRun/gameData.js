const gameCoin = require('../game/gameCoinList');
const gameStopLoss = require('../game/gameStopLoss');
const gameAlert = require('../game/gameAlert');



// call this function to run game data services
function run() {
    gameCoin.run();
    gameStopLoss.run();
    gameAlert.run();
}


run();
