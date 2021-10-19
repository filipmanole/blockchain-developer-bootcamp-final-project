import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Swapper, Swapper__factory, UniswapV2Factory, UniswapV2Factory__factory } from '../typechain';
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20PresetMinterPauser } from '../typechain/ERC20PresetMinterPauser';
import { ERC20PresetMinterPauser__factory } from '../typechain/factories/ERC20PresetMinterPauser__factory';
import { ContractTransaction } from '@ethersproject/contracts';


describe("Swapper Contract", () => {
  /* Actors for the tests */
  let deployer: SignerWithAddress;
  let owner: SignerWithAddress;
  let provider: SignerWithAddress;
  let trader: SignerWithAddress;

  /* Dummy tokens */
  let DT0: ERC20PresetMinterPauser;
  let DT1: ERC20PresetMinterPauser;
  
  /* Other variables */
  let uniswapV2Factory: UniswapV2Factory;
  let swapper: Swapper;
  let tx: ContractTransaction;

  before(async () => {
    /* Get testing actors */
    [deployer, owner, provider, trader] = await ethers.getSigners();

    /* Deploy two ERC20 tokens */
    const erc20TokenFactory = new ERC20PresetMinterPauser__factory(deployer);
    DT0 = await erc20TokenFactory.deploy("DummyToken0", "DT0");
    DT1 = await erc20TokenFactory.deploy("DummyToken1", "DT1");

    /* Deploy UniswapV2Factory Contract */
    const uniswapV2Factory__factory = new UniswapV2Factory__factory(deployer);
    uniswapV2Factory = await uniswapV2Factory__factory.deploy(deployer.address);

    /* Deploy the Swapper Contract */
    const SwapperContractFactory = new Swapper__factory(owner);
    swapper = await SwapperContractFactory.deploy(uniswapV2Factory.address);
  });

  it("should be 1000 DT0 and 1000 DT1", async () => {
    /* Assign 1000 DT0 and 1000 DT1 to the liquidity provider address */
    tx = await DT0.mint(provider.address, 1000);
    await tx.wait();
    tx = await DT1.mint(provider.address, 1000);
    await tx.wait();

    /* Get the provider's balances */
    const providerDT0: BigNumber = await DT0.balanceOf(provider.address);
    const providerDT1: BigNumber = await DT1.balanceOf(provider.address);
    
    expect(providerDT0.eq(1000)).to.be.true;
    expect(providerDT1.eq(1000)).to.be.true;
  });

  it("should be 100 DT0 and 0 DT1 ", async () => {
    /* Assign 200 DT0 to the trader  */
    tx = await DT0.mint(trader.address, 200);
    await tx.wait();

    /* Get the trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);

    expect(traderDT0.eq(200)).to.be.true;
    expect(traderDT1.eq(0)).to.be.true;
  });

  it("should be 0 pairs int the liquidity pool", async () => {
    /* Get the number of the total availabe pairs */
    const numberOfPairs: BigNumber = await uniswapV2Factory.allPairsLength();
    
    expect(numberOfPairs.eq(0)).to.be.true;
  });

  it("should emit PairAdded event", async ()=> {
    /* Provider should add a pair of (DT0, DT1) in the pool */
    await expect(
      swapper.connect(provider).addLiquidity(DT0.address, 500, DT1.address, 500)
    ).to.emit(swapper, "PairAdded").withArgs(DT0.address, DT1.address);
  });

  it("should be one pair in the liquidity pool", async () => {
    /* Get the number of the total availabe pairs */
    const numberOfPairs: BigNumber = await uniswapV2Factory.allPairsLength();

    expect(numberOfPairs.eq(1)).to.be.true;
  });

  it("should exchange DT0 for DT1", async () => {
    /* Get the received amount of DT1 when swapping 50 DT0 into DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsOut(50, path);
    
    /* Get trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);

    /* Swap 50 DT0 into DT1 */
    tx = await swapper.connect(trader).swap(DT0.address, DT1.address, amountIn, amountOut);
    await tx.wait();

    /* Get trader's balances after performing the swap */
    const newTraderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const newTraderDT1: BigNumber = await DT1.balanceOf(trader.address);

    /* Calculate expected balances */
    const expectedDT0: BigNumber = traderDT0.sub(amountIn);
    const expectedDT1: BigNumber = traderDT1.add(amountOut);

    expect(newTraderDT0.eq(expectedDT0)).to.be.true;
    expect(newTraderDT1.eq(expectedDT1)).to.be.true;
  });

  it("should emit Swapped event", async () => {
    /* Get the received amount of DT1 when swapping 10 DT0 into DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsOut(10, path);

    await expect(
      swapper.connect(trader).swap(DT0.address, DT1.address, amountIn, amountOut)
    ).to.emit(swapper, "Swapped").withArgs(DT1.address, amountOut);
  });

  it("should not withdraw if not the owner", async () => {
    /* Get trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);

    /* Perform withdraw as trader */
    await expect(swapper.connect(trader).withdraw()).to.be.reverted;

    /* The trader's balances after the withdraw call should not be modified */
    const newTraderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const newTraderDT1: BigNumber = await DT1.balanceOf(trader.address);

    expect(traderDT0.eq(newTraderDT0)).to.be.true;
    expect(traderDT1.eq(newTraderDT1)).to.be.true;
  });

  it("should withdraw accumulated fees", async () => {
    /* Get ammount of DT0 hold by the swapper owner */
    const swapperDT0: BigNumber = await DT0.balanceOf(swapper.address);

    /* Withdraw the accumulated fee */
    tx = await swapper.withdraw();
    await tx.wait();

    /* Calculate the new expected DT0 balnce for the owner */
    const ownerDT0: BigNumber = await DT0.balanceOf(owner.address);
    
    expect(swapperDT0.eq(ownerDT0)).to.be.true;
  });

  it("should emit Withdrawn event", async () => {
    await expect(swapper.withdraw()).to.emit(swapper, "Withdrawn");
  })
});
