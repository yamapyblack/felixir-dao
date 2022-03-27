import { PNGCollectionEncoder, PngImage } from "@nouns/sdk";
import { promises as fs } from "fs";
import { PNG } from "pngjs";

/**
 * Read a PNG image file and return a `PngImage` object.
 * @param path The path to the PNG file
 */
const readPngImage = async (path: string): Promise<PngImage> => {
  const buffer = await fs.readFile(path);
  const png = PNG.sync.read(buffer);

  return {
    width: png.width,
    height: png.height,
    rgbaAt: (x: number, y: number) => {
      const idx = (png.width * y + x) << 2;
      const [r, g, b, a] = [
        png.data[idx],
        png.data[idx + 1],
        png.data[idx + 2],
        png.data[idx + 3],
      ];
      return {
        r,
        g,
        b,
        a,
      };
    },
  };
};

export const encode = async (file: string): Promise<any> => {
  const encoder = new PNGCollectionEncoder();

  const image = await readPngImage(file);
  encoder.encodeImage(file.replace(/\.png$/, ""), image);

  const jsonStr = JSON.stringify({
    ...encoder.data,
  });
  console.log(jsonStr);
  return JSON.parse(jsonStr);
};
