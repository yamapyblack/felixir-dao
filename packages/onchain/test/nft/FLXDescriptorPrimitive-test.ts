import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { FLXDescriptorPrimitive } from "../../typechain/FLXDescriptorPrimitive";
// import { NFTDescriptor } from "../typechain/NFTDescriptor";
import { ERC721JunctionMock } from "../../typechain/ERC721JunctionMock";

const OUT_SVG_FILE = "images/encoder.svg";
const INPUT_SVG_FILE = "images/chr_all_2.png"

describe("FLXDescriptorPrimitive-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: FLXDescriptorPrimitive;
  let c0;
  let c2: ERC721JunctionMock;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const ERC721JunctionMock = await ethers.getContractFactory("ERC721JunctionMock");
    c2 = await ERC721JunctionMock.deploy();
    await c2.deployed();

    const NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    c0 = await NFTDescriptor.deploy();
    await c0.deployed();

    const FLXDescriptorPrimitive = await ethers.getContractFactory("FLXDescriptorPrimitive", {
      libraries: { NFTDescriptor: c0.address },
    });
    c = (await FLXDescriptorPrimitive.deploy()) as FLXDescriptorPrimitive;
    await c.deployed();

    await c.setToken(c2.address)
  });

  describe("test", async () => {
    it("fail setToken", async () => {
      await expect(c.connect(addr1).setToken(addr1.address)).reverted
    });

    it("success setToken", async () => {
      await c.setToken(addr1.address)
      expect(await c.token()).equals(addr1.address)
    });

    // it("success generateImage", async () => {
    //   const encodeJson = await encode(INPUT_SVG_FILE);
    //   const palettes = encodeJson.palette;
    //   palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
    //   const seed = encodeJson.images.root[0].data;
    //   console.log(palettes)

    //   await c.addBulkColorsToPalette(0, palettes);
    //   await c.setSeed(0, seed);

    //   const svg = await c.generateImage(0);
    //   const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg));
    //   console.log(svg2)
    //   await fs.writeFile(OUT_SVG_FILE, svg2);
    // });

    it("success all generateImage", async () => {

      for(let i = 0; i < 48; i++){
        const INPUT_SVG_FILE_ALL = "images/chr_all_" + (i+1) + ".png"

        const encodeJson = await encode(INPUT_SVG_FILE_ALL);
        const palettes = encodeJson.palette;
        palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
        const seed = encodeJson.images.root[0].data;
        console.log(palettes)
  
        console.log(i)
        await c.addBulkColorsToPalette(i, palettes);
        await c.setSeed(i, seed);  
      }

      // const s = await c.seeds(14)
      // console.log(s)
      // const p = await c.palettes(14,0)
      // console.log(p)

      const svg = await c.generateImage(0);
      // console.log(svg)
      const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg));
      // console.log(svg2)
      await fs.writeFile(OUT_SVG_FILE, svg2);

    });

  });
});
