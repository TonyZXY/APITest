const mongoose = require('mongoose');
const db = require('../functions/postgredb');


//store total rank schema and function that read and write data from mongodb

const rankingSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        require: true
    },
    time_string: {
        type: String,
        require: true
    },
    date_number: {
        type: Number,
        require: true
    },
    data: [{
        user_id: {
            type: String,
            require: true
        },
        user_nickname: {
            type: String,
            require: true
        },
        total: {
            type: Number,
            require: true
        },
        total_rank: {
            type: Number,
            require: true
        }
    }]
});


const TotalRanking = module.exports = mongoose.model('TotalRanking', rankingSchema);

module.exports = {
    addRanking: (ranking, callback) =>{
        TotalRanking.create(ranking, callback);
    },

    // get the latest record of the total rank
    getRanking: (callback) => {
        TotalRanking.find(callback).limit(1).sort({date_number:-1});
    }
};