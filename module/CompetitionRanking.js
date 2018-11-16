const mongoose = require('mongoose');
const db = require('../functions/postgredb');


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
        this_week: {
            type: Number,
            require: true
        },
        daily_rank: {
            type: Number,
            require: true
        }
    }]
});


const CompetitionRanking = module.exports = mongoose.model('CompetitionRanking', rankingSchema);

module.exports = {
    addRanking: (ranking, callback) =>{
        CompetitionRanking.create(ranking, callback);
    },

    getRanking: (callback) => {
        CompetitionRanking.find(callback).limit(1).sort({_id:-1});
    }
};