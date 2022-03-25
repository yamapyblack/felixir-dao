import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

//
import { ERC721PrimitiveMock } from "../typechain/ERC721PrimitiveMock"
import { FLXSvgBase } from "../typechain/FLXSvgBase"
import { FLXTokenDescriptor } from "../typechain/FLXTokenDescriptor"
  
describe("testing", async () => {
    let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress
    let contract: ERC721PrimitiveMock
    let c1: FLXSvgBase
    let c2: FLXTokenDescriptor

    beforeEach(async () => {
        [owner, addr1, addr2,] = await ethers.getSigners()

        const FLXSvgBase = await ethers.getContractFactory("FLXSvgBase");
        c1 = (await FLXSvgBase.deploy()) as FLXSvgBase
        await c1.deployed()

        const FLXTokenDescriptor = await ethers.getContractFactory("FLXTokenDescriptor", {
            libraries: {FLXSvgBase: c1.address}
        })
        c2 = (await FLXTokenDescriptor.deploy()) as FLXTokenDescriptor
        await c2.deployed()

        const ERC721PrimitiveMock = await ethers.getContractFactory("ERC721PrimitiveMock");
        contract = (await ERC721PrimitiveMock.deploy()) as ERC721PrimitiveMock
        await contract.deployed()

        await contract.setDescriptor(c2.address)
    })

    describe("tokenURI", async () => {

        it("success", async () => {
            const tokenId = 1
            await contract["mint(address,uint256)"](addr1.address, tokenId)

            const svg = await contract.tokenURI(tokenId)
            console.log(svg)

            const svg1 = svg.split(",")[1]
            const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1))
            const svgarr = svg2.split(",")
            const svg3 = svgarr[svgarr.length-1]
            const svg4 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg3))
            console.log(svg4)
        })
    });
});