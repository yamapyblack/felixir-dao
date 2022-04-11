import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { FLXDescriptor } from "../../typechain/FLXDescriptor";
// import { NFTDescriptor } from "../typechain/NFTDescriptor";

const OUT_SVG_FILE = "images/encoder.svg";
const INPUT_SVG_FILE = "images/chr_all_2.png"
const INPUT_SVG_FILE2 = "images/image6.png"

describe("FLXDescriptor-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: FLXDescriptor;
  let c0;

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
  });

  describe("test", async () => {
    it("fail setName", async () => {
      await expect(c.connect(addr1).setName("hoge")).reverted
    });

    it("success setName", async () => {
      await c.setName("hoge")
      expect(await c.generateName(1)).equals("hoge1")
    });

    it("fail setDescription", async () => {
      await expect(c.connect(addr1).setDescription("hoge")).reverted
    });

    it("success setDescription", async () => {
      await c.setDescription("hoge")
      expect(await c.generateDescription(1)).equals("hoge")
    });

    it("success generateImage", async () => {
      const encodeJson = await encode(INPUT_SVG_FILE);
      const palettes = encodeJson.palette;
      palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
      const seed = encodeJson.images.root[0].data;
      console.log(palettes)

      await c.addBulkColorsToPalette(0, palettes);
      await c.setSeed(0, seed);

      const svg = await c.generateImage(0);
      // const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg));
      // console.log(svg2)
      // await fs.writeFile(OUT_SVG_FILE, svg2);
    });
  });
});
