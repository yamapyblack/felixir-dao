import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";

// test contracts and parameters
import { PopMock } from "../../typechain/PopMock";

const OUT_SVG_FILE = "images/encoder.svg";
const INPUT_SVG_FILE = "images/image5.png"
const INPUT_SVG_FILE2 = "images/image6.png"

describe("PopMock-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: PopMock;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const PopMock = await ethers.getContractFactory("PopMock", {});
    c = (await PopMock.deploy()) as PopMock;
    await c.deployed();
  });

  describe("test", async () => {    
    it("success setName", async () => {
      await c.push("hoge")
      await c.list()

      await c.push("fuga")
      await c.list()

      await c.pop()
      await c.list()

      // c.push("fuga")
      // console.log(c.arr.toString())


    });
  });

});
