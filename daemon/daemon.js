const fs = require('fs');
const { ethers } = require('ethers');
const express = require('express');
const args = require('yargs').argv;

const configs = JSON.parse(fs.readFileSync('daemon/config.json'));

let provider = ethers.getDefaultProvider('ropsten'); // ropsten testnet
// provider.getBlockNumber().then((blockNumber) => {
//     console.log("Current block number: " + blockNumber);
// });

const app = express();
app.use(express.json());

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

// express
// app.get("/", (req, res) => {
//     res.send("Hello, World!");
// });

app.get("/api/vault/:account", async (req, res) => {
    balance = await relayer.vault(req.params.account);
    res.json({ "balance": balance });
});

// TODO: implement contract's functions
// bmsg

app.post("/api/deposit", async (req, res) => {
    amount = req.body.amount;
    returnData = await relayerWithSigner.deposit({value: amount});
    res.json({ "returnData": returnData });
});

app.post("/api/withdraw", async (req, res) => {
    amount = req.body.amount;
    returnData = await relayerWithSigner.withdraw(amount);
    res.json({ "returnData": returnData });
});

// TODO: implement contract's functions
// tryDispatch
// trySingleCall

// TODO: implement BATCH service
// TODO: implement RTC service

// listen
port = args.port || 3000;
app.listen(port, () => console.log("Daemon of BATCHA!", "Port:", port));
