
const mongoose = require('mongoose');

var coinNotificationIosDeviceSchema = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    deviceID: {
        type: [String],
        require:true
    }
});

var NotificationIOS = module.exports = mongoose.model('coinNotificationIosDevice', coinNotificationIosDeviceSchema);

module.exports.getNotificationIOSDevice = (callback) => {
    NotificationIOS.find(callback);
};

module.exports.getNotificationIOSDeviceByUserID = (userID, callback) => {
    NotificationIOS.findOne({userID:userID}, callback)
}

module.exports.addNotificationIOSUser = (user,deviceToken, callback)=> {

    NotificationIOS.findOne({userID:user.userID}, (err, userInDB)=>{
        if(err){
            console.log(err)
        }else if(!userInDB){
            NotificationIOS.create(user,callback)
        } else{
            let checkSame = false;
            userInDB.deviceID.forEach(device => {
                if(device === deviceToken){
                    checkSame = true;
                }
            });

            if(!checkSame){
                NotificationIOS.findOneAndUpdate({userID:user.userID},{
                    $push:{
                        deviceID:deviceToken
                    }
                },{new: true},callback)
            }


        }

    })
}


