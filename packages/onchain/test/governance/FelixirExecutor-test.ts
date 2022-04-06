import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect, use } from 'chai'

// test contracts and parameters
import { FelixirExecutorMock } from "../../typechain/FelixirExecutorMock";
import { utils } from "ethers";
import { BigNumberish, BytesLike } from "ethers";
import { encodeParameters, NilAddress } from "../helper/helper";
import { BigNumber } from "ethers";

type Param = {
  target: string,
  value: BigNumberish,
  signature: string,
  data: BytesLike,
  eta: BigNumberish
}

const days8 = 60 * 60 * 24 * 8

describe("FelixirExecutor-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress

  let c: FelixirExecutorMock;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const FelixirExecutorMock = await ethers.getContractFactory("FelixirExecutorMock");
    c = await FelixirExecutorMock.deploy();
    await c.deployed();

    await c.setLogic(owner.address)
  });

  describe("test", async () => {
    it("fail onlyAdmin", async () => {
      await expect(c.connect(addr1).setLogic(addr1.address)).revertedWith("FelixirExecutor::queueTransaction: Call must come from admin.")
      await c.setAdmin(NilAddress)
      await expect(c.setLogic(addr1.address)).revertedWith("FelixirExecutor::queueTransaction: Call must come from admin.")
    })

    it("fail onlyLogic", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + days8,
      }
      await expect(c.connect(addr1).queueTransaction(param.target, param.value, param.signature, param.data, param.eta)).revertedWith("FelixirExecutor::queueTransaction: Call must come from logic contract.")
      await expect(c.connect(addr1).cancelTransaction(param.target, param.value, param.signature, param.data, param.eta)).revertedWith("FelixirExecutor::queueTransaction: Call must come from logic contract.")
      await expect(c.connect(addr1).executeTransaction(param.target, param.value, param.signature, param.data, param.eta)).revertedWith("FelixirExecutor::queueTransaction: Call must come from logic contract.")
    })

    it("fail queueTransaction DELAY", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + 100,
      }
      await expect(c.queueTransaction(param.target, param.value, param.signature, param.data, param.eta)).revertedWith("FelixirExecutor::queueTransaction: Estimated execution block must satisfy delay.")
    })

    it("fail executeTransaction No1", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + days8,
      }

      await c.queueTransaction(param.target, param.value, param.signature, param.data, param.eta)
      await expect(c.executeTransaction(param.target, param.value, param.signature, [], param.eta)).revertedWith("FelixirExecutor::executeTransaction: Transaction hasn't been queued.")
    })

    it("fail executeTransaction No2", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + days8,
      }

      await c.queueTransaction(param.target, param.value, param.signature, param.data, param.eta)
      await expect(c.executeTransaction(param.target, param.value, param.signature, param.data, param.eta)).revertedWith("FelixirExecutor::executeTransaction: Transaction hasn't surpassed time lock.")
    })

    it("fail executeTransaction No3", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + days8,
      }

      await c.queueTransaction(param.target, param.value, param.signature, param.data, param.eta)

      await c.add15days()
      await expect(c.executeTransaction(param.target, param.value, param.signature, param.data, param.eta)).revertedWith("FelixirExecutor::executeTransaction: Transaction is stale.")
    })

    it("fail executeTransaction No4", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + days8,
      }

      await c.queueTransaction(param.target, param.value, param.signature, param.data, param.eta)
      const encodedParam = utils.keccak256(encodeParameters([ "address", "uint", "string", "bytes", "uint" ], [param.target, param.value, param.signature, param.data, param.eta]))

      expect(await c.queuedTransactions(encodedParam)).true

      await c.add10days()

      await expect(c.executeTransaction(param.target, param.value, param.signature, param.data, param.eta)).revertedWith("FelixirExecutor::executeTransaction: Transaction execution reverted.")
    })

    it("success queue and cancel Transaction", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + days8,
      }

      await c.queueTransaction(param.target, param.value, param.signature, param.data, param.eta)
      const encodedParam = utils.keccak256(encodeParameters([ "address", "uint", "string", "bytes", "uint" ], [param.target, param.value, param.signature, param.data, param.eta]))

      expect(await c.queuedTransactions(encodedParam)).true
      await c.cancelTransaction(param.target, param.value, param.signature, param.data, param.eta)
      expect(await c.queuedTransactions(encodedParam)).false      
    })

    it("success executeTransaction", async () => {
      let param: Param = {
        target: addr1.address,
        value: utils.parseEther("1"),
        signature: "",
        data: encodeParameters(['address'],[addr1.address]),
        eta: Math.floor(Date.now() / 1000) + days8,
      }

      await c.queueTransaction(param.target, param.value, param.signature, param.data, param.eta)
      const encodedParam = utils.keccak256(encodeParameters([ "address", "uint", "string", "bytes", "uint" ], [param.target, param.value, param.signature, param.data, param.eta]))

      expect(await c.queuedTransactions(encodedParam)).true
      await owner.sendTransaction({to: c.address, value: utils.parseEther("1")})

      await c.add10days()

      const bal = await addr1.getBalance()
      console.log((bal).toString())
      await c.executeTransaction(param.target, param.value, param.signature, param.data, param.eta)
      console.log((await addr1.getBalance()).toString())

      expect(await addr1.getBalance()).equals(BigNumber.from(bal).add(utils.parseEther("1")))

    })

  });
});
