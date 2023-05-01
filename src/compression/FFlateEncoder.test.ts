import FFlateEncoder from "./FFlateEncoder";

describe("FFlateEncoder", () => {
    it("encode decode", () => {
        const encoder = new FFlateEncoder();
        const array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
        const encoded = encoder.encode(array.buffer);
        const decoded = encoder.decode(encoded);
        expect(decoded).toEqual(array.buffer);
    });
});
