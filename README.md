# Intentify

Intentify is a decentralized platform that seamlessly connects Seekers (those requesting resources) with Providers (those offering resources) based on aligned intents. 
Built on the Polygon Amoy Testnet and powered by Okto Wallet, Intentify simplifies Web3 interactions by making asset management secure and accessible, fostering the transition to decentralized finance.

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
    - Seeker A submits an intent for 500 tokens at 5% interest.
    - Seeker B submits an intent for 200 tokens at interest.

### Provider:
    - Provider X offers 700 tokens at 4% interest.

### Solver
    - The solver function pairs Provider X with both Seekers, allocating tokens proportionally to meet their intents.   
