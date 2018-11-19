const https = require('https');
const mongoose = require('mongoose');
const logger = require('../functions/logger');

const News = require('../module/News');


const config = require('../config');

mongoose.connect(config.database, config.options);

// get news from cryptocompare news api
function getNews() {
    https.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN', (res) => {
        let data = '';
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', () => {
            let dataJSON = JSON.parse(data);
            let newsList = dataJSON.Data;
            newsList.forEach(element => {
                let news = new News;
                news.title = element.title;
                news.newsDescription = element.body;
                if (element.author === null || element.author === undefined) {
                    news.author = 'N/A';
                } else {
                    news.author = element.author;
                }
                news.imageURL = element.imageurl;
                news.url = element.url;
                news.contentTag = element.tags.split('|');
                let d = Date(element.published_on);
                let date = new Date(d);
                news.publishedTime = date.toISOString();
                if (element.source_info.name === null) {
                    news.source = 'N/A';
                } else {
                    if (element.source_info.name === "CCN") {
                        news.source = "Crypto Coins News";
                    } else {
                        news.source = element.source_info.name;
                    }
                }
                news.languageTag = 'EN';
                news.localeTag = "";
                News.findNews(news.url, (err, newsFromDB) => {
                    if (err) {
                        console.log(err);
                        logger.databaseError('NewsFromCryptoCompare', 'server', err)
                    } else {
                        if (!newsFromDB) {
                            News.addNews(news, (err, msg) => {
                                if (err) {
                                    console.log(err);
                                    logger.databaseError('NewsFromCryptoCompare', 'server', err)
                                } else {
                                }
                            })
                        } else {
                        }
                    }
                });
            });
        });

        logger.APIUpdateLog('NewsFromCryptoCompare', 'CryptoCompare', 'Crypto Compare News Updated')
    });
}

const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};

// get data every 5 mins
async function getLoop() {
    let time = 1;
    do {
        loginConsole(time);
        getNews();
        await delay(5 * 60 * 1000);
        time++;
    } while (true)
}

module.exports.run = () => {
    getNews();
};


function loginConsole(times) {
    console.log(new Date(Date.now()).toLocaleString() + '  Run for ' + times + ' times.');
}

function consoleLog(msg) {
    console.log(new Date(Date.now()).toLocaleString() + " " + msg);
}