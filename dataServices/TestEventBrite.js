const https = require('https');

let url = 'https://www.eventbriteapi.com/v3/events/search/?token=VKY7KRN2LTUKG2EAFULE';

let url2 = 'https://www.eventbriteapi.com/v3/venues/26554254/?token=VKY7KRN2LTUKG2EAFULE';

https.get(url2,(res)=>{
    res.on("error", (err)=>{
        console.log(err);
    });

    let data = '';
    res.on("data", d=>{
        data += d;
    });

    res.on("end", ()=>{
        // console.log(data);
        let JSONData = JSON.parse(data);

        // console.log(JSONData.pagination);

        // console.log(JSON.stringify(JSONData.events[0]));

        console.log(JSON.stringify(JSONData.address))
    })
});