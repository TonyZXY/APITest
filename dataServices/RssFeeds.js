const logger = require('../functions/logger');
const CryptoCompare = require('./NewsFromCryptoCompare');
let Parser = require('rss-parser');
let parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'image'],
        ]
    }
});
const News = require('../module/News');

const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.database,config.options);


async function runBitcoinist() {
    let feed = await parser.parseURL('http://bitcoinist.com/feed/');
    let feeds = feed.items;
    let length = feeds.length;
    let num = 0;
    feeds.forEach(element => {
        let news = new News();
        news.title = element.title;
        news.author = element.creator;
        news.newsDescription = element.contentSnippet;
        news.imageURL = element.image.$.url;
        news.url = element.link;
        news.contentTag = element.categories;
        news.publishedTime = element.isoDate;
        news.source = 'Bitcoinist';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.url,(err,newsFromDB)=>{
            if (err){
                console.log(err);
                logger.databaseError("RssFeeds","bitcoinist",err);
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                            logger.databaseError("RssFeeds","bitcoinist",err);
                        }else {
                            num += 1;
                            if (num === length){
                                loginConsole("update bitcoinist");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        loginConsole("update bitcoinsit");
                    }
                }
            }
        });
    });
}


async function runBitcoinCom() {
    let feed = await parser.parseURL('https://news.bitcoin.com/feed/');
    let feeds = feed.items;
    let length = feeds.length;
    let num = 0;
    feeds.forEach(element=>{
        let news = new News();
        news.title = element.title;
        news.author = element.creator;
        news.newsDescription = element.contentSnippet;
        news.imageURL = element.content.split('"')[5];
        news.url = element.link;
        news.contentTag = element.categories;
        news.publishedTime = element.isoDate;
        news.source = 'Bitcoin.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.url,(err,newsFromDB)=>{
            if (err){
                console.log(err);
                logger.databaseError("RssFeeds","bitcoin.com",err);
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                            logger.databaseError("RssFeeds","bitcoi.com",err);
                        }else {
                            num += 1;
                            if (num === length){
                                loginConsole("update bitcoin.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        loginConsole("update bitcoin.com");
                    }
                }
            }
        });
    });
}


async function runCoinDesk() {
    let feed = await parser.parseURL('https://feeds.feedburner.com/CoinDesk');
    let feeds = feed.items;
    let length = feeds.length;
    let num = 0;
    feeds.forEach(element => {
        let news = new News();
        news.title = element.title;
        news.author = element.creator;
        news.newsDescription = element.contentSnippet;
        news.imageURL = 'https://www.coindesk.com/wp-content/themes/coindesk2/images/header-logo-new.png';
        news.url = element.link;
        news.contentTag = element.categories;
        news.publishedTime = element.isoDate;
        news.source = 'Coindesk';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.url,(err,newsFromDB)=>{
            if (err){
                console.log(err);
                logger.databaseError("RssFeeds","coindesk",err);
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                            logger.databaseError("RssFeeds","coindesk",err);
                        }else {
                            num += 1;
                            if (num === length){
                                loginConsole("update coindesk.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        loginConsole("update coindesk.com");
                    }
                }
            }
        });
    });
}



async function runBtcManager() {
    let feed = await parser.parseURL('https://btcmanager.com/feed/');
    let feeds = feed.items;
    let length = feeds.length;
    let num = 0;
    feeds.forEach(element => {
        let news = new News();
        news.title = element.title;
        news.author = element.creator;
        news.newsDescription = element.contentSnippet;
        news.imageURL = element.content.split('"',6)[5];
        news.url = element.link;
        news.contentTag = element.categories;
        news.publishedTime = element.isoDate;
        news.source = 'BtcManager';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.url,(err,newsFromDB)=>{
            if (err){
                console.log(err);
                logger.databaseError("RssFeeds","btcmanager",err);
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                            logger.databaseError("RssFeeds","btcmanager",err);
                        }else {
                            num += 1;
                            if (num === length){
                                loginConsole("update btcmanager.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        loginConsole("update btcmanager.com");
                    }
                }
            }
        });
    });
}



async function runEthnews() {
    let feed = await parser.parseURL('https://www.ethnews.com/rss.xml');
    let feeds = feed.items;
    let length = feeds.length;
    let num = 0;
    feeds.forEach(element => {
        let news = new News();
        let title = element.title.split('<h1>')[1];
        news.title = title.split('</h1>')[0];
        news.author = element.creator;
        news.newsDescription = element.contentSnippet;
        news.imageURL = element.content.split('"',2)[1];
        news.url = element.link;
        news.contentTag = element.categories;
        news.publishedTime = element.isoDate;
        news.source = 'ETHNews.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.url,(err,newsFromDB)=>{
            if (err){
                console.log(err);
                logger.databaseError("RssFeeds","ethnews",err);
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                            logger.databaseError("RssFeeds","ethnews",err);
                        }else {
                            num += 1;
                            if (num === length){
                                loginConsole("update ethnews.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        loginConsole("update ethnews.com");
                    }
                }
            }
        });
    });
}



async function runCointelegraph() {
    let feed = await parser.parseURL('https://cointelegraph.com/editors_pick_rss');
    let feeds = feed.items;
    let length = feeds.length;
    let num = 0;
    feeds.forEach(element => {
        let news = new News();
        news.title = element.title;
        news.author = element.creator;
        news.newsDescription = element.contentSnippet;
        news.imageURL = element.image.$.url;
        news.url = element.link;
        news.contentTag = element.categories;
        news.publishedTime = element.isoDate;
        news.source = 'CoinTelegraph';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.url,(err,newsFromDB)=>{
            if (err){
                console.log(err);
                logger.databaseError("RssFeeds","cointelegrap",err);
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                            logger.databaseError("RssFeeds","cointelegrap",err);
                        }else {
                            num += 1;
                            if (num === length){
                                loginConsole("update cointelegraph.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        loginConsole("update cointelegraph.com");
                    }
                }
            }
        });
    });
}


async function runGet(){
    runBitcoinCom();
    loginConsole("run bitcoin.com");
    logger.APIUpdateLog("RssFeeds", "bitcoin.com","bitcoin.com Updated");
    await delay(7000);
    runBitcoinist();
    loginConsole("run bitcoinist.com");
    logger.APIUpdateLog("RssFeeds", "bitcoinist","bitcoinist Updated");
    await delay(7000);
    runBtcManager();
    loginConsole("run btcmanager.com");
    logger.APIUpdateLog("RssFeeds", "btcmanager","btcmanager Updated");
    await delay(7000);
    runCoinDesk();
    loginConsole("run coindesk.com");
    logger.APIUpdateLog("RssFeeds", "coindesk","coindesk Updated");
    await delay(7000);
    runCointelegraph();
    loginConsole("run cointelegraph.com");
    logger.APIUpdateLog("RssFeeds", "cointelegraph","cointelegraph Updated");
    await delay(7000);
    runEthnews();
    loginConsole("run ethnews.com");
    logger.APIUpdateLog("RssFeeds", "ethnews","ethnews Updated");
    await delay(7000);
    // CryptoCompare.run();
    // loginConsole("run cryptocompare.com");
    // logger.APIUpdateLog("RssFeed","crypto","cryptocompare Updated");
    // await delay(7000);
}

const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};

async function getLoop(){
    let time = 1;
    do {
        runGet();
        await delay(300*1000);
        time ++;
    } while (true)
}

function loginConsole(msg) {
    console.log(
        new Date(Date.now()).toLocaleString() +"  " + msg
    );
}

module.exports.run = ()=>{
    getLoop();
};