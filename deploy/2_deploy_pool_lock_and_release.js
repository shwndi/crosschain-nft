// const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { firstNameAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("Deploying NFTPoolLockAndRelease contract...");
    
    let sourceRouter, linkTokenAddr;
    if (developmentChains.includes(network.name)) {
        const ccipSimulatordeploment = await deployments.get("CCIPLocalSimulator");
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatordeploment.address);
        const ccipConfig = await ccipSimulator.configuration();
        sourceRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        sourceRouter = networkConfig[network.config.chainId].router;
        linkTokenAddr = networkConfig[network.config.chainId].linkToken;
    }


    const nftDeploment = await deployments.get("MyToken");
    const nftAddr = nftDeploment.address;

    await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstNameAccount,
        log: true,
        args: [sourceRouter, linkTokenAddr, nftAddr]
    })
    log("NFTPoolLockAndRelease deployed successfully!");
}

module.exports.tags = ["sourcechain", "all"];   