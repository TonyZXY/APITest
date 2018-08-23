const https = require('https');
const http = require('http');
const News = require("../module/News");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const logger = require('../functions/logger')

const config = require('../config');

mongoose.connect(config.database, config.options);


const postNews_options = {
    host: 'localhost',
    port: '3030',
    path: '/test/news',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};


const urlHead = 'https://newsapi.org/v2/';
const everyThing = 'everything';
const top = 'top-headlines';
const apiKey = '&apiKey=ca4d58033c08437482868da765e633f6';
const pageSize = '&pageSize=50';
const languageEN = '&language=en';
const languageCN = '&language=cn';
const bitcoin = '?q=bitcoin';
const sortByTime = '&sortBy=publishedAt';


const techcrunch = '?sources=techcrunch';
const arstechnica = '?sources=ars-technica';
const engadget = '?sources=engadget';
const cryptoCoinNews = '?sources=crypto-coins-news';
const wallStreetJournal = '?sources=the-wall-street-journal';
const ABCNews = '?sources=abc-news';

const getTechCrunch = {
    url: urlHead + everyThing + techcrunch + apiKey + pageSize + sortByTime + languageEN,
    from: '',
    contentTag: 'tech',
    languageTag: 'EN',
    imageURL: '',
    author: 'N/A',
    source: 'N/A'
};

const getArsTechnica = {
    url: urlHead + everyThing + arstechnica + apiKey + pageSize + sortByTime + languageEN,
    from: '',
    contentTag: 'tech',
    languageTag: 'EN',
    imageURL: '',
    author: 'N/A',
    source: 'N/A'
};

const getEngadget = {
    url: urlHead + everyThing + engadget + apiKey + pageSize + sortByTime + languageEN,
    from: '',
    contentTag: 'tech',
    languageTag: 'EN',
    imageURL: '',
    author: 'N/A',
    source: 'N/A'
};

const getCryptoCoinNews = {
    url: urlHead + everyThing + cryptoCoinNews + apiKey + pageSize + sortByTime + languageEN,
    from: '',
    contentTag: 'crypto',
    languageTag: 'EN',
    imageURL: '',
    author: 'N/A',
    source: 'N/A'
};

const getWallStreetJournal = {
    url: urlHead + everyThing + wallStreetJournal + apiKey + pageSize + sortByTime + languageEN,
    from: '',
    contentTag: 'business',
    languageTag: 'EN',
    imageURL: '',
    author: 'N/A',
    source: 'N/A'
};

const getBitCoin = {
    url: urlHead + top + bitcoin + sortByTime + apiKey + pageSize + languageEN,
    from: '',
    contentTag: 'crypto',
    languageTag: 'EN',
    imageURL: '',
    author: 'N/A',
    source: 'N/A'
};

const getABCNews = {
    url: urlHead + everyThing + ABCNews + sortByTime + apiKey + pageSize + languageEN,
    from: '',
    contentTag: 'general',
    languageTag: 'EN',
    imageURL: '',
    author: 'N/A',
    source: 'N/A'
};

const newsList = [getCryptoCoinNews, getBitCoin];

function getNews(content) {
    let httpUrl = content.url;
    if (content.from !== '') {

        httpUrl += '&from=' + content.from.toISOString();
    }
    console.log('Get Data From URL: ' + httpUrl);
    logger.APIUpdateLog("NewsFromNewsAPI", httpUrl, "Get Data From URL: " + httpUrl);
    https.get(httpUrl, (res) => {
        let data = '';
        res.on('error', (err) => {
            console.log("error in receiving data: " + err);
            logger.APIConnectionError('NewsFromNewsAPI', httpUrl, err);
            delay(2000);
            getLoop();
        });
        res.on('data', function (d) {
            data += d;
        });
        res.on('end', function () {
            let dataJSON = JSON.parse(data);
            console.log('Total find results: ' + dataJSON.totalResults);
            logger.APIUpdateLog("NewsFromNewsAPI", httpUrl, "Total find results: " + dataJSON.totalResults);
            if (dataJSON.totalResults !== 0) {
                let articles = dataJSON.articles;
                console.log('Numbers of Data Got: ' + articles.length);
                articles.forEach(function (element) {
                    let news = new News;
                    news.title = element.title;
                    news.newsDescription = element.description;
                    if (element.author === null) {
                        news.author = content.author;
                    } else {
                        news.author = element.author;
                    }
                    if (element.urlToImage === null) {
                        news.imageURL = content.imageURL;
                    } else {
                        news.imageURL = element.urlToImage;
                    }
                    news.url = element.url;
                    news.contentTag = [content.contentTag];
                    news.publishedTime = element.publishedAt;
                    if (element.source.name === null) {
                        news.source = content.source;
                    } else {
                        news.source = element.source.name;
                    }
                    news.languageTag = content.languageTag;
                    news.localeTag = "";
                    content.from = element.publishedAt;
                    News.findNews(news.url, (err, newsFromDB) => {
                        if (err) {
                            console.log(err);
                            logger.databaseError('NewsFromNewsAPI', 'server', err)
                        } else {
                            if (!newsFromDB) {
                                News.addNews(news, (err, msg) => {
                                    if (err) {
                                        console.log(err);
                                        logger.databaseError('NewsFromNewsAPI', 'server', err)
                                    } else {

                                    }
                                })
                            } else {

                            }
                        }
                    });
                });
                let date = new Date(articles[0].publishedAt);
                date.setSeconds(date.getSeconds() + 1);
                content.from = date;
            }
        });
    })
    logger.APIUpdateLog("NewsFromNewsAPI", httpUrl, "News API Updated")
}

const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};

async function loop() {
    for (i = 0; i < newsList.length; i++) {
        getNews(newsList[i]);
        await delay(5000);
    }
}

async function getLoop() {
    let time = 1;
    do {
        loginConsole(time);
        loop();
        await delay(840000);
        time++;
    } while (true)
}

function loginConsole(times) {
    console.log(new Date(Date.now()).toLocaleString() + '  Run for ' + times + ' times.');
}

module.exports.run = () => {
    getLoop();
};


//_________________________
