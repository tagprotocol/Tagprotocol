// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  // TagNFT

  const TagNFT = await hre.ethers.getContractFactory("TagNFT");
    const tagNFT = await TagNFT.deploy("HashTag NFT" , "HTAG");

  await tagNFT.deployed();

  console.log("TagNFT deployed to:", tagNFT.address);

  // TagNFT

  // TagRate

  const TagRates = await hre.ethers.getContractFactory("TagRates");
  const tagRates = await TagRates.deploy();

  await tagRates.deployed();

  console.log("TagRates deployed to:", tagRates.address);

  // TagRate

  // TagTreasury

  const TagTreasury = await hre.ethers.getContractFactory("TagTreasury");
  const tagTreasury = await TagTreasury.deploy( tagNFT.address , tagRates.address );

  await tagTreasury.deployed();
  await tagNFT.allowContract(tagTreasury.address);

  console.log("TagTreasury deployed to:", tagTreasury.address);

  // TagTreasury

  // Setup

  await tagRates.setChainLinkAddress("0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED");
  await tagRates.setBaseRate("200");

  await tagTreasury.setMaxLevel("11");
  await tagTreasury.setLevel("1" , "2500" , "0");
  await tagTreasury.setLevel("2" , "3000" , "2");
  await tagTreasury.setLevel("3" , "3500" , "4");
  await tagTreasury.setLevel("4" , "4000" , "6");
  await tagTreasury.setLevel("5" , "4500" , "8");
  await tagTreasury.setLevel("6" , "5000" , "10");
  await tagTreasury.setLevel("7" , "5250" , "12");
  await tagTreasury.setLevel("8" , "5500" , "14");
  await tagTreasury.setLevel("9" , "5750" , "16");
  await tagTreasury.setLevel("10" , "6000" , "18");
  await tagTreasury.setLevel("11" , "6500" , "20");
  await tagTreasury.setLevel("12" , "10000" , "2000");

  // await tagTreasury.setLevel("1" , "2500" , "0");
  // await tagTreasury.setLevel("2" , "3000" , "10");
  // await tagTreasury.setLevel("3" , "3500" , "100");
  // await tagTreasury.setLevel("4" , "4000" , "250");
  // await tagTreasury.setLevel("5" , "4500" , "500");
  // await tagTreasury.setLevel("6" , "5000" , "1000");
  // await tagTreasury.setLevel("7" , "5250" , "100000");
  // await tagTreasury.setLevel("8" , "5500" , "200000");
  // await tagTreasury.setLevel("9" , "5750" , "300000");
  // await tagTreasury.setLevel("10" , "6000" , "400000");
  // await tagTreasury.setLevel("11" , "10000" , "2000000");
  await tagTreasury.changeMaster("0x6E0282F6B04DCa3CFd5921447F7656130b7cC1aa");
  await tagTreasury.activate();


  // Setup

}
//npx hardhat verify --network rinkeby 0xCdaFa7418d5b93d48D5dc163678EA0a366a52135 "0x92E177b91951C8E5D8F63c3C872cCE9D5b6af6C9" "0xAb3Dea1202829505f2e1993FA3345D19fa13b1c4"

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

//npx hardhat verify --network rinkeby 0x4F5AF2D8506d3D148A7Be24d065e4353e872132C "0x9D89C07bcB7C75a86622F45BE881dB4CCccFc046" "0xcc31818532abcD9afaD96935A78513565Db33A17"
