function delayAlgorithm(times, delayTime){
    //TODO: send notification for the first time
    //TODO: After first notification ,1/2 hour next notification
    //After second notification, 2 hour
    // 4 hour 
    // 8
    // 16
    // 24

    
   
}

var minutespartB = 1;
var times = 0
the_interval = minutespartB * 60*1000;
setInterval(function(){
    if(times === 0){
        console.log("send this notification" + times)
    } else{
        times ++;
        setTimeout(() =>{
            console.log("send this notification" + times)
        },2*60*1000)
        if(times === 1){
            times ++;
            setTimeout(() =>{
                console.log("send this notification" + times)
            },3*60*1000)
        }
    }
}, the_interval)


