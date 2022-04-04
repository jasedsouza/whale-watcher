const axios = require('axios');
const BigNumber = require('bignumber.js');

// setup api calls to etherscan and discord
const etherscan = axios.create({
    baseURL: 'https://api.etherscan.io/api'
});
const discord = axios.create({
    baseURL: 'https://discord.gg/'
});

// get config for application
let etherscan_apikey = '';
let watched_addresses_list = [''];
watched_addresses = watched_addresses_list.join(',');
let default_threshold_percentage = 5;
let eth_delta_threshold = 1000;
let eth_delta_percentage_threshold = 5;

// TODO: get this from database later. Make sure balances are stored as strings for BigInt problem
var eth_history = [
        {
            account: 'efg',
            nickname: 'egf',
            balance: '123' 
        },
        {
            account: 'abc',
            nickname: 'test abc',
            balance: '324'
        }
];

// Construct etherscan api request
let etherAccountBalancesQuery = '?module=account&action=balancemulti&address='+watched_addresses+'&tag=latest&apikey='+etherscan_apikey;

// Get watched account eth balances
etherscan.get(etherAccountBalancesQuery).then(resp => {
    resp.data.result.forEach(record => compareEtherBalance(record));
});

function compareEtherBalance(etherBalanceResult) {
    let storedAccount = eth_history.find( ({account}) => account === etherBalanceResult.account);

    // handle if API returns records not asked for
    if(storedAccount == null ) {
        console.error("Account: "+etherBalanceResult.account+" not in watchlist");
        return;
    }

    let delta = thresholdsCompare(storedAccount.balance, etherBalanceResult.balance);
    if (delta == null ) { return; }

    let trade = (delta > 0) ? ('BOUGHT') : ('SOLD');
    delta = (delta > 0) ? (delta) : (delta*-1);

    let thresholdNotification = storedAccount.nickname+" has just "+trade+" ETH Ξ"+delta+"\nPreviously detected balance on address "+storedAccount.account+" was Ξ"+storedAccount.balance+"\nCurrent ETH balance is now: Ξ"+etherBalanceResult.balance;
    // TODO: if passes threshold notify discord
    //notifyDiscordBot(thresholdNotification);
    console.info(thresholdNotification);

    // TODO: Update with latest balances
}

// returns delta if a threshold has been breached
function thresholdsCompare(oldBalance, newBalance){
    let bigOldBalance = new BigNumber(oldBalance);
    let bigNewBalance = new BigNumber(newBalance);
    let delta = new BigNumber(bigNewBalance.minus(bigOldBalance));
    let delta_percentage = delta.dividedBy(oldBalance).times(100);

    //console.info("delta:"+delta+"; old balance:"+oldBalance+"; new balance:"+newBalance+"; delta percentage:"+delta_percentage+"%");
    if(delta >= eth_delta_threshold || delta <= -eth_delta_threshold) { return delta; }
    if(delta_percentage >= eth_delta_percentage_threshold || delta_percentage <= -eth_delta_percentage_threshold) { return delta; }
}


/*
//Post message to Discord Bot
async function notifyDiscordBot(message) {

    let payload = { "content": message };

    let res = await discord.post('<Insert webhook endpoint>', payload);

    let data = res.data;
    console.log(data);
}

notifyDiscordBot();*/