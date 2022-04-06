import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import path from "path";

// test contracts and parameters
import { FLXDescriptor } from "../../typechain/FLXDescriptor";
// import { MultiPartRLEToSVG } from "../typechain/MultiPartRLEToSVG";

const OUT_SVG_FILE = "images/encoder.svg";
const INPUT_SVG_FILE = "images/image5.png"
const INPUT_SVG_FILE2 = "images/image6.png"

describe("encoder-test", async () => {
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
    it("success weapon", async () => {
      // const palettes = ["", "ffffff", "181b1d", "550e11", "0e6775"];
      // const seed =
      //   "0x0001131f100301030103010301030103010301020201010301010102030301010101040101010101040101030103010301030103010301030103010301030103010301030103010301030103010301";

      const encodeJson = await encode(INPUT_SVG_FILE);
      const palettes = encodeJson.palette;
      palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
      const seed = encodeJson.images.root[0].data;
      console.log(seed)

      await c.addBulkColorsToPalette(0, palettes);
      await c.setSeed(0, seed);

      const svg = await c.generateImage(0);
      const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg));
      console.log(svg2)
      await fs.writeFile(OUT_SVG_FILE, svg2);

      // const svg1 = svg.split(",")[1];
      // const svg2 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg1));
      // const svg3 = svg2.split(",")[3];
      // const svg4 = ethers.utils.toUtf8String(ethers.utils.base64.decode(svg3));
      // console.log(svg4);

      // await fs.writeFile(OUT_SVG_FILE, svg4);
    });
  });
});
