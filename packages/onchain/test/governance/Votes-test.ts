import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { encode } from "../../scripts/svg/encoder";
import { promises as fs } from "fs";
import { expect, use } from 'chai'
import path from "path";
import {getBlockNumber, NilAddress} from "../helper/helper"

// test contracts and parameters
import { VotesMock } from "../../typechain/VotesMock";

const ethSigUtil = require('eth-sig-util');
import { fromRpcSig } from 'ethereumjs-util'
const Wallet = require('ethereumjs-wallet').default;

const name = "VotesMock";
const version = '1';
const chainId = 31337 //hardhat default

const Delegation = [
  { name: 'delegatee', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
];

const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
];  

describe("Votes-test", async () => {
  let owner :SignerWithAddress, addr1 :SignerWithAddress, addr2 :SignerWithAddress
  let c: VotesMock;

  beforeEach(async () => {
    [owner, addr1, addr2,] = await ethers.getSigners()

    const VotesMock = await ethers.getContractFactory("VotesMock");
    c = await VotesMock.deploy();
    await c.deployed();

  });

  describe("test", async () => {
    it("success getVotes", async () => {
      expect(await c.getVotes(owner.address)).equals(0)
    })

    it("success transferVotingUnits", async () => {
      await c.transferVotingUnits(NilAddress, owner.address, 1)
      const t = await c.getTotalSupply()
      expect(await c.getVotes(owner.address)).equals(1)
    })

    it("success getPastVotes and getPastTotalSupply", async () => {
      await c.transferVotingUnits(NilAddress, owner.address, 1)
      const blockNum = await getBlockNumber()
      await c.transferVotingUnits(NilAddress, owner.address, 1)

      expect(await c.getPastVotes(owner.address, blockNum)).equals(1)
      expect(await c.getPastTotalSupply(blockNum)).equals(1)

      expect(await c.getVotes(owner.address)).equals(2)
      expect(await c.getTotalSupply()).equals(2)
    })

    it("success delegate", async () => {
      await c.transferVotingUnits(NilAddress, owner.address, 1)
      const blockNum = await getBlockNumber()
      await c.delegate(addr1.address)
      await c.transferVotingUnits(NilAddress, owner.address, 1)

      expect(await c.getPastVotes(owner.address, blockNum)).equals(1)

      expect(await c.getVotes(owner.address)).equals(0)
      expect(await c.getVotes(addr1.address)).equals(2)
    })

    it("success clear delegate", async () => {
      await c.transferVotingUnits(NilAddress, owner.address, 1)
      await c.delegate(addr1.address)
      expect(await c.getVotes(owner.address)).equals(0)
      expect(await c.getVotes(addr1.address)).equals(1)

      await c.delegate(owner.address)
      expect(await c.getVotes(owner.address)).equals(1)
      expect(await c.getVotes(addr1.address)).equals(0)
    })

    it("success clear delegateBySig", async () => {
      const wallet = Wallet.generate();
      const walletOwner = wallet.getAddressString();

      await c.transferVotingUnits(NilAddress, walletOwner, 1)
      expect(await c.getVotes(walletOwner)).equals(1)

      const nonce = 0
      const expiry = 9999999999

      let data : {
        primaryType: string
        types: { 
            EIP712Domain: any 
            Delegation: any 
        }
        domain: { 
            name: string
            version: string
            chainId: BigNumberish
            verifyingContract: string
        }
        message: { 
            delegatee: string
            nonce: BigNumberish
            expiry: BigNumberish
        }
      } 

      data = {
        primaryType: 'Delegation',
        types: { 
            EIP712Domain: EIP712Domain, 
            Delegation: Delegation
        },
        domain: { 
            name: name,
            version: version,
            chainId: chainId,
            verifyingContract: c.address
        },
        message: { 
            delegatee: owner.address,
            nonce: nonce,
            expiry: expiry 
        }
      }

      const signature = ethSigUtil.signTypedMessage(wallet.getPrivateKey(), { data });
      const { v, r, s } = fromRpcSig(signature);

      await c.delegateBySig(owner.address, nonce, expiry, v,r,s)
      expect(await c.getVotes(walletOwner)).equals(0)
      expect(await c.getVotes(owner.address)).equals(1)
    })

  });
});
