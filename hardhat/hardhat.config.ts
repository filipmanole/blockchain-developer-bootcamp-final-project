import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
        {
          privateKey: "0x0000000000000000000000000000000000000000000000000000000000000001",
          balance: "100000000000000000000",
        },
        {
          privateKey: "0x0000000000000000000000000000000000000000000000000000000000000002",
          balance: "100000000000000000000",
        },
      ]
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: [
      'node_modules/@openzeppelin/contracts/build/contracts/ERC20PresetMinterPauser.json',
      'node_modules/@uniswap/v2-core/build/UniswapV2Factory.json',
      'node_modules/@uniswap/v2-periphery/build/UniswapV2Router02.json',
      'node_modules/@uniswap/v2-periphery/build/WETH9.json',
    ],
  },
}

