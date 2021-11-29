import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Swapper, Swapper__factory, UniswapV2Factory, UniswapV2Factory__factory, UniswapV2Router02, UniswapV2Router02__factory } from '../typechain';
import { BigNumber } from 'ethers';
import { ContractTransaction } from '@ethersproject/contracts';
import { WETH9__factory } from '../typechain/factories/WETH9__factory';
import { DummyToken } from '../typechain';
import { DummyToken__factory } from '../typechain/factories/DummyToken__factory';

const main = async () => {
  const [deployer, owner] = await ethers.getSigners();
  let tx: ContractTransaction;

  /* Deploy two ERC20 tokens */
  const erc20TokenFactory = new DummyToken__factory(deployer);
  const DT0 = await erc20TokenFactory.deploy("DummyToken0", "DT0");
  const DT1 = await erc20TokenFactory.deploy("DummyToken1", "DT1");

  /* Deploy Wrapped Ethereum */
  const WETH9Factory = new WETH9__factory(deployer);
  const WETH = await WETH9Factory.deploy();

  /* Deploy UniswapV2Factory Contract */
  const uniswapV2Factory__factory = new UniswapV2Factory__factory(deployer);
  const uniswapV2Factory = await uniswapV2Factory__factory.deploy(deployer.address);

  /* Deploy UniswapV2Router02 Contract */
  const uniswapV2RouterFactory = new UniswapV2Router02__factory(deployer);
  const uniswapV2Router = await uniswapV2RouterFactory.deploy(uniswapV2Factory.address, WETH.address);

  /* Deploy the Swapper Contract */
  const SwapperContractFactory = new Swapper__factory(owner);
  const swapper = await SwapperContractFactory.deploy(uniswapV2Factory.address, uniswapV2Router.address);

  console.log("Swapper deployed to:", swapper.address);
  console.log("DT0     deployed to:", DT0.address);
  console.log("DT1     deployed to:", DT1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); 
    process.exit(1);
  });