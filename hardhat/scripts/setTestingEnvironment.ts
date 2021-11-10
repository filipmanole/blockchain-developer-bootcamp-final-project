import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Swapper, Swapper__factory, UniswapV2Factory, UniswapV2Factory__factory, UniswapV2Router02, UniswapV2Router02__factory } from '../typechain';
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20PresetMinterPauser } from '../typechain/ERC20PresetMinterPauser';
import { ERC20PresetMinterPauser__factory } from '../typechain/factories/ERC20PresetMinterPauser__factory';
import { ContractTransaction } from '@ethersproject/contracts';
import { WETH9__factory } from '../typechain/factories/WETH9__factory';
import { WETH9 } from '../typechain/WETH9';

const expand = (num: number): BigNumber => BigNumber.from(num).mul(BigNumber.from(10).pow(18));

const main = async () => {
  const [deployer, owner, provider, trader] = await ethers.getSigners();
  let tx: ContractTransaction;

  /* Deploy two ERC20 tokens */
  const erc20TokenFactory = new ERC20PresetMinterPauser__factory(deployer);
  const DT0 = await erc20TokenFactory.deploy("DummyToken0", "DT0");
  const DT1 = await erc20TokenFactory.deploy("DummyToken1", "DT1");

  /* Assign 1000 DT0 and 1000 DT1 to the liquidity provider address */
  tx = await DT0.mint(provider.address, expand(1000));
  await tx.wait();
  tx = await DT1.mint(provider.address, expand(1000));
  await tx.wait();

  /* Assign 200 DT0 to the trader  */
  tx = await DT0.mint(trader.address, expand(200));
  await tx.wait();

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