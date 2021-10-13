import { expect } from 'chai';
import { ethers } from 'hardhat';

import SimpleStorageArtifact from '../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json';
import { SimpleStorage } from '../typechain/SimpleStorage';
import { deployContract } from 'ethereum-waffle';

describe("Simple Storage Contract", () => {
  let simpleStorage: SimpleStorage;

  beforeEach(async () => {
    const [signer] = await ethers.getSigners();
    simpleStorage = (await deployContract(signer, SimpleStorageArtifact)) as SimpleStorage;
  });

  it("should store the value 89.", async () => {
    const tx = await simpleStorage.set(89);
    await tx.wait();

    const storedData = await simpleStorage.get();
    expect(storedData).to.equal(89);
  });
});