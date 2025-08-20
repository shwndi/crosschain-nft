const { task } = require("hardhat/config");

task("check-wnft").setAction(async (taskArgs, hre) => {
    const { firstNameAccount } = await hre.getNamedAccounts();
    const wnft = await ethers.getContract("WrappedMyToken", firstNameAccount)

    console.log("WrappedMyToken contract address:", wnft.address);
    
    const totalSupply = await wnft.totalSupply();
    console.log(`Total Supply of WrappedMyToken: ${totalSupply}`);
    console.log("checking status of WrappedMyToken");
    for(let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await wnft.ownerOf(tokenId);
        console.log(`Token ID: ${tokenId} -- Owner: ${owner}`);
    }
    console.log("WNFT check completed.");
})
module.exports = {};