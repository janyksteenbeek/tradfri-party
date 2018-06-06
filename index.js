require('dotenv').config();

let party = require('./party/Party').create(
    require('node-tradfri').create({
        coapClientPath: process.env.TRADFRI_COAPCLIENT || require('path').resolve(__dirname, 'lib/coap-client-mac/coap-client'),
        identity: process.env.TRADFRI_IDENTITY,
        preSharedKey: process.env.TRADFRI_PRESHAREDKEY,
        hubIpAddress: process.env.TRADFRI_HUBIP
    }),
    process.env.PARTY_INTERVAL
);

party.discover().then(() => party.start());