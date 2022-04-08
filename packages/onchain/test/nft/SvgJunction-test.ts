import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'

// test contracts and parameters
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive";
import { FLXDescriptor } from "../../typechain/FLXDescriptor";
import { FLXPrimitive } from "../../typechain/FLXPrimitive";
import { FLXExtension } from "../../typechain/FLXExtension";

const OUT_SVG_FILE = "images/encoder.svg";
const INPUT_SVG_FILE = "images/image_soard2.png"
const INPUT_SVG_FILE2 = "images/image5.png"

describe("SvgJunction-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c0;
  let c: FLXDescriptor;
  let c1: FLXDescriptorPrimitive;
  let c2: FLXExtension;
  let c3: FLXPrimitive;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    c0 = await NFTDescriptor.deploy();
    await c0.deployed();

    const FLXDescriptor = await ethers.getContractFactory("FLXDescriptor", {
      libraries: { NFTDescriptor: c0.address },
    });
    c = (await FLXDescriptor.deploy()) as FLXDescriptor;
    await c.deployed();

    const FLXDescriptorPrimitive = await ethers.getContractFactory("FLXDescriptorPrimitive", {
      libraries: { NFTDescriptor: c0.address },
    });
    c1 = (await FLXDescriptorPrimitive.deploy()) as FLXDescriptorPrimitive;
    await c.deployed();

    const FLXExtension = await ethers.getContractFactory("FLXExtension", {});
    c2 = (await FLXExtension.deploy()) as FLXExtension;
    await c2.deployed();

    const FLXPrimitive = await ethers.getContractFactory("FLXPrimitive", {});
    c3 = (await FLXPrimitive.deploy()) as FLXPrimitive;
    await c3.deployed();

    await c2.setDescriptor(c.address)
    await c3.setDescriptor(c1.address)
  });

  describe("test", async () => {
    it("success generateImage", async () => {
      //set seed palettes
      const encodeJson = await encode(INPUT_SVG_FILE);
      const palettes = encodeJson.palette;
      palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
      const seed = encodeJson.images.root[0].data;
      console.log(palettes)

      await c.addBulkColorsToPalette(0, palettes);
      await c.setSeed(0, seed);

      const encodeJson2 = await encode(INPUT_SVG_FILE2);
      const palettes2 = encodeJson2.palette;
      palettes2.shift(); // Nounsのだと先頭が空になるため、先頭削除
      const seed2 = encodeJson2.images.root[0].data;
      console.log(palettes2)

      await c1.addBulkColorsToPalette(0, palettes2)
      await c1.setSeed(0, seed2)

      //mint
      await c2["mint(address,uint256)"](owner.address, 1)
      await c3["mint(address,uint256)"](owner.address, 1)

      //junction
      await c2.setApprovalForAll(c3.address, true)
      await c3.junction(1,[{addr: c2.address, id: 1}])

      //set token address to descriptor
      await c1.setToken(c3.address)
      
      //tokenURI
      const svg = await c3.tokenURI(1)
      const svg1 = svg.split(",")[1];
      const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1));
      console.log(svg2);

      const svg2s = svg2.split(",")
      const svg3 = svg2s[svg2s.length-1];
      const svg4 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg3));
      // console.log(svg4);

      await fs.writeFile(OUT_SVG_FILE, svg4);
    });
  });
});
