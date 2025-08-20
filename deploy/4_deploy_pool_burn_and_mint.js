// const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { firstNameAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;
    
    log("Deploying NFTPoolBurnAndMint contract...");

    let destinationRouter, linkTokenAddr;
    if (developmentChains.includes(network.name)) {
        const CCIPSimulatordeploment = await deployments.get("CCIPLocalSimulator");
        const CCIPSimulator = await ethers.getContractAt("CCIPLocalSimulator", CCIPSimulatordeploment.address);
        const config = await CCIPSimulator.configuration();

        destinationRouter = config.destinationRouter_;
        linkTokenAddr = config.linkToken_;
    } else {
        destinationRouter = networkConfig[network.config.chainId].router;
        linkTokenAddr = networkConfig[network.config.chainId].linkToken;
    }               

    const wnftDeploment = await deployments.get("WrappedMyToken");
    const wnftAddr = wnftDeploment.address;

    await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstNameAccount,
        log: true,
        args: [destinationRouter, linkTokenAddr, wnftAddr]
    })
    log("NFTPoolBurnAndMint deployed successfully!");
}

module.exports.tags = ["destchain", "all"];   