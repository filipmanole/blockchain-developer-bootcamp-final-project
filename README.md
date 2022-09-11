# Swapper

Blog post containing a shor overview: [https://filipmanole.com/how-i-built-my-own-decentralized-exchange-dex](https://filipmanole.com/how-i-built-my-own-decentralized-exchange-dex)

Ethereum address: 0xa9fe8dBBa511cD5d1063D0862Fb0D24C4ac47233

Application link: [https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/](https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/)

## Project description

**`Swapper`** is a decentralized application, with similar functionality to a DEX, running on ethereum blockchain (`Rinkeby` testnet). The application is based on the UniswapV2 API, and allows users to add liquidity and swap `ERC20` tokens. The developed smart contract will keep 0.01% fee from each swap, and all the accumulated fees can be withdrawn by the contract owner.

The application is build using popular tools like `React`, `hardhat`, `ethers` and `typechain` (allowing the application to be fully typed).

## Directory structure

- [**hardhat**](hardhat): directory containing [**contracts**](hardhat/contracts), [**unit tests**](hardhat/test), [**deploy scripts**](hardhat/scripts)
- [**frontend**](frontend): directory containing the React application
- [**avoiding_common_attacks.md**](avoiding_common_attacks.md)
- [**deployed_address.txt**](deployed_address.txt)
- [**design_pattern_decisions.md**](design_pattern_decisions.md)

## Compile smart contracts and run unit tests

1. Go to the hardhat directory and install dependencies:
    ```sh
    cd hardhat
    npm ci
    ```

2. Compile the smart contracts:
    ```sh
    npm run clean # clean the environment
    npm run compile # compile contracts
    ```

3. Run the unit tests:
    ```sh
    npm run test # run tests
    ```

When compiling contracts, consider running `npm run compile` from the hardhat directory over `npx hardhat compile`; 

`npm run compile` compiles contracts and synchronizes the typechain generated folder in the frontend directory

## Set ERC20 tokens addresses

In the [**`tokens.ts`**](frontend/src/tokens.ts), there is an object called `TOKENS`. This object is used as a dictionary, and it should contain all the erc20 tokens used on the application. For one token, the key should be the address, and the value of the key an object containing its name, symbol and decimals. Here is an example of a key-value pair:

```typescript
/* the key should be a valid erc20 token address */
'0xB83A3DCeBF2ced779682Ce04a1fc1DeFf7F5D314': {
    name: 'DummyToken0', /* name of the erc20 token */
    symbol: 'DT0', /* symbol of the erc20 token */
    decimals: 18, /* decimals of the erc20 token */
  },
```

## Run the web application on the localhost

1. Follow the steps from the above section, [**Compile smart contracts and run unit tests**](#Compile-smart-contracts-and-run-unit-tests), to compile the contracts.

2. From the `hardhat` directory, set the environment:

    ```sh
    npx hardhat node # run local development blockchain node
    npx hardhat run --network localhost scripts/prepareDevEnvironment.ts # deploy contracts
    ```

    The ouput of the deployment script is needed to run the web application. It should be similar to the following:
    ```
    Swapper deployer   : 0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF
    Swapper deployed to: 0x153b84F377C6C7a7D93Bd9a717E48097Ca6Cfd11
    DT0     deployed to: 0xF2E246BB76DF876Cef8b38ae84130F4F55De395b
    DT1     deployed to: 0x2946259E0334f33A064106302415aD3391BeD384
    ```

3. Use the erc20 token addresses (DT0, DT1), from the `step 2`, displayed after the deployment of the contracts, and modify the **`TOKENS`** object following instructions from the section [**set the erc20 tokens**](#Set-ERC20-tokens-addresses). After the modification, based on output showed at step 2, **`TOKENS`** object should be:

    ```typescript
    export const TOKENS: TTokenDictionary = {
      '0xF2E246BB76DF876Cef8b38ae84130F4F55De395b': {
        name: 'DummyToken0',
        symbol: 'DT0',
        decimals: 18,
      },
      '0x2946259E0334f33A064106302415aD3391BeD384': {
        name: 'DummyToken1',
        symbol: 'DT1',
        decimals: 18,
      },
    };
    ```

4. The react application requires `REACT_APP_DEPLOYER_ADDRESS` and `REACT_APP_SWAPPER_ADDRESS` set in the environment variables:

    ```sh
    # use deployer and swapper addresses from the output of the deployment script, at step 2
    export REACT_APP_DEPLOYER_ADDRESS=0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF
    export REACT_APP_SWAPPER_ADDRESS=0x153b84F377C6C7a7D93Bd9a717E48097Ca6Cfd11
    ```

5. Go to the frontend directory and :
    ```sh
    cd frontend
    npm ci
    ```

6. From the `frontend` directory, start the React application:
    ```sh
    npm run start
    ```

7. After the server starts, the aplication should be available be accessing [**localhost:3000**](localhost:3000).

8. Metamask setup:
    - make sure the network is set to:
        - RPC URL: http://localhost:8545
        - Chain ID: 1337
    - add one of the following private keys is imported in the Metamask:
        - `0x0000000000000000000000000000000000000000000000000000000000000001`
        - `0x0000000000000000000000000000000000000000000000000000000000000002`
        - `0x0000000000000000000000000000000000000000000000000000000000000003`
        - `0x0000000000000000000000000000000000000000000000000000000000000004`

    In the prepareDevEnvironment, the Swapper contract is deployed by the account with the following private key: `0x0000000000000000000000000000000000000000000000000000000000000002`. Logging with this account in the web application will reveal functionality available only for the contract owner.

## Application Deployment

The application is deployed using GitHub Pages at [https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/](https://filipmanole.github.io/blockchain-developer-bootcamp-final-project/):

- Each commit containing smart contract or unit tests modifications will trigger the tests to run
- Each commit in the main branch will trigger application redeployment

Also, consider testing the application in a Chromium browser.

Screencast walking through the deployed application: [https://www.loom.com/share/f1b5762968cc4b2c82fad2e48bea6cf2](https://www.loom.com/share/f1b5762968cc4b2c82fad2e48bea6cf2)

## Related links

- [Uniswap v2](https://uniswap.org/docs/v2/)
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/ )
