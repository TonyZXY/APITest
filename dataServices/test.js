const https = require('https');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/APITest'/**, options**/);

const News = require('./NewsTest');


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
            if (element.author === null) {
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
                news.source = element.source_info.name;
            }
            news.languageTag = 'EN';
            news.localeTag = "";
            News.addNews(news,(err,msg)=>{
                if (err){
                    console.log(err);
                } else {
                    console.log(msg);
                }
            })
        });
    });
});