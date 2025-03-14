# Web3 Challenge.

## Summary

Smart contract for NFT ownership with gating mechanism.

## Features

- NFT must be staked for at least 1 week before it can pass the gating requirements.
- Delegated wallets should be supported to prove ownership.
- Users should not be able to register multiple emails by simply delegating to different wallets.

## Prerequisites

- Node.js v20.18.3
- Solidity v0.8.20
- Openzeppelin v5
- Hardhat
- Prepare .env file based on the .env.example.
```
RPC_URL="RPC endpoint with API key"
PRIVATE_KEY="Account private key"
ETHERSCAN_API_KEY="Etherscan API key"
```
---


## Run the project

1. Clone the repository from Github:
```
git clone https://github.com/profullstackdeveloper/marketplace-reservation.git
cd marketplace-reservation
cd web3-challenge
```
2. Install packages
```
npm install
```
3. Run the project
```
npm run start:node
npm run compile
npm run deploy:local //Deploy smart contract on local node
npm run deploy:sepolia //Deploy smart contract on Sepolia
npm run test //Running test cases
```
*** Please be aware of running local node like hardhat node or Ganache (port 8545) while deploying or testing the contract. ***

*** Please be sure that compile the contract at first to generate types and interfaces for the smart contract ***

## Future Options
- Add more options for networks like Ethereum Mainnet, BSC, etc.
