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
mongoose.connect('mongodb://localhost/APITest');


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
        news.source = 'bitcoinist.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.title,news.publishedTime,(err,newsFromDB)=>{
            if (err){
                console.log(err)
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                        }else {
                            num += 1;
                            if (num === length){
                                console.log("update bitcoinist");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        console.log("update bitcoinsit");
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
        news.source = 'bitcoin.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.title,news.publishedTime,(err,newsFromDB)=>{
            if (err){
                console.log(err)
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                        }else {
                            num += 1;
                            if (num === length){
                                console.log("update bitcoin.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        console.log("update bitcoin.com");
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
        news.source = 'coindesk.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.title,news.publishedTime,(err,newsFromDB)=>{
            if (err){
                console.log(err)
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                        }else {
                            num += 1;
                            if (num === length){
                                console.log("update coindesk.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        console.log("update coindesk.com");
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
        news.source = 'btcmanager.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.title,news.publishedTime,(err,newsFromDB)=>{
            if (err){
                console.log(err)
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                        }else {
                            num += 1;
                            if (num === length){
                                console.log("update btcmanager.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        console.log("update btcmanager.com");
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
        news.source = 'ethnews.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.title,news.publishedTime,(err,newsFromDB)=>{
            if (err){
                console.log(err)
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                        }else {
                            num += 1;
                            if (num === length){
                                console.log("update ethnews.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        console.log("update ethnews.com");
                    }
                }
            }
        });
    });
}



async function runCointelegraph() {
    let feed = await parser.parseURL('https://cointelegraph.com/rss');
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
        news.source = 'cointelegraph.com';
        news.languageTag = 'EN';
        news.localeTag = '';
        News.findNews(news.title,news.publishedTime,(err,newsFromDB)=>{
            if (err){
                console.log(err)
            } else {
                if (!newsFromDB) {
                    News.addNews(news,(err,msg)=>{
                        if (err) {
                            console.log(err);
                        }else {
                            num += 1;
                            if (num === length){
                                console.log("update cointelegraph.com");
                            }
                        }
                    })
                } else {
                    num += 1;
                    if (num === length){
                        console.log("update cointelegraph.com");
                    }
                }
            }
        });
    });
}


async function runGet(){
    runBitcoinCom();
    console.log("run bitcoin.com");
    await delay(7000);
    runBitcoinist();
    console.log("run bitcoinist.com");
    await delay(7000);
    runBtcManager();
    console.log("run btcmanager.com");
    await delay(7000);
    runCoinDesk();
    console.log("run coindesk.com");
    await delay(7000);
    runCointelegraph();
    console.log("run cointelegraph.com");
    await delay(7000);
    runEthnews();
    console.log("run ethnews.com");
    await delay(7000);
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

getLoop();