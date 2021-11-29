import { ethers } from 'hardhat';

import { DummyToken__factory, Swapper__factory } from '../typechain';

const main = async () => {
  const [deployer] = await ethers.getSigners();

  /* Existing Uniswap Router02 and Factory on Rinkeby */
  const uniswapV2FactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
  const uniswapV2RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  /* Deploy the Swapper Contract */
  const SwapperContractFactory = new Swapper__factory(deployer);
  const swapper = await SwapperContractFactory.deploy(uniswapV2FactoryAddress, uniswapV2RouterAddress);

  /* Deploy two ERC20 tokens */
  const erc20TokenFactory = new DummyToken__factory(deployer);
  const DT0 = await erc20TokenFactory.deploy("DummyToken0", "DT0");
  const DT1 = await erc20TokenFactory.deploy("DummyToken1", "DT1");

  console.log("Deployer           :", deployer.address);
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
