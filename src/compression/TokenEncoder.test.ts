import { StreamDataView } from "stream-data-view";
import TokenEncoder from "./TokenEncoder";
import { DataType } from "./DataType";
import { ReducedToken } from "../tokenizer/Token";


function testAction<T>(
    value: T,
    encode: (value: T) => any,
    reset: () => void,
    decode: () => T,
    check: (result: T, value: T) => void = (result, value) => 
        console.assert(JSON.stringify(result) === JSON.stringify(value),
            `Not equal: \n%s\n!==\n%s (expected)`,
            JSON.stringify(result),
            JSON.stringify(value))) 
{
    encode(value);
    reset();
    const decoded = decode();
    reset();
    check(decoded, value);
}

describe("TokenEncoder", () => {
    let tokenEncoder: TokenEncoder;
    let tokenDecoder: TokenEncoder;
    let reset: () => void;

    beforeEach(() => {
        const streamDataView = new StreamDataView();
        tokenEncoder = new TokenEncoder(streamDataView);
        tokenDecoder = new TokenEncoder(streamDataView);
        reset = () => streamDataView.resetOffset();

    });

    it("decode string", () => {
        testAction(DataType.STRING,
            dataType => tokenEncoder.encodeDataType(dataType),
            reset,
            () => tokenDecoder.decodeDataType(),
        );
    });

    it("decode undefined", () => {
        testAction(DataType.UNDEFINED,
            dataType => tokenEncoder.encodeDataType(dataType),
            reset,
            () => tokenDecoder.decodeDataType(),
        );
    });

    it("decode number", () => {
        testAction(33,
            number => tokenEncoder.encodeSingleNumber(number, DataType.INT8),
            reset,
            () => tokenDecoder.decodeSingleNumber(DataType.INT8));
    });

    it("decode object", () => {
        testAction([
            { type: "leaf", value: 123 },
            { type: "leaf", value: 45 },
            { type: "leaf", value: 67 },
            { type: "leaf", value: 89 },
        ],
        header => tokenEncoder.encodeMulti(header, 0, false),
        reset,
        () => {
            const result: ReducedToken[] = [];
            tokenDecoder.decodeMulti(result, false);
            return result;
        });
    });

    it("decode object with large numbers", () => {
        testAction([
            { type: "leaf", value: 1000001 },
            { type: "leaf", value: 1002000 },
            { type: "leaf", value: 1003001 },
        ],
        header => tokenEncoder.encodeMulti(header, 0, false),
        reset,
        () => {
            const result: ReducedToken[] = [];
            tokenDecoder.decodeMulti(result, false);
            return result;
        });
    });

    it("decode array", () => {
        testAction([1, 2, 3, 4, 10, 20, 200],
            array => tokenEncoder.encodeNumberArray(array),
            reset,
            () => tokenDecoder.decodeNumberArray());

    });

    it("decode large arrays", () => {
        testAction(new Array(2000).fill(null).map((_,index) => index),
            array => tokenEncoder.encodeNumberArray(array),
            reset,
            () => tokenDecoder.decodeNumberArray());
    });

    it("decode array with range of numbers", () => {
        testAction([10000, -202, 3, 4, 10, 20, 3200],
            array => tokenEncoder.encodeNumberArray(array),
            reset,
            () => tokenDecoder.decodeNumberArray());

    });

    it("decode string", () => {
        testAction("teststring",
            string => tokenEncoder.encodeString(string),
            reset,
            () => tokenDecoder.decodeString());
    });

    it("decode string with known dataType", () => {
        testAction("teststring",
            string => tokenEncoder.encodeString(string, DataType.STRING),
            reset,
            () => tokenDecoder.decodeString(DataType.STRING));

    });

    it("decode string with emojis", () => {
        testAction("test😀😃😄😁😆",
            string => tokenEncoder.encodeString(string),
            reset,
            () => tokenDecoder.decodeString());
    });

    it("decode object token", () => {
        testAction({ type: "object", value: [200, 201] },
            o => tokenEncoder.encodeObjectToken(o),
            reset,
            () => tokenDecoder.decodeObjectToken());
    });

    it("decode object token with larger numbers", () => {
        testAction({ type: "object", value: [2000, 2001] },
            o => tokenEncoder.encodeObjectToken(o),
            reset,
            () => tokenDecoder.decodeObjectToken());
    });

    it("decode object token with defined datatype", () => {
        testAction({ type: "object", value: [2000, 2001] },
            o => tokenEncoder.encodeObjectToken(o, DataType.OBJECT_32),
            reset,
            () => tokenDecoder.decodeObjectToken(DataType.OBJECT_32));

    });

    it("decode split token", () => {
        testAction({ type: "split", value: [200, 201] },
        o => tokenEncoder.encodeSplitToken(o),
        reset,
        () => tokenDecoder.decodeSplitToken());
    });

    it("decode split token with larger index", () => {
        testAction({ type: "split", value: [2000, 2001] },
            o => tokenEncoder.encodeSplitToken(o),
            reset,
            () => tokenDecoder.decodeSplitToken());
    });

    it("decode split token with defined datatype", () => {
        testAction({ type: "split", value: [2000, 2001] },
            o => tokenEncoder.encodeSplitToken(o, DataType.SPLIT_32),
            reset,
            () => tokenDecoder.decodeSplitToken(DataType.SPLIT_32));
    });

    it("decode token of string", () => {
        testAction({ type: "leaf", value: "tokenstring" },
            o => tokenEncoder.encodeToken(o),
            reset,
            () => tokenDecoder.decodeToken());
    });

    it("decode float token", () => {
        testAction({ type: "leaf", value: 123.5 },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());
    });

    it("decode emoji token", () => {
        testAction({ type: "leaf", value: "😁😆" },
            o => tokenEncoder.encodeToken(o),
            reset,
            () => tokenDecoder.decodeToken());
    });

    it("decode array token", () => {
        testAction({ type: "array", value: [1, 10, 20, 30, 200] },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());

    });

    it("decode array token larger numbers", () => {
        testAction({ type: "array", value: [1001, 1010, 1020, 1030, 1200] },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());
    });

    it("decode array token large large numbers", () => {
        testAction({ type: "array", value: [10010, 10100, 10300, 20000] },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());
    });

    it("decode array token another large numbers", () => {
        testAction({ type: "array", value: [10010, 10100, 10000] },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());
    });

    it("decode array token with 260 elements", () => {
        testAction({ type: "array", value: new Array(260).fill(null).map((_,index) => index) },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());

    });

    it("decode array token of array", () => {
        testAction(new Array(100).fill(null).map((_,index) => {
            const token: ReducedToken = {
                type: "array",
                value: new Array(index).fill(null).map((_, index) => index),
            };
            return token;
        }),
            o => tokenEncoder.encodeTokens(o, false),
            reset,
            () => tokenDecoder.decodeTokens(false));

    });

    it("decode 260 size array token of array", () => {
        testAction(new Array(260).fill(null).map((_,index) => {
            const token: ReducedToken = {
                type: "array",
                value: new Array(index).fill(null).map((_, index) => index),
            };
            return token;
        }),
            o => tokenEncoder.encodeTokens(o, false),
            reset,
            () => tokenDecoder.decodeTokens(false));

    });

    it("decode 260 size array token of array with 1 element", () => {
        testAction(new Array(260).fill(null).map((_) => {
            const token: ReducedToken = {
                type: "array",
                value: [1],
            };
            return token;
        }),
            o => tokenEncoder.encodeTokens(o, false),
            reset,
            () => tokenDecoder.decodeTokens(false));

    });

    it("decode complex token", () => {
        testAction({ type: "complex", value: [1, 2, 3, 2, 1, 2, 1, 0] },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());

    });

    it("decode complex token with long string", () => {
        testAction({ type: "complex", value: "120100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000031000000000010000000120103100020103100020103100031000000000002010031000000031000000003100000310000310000003100000003100000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000310000000000100000001201031000201031000201031000310000000000020100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000003100000000001000000012010310002010310002010310003100000000000201003100000003100000000310000031000031000000310000000031000000000000000000000000000100000000000000000000000000310000000000100000001201031000201031000201031000310000000000020100310000000310000000031000003100003100000031000000031000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000003100000000001000000012010310002010310002010310003100000000000".split("").map(a => parseInt(a)) },
        o => tokenEncoder.encodeToken(o),
        reset,
        () => tokenDecoder.decodeToken());

    });

    it("decode array of number with UINT2 range", () => {
        testAction([1, 2, 3, 2, 1, 2, 1, 0],
            o => tokenEncoder.encodeNumberArray(o, DataType.UINT2),
            reset,
            () => tokenDecoder.decodeNumberArray(DataType.UINT2));

    });

    it("decode numbers with UINT4 range", () => {
        testAction([1, 15, 12, 12, 1, 9, 1, 0],
            o => tokenEncoder.encodeNumberArray(o, DataType.UINT4),
            reset,
            () => tokenDecoder.decodeNumberArray(DataType.UINT4));

    });

    it("decode string with repeating characters", () => {
        testAction("xyzxyzyzxxxyyyzzz",
        o => tokenEncoder.encodeString(o),
        reset,
        () => tokenDecoder.decodeString());

    });

    it("decode string with repeating characters 2", () => {
        testAction("abcdeabcabcadbdddba",
        o => tokenEncoder.encodeString(o),
        reset,
        () => tokenDecoder.decodeString());
    });
});
