import "@nomiclabs/hardhat-waffle"
import { ethers } from "hardhat"
import { providers, utils } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect, should, use } from "chai"
import { FelixirShop } from "../../typechain/FelixirShop"
import { ERC721Mock } from "../../typechain/ERC721Mock"
import { TreasuryMock } from "../../typechain/TreasuryMock"
import { FakeContract, smock } from '@defi-wonderland/smock'

should()
use(smock.matchers)


describe("FelixirShop.sol", () => {
    let felixirShop: FelixirShop
    let mockERC721: ERC721Mock
    let mockTresuary: TreasuryMock
    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let other: SignerWithAddress

    const options = {value: utils.parseEther("300.0")}
   
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

    describe("startSale()", () => {
        it("fail revert if isSaleNow is true", async () => {
            await expect(felixirShop.startSale()).to.be.revertedWith("Sale has already been started")
        })
        it("fail revert if msg.sender is not owner", async () => {
            await expect(felixirShop.connect(other).startSale()).to.be.revertedWith("Ownable: caller is not the owner")      
        })
    
        it("success set isSaleNow true", async () => {
            await felixirShop.settleSale()
            expect(await felixirShop.isSaleNow()).to.be.eq(false)
            await felixirShop.startSale()
            expect(await felixirShop.isSaleNow()).to.be.eq(true)
        })
        it("success emit SaleStarted event", async () => {
            await felixirShop.settleSale()
            await expect(felixirShop.startSale())
                .to.emit(felixirShop, 'SaleStarted')
                .withArgs(owner.address);
        })
    })

    describe("settleSale()", () => {
        it("fail revert if isSaleNow is false", async () => {
            await felixirShop.settleSale()
            await expect(felixirShop.settleSale()).to.be.revertedWith("Sale has already been settled")
        })
        it("fail revert if msg.sender is not owner", async () => {
            await expect(felixirShop.connect(other).settleSale()).to.be.revertedWith("Ownable: caller is not the owner")
        })
       
        it("success set isSaleNow false", async () => {
            expect(await felixirShop.isSaleNow()).to.be.eq(true)
            await felixirShop.settleSale()
            expect(await felixirShop.isSaleNow()).to.be.eq(false)
        })
        it("success emit SaleSettled event", async () => {
            await expect(felixirShop.settleSale())
                .to.emit(felixirShop, "SaleSettled")
                .withArgs(owner.address)
        })
    })

    describe("sell()", () => {
        it("fail revert if isSaleNow is false", async () => {
            await felixirShop.settleSale()
            await expect(felixirShop.connect(user1).sell(options)).to.be.revertedWith("Sale has been settled")
        })
        it("fail revert if msg.value under the sell price", async () => {
            await expect(felixirShop.connect(user1).sell({value: utils.parseEther("299.0")}))
                .to.be.revertedWith("SEND MORE ETH")
        })
        // it("fail revert if counter is more than 8888", async () => {
        //     const fakeFelixirShop = await smock.fake(felixirShop)
        //     fakeFelixirShop.counter.returns(8889)
        //     console.log(await fakeFelixirShop.counter())
        //     await expect(fakeFelixirShop.connect(user1).sell(options)).to.be.revertedWith("All felixirs have been already sold")
        // })
        it("success transfer token to msg.sender", async () => {
            expect(await mockERC721.balanceOf(user1.address)).to.be.eq(0)
            expect(await mockERC721.balanceOf(user2.address)).to.be.eq(0)

            await felixirShop.connect(user1).sell(options)
            expect(await mockERC721.balanceOf(user1.address)).to.be.eq(1)
            expect(await mockERC721.ownerOf(1)).to.be.eq(user1.address)

            await felixirShop.connect(user2).sell(options)
            expect(await mockERC721.balanceOf(user2.address)).to.be.eq(1)
            expect(await mockERC721.ownerOf(2)).to.be.eq(user2.address)
        })
        it("success increase counter", async () => {
            expect(await felixirShop.counter()).to.be.eq(1)
            await felixirShop.connect(user1).sell(options)
            expect(await felixirShop.counter()).to.be.eq(2)
            await felixirShop.connect(user2).sell(options)
            expect(await felixirShop.counter()).to.be.eq(3)
        })
        it("success transfer ETH to treasury per sell", async () => {
            const provider = ethers.provider
            expect((await provider.getBalance(mockTresuary.address)).toNumber()).to.be.eq(0)
            await felixirShop.connect(user1).sell(options)
            const treasuryBalance1 = await provider.getBalance(mockTresuary.address)
            expect(parseInt(utils.formatEther(treasuryBalance1))).to.be.eq(300)
            await felixirShop.connect(user2).sell(options)
            const treasuryBalance2 = await provider.getBalance(mockTresuary.address)
            expect(parseInt(utils.formatEther(treasuryBalance2))).to.be.eq(600)
        })
        it("success emit Received event in MockTreasury", async () => {
            await expect(felixirShop.connect(user1).sell(options))
                .to.emit(mockTresuary, 'Received')
                .withArgs(felixirShop.address, "300000000000000000000");   
        })
    })
})