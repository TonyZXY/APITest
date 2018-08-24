const delay = (amount) => {
    return new Promise((resolve) => {
        setTimeout(resolve, amount);
    });
};

let array = [1, 2, 3, 4];
let time = 1;

async function forLoop() {
    for (let i = 0; i < 17; i++) {
        loginConsole("forLoop: " + (i + 1));
        await delay(1000);
    }
}

async function forCurrency() {
    for (let j = 0; j < array.length; j++) {
        loginConsole('forCurrency: ' + (j + 1));
        await forLoop();
    }
}


function start() {
    loginConsole('All: ' + time);
    forCurrency().then(() => {
        delay(5000).then(() => {
            time++;
            start();
        });
    })
}

start();

// forLoop();

function loginConsole(msg) {
    console.log(
        new Date(Date.now()).toLocaleString() + " " + msg
    );
}


async function startcall() {
    let array = [];
    loginConsole(" start Loop for " + time);
    logger.APIUpdateLog("CoinGlobalAvg", "MarketCap", "MarketCap Gobal Average Start loop for " + time);
    time++;
    forCurrency(array).then(() => {

    });
    logger.APIUpdateLog("CoinGlobalAvg", "MarketCap", "MarketCap Gobal Average Added to database");
    await delay(300000);

}
