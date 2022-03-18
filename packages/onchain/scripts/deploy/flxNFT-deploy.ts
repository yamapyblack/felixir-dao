import { ethers } from "hardhat";

async function main() {
  const FLXNFT = await ethers.getContractFactory("FLXNFT");
  const contract = await FLXNFT.deploy();

  await contract.deployed();
  console.log("deployed to:", contract.address);

  const FXLSvgBase = await ethers.getContractFactory("FXLSvgBase");
  const c1 = await FXLSvgBase.deploy();

  await c1.deployed();
  console.log("deployed to:", c1.address);

  const FXLTokenDescriptor = await ethers.getContractFactory("FXLTokenDescriptor", 
  {libraries:
    {FXLSvgBase: c1.address}
  })

  const c2 = await FXLTokenDescriptor.deploy()

  await c2.deployed();
  console.log("deployed to:", c2.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
