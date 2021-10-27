import { ethers } from 'hardhat';
import { SimpleStorage } from '../typechain';

async function main() {

  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage: SimpleStorage = await SimpleStorageFactory.deploy();

  console.log("SimpleStorage deployed to:", simpleStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });