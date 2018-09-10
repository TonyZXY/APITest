const https = require('https');

let url = 'https://api.meetup.com/2/events?key=4e46424491c5b3830231b2ce4ec6c&group_urlname=ny-tech&sign=true';


https.get(url, (res)=>{
    res.on("error", (err)=>{
        console.log(err);
    });

    let data = '';

    res.on("data", d=>{
        data += d;
    });

    res.on("end", () =>{
        let JSONData = JSON.parse(data);

        // console.log(JSONData.meta);
        console.log(JSON.stringify(JSONData.results[0]));
    })
});