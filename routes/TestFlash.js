const https = require('https');
const db = require('../functions/postgredb');




https.get('https://cryptogeekapp.com/api/getFlashWithLan?languageTag=EN&skip=0&limit=5', (res)=>{
    let data = '';
    res.on("error", (err)=>{
        console.log(err);
    });
    res.on("data", (d)=>{
        data +=d;
    });
    res.on("end", ()=>{
        let dataJSON = JSON.parse(data);
        // console.log(dataJSON);

        let ids = [];
        dataJSON.forEach( element =>{
            ids.push(element._id);
        });
        let likes = [];
        db.getLikesNumberList(ids,(err,res)=>{
            likes = res.rows;
            console.log(likes);
            dataJSON.forEach( flash =>{
                likes.forEach(e =>{
                    if (e.news_id === flash._id){
                        flash.like = e.likes;
                        flash.dislike = e.dislikes;
                    }
                })
            });
            console.log(dataJSON)
        });
    })
});