import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

//
import { ERC721Carrier } from "../typechain/ERC721Carrier"
import { ERC721Mock } from "../typechain/ERC721Mock"

describe("testing", async () => {
    let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress
    let contract: ERC721Carrier
    let c1: ERC721Mock

    beforeEach(async () => {
        [owner, addr1, addr2,] = await ethers.getSigners()

        const ERC721Mock = await ethers.getContractFactory("ERC721Mock")
        c1 = (await ERC721Mock.deploy()) as ERC721Mock
        await c1.deployed()

        const ERC721Carrier = await ethers.getContractFactory("ERC721Carrier")
        contract = (await ERC721Carrier.deploy("ERC721Carrier", "ERC721CARRIER")) as ERC721Carrier
        await contract.deployed()
    })

    describe("tokenURI", async () => {

        it("success", async () => {
            const pTokenId = 1
            const exTokenId = 2

            await contract["mint(address,uint256)"](owner.address, pTokenId)
            await c1.mint(owner.address, exTokenId)

            await c1.setApprovalForAll(contract.address, true)
            await contract.deposit(c1.address, exTokenId, pTokenId, owner.address)

            await contract["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, pTokenId)
            expect(addr1.address).equals(await contract.ownerOf(pTokenId))

            await contract.connect(addr1).withdraw(c1.address, exTokenId, pTokenId)
            expect(addr1.address).equals(await c1.ownerOf(exTokenId))
        })
    });
});