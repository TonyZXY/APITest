const NewsAPI = require('../dataServices/NewsFromNewsAPI');
const CryptoCoinNews = require('../dataServices/NewsFromCryptoCompare');
const RSSFeed = require('../dataServices/RssFeeds');
const alg = require('../dataServices/coinAlgorithm');
const avg = require('../dataServices/CoinGlobalAvg');
const event = require('../dataServices/EventData');


function run() {
    NewsAPI.run();
    RSSFeed.run();
    alg.run();
    avg.run();
    event.run();
}


run();