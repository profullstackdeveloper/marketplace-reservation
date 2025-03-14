# Frontend Challenge.

## Summary

Frontend UI for reservation page.

## Features
Accepts an invite code input, then a screen to connect wallet and enter email address with a button to submit
- should do proper validation before submitting a reservation.
- should handle errors.
- should handle if users click submit button multiple times

## Prerequisites

- Node.js v20.18.3
- Prepare .env file based on the .env.example.
```
VITE_API_URL="Base API url"
```
---

## Run the project

1. Clone the repository from Github:
```
git clone https://github.com/profullstackdeveloper/marketplace-reservation.git
cd marketplace-reservation
cd market-claim
```
2. Install packages
```
npm install
```
3. Run the project
```
npm run dev
```

*** Please be sure that browser has Metamask wallet extension. And API server is running for this UI. ***

## Future Options
- Add more options for several wallets by using wallet connection. For now, it only integrates with only Metamask wallet.
- Add options to detect user or chain selection. For now, it only accepts first account which has been connected. To switch to the other account, it should be disconnected through the wallet extension at first and switch to another account.
- Build SSR with Vite to secure the API endpoints.
