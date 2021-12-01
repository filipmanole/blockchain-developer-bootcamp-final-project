import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ContractTransaction } from '@ethersproject/contracts';
import { DummyToken } from '../typechain';
import { DummyToken__factory } from '../typechain/factories/DummyToken__factory';

/* Unit tests, covering minting tokens only one time per account */

describe("DummyToken Contract", () => {
  /* Actors for the tests */
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let dummyToken: DummyToken;

  let tx: ContractTransaction;

  const expand = (num: number): BigNumber => BigNumber.from(num).mul(BigNumber.from(10).pow(18));

  before(async () => {
    /* Get testing actors */
    [deployer, user] = await ethers.getSigners();

    /* Deploy the dummy token minter */
    const dummyTokenFactory = new DummyToken__factory(deployer);
    dummyToken = await dummyTokenFactory.deploy("DummyToken0", "DT0");
  });

  it("should have 0 tokens in the balance", async () => {
    const balance = await dummyToken.balanceOf(user.address);
    expect(balance.eq(0)).to.be.true;
  });

  it("should have status of not minted", async () => {
    const status = await dummyToken.connect(user).getStatus();
    expect(status).to.be.false;
  });

  it("should mint 1000 tokens", async () => {

    tx = await dummyToken.connect(user).mintOnlyOnce();
    await tx.wait();

    const balance = await dummyToken.balanceOf(user.address);
    expect(balance.eq(expand(1000))).to.be.true;
  });

  it("should have status of already minted", async () => {
    const status = await dummyToken.connect(user).getStatus();
    expect(status).to.be.true;
  });

  it("should revert when tying to mint another 1000 tokens", async () => {
    await expect(dummyToken.connect(user).mintOnlyOnce()).to.be.reverted;
  });
});
