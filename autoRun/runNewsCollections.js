const NewsAPI = require('../dataServices/NewsFromNewsAPI');
const CryptoCoinNews = require('../dataServices/NewsFromCryptoCompare');
const RSSFeed = require('../dataServices/RssFeeds');
const alg = require('../dataServices/coinAlgorithm');
const avg = require('../dataServices/CoinGlobalAvg');



function run() {
    NewsAPI.run();
    CryptoCoinNews.run();
    RSSFeed.run();
    alg.run();
    avg.run();
}


run();