import dokCompression from "dok-compression";
import fs from "fs";

function performZipTest() {
    const encoder = new dokCompression.FFlateEncoder();
    const arrayBuffer = Uint8Array.from([12, 34, 56, 78, 9, 10 ]).buffer;
    const encoded = encoder.encode(arrayBuffer);
    const result = encoder.decode(encoded);
    if (arrayBuffer.toString() !== result.toString()) {
        throw new Error("zip test failed");
    }
}

function performNodeTest() {
    const splitKey = "abc-def-ghi-jkl-mnop";
    const data = {
        "a": 123,
        "b": [123, 456],
        "c": {"d": 789},
        [splitKey]:  999
    };
    const compressor = new dokCompression.Compressor();
    const arrayBuffer = compressor.compress(data);
    const extractableData = compressor.expand(new Uint8Array(arrayBuffer).buffer);
    const result = {
        "a": extractableData.extract("a"),
        "b": extractableData.extract("b"),
        "c": extractableData.extract("c"),
        [splitKey]: extractableData.extract(splitKey),
    };

    if (JSON.stringify(data) !== JSON.stringify(result)) {
        throw new Error(`Mismatched compression-expansion`);
    }
}

function performTokenEncoderTest() {
    dokCompression.TokenEncoder.selfTest();
}

function performFileTest() {
    const array = Uint8Array.from([12, 34, 56, 78, 9, 10 ]);
    console.log(">>", array.byteOffset, array.byteLength);
    const arrayBuffer = array.buffer;
    fs.writeFileSync("tmp.bin", Buffer.from(array));
    const buffer = fs.readFileSync("tmp.bin");
    console.log(array);
    console.log(buffer);
    fs.unlinkSync("tmp.bin");
}

performZipTest();
performTokenEncoderTest();
performNodeTest();
performFileTest();



export {}
 