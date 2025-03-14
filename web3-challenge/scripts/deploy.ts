// import { ethers } from "hardhat";
// import type { NFTGate } from "../typechain-types/contracts/NFTGate";
// import type { MockNFT } from "../typechain-types/contracts/MockNFT";

// async function main() {
//   const ERC721Factory = await ethers.getContractFactory("MockNFT");
//   const nft = (await ERC721Factory.deploy()) as MockNFT;
//   await nft.waitForDeployment();

//   const nftAddress = await nft.getAddress();

//   console.log(`MockNFT deployed to: ${await nft.getAddress()}`);

//   const NFTGateFactory = await ethers.getContractFactory("NFTGate");
//   const nftGate = (await NFTGateFactory.deploy(nftAddress)) as NFTGate;
//   await nftGate.waitForDeployment();

//   console.log(`NFTGate deployed to: ${await nftGate.getAddress()}`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const GatedNFT = await ethers.getContractFactory("GatedNFT");
  const gatedNFT = await GatedNFT.deploy("GatedNFT", "GNFT");

  await gatedNFT.deployed();

  console.log("GatedNFT deployed to:", gatedNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contracts:", error);
    process.exit(1);
  });
