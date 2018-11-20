const mongoose = require('mongoose');


// store Coin schema and functions for coin data (global average)

const coinSchema = mongoose.Schema({
    id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    symbol: {
        type: String
    },
    website_slug: String,
    rank: Number,
    circulating_supply: Number,
    total_supply: Number,
    max_supply: Number,
    quotes: [{
        currency: String,
        data: {
            price: Number,
            volume_24h: Number,
            market_cap: Number,
            percent_change_1h: Number,
            percent_change_24h: Number,
            percent_change_7d: Number
        }
    }],
    last_updated: Number
});

const Coin = module.exports = mongoose.model('Coin', coinSchema);


module.exports.getCoinList = (callback) => {
    Coin.find(callback).sort({rank: 1});
};

module.exports.addCoins = (coins, callback) => {
    coins.forEach(coin => {
        Coin.findOneAndUpdate({id: coin.id}, coin, {upsert: true, returnNewDocument: true}, callback);
    });
};

// get coin list with different currency
module.exports.getCoinListCurrency = (currency, callback) => {
    Coin.aggregate([{
        $project: {
            quotes: {
                $filter: {
                    input: "$quotes",
                    as: "quotes",
                    cond: {
                        $eq: ["$$quotes.currency", currency]
                    }
                }
            },
            id: 1,
            circulating_supply: 1,
            last_updated: 1,
            max_supply: 1,
            name: 1,
            rank: 1,
            symbol: 1,
            total_supply: 1,
            website_slug: 1
        }
    }], callback).sort({rank: 1});
};

module.exports.deleteCoinByName = (name, callback) => {
    Coin.remove({
        name: name
    }, callback)
};

module.exports.getOneCoin = (symbol, callback) => {
    Coin.findOne({
        symbol: symbol
    }, callback)
};
