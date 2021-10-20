import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Swapper, Swapper__factory, UniswapV2Factory, UniswapV2Factory__factory, UniswapV2Router02, UniswapV2Router02__factory } from '../typechain';
import { BigNumber } from '@ethersproject/bignumber';
import { ERC20PresetMinterPauser } from '../typechain/ERC20PresetMinterPauser';
import { ERC20PresetMinterPauser__factory } from '../typechain/factories/ERC20PresetMinterPauser__factory';
import { ContractTransaction } from '@ethersproject/contracts';
import { WETH9__factory } from '../typechain/factories/WETH9__factory';
import { WETH9 } from '../typechain/WETH9';


describe("Swapper Contract", () => {
  /* Actors for the tests */
  let deployer: SignerWithAddress;
  let owner: SignerWithAddress;
  let provider: SignerWithAddress;
  let trader: SignerWithAddress;

  /* Dummy tokens */
  let DT0: ERC20PresetMinterPauser;
  let DT1: ERC20PresetMinterPauser;

  /* WETH token */
  let WETH: WETH9;
  
  /* Other variables */
  let uniswapV2Factory: UniswapV2Factory;
  let swapper: Swapper;
  let tx: ContractTransaction;

  const expand = (num: number): BigNumber => BigNumber.from(num).mul(BigNumber.from(10).pow(18));

  before(async () => {
    /* Get testing actors */
    [deployer, owner, provider, trader] = await ethers.getSigners();

    /* Deploy two ERC20 tokens */
    const erc20TokenFactory = new ERC20PresetMinterPauser__factory(deployer);
    DT0 = await erc20TokenFactory.deploy("DummyToken0", "DT0");
    DT1 = await erc20TokenFactory.deploy("DummyToken1", "DT1");

    /* Deploy Wrapped Ethereum */
    const WETH9Factory = new WETH9__factory(deployer);
    WETH = await WETH9Factory.deploy();

    /* Deploy UniswapV2Factory Contract */
    const uniswapV2Factory__factory = new UniswapV2Factory__factory(deployer);
    uniswapV2Factory = await uniswapV2Factory__factory.deploy(deployer.address);

    /* Deploy UniswapV2Router02 Contract */
    const uniswapV2RouterFactory = new UniswapV2Router02__factory(deployer);
    const uniswapV2Router = await uniswapV2RouterFactory.deploy(uniswapV2Factory.address, WETH.address);

    /* Deploy the Swapper Contract */
    const SwapperContractFactory = new Swapper__factory(owner);
    swapper = await SwapperContractFactory.deploy(uniswapV2Factory.address, uniswapV2Router.address);
  });

  it("should be 1000 DT0 and 1000 DT1", async () => {
    /* Assign 1000 DT0 and 1000 DT1 to the liquidity provider address */
    tx = await DT0.mint(provider.address, expand(1000));
    await tx.wait();
    tx = await DT1.mint(provider.address, expand(1000));
    await tx.wait();

    /* Get the provider's balances */
    const providerDT0: BigNumber = await DT0.balanceOf(provider.address);
    const providerDT1: BigNumber = await DT1.balanceOf(provider.address);
    
    expect(providerDT0.eq(expand(1000))).to.be.true;
    expect(providerDT1.eq(expand(1000))).to.be.true;
  });

  it("should be 200 DT0 and 0 DT1 ", async () => {
    /* Assign 200 DT0 to the trader  */
    tx = await DT0.mint(trader.address, expand(200));
    await tx.wait();

    /* Get the trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);

    expect(traderDT0.eq(expand(200))).to.be.true;
    expect(traderDT1.eq(0)).to.be.true;
  });

  it("should be 0 pairs int the liquidity pool", async () => {
    /* Get the number of the total availabe pairs */
    const numberOfPairs: BigNumber = await uniswapV2Factory.allPairsLength();
    
    expect(numberOfPairs.eq(0)).to.be.true;
  });

  it("should emit PairAdded event", async ()=> {
    const DT0amount: BigNumber = expand(500);
    const DT1amount: BigNumber = expand(500);

    const providerDT0: BigNumber = await DT0.balanceOf(provider.address);
    const providerDT1: BigNumber = await DT1.balanceOf(provider.address);

    /* Provider should hold the needed DT0 and DT1 amounts to add a pair */
    expect(providerDT0.gte(DT0amount)).to.be.true;
    expect(providerDT1.gte(DT1amount)).to.be.true;

    /* Approve swapper contract to use the DT0 and DT1 amount of the pair */
    tx = await DT0.connect(provider).approve(swapper.address, DT0amount);
    await tx.wait();
    tx = await DT1.connect(provider).approve(swapper.address, DT1amount);
    await tx.wait();

    /* Provider should add a pair of (DT0, DT1) in the pool */
    await expect(
      swapper.connect(provider).addLiquidity(DT0.address, DT0amount, DT1.address, DT1amount)
    ).to.emit(swapper, "PairAdded");
  });

  it("should be one pair in the liquidity pool", async () => {
    /* Get the number of the total availabe pairs */
    const numberOfPairs: BigNumber = await uniswapV2Factory.allPairsLength();

    expect(numberOfPairs.eq(1)).to.be.true;
  });

  it("should exchange DT0 for DT1, specifying input token amount", async () => {
    const inputAmount: BigNumber = expand(50);

    /* Get the received amount of DT1 when swapping an exact amount of DT0 into DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsOut(inputAmount, path);
    
    /* Get trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);

    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    /* Swap exact DT0 into DT1 */
    tx = await swapper.connect(trader).swapExactTokensIn(DT0.address, DT1.address, amountIn, amountOut);
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

  it("should emit SwappedExactInput event", async () => {
    const inputAmount: BigNumber = expand(10);

    /* Get the received amount of DT1 when swapping an exact amount of DT0 into DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsOut(inputAmount, path);

    /* Get trader's DT0 balance */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);

    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    await expect(
      swapper.connect(trader).swapExactTokensIn(DT0.address, DT1.address, amountIn, amountOut)
    ).to.emit(swapper, "SwappedExactInput");
  });

  it("should exchange DT0 for DT1, specifying output token amount", async () => {
    const outputAmount: BigNumber = expand(10);

    /* Get the input amount of DT0 when swapping into an exact amount of DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsIn(outputAmount, path);
    
    /* Get trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);

    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    tx = await swapper.connect(trader).swapExactTokensOut(DT0.address, DT1.address, amountIn, amountOut);
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

  it("should emit SwappedExactOutput event", async () => {
    const outputAmount: BigNumber = expand(10);

    /* Get the input amount of DT0 when swapping into an exact amount of DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsIn(outputAmount, path);

    /* Get trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);

    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    await expect(
      swapper.connect(trader).swapExactTokensOut(DT0.address, DT1.address, amountIn, amountOut)
    ).to.emit(swapper, "SwappedExactOutput");
  });

  it("should return tokens if swapExactTokensIn fails", async () => {
    const inputAmount: BigNumber = expand(50);

    /* Get the received amount of DT1 when swapping an exact amount of DT0 into DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsOut(inputAmount, path);
    
    /* Get trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);

    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    await expect(swapper.connect(trader).swapExactTokensIn(DT0.address, DT1.address, amountIn, amountOut.add(expand(5)))).to.be.reverted;

    /* Get trader's balances after performing the swap */
    const newTraderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const newTraderDT1: BigNumber = await DT1.balanceOf(trader.address);

    expect(traderDT0.eq(newTraderDT0)).to.be.true;
    expect(traderDT1.eq(newTraderDT1)).to.be.true;
  });

  it("should return tokens if swapExactTokensOut fails", async () => {
    const outputAmount: BigNumber = expand(10);

    /* Get the input amount of DT0 when swapping into an exact amount of DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsIn(outputAmount, path);
    
    /* Get trader's balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const traderDT1: BigNumber = await DT1.balanceOf(trader.address);
    
    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    await expect(swapper.connect(trader).swapExactTokensOut(DT0.address, DT1.address, amountIn.sub(expand(5)), amountOut)).to.be.reverted;

    /* Get trader's balances after performing the swap */
    const newTraderDT0: BigNumber = await DT0.balanceOf(trader.address);
    const newTraderDT1: BigNumber = await DT1.balanceOf(trader.address);

    expect(traderDT0.eq(newTraderDT0)).to.be.true;
    expect(traderDT1.eq(newTraderDT1)).to.be.true;
  });

  it("should keep 0.1% fee when swapExactTokensIn is called", async () => {
    const inputAmount: BigNumber = expand(10);

    /* Get the received amount of DT1 when swapping an exact amount of DT0 into DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsOut(inputAmount, path);
    
    /* Get swapper's DT0 balance */
    const swapperDT0: BigNumber = await DT0.balanceOf(swapper.address);

    /* Get trader's DT0 balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    
    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    /* Swap exact DT0 into DT1 */
    tx = await swapper.connect(trader).swapExactTokensIn(DT0.address, DT1.address, amountIn, amountOut);
    await tx.wait();

    /* Get swapper's new DT0 balance */
    const newSwapperDT0: BigNumber = await DT0.balanceOf(swapper.address);

    /* Calculate expected balances */
    const fee = amountIn.div(1000);

    expect(newSwapperDT0.eq(swapperDT0.add(fee))).to.be.true;
  });

  it("should keep 0.1% fee when swapExactTokensOut is called", async () => {
    const outputAmount: BigNumber = expand(10);

    /* Get the received amount of DT1 when swapping an exact amount of DT0 into DT1 */
    const path: string[] = [DT0.address, DT1.address];
    const [amountIn, amountOut] = await swapper.connect(trader).getAmountsIn(outputAmount, path);
    
    /* Get swapper's DT0 balance */
    const swapperDT0: BigNumber = await DT0.balanceOf(swapper.address);

    /* Get trader's DT0 balances */
    const traderDT0: BigNumber = await DT0.balanceOf(trader.address);
    
    /* Trader should hold the required number of DT0 token */
    expect(traderDT0.gte(amountIn)).to.be.true;

    /* Approve swapper to use the trader's tokens */
    tx = await DT0.connect(trader).approve(swapper.address, amountIn);
    await tx.wait();

    /* Swap exact DT0 into DT1 */
    tx = await swapper.connect(trader).swapExactTokensOut(DT0.address, DT1.address, amountIn, amountOut);
    await tx.wait();

    /* Get swapper's new DT0 balance */
    const newSwapperDT0: BigNumber = await DT0.balanceOf(swapper.address);

    /* Calculate expected balances */
    const fee = amountIn.div(1000);

    expect(newSwapperDT0.eq(swapperDT0.add(fee))).to.be.true;
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
    /* Get ammount of tokens hold by the swapper owner */
    const ownerDT0: BigNumber = await DT0.balanceOf(owner.address);
    const ownerDT1: BigNumber = await DT1.balanceOf(owner.address);

    /* Get ammount of tokens hold by the swapper contract */
    const swapperDT0: BigNumber = await DT0.balanceOf(swapper.address);
    const swapperDT1: BigNumber = await DT1.balanceOf(swapper.address);

    /* For a proper withdraw test, one of the amount should be different than 0 */
    expect(swapperDT0.eq(0) && swapperDT1.eq(0)).to.be.false;

    /* Withdraw the accumulated fee */
    tx = await swapper.withdraw();
    await tx.wait();

    /* Get new ammount of tokens hold by the swapper owner */
    const newOwnerDT0: BigNumber = await DT0.balanceOf(owner.address);
    const newOwnerDT1: BigNumber = await DT1.balanceOf(owner.address);

    expect(newOwnerDT0.eq(ownerDT0.add(swapperDT0))).to.be.true;
    expect(newOwnerDT1.eq(ownerDT1.add(swapperDT1))).to.be.true;
  });

  it("should emit Withdrawn event", async () => {
    await expect(swapper.withdraw()).to.emit(swapper, "Withdrawn");
  })
});
