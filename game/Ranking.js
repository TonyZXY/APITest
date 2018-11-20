const mongoose = require('mongoose');
const db = require('../functions/postgredb');

// store ranking schema and functions for editing
// not use

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
    week_number: {
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
        week_percentage: {
            type: Number,
            require: true
        },
        week_rank: {
            type: Number,
            require: true
        },
        total_rank: {
            type: Number,
            require: true
        }
    }]
});


const Ranking = module.exports = mongoose.model('Ranking', rankingSchema);


module.exports = {
    addRanking: (ranking, callback) => {
        Ranking.create(ranking, callback);
    },

    getRanking: (callback) => {
        let weekNumber;
        db.gameCheckWeekNumber((err,dbmsg)=>{
            if (err){
                console.log(err);
            } else {
                weekNumber = parseInt(dbmsg.rows[0].value) - 1;
                Ranking.find({
                    week_number: weekNumber
                },callback);
            }
        });
    },

    deleteByID: (id, callback) => {

    },


};
