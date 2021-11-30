# Swapper

## Project description

**`Swapper`** is a decentralized application, with similar functions of a DEX, running on ethereum blockchain (`Rinkeby` testnet). The application is based on the UniswapV2 API, and allows users to add liquidity and swap `ERC20` tokens. The smart contract will keep 0.01% fee from each swap. All accumulated fees can be withdrawn by the contract owner.

The application is build using popular tools like `React`, `hardhat`, `ethers` and `typechain` (allowing the application to be fully typed).

## Directory structure

The root of the repository has two important directories:
- **`hardhat`** containing solidity contracts and unit tests;
- **`frontend`** containing the React web application

## Building smart contract and running unit tests

To build the smart contracts:

```sh
cd hardhat
npm run clean
npm run compile
```
After the smart contracts are build you can run the unit tests:
```sh
npm run test
```

When compiling contracts, consider running `npm run compile` from the hardhat directory over `npx hardhat compile`; 

`npm run compile` compiles contracts and synchronizes the typechain generated folder in the frontend directory

## Run web application on the localhost

Sun the environment:

```sh
npx hardhat node # run local development blockchain node
npm run compile # compile contracts
npx hardhat run --network localhost scripts/prepareDevEnvironment.ts # deploy contracts
```

The react application requires `REACT_APP_DEPLOYER_ADDRESS` and `REACT_APP_SWAPPER_ADDRESS` set in the environment variables:

```sh
# consider using the proper addresses, generated when the contracts were deployed;
export REACT_APP_DEPLOYER_ADDRESS=0x6E0a4931AF9f11df3c6Fce72454d1d9718C002AC
export REACT_APP_SWAPPER_ADDRESS=0x06a61dd7C52F11388e085Eb9b4B7223caE15BBE9
```

Move to the frontend directory and start the React application:
```sh
pwd # blockchain-developer-bootcamp-final-project/frontend
npm run start
```

After the server starts, the aplication should be available be accessing [localhost:3000](localhost:3000).

In the prepareDevEnvironment, the Swapper contract is deployed by the account with the following secret key: `0x0000000000000000000000000000000000000000000000000000000000000002`. Logging with this account in the web application will reveal functionality available only for the contract owner.

## Application Deployment

The application is deployed using GitHub Pages at: [https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/](https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/):

- Each commit containing smart contract or unit tests modifications will trigger the tests to run
- Each commit in the main branch will trigger application redeployment

Also, onsider testing the application in a Chromium browser.

## Related links

- [Uniswap v2](https://uniswap.org/docs/v2/)