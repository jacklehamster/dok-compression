import { StreamDataView } from "stream-data-view";
import { ReducedToken } from "../tokenizer/Token";
import { DataType, DataTypeUtils } from "./DataType";
interface MultiInfo {
    organized: boolean;
    lastStringLength?: number;
}
export default class TokenEncoder {
    streamDataView: StreamDataView;
    dataTypeUtils: DataTypeUtils;
    constructor(streamDataView: StreamDataView);
    encodeTokens(tokens: ReducedToken[], organized: boolean): void;
    decodeTokens(organized: boolean): ReducedToken[];
    encodeToken(token: ReducedToken, dataType?: DataType, multiInfo?: MultiInfo): void;
    decodeToken(dataType?: DataType, multiInfo?: MultiInfo): ReducedToken;
    isOffsetDataType(dataType: DataType): boolean;
    encodeArrayToken(arrayToken: ReducedToken, dataType?: DataType): void;
    decodeArrayToken(dataType?: DataType): ReducedToken;
    encodeObjectToken(objectToken: ReducedToken, dataType?: DataType): void;
    decodeObjectToken(dataType?: DataType): ReducedToken;
    encodeSplitToken(splitToken: ReducedToken, dataType?: DataType): void;
    decodeSplitToken(dataType?: DataType): ReducedToken;
    encodeReferenceToken(token: ReducedToken, dataType?: DataType): void;
    decodeReferenceToken(dataType?: DataType): ReducedToken;
    encodeComplexToken(token: ReducedToken, dataType?: DataType): void;
    decodeComplexToken(dataType?: DataType): ReducedToken;
    encodeDataType(dataType: DataType): DataType;
    decodeDataType(): DataType;
    encodeMulti(tokens: ReducedToken[], pos: number, organized: boolean): number;
    decodeMulti(tokens: ReducedToken[], organized: boolean): number;
    encodeSingleNumber(value: number, dataType?: DataType): void;
    decodeSingleNumber(dataType?: DataType): number;
    bit2ToNum([a, b, c, d]: number[]): number;
    numToBit2(n: number, size?: number): number[];
    bit4ToNum([a, b]: number[]): number;
    numToBit4(n: number, size?: number): number[];
    encodeNumberArray(array: number[], dataType?: DataType): void;
    decodeNumberArray(dataType?: DataType): number[];
    encodeString(value: string, dataType?: DataType, multiInfo?: MultiInfo): void;
    decodeString(dataType?: DataType, multiInfo?: MultiInfo): string;
}
export {};
