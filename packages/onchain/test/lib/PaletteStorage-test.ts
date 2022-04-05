import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { PaletteStorageMock } from "../../typechain/PaletteStorageMock";

describe("PaletteStorage-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: PaletteStorageMock;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const PaletteStorageMock = await ethers.getContractFactory("PaletteStorageMock");
    c = await PaletteStorageMock.deploy();
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

  });
});
