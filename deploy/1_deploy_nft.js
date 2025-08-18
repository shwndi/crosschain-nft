module.exports =  async({getNamedAccounts,deployments})=>{
    const {firstNameAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("Deploying NFT contract...");
    await deploy("MyToken",{
        contract: "MyToken",
        from: firstNameAccount,
        args: ["MyToken","MT"],
        log: true,
    })
    log("NFT contract deployed successfully")

}

module.exports.tags=["sourcechain","all"]