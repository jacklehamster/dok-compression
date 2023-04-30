import './index.css'
import React from 'react'
import files from "./dir.json";
import dokCompression from "dok-compression";
import { createRoot } from 'react-dom/client';
const {Loader, Compressor} = dokCompression;

const container = document.getElementById('root');
const root = createRoot(container!);

files.sort();


const out = document.body.appendChild(document.createElement("div"));
out.style.whiteSpace = "pre";
out.style.fontSize = "8pt";
const superLog = console.log;
console.log = (...msg: any[]) => {
  superLog(...msg);

  const div = out.appendChild(document.createElement("div"));
  div.textContent = msg.map(m => JSON.stringify(m, null, "  ")).join(" ") + "\n";
  out.appendChild(document.createElement("hr"));
};

async function execute() {
    const loader = new Loader();
    console.log(files);
    const originalData = await Promise.all(files.map(file => loader.load(file)));

    // //  compress
    const compressor = new Compressor();
    let time = performance.now();
    const compressedBuffer = compressor.compress(Object.fromEntries(originalData.map((data, index) => [files[index], data])));
    console.log("Time to compress: %s", performance.now() - time);

    console.log("Compressed buffer size is %s", compressedBuffer.byteLength);

    const textEncoder = new TextEncoder();
    console.log("Original data size was %s", originalData
      .map(data => textEncoder.encode(JSON.stringify(data)).length)
      .reduce((a, b) => a + b));

    //  expand
    time = performance.now();
    const extractable = compressor.expand(compressedBuffer);
    console.log("Time to expand header: %s", performance.now() - time);
    console.log("Files:", extractable.fileNames);

    files.forEach((file, index) => {
      time = performance.now();
      const extractedData = extractable.extract(file);
      console.log("Time to expand %s: %s", file, performance.now() - time);
      console.log([file, extractedData]);
      console.assert(JSON.stringify(originalData[index]) === JSON.stringify(extractedData));
    });

    const repeatObjectNoReference = extractable.extract("data/data-repeat-object.json");
    console.assert(repeatObjectNoReference.a !== repeatObjectNoReference.b);

    try {
      const eTest = await compressor.loadAndExpand("bin/gamefiles.dokbin");
      const turtleData = eTest.extract("games/turtle/turtle.json");
      console.log("Version", eTest.version);
      console.log("Number of files stored:", eTest.fileNames.length);
      console.log("Turtle data", turtleData);
      console.log("Original data size", eTest.originalDataSize);
      console.log("Compressed size %s (%s%)", eTest.compressedSize,
        Math.ceil(10 * 100 * eTest.compressedSize! / eTest.originalDataSize!) / 10);
      console.log(eTest.getHeaderTokens());
    } catch (e) {
      console.error(e.message);
    }
}

document.addEventListener("DOMContentLoaded", execute);


root.render(<div>Hello world</div>);
