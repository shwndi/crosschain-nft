const { task } = require("hardhat/config");

task("mint-nft").setAction(async (taskArgs, hre) => {
    const { firstNameAccount } = await hre.getNamedAccounts();
    const nft = await ethers.getContract("MyToken", firstNameAccount);

    console.log("Minting NFT to first account...");

    const mintTx = await nft.safeMint(firstNameAccount);
    await mintTx.wait(6);
    console.log("NFT minted successfully!");
})

module.exports = {};