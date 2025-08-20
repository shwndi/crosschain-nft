const { task } = require("hardhat/config")

task("check-nft").setAction(async (taskArgs, hre) => {
    const { firstNameAccount } = await hre.getNamedAccounts();
    const nft = await ethers.getContract("MyToken", firstNameAccount);

    const totalSupply = await nft.totalSupply();
    console.log("checking status of MyToken");

    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await nft.ownerOf(tokenId);
        console.log(`Token ID: ${tokenId} -- Owner: ${owner}`);
    }
})
module.exports = {};

