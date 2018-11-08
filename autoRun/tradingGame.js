const gameCoinList = require('../dataServices/gameCoinList');
const gameStopLoss = require('../dataServices/gameStopLoss');
const gameAlert    = require('../dataServices/gameAlert'   );






function run() {
    gameCoinList.run();


    gameAlert.run();
    gameStopLoss.run();
}



