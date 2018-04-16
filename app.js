var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());


//import news and video module
var News = require('./module/news.js');
var Video = require('./module/video.js');


//connecte to database
mongoose.connect('mongodb://localhost/news');
var db = mongoose.connection;

//nothing
app.get('/', function(req,res){
    res.send('helloworld');
});

//get news list (all news)
app.get('/api/news',function(req,res){
    News.getNewsList(function(err,newsList){
        if(err){
            throw err;
        }
        res.json(newsList);
    })
})

//get news by ID
app.get('/api/news/:_id',function(req,res){
    News.getNewsByID(req.params._id,function(err,news){
        if(err){
            throw err;
        }
        res.json(news);
    })
})

//add news
app.post('/api/news', function(req,res){
    var newsAdded = req.body;
    News.addNews(newsAdded, function(err,news){
        if(err){
            throw err;
        }
        res.json(news);
    })
})

//update news
app.put('/api/news/:_id', function(req,res){
    var id = req.params._id;
    var news = req.body;
    News.updateNews(id,news,{}, function(err,news){
        if(err){
            throw err;
        }
        res.json(news);
    })
})

//delete news
app.delete('/api/news/:_id', function(req,res){
    var id = req.params._id;
    News.deleteNews(id, function(err,news){
        if(err){
            throw err;
        }
        res.json(news);
    })
})

//get video List
app.get('/api/videos',function(req,res){
    Video.getVideos(function(err,video){
        if(err){
            throw err;
        }
        res.json(video);
    })
})

// add video
app.post('/api/videos', function(req,res){
    var videoAdded = req.body;
    Video.addVideo(videoAdded, function(err,video){
        if(err){
            throw err;
        }
        res.json(video);
    })
})

//update video
app.put('/api/videos/:_id', function(req,res){
    var id = req.params._id;
    var videoAdded = req.body;
    Video.updateVideo(id,videoAdded,{}, function(err,video){
        if(err){
            throw err;
        }
        res.json(video);
    })
})

//get video by id
app.get('/api/videos/:_id',function(req,res){
    Video.getVideoByID(req.params._id,function(err,video){
        if(err){
            throw err;
        }
        res.json(video);
    })
})

//delete video
app.delete('/api/videos/:_id', function(req,res){
    var id = req.params._id;
    Video.deleteVideo(id, function(err,video){
        if(err){
            throw err;
        }
        res.json(video);
    })
})


//start application
app.listen(3000);
console.log('Running on port 3000');

