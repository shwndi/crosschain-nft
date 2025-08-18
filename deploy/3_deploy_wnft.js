module.exports =  async({getNamedAccounts,deployments})=>{
    const {firstNameAccount} = await getNamedAccounts();
    const {deploy,log} = deployments;

    log("Deploying WWNFTNFT contract...");
    await deploy("WrappedMyToken",{
        contract: "WrappedMyToken",
        from: firstNameAccount,
        args: ["WrappedMyToken","WNFT"],
        log: true,
    })
    log("WNFT contract deployed successfully")

}

module.exports.tags=["destchain","all"]