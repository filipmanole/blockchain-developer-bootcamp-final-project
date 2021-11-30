# Swapper

## Project description

**`Swapper`** is a decentralized application, with similar functionality to a DEX, running on ethereum blockchain (`Rinkeby` testnet). The application is based on the UniswapV2 API, and allows users to add liquidity and swap `ERC20` tokens. The developed smart contract will keep 0.01% fee from each swap, and all the accumulated fees can be withdrawn by the contract owner.

The application is build using popular tools like `React`, `hardhat`, `ethers` and `typechain` (allowing the application to be fully typed).

## Directory structure

The root of the repository has two important directories:
- **`hardhat`** containing solidity contracts and unit tests;
- **`frontend`** containing the React web application

## Compile smart contracts and run unit tests

Go to the hardhat directory and install dependencies:
```sh
cd hardhat
pwd # blockchain-developer-bootcamp-final-project/hardhat
npm ci
```

To compile the smart contracts:

```sh
npm run clean # clean the environment
npm run compile # compile contracts
```

After the smart contracts are build you can run the unit tests:
```sh
npm run test
```

When compiling contracts, consider running `npm run compile` from the hardhat directory over `npx hardhat compile`; 

`npm run compile` compiles contracts and synchronizes the typechain generated folder in the frontend directory

## Set ERC20 tokens addresses

In the [**`tokens.ts`**](frontend/src/tokens.ts), there is an object called `TOKENS`. This object should be modified accordingly as in the following example:

```typescript
/* the key should be a valid erc20 token address */
'0xB83A3DCeBF2ced779682Ce04a1fc1DeFf7F5D314': {
    name: 'DummyToken0', /* name of the erc20 token */
    symbol: 'DT0', /* symbol of the erc20 token */
    decimals: 18, /* decimals of the erc20 token */
  },
```

## Run web application on the localhost

1. Follow the steps from the above section, [**Compile smart contracts and run unit tests**](#Compile-smart-contracts-and-run-unit-tests), to compile the contracts.

2. From the `hardhat` directory, set the environment:

    ```sh
    npx hardhat node # run local development blockchain node
    npx hardhat run --network localhost scripts/prepareDevEnvironment.ts # deploy contracts
    ```

3. Use the erc20 token addresses displayed after the deploy of the contreacts, and [**set the erc20 tokens**](Set-ERC20-tokens-addresses).

3. The react application requires `REACT_APP_DEPLOYER_ADDRESS` and `REACT_APP_SWAPPER_ADDRESS` set in the environment variables:

    ```sh
    # use the proper addresses, generated when the contracts were deployed;
    export REACT_APP_DEPLOYER_ADDRESS=0x6E0a4931AF9f11df3c6Fce72454d1d9718C002AC
    export REACT_APP_SWAPPER_ADDRESS=0x06a61dd7C52F11388e085Eb9b4B7223caE15BBE9
    ```

4. Go to the frontend directory and :
    ```sh
    cd frontend
    pwd # blockchain-developer-bootcamp-final-project/frontend
    npm ci
    ```

3. From the `frontend` directory, start the React application
    ```sh
    npm run start
    ```

6. After the server starts, the aplication should be available be accessing [**localhost:3000**](localhost:3000).

In the prepareDevEnvironment, the Swapper contract is deployed by the account with the following secret key: `0x0000000000000000000000000000000000000000000000000000000000000002`. Logging with this account in the web application will reveal functionality available only for the contract owner.

## Run web application on the localhost with Docker

In the root directory, there is a `docker-compose.yaml` and in the `frontend` directory a `Dockerfile`. Those files will help to run a docker image containing the web application.

Assuming the repository is clean, with no changes, the following steps can be followed to run the docker image.

1. Follow the steps from the above section, [**Compile smart contracts and run unit tests**](#Compile-smart-contracts-and-run-unit-tests), to compile the contracts.

2. From the `hardhat` directory, set the environment:

    ```sh
    npx hardhat node # run local development blockchain node
    npx hardhat run --network localhost scripts/prepareDevEnvironment.ts # deploy contracts
    ```

3. Use the erc20 token addresses displayed after the deploy of the contreacts, and [**set the erc20 tokens**](Set-ERC20-tokens-addresses).

4. Create the `node_module` directory inside the frontend directory. This will be used by the docker image an a volume, and the editor will not complain about not finding existing modules.

    ```sh
    cd frontend
    pwd # blockchain-developer-bootcamp-final-project/frontend
    mkdir node_modules
    ```

5. In the root directory, set the .env file::

    ```sh
    cp .env.sample .env
    vim .env # edit .env file accordingly
    ```

    `FRONTEND_PORT` - the port where the frontend will run on localhost
    `REACT_APP_DEPLOYER_ADDRESS` - owner of the smart contract, used to enable the owner's functionality
    `REACT_APP_SWAPPER_ADDRESS` - address of the swapper contract

6. From the run the docker image:
    ```sh
    docker-compose up
    ```

## Application Deployment

The application is deployed using GitHub Pages at: [https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/](https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/):

- Each commit containing smart contract or unit tests modifications will trigger the tests to run
- Each commit in the main branch will trigger application redeployment

Also, consider testing the application in a Chromium browser.

Screencast walking through the deployed application: [https://www.loom.com/share/f1b5762968cc4b2c82fad2e48bea6cf2](https://www.loom.com/share/f1b5762968cc4b2c82fad2e48bea6cf2)

## Related links

- [Uniswap v2](https://uniswap.org/docs/v2/)
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/ )