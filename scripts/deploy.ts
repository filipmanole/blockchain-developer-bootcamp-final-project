import { ethers } from 'hardhat';

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const SimpleStorage = await ethers.getContractFactory('SimpleStorage');
  const simpleStorage = await SimpleStorage.deploy();

  console.log(`SimpleStorage address: ${simpleStorage.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });