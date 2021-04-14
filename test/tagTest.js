const { expect } = require("chai");
// const [owner, addr1 ] = await ethers.getSigners();

describe("Testing Contracts", function() {
    before( async function() {
        try{
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

        }catch (e) {
            expect(e).to.be.an('error');
        }

    })

    describe("Setup " ,async function() {
        // it("Setup of contracts", async function() {
        //     try{
        //         await tagRates.setChainLinkAddress("0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED");
        //         await tagRates.setBaseRate("200");
        //         await tagTreasury.setMaxLevel("11")
        //         await tagTreasury.setLevel("1" , "2500" , "0");
        //         await tagTreasury.setLevel("2" , "3000" , "10");
        //         await tagTreasury.setLevel("3" , "3500" , "100");
        //         await tagTreasury.setLevel("4" , "4000" , "250");
        //         await tagTreasury.setLevel("5" , "4500" , "500");
        //         await tagTreasury.setLevel("6" , "5000" , "1000");
        //         await tagTreasury.setLevel("7" , "5250" , "100000");
        //         await tagTreasury.setLevel("8" , "5500" , "200000");
        //         await tagTreasury.setLevel("9" , "5750" , "300000");
        //         await tagTreasury.setLevel("10" , "6000" , "400000");
        //         await tagTreasury.setLevel("11" , "10000" , "2000000");
        //         await tagTreasury.changeMaster("0x6E0282F6B04DCa3CFd5921447F7656130b7cC1aa");
        //         await tagTreasury.activate();
        //     }catch (e) {
        //         console.error("Error Hit Here" , e )
        //         expect(e).to.be.an("error");
        //     }
        // });
    })

    // it("Setup Checks" , async function() {
    //     try {
    //
    //     }catch (e) {
    //         expect(e).to.be.an("error");
    //
    //     }
    // })
});
