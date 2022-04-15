import { ethers } from "hardhat";
import { Addr } from "../addresses"
import { FelixirShop } from "../../typechain/FelixirShop"

async function main() {

  const FelixirShop = await ethers.getContractFactory("FelixirShop");
  const c0 = await FelixirShop.deploy(Addr.FLXPrimitive, Addr.Deployer);
  await c0.deployed();
  console.log("deployed to:", c0.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
