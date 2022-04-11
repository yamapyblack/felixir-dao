import "@nomiclabs/hardhat-waffle"
import { ethers } from "hardhat"
import { utils } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai"
import { FelixirShop } from "../../typechain/FelixirShop"
import { ERC721Mock } from "../../typechain/ERC721Mock"
import { TreasuryMock } from "../../typechain/TreasuryMock"


describe("FelixirShop.sol", () => {
    let felixirShop: FelixirShop
    let mockERC721: ERC721Mock
    let mockTresuary: TreasuryMock
    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let other: SignerWithAddress

    const options = {value: utils.parseEther("1.0")}
   
    beforeEach(async () => {
        [owner, user1, user2, other] = await ethers.getSigners()
        mockERC721 = await (await ethers.getContractFactory("ERC721Mock")).deploy()
        mockTresuary = await (await ethers.getContractFactory("TreasuryMock")).deploy()
        felixirShop = await (await ethers.getContractFactory("FelixirShop")).deploy(
            mockERC721.address, mockTresuary.address
        )
    })
    
    describe("constructor()", () => {
        it("set felixirs", async () => {
            expect(await felixirShop.felixirs()).to.be.eq(mockERC721.address) 
        })
        it("set tresury", async () => {
            expect(await felixirShop.treasury()).to.be.eq(mockTresuary.address)    
        })
        it("set owner", async () => {
            expect(await felixirShop.owner()).to.be.eq(owner.address)
        })
        it("set isSaleNow", async () => {
            expect(await felixirShop.isSaleNow()).to.be.eq(true)    
        })
    })

    describe("setSale()", () => {
        it("fail revert if msg.sender is not the contract owner", async () => {
            await expect(felixirShop.connect(other).setSale(false)).to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("fail revert if param _isSaleNow has same status with isSaleNow", async () => {
            expect(await felixirShop.isSaleNow()).to.be.eq(true)
            await expect(felixirShop.setSale(true)).to.be.revertedWith("The sale has already been started/settled")
            await felixirShop.setSale(false)
            await expect(felixirShop.setSale(false)).to.be.revertedWith("The sale has already been started/settled")
        })
        it("success update setSale", async () => {
            expect(await felixirShop.isSaleNow()).to.be.eq(true)
            await felixirShop.setSale(false)
            expect(await felixirShop.isSaleNow()).to.be.eq(false)
            await felixirShop.setSale(true)    
            expect(await felixirShop.isSaleNow()).to.be.eq(true)
        })
    })

    describe("buy()", () => {
        it("fail revert if isSaleNow is false", async () => {
            await felixirShop.setSale(false)
            await expect(felixirShop.connect(user1).buy(options)).to.be.revertedWith("Sale has been settled")
        })
        it("fail revert if msg.value is not tokenPrice", async () => {
            await expect(felixirShop.connect(user1).buy({value: utils.parseEther("0.9")}))
                .to.be.revertedWith("SEND MORE ETH")
        })
        //this test takes too much time.
        // it("fail revert if counter is more than 8888", async () => {
        //     for (let i = 1; i <= 8889; i++) {
        //         if (i == 8889) {
        //             await expect(felixirShop.connect(user1).buy(options))
        //                 .to.be.revertedWith("All felixirs have been already sold")    
        //         } else {
        //             await felixirShop.connect(user1).buy(options)
        //             expect(await felixirShop.counter()).to.be.eq(i + 1)
        //         }
        //     } 
        // })
        it("success transfer token to msg.sender", async () => {
            expect(await mockERC721.balanceOf(user1.address)).to.be.eq(0)
            expect(await mockERC721.balanceOf(user2.address)).to.be.eq(0)

            await felixirShop.connect(user1).buy(options)
            expect(await mockERC721.balanceOf(user1.address)).to.be.eq(1)
            expect(await mockERC721.ownerOf(1)).to.be.eq(user1.address)

            await felixirShop.connect(user2).buy(options)
            expect(await mockERC721.balanceOf(user2.address)).to.be.eq(1)
            expect(await mockERC721.ownerOf(2)).to.be.eq(user2.address)
        })
        it("success increase counter", async () => {
            expect(await felixirShop.counter()).to.be.eq(1)
            await felixirShop.connect(user1).buy(options)
            expect(await felixirShop.counter()).to.be.eq(2)
            await felixirShop.connect(user2).buy(options)
            expect(await felixirShop.counter()).to.be.eq(3)
        })
        it("success transfer ETH to treasury per buy", async () => {
            const provider = ethers.provider
            expect((await provider.getBalance(mockTresuary.address)).toNumber()).to.be.eq(0)
            await felixirShop.connect(user1).buy(options)
            const treasuryBalance1 = await provider.getBalance(mockTresuary.address)
            expect(parseInt(utils.formatEther(treasuryBalance1))).to.be.eq(1)
            await felixirShop.connect(user2).buy(options)
            const treasuryBalance2 = await provider.getBalance(mockTresuary.address)
            expect(parseInt(utils.formatEther(treasuryBalance2))).to.be.eq(2)
        })
        it("success emit Received event in MockTreasury", async () => {
            await expect(felixirShop.connect(user1).buy(options))
                .to.emit(mockTresuary, 'Received')
                .withArgs(felixirShop.address, "1000000000000000000");   
        })
    })
})