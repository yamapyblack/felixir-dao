import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { FLXDescriptor } from "../../typechain/FLXDescriptor";
// import { MultiPartRLEToSVG } from "../typechain/MultiPartRLEToSVG";

const OUT_SVG_FILE = "images/encoder.svg";
const INPUT_SVG_FILE = "images/image5.png"
const INPUT_SVG_FILE2 = "images/image6.png"

describe("testing", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: FLXDescriptor;
  // let c0: MultiPartRLEToSVG;
  let c0;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const MultiPartRLEToSVG = await ethers.getContractFactory("MultiPartRLEToSVG");
    // c0 = (await MultiPartRLEToSVG.deploy()) as MultiPartRLEToSVG;
    c0 = await MultiPartRLEToSVG.deploy();
    await c0.deployed();

    const FLXDescriptor = await ethers.getContractFactory("FLXDescriptor", {
      // libraries: { MultiPartRLEToSVG: c0.address },
    });
    c = (await FLXDescriptor.deploy()) as FLXDescriptor;
    await c.deployed();
  });

  describe("test", async () => {
    it("fail setSeed", async () => {
      await expect(c.connect(addr1).setSeed(0, "")).reverted
    })

    it("success setSeed", async () => {
      const seed = '0x0001131f100301030103010301030103010301020201010301010102030301010101040101010101040101030103010301030103010301030103010301030103010301030103010301030103010301'
      await c.setSeed(0, seed)
      expect(await c.seeds(0)).equals(seed)
    })

    it("fail addBulkColorsToPalette", async () => {      
      await expect(c.connect(addr1).addBulkColorsToPalette(0, [''])).reverted
    })

    it("fail addBulkColorsToPalette 256colors", async () => {
      let palettes = []
      for(let i = 0; i < 257; i++){
        palettes.push('ffffff')
      }
      await expect(c.addBulkColorsToPalette(0, palettes)).revertedWith('Palettes can only hold 256 colors')
    })

    it("success addBulkColorsToPalette", async () => {      
      const palettes = ["ffffff", "181b1d"]
      await c.addBulkColorsToPalette(0, palettes)
      expect(await c.palettes(0,0)).equals(palettes[0])
      expect(await c.palettes(0,1)).equals(palettes[1])
    })

    it("fail addColorToPalette", async () => {      
      await expect(c.connect(addr1).addColorToPalette(0, '')).reverted
    })

    it("fail addColorToPalette 256colors", async () => {
      let palettes = []
      for(let i = 0; i < 256; i++){
        palettes.push('ffffff')
      }
      await c.addBulkColorsToPalette(0, palettes)
      await expect(c.addColorToPalette(0, 'f0f0f0')).revertedWith('Palettes can only hold 256 colors')
    })

    it("success addColorToPalette", async () => {      
      const palette = "ffffff"
      await c.addColorToPalette(0, palette)
      expect(await c.palettes(0,0)).equals(palette)
    })

    it("success generateImage", async () => {
      const encodeJson = await encode(INPUT_SVG_FILE);
      const palettes = encodeJson.palette;
      palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
      const seed = encodeJson.images.root[0].data;
      console.log(palettes)

      await c.addBulkColorsToPalette(0, palettes);
      await c.setSeed(0, seed);

      // const svg = await c.generateImage(0);
      // const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg));
      // console.log(svg2)
      // await fs.writeFile(OUT_SVG_FILE, svg2);
    });
  });
});
