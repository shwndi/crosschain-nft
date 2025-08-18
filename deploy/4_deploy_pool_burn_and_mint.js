// const { deployments, getNamedAccounts, ethers } = require("hardhat");

module.exports= async({deployments,getNamedAccounts})=>{
    const {firstNameAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;
// address _router,address _link, address nftAddr
    const CCIPSimulatordeploment = await deployments.get("CCIPLocalSimulator");
    const CCIPSimulator  =  await ethers.getContractAt("CCIPLocalSimulator",CCIPSimulatordeploment.address); 
    const config =await  CCIPSimulator.configuration();
    // const sourceRouter = config.sourceRouter_;
    // const chainSelector = config.chainSelector_;
    const destinationRouter = config.destinationRouter_;
    const linkTokenAddr = config.linkToken_;

    const wnftDeploment = await deployments.get("WrappedMyToken");
    const wnftAddr = wnftDeploment.address;
    
    log("Deploying NFTPoolBurnAndMint contract...");
    await deploy("NFTPoolBurnAndMint",{
        contract:"NFTPoolBurnAndMint",
        from: firstNameAccount,
        log: true,
        args: [destinationRouter, linkTokenAddr,wnftAddr]
    })
    log("NFTPoolBurnAndMint deployed successfully!");
}

module.exports.tags = ["destchain","all"];   