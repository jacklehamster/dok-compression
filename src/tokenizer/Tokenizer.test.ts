import Tokenizer from "./Tokenizer";

describe('tokenizer', () => {
    it('tokenize', () => {
        const tokenizer = new Tokenizer();
        const header = tokenizer.tokenize({
            "test-string": "abc",
            "test-number": 123,
            "test-array": [1, 2, 3],
            "test-object": {"a": "b"},
            "test-split": "abcd efgh ijkl mnopqr"
        });
        expect(header.files["test-string"].token.value).toEqual("abc");
        expect(header.files["test-number"].token.value).toEqual(123);
        expect(header.files["test-array"].token.value).toEqual([
            1, 2, 3,
        ]);
        expect(header.files["test-object"].token.value).toEqual({"a": "b"});
        expect(header.files["test-split"].token.value).toEqual("abcd efgh ijkl mnopqr");
    });
});