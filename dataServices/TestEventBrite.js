const https = require('https');
const Event = require('../module/Event');

let url = 'https://www.eventbriteapi.com/v3/events/search/?organizer.id=14851725402&include_unavailable_events=true&token=VKY7KRN2LTUKG2EAFULE';

let url4 = 'https://www.eventbriteapi.com/v3/organizers/14851725402/events/?order_by=start_desc&token=VKY7KRN2LTUKG2EAFULE';

let url2 = 'https://www.eventbriteapi.com/v3/venues/26554254/?token=VKY7KRN2LTUKG2EAFULE';

const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.database, config.options).then(console.log("connected"));

https.get(url4,(res)=>{
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

        let result = JSONData.events[0];
        // console.log(result);
        let event = new Event();
        event.eventID = result.id;
        event.eventName = result.name.text;
        event.eventDescription = result.description.text;
        event.eventURL = result.url;
        event.eventStartTime = new Date(result.start.local);
        event.eventEndTime = new Date(result.end.local);
        event.eventCreatedTime = new Date(result.created);
        event.eventUpdatedTime = new Date(result.changed);
        event.eventImageURL = result.logo.original.url;



        // console.log(event);

        https.get('https://www.eventbriteapi.com/v3/venues/'+result.venue_id+'/?token=VKY7KRN2LTUKG2EAFULE',(response)=>{
            response.on("error", (err)=>{
                console.log(err);
            });

            let data2 = '';
            response.on("data", d=>{
                data2 += d;
            });

            response.on("end", ()=>{
                let JS = JSON.parse(data2);

                // console.log(JS);
                event.eventVenue = JS.name;
                event.eventAddress = JS.address.address_1;
                event.eventCity = JS.address.city;
                event.eventLati = JS.address.latitude;
                event.eventLong = JS.address.longitude;

                https.get('https://www.eventbriteapi.com/v3/organizers/14851725402/?token=VKY7KRN2LTUKG2EAFULE',(re)=>{
                    re.on("error", (err)=>{
                        console.log(err);
                    });

                    let data3 = '';
                    re.on("data", d=>{
                        data3 += d;
                    });

                    re.on("end", ()=>{
                        // console.log(data3);
                        let JSO = JSON.parse(data3);
                        // console.log(JSO);
                        event.eventHost = JSO.name;
                        event.eventHostPage = JSO.url;


                        // console.log(event);
                        Event.addEvent(event,(err,msg)=>{
                            if (err) {
                                console.log(err);
                            } else {
                                Event.getAllEvent((err,msg2)=>{
                                    if (err){
                                        console.log(err);
                                    } else {
                                        console.log(msg2);
                                    }
                                })
                            }
                        })

                    });
                });

            });
        })

    })
});