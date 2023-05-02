import Tokenizer from "../tokenizer/Tokenizer";
import Reducer from "./Reducer";

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
        expect(dataStore).not.toBeNull();
        const sortedKeys = dataStore.files.map(index => dataStore.headerTokens[index].value);
        const s = JSON.stringify(sortedKeys);
        sortedKeys.sort();
        expect(s).toEqual(JSON.stringify(sortedKeys));
        console.log(dataStore);
    });
});