import { network, ethers } from "hardhat";

export const encodeParameters = (types: string[], values: unknown[]): string => {
  const abi = new ethers.utils.AbiCoder()
  return abi.encode(types, values)
}

export const evmMine = async (num: number): Promise<void> => {
  for(let i = 0; i < num; i++){
    await network.provider.send("evm_mine")
  }
}

export const getBlockNumber = async (): Promise<number> => {
  return ethers.provider.getBlockNumber()
}

export const NilAddress = "0x0000000000000000000000000000000000000000";
