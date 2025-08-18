const { deployments, ethers } = require("hardhat");
const { expect } = require("chai");

// prepare variables: contract ，account

let firstNameAccount, ccipSimulator, nft, nftPoolLockAndRelease, wnft, nftPoolBurnAndMint;
let chainSelector;
before(async function () {
    firstNameAccount = (await getNamedAccounts()).firstNameAccount;
    await deployments.fixture(["all"]);
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator", firstNameAccount);
    nft = await ethers.getContract("MyToken", firstNameAccount);
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstNameAccount);
    wnft = await ethers.getContract("WrappedMyToken", firstNameAccount);
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstNameAccount);
    const config = await ccipSimulator.configuration();
    // console.log("CCIP配置:", config);
    chainSelector = config.chainSelector_;
})
// source chain --> destination chain
describe("source chain --> destination chain", async function () {
    // test if user can mint nft from nft contract successfully
    it("test if user can mint nft from nft contract successfully", async function () {
        await nft.safeMint(firstNameAccount);
        const owner = await nft.ownerOf(0);
        expect(owner).to.equal(firstNameAccount);
    })
    // test if user can lock the nft in the pool and send ccip message on source chain
    it("test if user can lock the nft in the pool and send ccip message on source chain", async function () {
        await nft.approve(nftPoolLockAndRelease.target, 0);
        await ccipSimulator.requestLinkFromFaucet(
            nftPoolLockAndRelease.target, ethers.parseEther("10"));
        await nftPoolLockAndRelease.lockAndSendNFT(0,
            firstNameAccount,
            chainSelector,
            nftPoolBurnAndMint.target);

        const owner = await nft.ownerOf(0);
        expect(owner).to.equal(nftPoolLockAndRelease);
    })
    // test if user can get a warpped nft in the destination chain
    it("test if user can get a warpped nft in the destination chain", async function () {
        const wnftOwner = await wnft.ownerOf(0);
        expect(wnftOwner).to.equal(firstNameAccount);
    })

})
// destination chain --> source chain
describe("destination chain --> source chain", async function () {
    // test if user can burn the warpped nft and send ccip message on the dest chain
    it("test if user can burn the warpped nft and send ccip message on the dest chain", async function () {
        await wnft.approve(nftPoolBurnAndMint.target, 0);
        await ccipSimulator.requestLinkFromFaucet(nftPoolBurnAndMint.target, ethers.parseEther("10"));
        await nftPoolBurnAndMint.burnAndSendNFT(0,
            firstNameAccount,
            chainSelector,
            nftPoolLockAndRelease.target
        )
        const totalSupply = await wnft.totalSupply();
        expect(totalSupply).to.equal(0);
    })
    // test if user have the unlock nft on source chain
    it("test if user have the unlock nft on source chain", async function () {
        const nftOwnet = await nft.ownerOf(0);
        expect(nftOwnet).to.equal(firstNameAccount);
    })
})
