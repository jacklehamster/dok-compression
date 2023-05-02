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
            "b": 123,
            "a": [1, 2, 3],
            "d": 123.456,
            "c": { "z": "123 456 789 abc" }
        });
    });

    it("should maintain fileNames", () => {
        const compressor = new Compressor();
        const arrayBuffer = compressor.compress({
            "b": 123,
            "a": [1, 2, 3],
            "d": 123.456,
            "c": { "z": "123 456 789 abc" }
        });
    
        const expander = new Compressor();
        const extractableData = expander.expand(arrayBuffer);
        expect(extractableData.fileNames).toEqual([ 'a', 'b', 'c', 'd' ]);
        // console.log(extractableData);
    });
});
