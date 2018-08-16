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





async function runCointelegraph() {
    let feed = await parser.parseURL('https://cointelegraph.com/rss/tag/bitcoin');
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
        console.log(news);
        // News.findNews(news.url,(err,newsFromDB)=>{
        //     if (err){
        //         console.log(err);
        //         logger.databaseError("RssFeeds","cointelegrap",err);
        //     } else {
        //         if (!newsFromDB) {
        //             News.addNews(news,(err,msg)=>{
        //                 if (err) {
        //                     console.log(err);
        //                     logger.databaseError("RssFeeds","cointelegrap",err);
        //                 }else {
        //                     num += 1;
        //                     if (num === length){
        //                         loginConsole("update cointelegraph.com");
        //                     }
        //                 }
        //             })
        //         } else {
        //             num += 1;
        //             if (num === length){
        //                 loginConsole("update cointelegraph.com");
        //             }
        //         }
        //     }
        // });
    });
}

runCointelegraph()