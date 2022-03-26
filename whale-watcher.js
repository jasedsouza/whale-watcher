const axios = require('axios');
let etherscan_apikey = '<insert api key>';

const etherscan = axios.create({
    baseURL: 'https://api.etherscan.io/api'
});

let watched_addresses_array = ['add addresses'];
watched_addresses = watched_addresses_array.join(',');

// Construct etherscan api request
let getAccountBalances = '?module=account&action=balancemulti&address='+watched_addresses+'&tag=latest&apikey='+etherscan_apikey;

// Get watched account eth balances
etherscan.get(getAccountBalances).then(resp => {
    console.log(resp.data.result[0].balance);
});


//Post String into Discord Bot
async function makeGetRequest() {

    let payload = { "content": "<Insert String>" };

    let res = await axios.post('<Insert webhook endpoint>', payload);

    let data = res.data;
    console.log(data);
}

makeGetRequest();