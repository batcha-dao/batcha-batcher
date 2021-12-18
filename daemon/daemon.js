const fs = require('fs');
const { ethers } = require('ethers');
const express = require('express');

const configs = JSON.parse(fs.readFileSync('daemon/config.json'));

let provider = ethers.getDefaultProvider('ropsten'); // ropsten testnet
// provider.getBlockNumber().then((blockNumber) => {
//     console.log("Current block number: " + blockNumber);
// });

const app = express();

// set wallet
const ownerAddress = configs.ownerAddress;
const ownerPrivateKey = configs.ownerPrivateKey;
const wallet = new ethers.Wallet(ownerPrivateKey, provider);

// set `relayer` smart contract
const relayer = new ethers.Contract(
    configs.relayer,
    JSON.parse(fs.readFileSync('abis/Relayer.json'))["abi"],
    provider
);
const relayerWithSigner = relayer.connect(wallet);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(3000, () => console.log("Daemon of BATCHA!"));
