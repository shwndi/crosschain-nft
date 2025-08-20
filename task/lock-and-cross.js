const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("lock-and-cross")
    .addOptionalParam("chainselector", "chain selector of dest chain")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addParam("tokenid", "Token ID to lock and cross")
    .setAction(async (taskArgs, hre) => {
        let chainSelector;
        let receiver;
        const tokenId = taskArgs.tokenid;
        const { firstNameAccount } = await getNamedAccounts();

        if (taskArgs.chainSelector) {
            chainSelector = taskArgs.chainselector;
        } else {
            chainSelector = networkConfig[hre.network.config.chainId].companionChainSelector;
            console.log("chain selector is not set in command")
        }
        console.log(`Chain Selector: ${chainSelector}`);
        if (taskArgs.receiver) {
            receiver = taskArgs.receiver;
        } else {
            const nftBurnAndMint =
                await hre.companionNetworks["destChain"]
                    .deployments.get("NFTPoolBurnAndMint");
            receiver = nftBurnAndMint.address;
            console.log("receiver is not set in command")
        }
        console.log(`Receiver: ${receiver}`);

        // transfer Link token to the address of the pool
        const linkTokenAddr = networkConfig[network.config.chainId].linkToken;
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddr);
        const nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstNameAccount);
        const balanceBefore = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`balance before: ${balanceBefore}`)

        const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther("10"));
        await transferTx.wait(6);
        const balance = await linkToken.balanceOf(nftPoolLockAndRelease.target);
        console.log(`Link token balance of NFTPoolLockAndRelease: ${balance}`);

        // approve pool address to call transferFrom
        const nft = await ethers.getContract("MyToken", firstNameAccount);
        await nft.approve(nftPoolLockAndRelease.target, tokenId);
        console.log("approve successfully");

        // call lockAndSendNFT
        const lockAndSendNFTTx = await nftPoolLockAndRelease.lockAndSendNFT(
            tokenId,
            firstNameAccount,
            chainSelector,
            receiver
        );
        await lockAndSendNFTTx.wait(6);
        console.log(`ccip transfer is send ,the tx hash is ${lockAndSendNFTTx.hash} `);
    })

module.exports = {};