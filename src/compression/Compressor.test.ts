import Compressor from "./Compressor";

function verifyCompression(data: any) {
    const compressor = new Compressor();
    const arrayBuffer = compressor.compress(data);

    const expander = new Compressor();
    const extractableData = expander.expand(arrayBuffer);

    for (let key in data) {
        expect(extractableData.extract(key)).toEqual(data[key]);
    }
}

describe("Compressor", () => {
    it("compress and decompress", () => {
        verifyCompression({
            "a": 123,
            "b": [1, 2, 3],
            "c": 123.456,
            "d": { "z": "123 456 789 abc" }
        });
    });
});
