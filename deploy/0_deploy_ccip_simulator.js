module.exports =  async({getNamedAccounts,deployments})=>{
    const {firstNameAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("Deploying CCIPSimulator contract...");
    await deploy("CCIPLocalSimulator",{
        contract: "CCIPLocalSimulator",
        from: firstNameAccount,
        args: [],
        log: true
    })
    log("CCIPSimulator contract deployed successfully")

}

module.exports.tags=["test","all"]