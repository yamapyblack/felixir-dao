import { ethers } from "hardhat";
import { Addr } from "../addresses"
import { encode } from "../svg/encoder";

async function main() {

  const contract = (await ethers.getContractAt("FelixirShop", Addr.FelixirShop)) as FLXDescriptorPrimitive

  for(let i = 0; i < 1; i++){
    const INPUT_SVG_FILE_ALL = "images/chr_all_" + (i+1) + ".png"

    const encodeJson = await encode(INPUT_SVG_FILE_ALL);
    const palettes = encodeJson.palette;
    palettes.shift(); // Nounsのだと先頭が空になるため、先頭削除
    const seed = encodeJson.images.root[0].data;
    console.log(palettes)

    console.log(i)
    await c1.addBulkColorsToPalette(i, palettes);
    await c1.setSeed(i, seed);  
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
