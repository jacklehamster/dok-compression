import Reducer from "../reducer/Reducer";
import Tokenizer from "../tokenizer/Tokenizer";
import ExtractableData from "./Extractor";

describe('reducer', () => {
    it('tokenize', () => {
        const tokenizer = new Tokenizer();
        const header = tokenizer.tokenize({
            "test-string": "abc",
            "test-number": 123,
            "test-array": [1, 2, 3],
            "test-object": {"a": "b"},
            "test-split": "abcd efgh ijkl mnopqr"
        });
        const reducer = new Reducer();
        const dataStore = reducer.reduce(header);
        const extractor = new ExtractableData(dataStore);
        expect(extractor.extract("test-string")).toEqual("abc");
        expect(extractor.extract("test-number")).toEqual(123);
        expect(extractor.extract("test-array")).toEqual([1, 2, 3]);
        expect(extractor.extract("test-object")).toEqual({"a": "b"});
        expect(extractor.extract("test-split")).toEqual("abcd efgh ijkl mnopqr");
    });
});