const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("burn-and-cross")
    .addOptionalParam("chainselector", "The chain selector for the desitnation chain --> seoplia")
    .addOptionalParam("receiver", "The receiver address on the desitnation chain --> seoplia")
    .addParam("tokenid", "The ID of the token to burn and cross")
    .setAction(
        async (taskArgs, hre) => {
            const { firstNameAccount } = await getNamedAccounts();
            const tokenId = taskArgs.tokenid;
            let chainSelector;
            let receiver;
            if (taskArgs.chainSelector) {
                chainSelector = taskArgs.chainSelector;
            } else {
                chainSelector = networkConfig[network.config.chainId].companionChainSelector;
                console.log("chain selector is not set in command, using default from config");
            }
            console.log(`Chain Selector: ${chainSelector}`);

            if (taskArgs.receiver) {
                receiver = taskArgs.receiver;
            } else {
                const nftPoolLockAndRelease =
                    await hre.companionNetworks["destChain"]
                        .deployments.get("NFTPoolLockAndRelease");
                receiver = nftPoolLockAndRelease.address;
                console.log("receiver is not set in command, using default from deployment");
            }
            console.log(`Receiver: ${receiver}`);

            // transfer Link token to the address of the pool
            const linkTokenAddr = networkConfig[network.config.chainId].linkToken;
            const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddr);
            const nftBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstNameAccount);
            const balanceBefore = await linkToken.balanceOf(nftBurnAndMint.target);
            console.log(`balance before: ${balanceBefore}`);

            // const transferTx = await linkToken.transfer(nftBurnAndMint.target, ethers.parseEther("10"));
            // await transferTx.wait(6);
            // const balance = await linkToken.balanceOf(nftBurnAndMint.target);
            // console.log(`Link token balance of NFTPoolBurnAndMint: ${balance}`);

            // approve pool address to call transferFrom
            const wnft = await ethers.getContract("WrappedMyToken", firstNameAccount);
            await wnft.approve(nftBurnAndMint.target, tokenId);
            console.log("approve successfully");

            console.log("tokenId: ", tokenId);
            console.log("receiver: ", receiver);
            console.log("chainSelector: ", chainSelector);
            console.log("firstNameAccount: ", firstNameAccount);
            console.log("nftBurnAndMint.target: ", nftBurnAndMint.target);
            const nftBurnAndMintTx = await nftBurnAndMint.burnAndSendNFT(
                tokenId,
                firstNameAccount,
                chainSelector,
                receiver
            );
            await nftBurnAndMintTx.wait(6);
            console.log(`ccip transfer is sent, the tx hash is ${nftBurnAndMintTx.hash}`);
        }
    )

module.exports = {};