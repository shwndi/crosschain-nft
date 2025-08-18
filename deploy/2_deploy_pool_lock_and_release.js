// const { deployments, getNamedAccounts, ethers } = require("hardhat");

module.exports= async({deployments,getNamedAccounts})=>{
    const {firstNameAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;
// address _router,address _link, address nftAddr
    const ccipSimulatordeploment = await deployments.get("CCIPLocalSimulator");
    const ccipSimulator  =  await ethers.getContractAt("CCIPLocalSimulator",ccipSimulatordeploment.address); 
    const ccipConfig = await ccipSimulator.configuration();
    const sourceRouter = ccipConfig.sourceRouter_;
    // const chainSelector = config.chainSelector_;
    // const destinationRouter = config.destinationRouter_;
    const linkTokenAddr = ccipConfig.linkToken_;

    const nftDeploment = await deployments.get("MyToken");
    const nftAddr = nftDeploment.address;
    
    log("Deploying NFTPoolLockAndRelease contract...");
    await deploy("NFTPoolLockAndRelease",{
        contract:"NFTPoolLockAndRelease",
        from: firstNameAccount,
        log: true,
        args: [sourceRouter, linkTokenAddr,nftAddr]
    })
    log("NFTPoolLockAndRelease deployed successfully!");
}

module.exports.tags = ["sourcechain","all"];   