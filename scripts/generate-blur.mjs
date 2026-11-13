import sharp from "sharp";

const buffer = await sharp("public/pic_2.png")
  .resize(320, 180, {
    fit: "cover",
    position: "attention",
  })
  .blur(1.2)
  .jpeg({ quality: 55, mozjpeg: true })
  .toBuffer();

const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;

console.log(`Preview image: ${buffer.length} bytes`);
console.log(`Base64 data URL: ${dataUrl.length} characters`);

await import("node:fs/promises").then((fs) =>
  fs.writeFile("blur-base64.txt", dataUrl),
);

console.log("Saved to blur-base64.txt");
