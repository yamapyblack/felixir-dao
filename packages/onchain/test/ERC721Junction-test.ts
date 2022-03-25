import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

//
import { ERC721JunctionMock } from "../typechain/ERC721JunctionMock"
import { ERC721Mock } from "../typechain/ERC721Mock"

describe("testing", async () => {
    let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress
    let contract: ERC721JunctionMock
    let c1: ERC721Mock

    beforeEach(async () => {
        [owner, addr1, addr2,] = await ethers.getSigners()

        const ERC721Mock = await ethers.getContractFactory("ERC721Mock")
        c1 = (await ERC721Mock.deploy()) as ERC721Mock
        await c1.deployed()

        const ERC721JunctionMock = await ethers.getContractFactory("ERC721JunctionMock")
        contract = (await ERC721JunctionMock.deploy()) as ERC721JunctionMock
        await contract.deployed()
    })

    describe("unJunction", async () => {

        it("fail approve", async () => {
            const pTokenId = 1
            const cTokenId = 2

            await contract.mint(owner.address, pTokenId)
            await c1.mint(owner.address, cTokenId)

            await expect(contract.junction(pTokenId, {addr: c1.address,id: cTokenId}, owner.address)).revertedWith("ERC721Junction: not approved")
        })

        it("fail not owner", async () => {
            const pTokenId = 1
            const cTokenId = 2

            await contract.mint(owner.address, pTokenId)
            await c1.mint(owner.address, cTokenId)

            await c1.setApprovalForAll(contract.address, true)
            await contract.junction(pTokenId, {addr: c1.address,id: cTokenId}, owner.address)

            await expect(contract.connect(addr1).unJunction(pTokenId)).revertedWith("ERC721Junction: unJunction by only parent tokens owner")
        })


        it("success", async () => {
            const pTokenId = 1
            const cTokenId = 2

            await contract.mint(owner.address, pTokenId)
            await c1.mint(owner.address, cTokenId)

            await c1.setApprovalForAll(contract.address, true)
            await contract.junction(pTokenId, {addr: c1.address,id: cTokenId}, owner.address)

            await contract["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, pTokenId)
            expect(addr1.address).equals(await contract.ownerOf(pTokenId))

            await contract.connect(addr1).unJunction(pTokenId)
            expect(addr1.address).equals(await c1.ownerOf(cTokenId))
        })

        it("success multiple", async () => {
            const pTokenId = 1
            const cTokenId = 2
            const cTokenId2 = 3

            await contract.mint(owner.address, pTokenId)
            await c1.mint(owner.address, cTokenId)
            await c1.mint(owner.address, cTokenId2)

            await c1.setApprovalForAll(contract.address, true)
            await contract.junction(pTokenId, {addr: c1.address,id: cTokenId}, owner.address)
            await contract.junction(pTokenId, {addr: c1.address,id: cTokenId2}, owner.address)

            await contract["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, pTokenId)
            expect(addr1.address).equals(await contract.ownerOf(pTokenId))

            await contract.connect(addr1).unJunction(pTokenId)
            expect(addr1.address).equals(await c1.ownerOf(cTokenId))
            expect(addr1.address).equals(await c1.ownerOf(cTokenId2))
        })
    });
});