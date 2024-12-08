# Intentify

Intentify is a decentralized platform that seamlessly connects Seekers (those requesting resources) with Providers (those offering resources) based on aligned intents.
Built on the Polygon Amoy Testnet and powered by Okto Wallet, Intentify simplifies Web3 interactions by making asset management secure and accessible, fostering the transition to decentralized finance.

## Live Demo

- On [PolygonAmoy](https://intention-9s4f.vercel.app/)

## Depolyed Contracts

### Polygon Amoy

| Contract   | PolygonAmoy Address                        |
| ---------- | ------------------------------------------ |
| Intentium  | 0x03067f04df80fc1560263bec88366af12aad264c |
| AlphaToken | 0x221D3e6Aa6292bA31C680DEC72100031F499c362 |

https://amoy.polygonscan.com/address/0x03067f04df80fc1560263bec88366af12aad264c

## Overview

- Core Roles
  - Seeker:
    - Submits an intent specifying:
    - Token amount needed.
    - Desired interest rate.
    - NFT as collateral.
  - Provider:
    - Offers an intent specifying:
    - Token amount available.
    - Interest rate they are willing to provide.

## Example Scenario

### Seekers:

Seeker A submits an intent for 500 tokens at 5% interest.
Seeker B submits an intent for 200 tokens at interest.

### Provider:

Provider X offers 700 tokens at 4% interest.

### Solver:

The solver function pairs Provider X with both Seekers, allocating tokens proportionally to meet their intents.

## Getting Started

### Frontend

    npm install
    npm run dev

### Backend (Solver)

    npm install
    npm run dev

### Foundry

    Follow forge docs

Screenshots : 

<img width="1440" alt="Screenshot 2024-12-08 at 2 08 35 AM" src="https://github.com/user-attachments/assets/a0769081-659d-4262-b354-e2b926c8a90e">
<img width="1440" alt="Screenshot 2024-12-08 at 2 08 16 AM" src="https://github.com/user-attachments/assets/5b7cea4c-5e9a-453e-8423-34ee6d4638ed">
<img width="1440" alt="Screenshot 2024-12-08 at 2 08 09 AM" src="https://github.com/user-attachments/assets/749bfa36-8ba6-4189-8d3d-b24cb554c7d5">
<img width="1438" alt="Screenshot 2024-12-08 at 2 07 58 AM" src="https://github.com/user-attachments/assets/1c515317-a636-4034-b3fb-6987272b54ab">
<img width="1440" alt="Screenshot 2024-12-08 at 2 07 37 AM" src="https://github.com/user-attachments/assets/ae11ee45-db21-4f81-b300-8cc05faab663">
