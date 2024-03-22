import { StreamDataView } from "stream-data-view";
import { ReducedToken } from "../tokenizer/Token";
import { DataType, DataTypeUtils } from "./DataType";

interface MultiInfo {
    organized: boolean;
    lastStringLength?: number;
}

const MAX_ARRAY_SIZE = 255;

export default class TokenEncoder {
    streamDataView: StreamDataView;
    dataTypeUtils: DataTypeUtils;

    constructor(streamDataView: StreamDataView) {
        this.streamDataView = streamDataView;
        this.dataTypeUtils = new DataTypeUtils();
    }

    encodeTokens(tokens: ReducedToken[], organized: boolean) {
        let pos = 0;
        while (pos < tokens.length) {
            const count = this.encodeMulti(tokens, pos, organized);
            if (count) {
                pos += count;
            }
        }
        this.encodeMulti([], pos, organized);
    }

    decodeTokens(organized: boolean) {
        const tokens: ReducedToken[] = [];
        while (this.streamDataView.getOffset() < this.streamDataView.getLength()) {
            if (!this.decodeMulti(tokens, organized)) {
                break;
            }
        }
        return tokens;
    }

    encodeToken(token: ReducedToken, dataType?: DataType, multiInfo?: MultiInfo): void {
        const usedDataType: DataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(token));
        switch (usedDataType) {
            case DataType.UNDEFINED:
            case DataType.NULL:
            case DataType.BOOLEAN_TRUE:
            case DataType.BOOLEAN_FALSE:
            case DataType.EMPTY_ARRAY:
                break;
            case DataType.INT8:
            case DataType.UINT8:
            case DataType.INT16:
            case DataType.UINT16:
            case DataType.INT32:
            case DataType.UINT32:
            case DataType.FLOAT32:
            case DataType.FLOAT64:
                this.encodeSingleNumber(token.value, usedDataType);
                break;
            case DataType.STRING:
            case DataType.UNICODE:
                this.encodeString(token.value, usedDataType, multiInfo);
                break;
            case DataType.OBJECT_8:
            case DataType.OBJECT_16:
            case DataType.OBJECT_32:
                this.encodeObjectToken(token, usedDataType);
                break;
            case DataType.SPLIT_8:
            case DataType.SPLIT_16:
            case DataType.SPLIT_32:
                this.encodeSplitToken(token, usedDataType);
                break;
            case DataType.ARRAY_8:
            case DataType.ARRAY_16:
            case DataType.ARRAY_32:
            case DataType.OFFSET_ARRAY_8:
            case DataType.OFFSET_ARRAY_16:
            case DataType.OFFSET_ARRAY_32:
                this.encodeArrayToken(token, usedDataType);
                break;
            case DataType.REFERENCE_8:
            case DataType.REFERENCE_16:
            case DataType.REFERENCE_32:
                this.encodeReferenceToken(token, usedDataType);
                break;
            case DataType.COMPLEX_OBJECT:
                this.encodeComplexToken(token, usedDataType);
                break;
            default:
                throw new Error("Invalid dataType: " + usedDataType);
        }
    }

    decodeToken(dataType?: DataType, multiInfo?: MultiInfo): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
        switch (usedDataType) {
            case DataType.UNDEFINED:
                return { type: "leaf", value: undefined };
            case DataType.NULL:
                return { type: "leaf", value: null };
            case DataType.BOOLEAN_TRUE:
                return { type: "leaf", value: true };
            case DataType.BOOLEAN_FALSE:
                return { type: "leaf", value: false };
            case DataType.EMPTY_ARRAY:
                return { type: "array", value: [] };
            case DataType.UINT2:
            case DataType.UINT4:
                throw new Error("Use decode number array.");
            case DataType.INT8:
            case DataType.UINT8:
            case DataType.INT16:
            case DataType.UINT16:
            case DataType.INT32:
            case DataType.UINT32:
            case DataType.FLOAT32:
            case DataType.FLOAT64:
                return { type: "leaf", value: this.decodeSingleNumber(usedDataType) };
            case DataType.STRING:
            case DataType.UNICODE:
                return { type: "leaf", value: this.decodeString(usedDataType, multiInfo) };
            case DataType.OBJECT_8:
            case DataType.OBJECT_16:
            case DataType.OBJECT_32:
                return this.decodeObjectToken(usedDataType);
            case DataType.SPLIT_8:
            case DataType.SPLIT_16:
            case DataType.SPLIT_32:
                return this.decodeSplitToken(usedDataType);
            case DataType.ARRAY_8:
            case DataType.ARRAY_16:
            case DataType.ARRAY_32:
            case DataType.OFFSET_ARRAY_8:
            case DataType.OFFSET_ARRAY_16:
            case DataType.OFFSET_ARRAY_32:
                return this.decodeArrayToken(usedDataType);
            case DataType.REFERENCE_8:
            case DataType.REFERENCE_16:
            case DataType.REFERENCE_32:
                return this.decodeReferenceToken(usedDataType);
            case DataType.COMPLEX_OBJECT:
                return this.decodeComplexToken(usedDataType);
            default:
                throw new Error("Invalid dataType: " + usedDataType);
        }
    }

    isOffsetDataType(dataType: DataType) {
        return dataType === DataType.OFFSET_ARRAY_8 || dataType === DataType.OFFSET_ARRAY_16 || dataType === DataType.OFFSET_ARRAY_32;
    }

    encodeArrayToken(arrayToken: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(arrayToken));
        const numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8
            ? DataType.UINT8
            : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16
                ? DataType.UINT16 : DataType.UINT32;

        let indices = arrayToken.value;
        if (this.isOffsetDataType(usedDataType)) {
            const offset = Math.min(...indices);
            indices = indices.map((value: number) => value - offset);
            this.encodeSingleNumber(offset);
        }

        this.encodeNumberArray(indices, numberType);
    }

    decodeArrayToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();

        let offset = 0;
        if (this.isOffsetDataType(usedDataType)) {
            offset = this.decodeSingleNumber();
        }

        const numberType = usedDataType === DataType.ARRAY_8 || usedDataType === DataType.OFFSET_ARRAY_8
            ? DataType.UINT8
            : usedDataType === DataType.ARRAY_16 || usedDataType === DataType.OFFSET_ARRAY_16
                ? DataType.UINT16 : DataType.UINT32;
        const indices = this.decodeNumberArray(numberType)
            .map(value => value + offset);
        return {
            type: "array",
            value: indices,
        }
    }

    encodeObjectToken(objectToken: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(objectToken));
        const numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
        const [keysIndex, valuesIndex] = objectToken.value;
        this.encodeSingleNumber(keysIndex, numberType);
        this.encodeSingleNumber(valuesIndex, numberType);
    }

    decodeObjectToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
        const numberType = usedDataType === DataType.OBJECT_8 ? DataType.UINT8 : usedDataType === DataType.OBJECT_16 ? DataType.UINT16 : DataType.UINT32;
        return {
            type: "object",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)],
        };
    }

    encodeSplitToken(splitToken: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(splitToken));
        const numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
        const [chunksIndex, separatorsIndex] = splitToken.value;
        this.encodeSingleNumber(chunksIndex, numberType);
        this.encodeSingleNumber(separatorsIndex, numberType);
    }

    decodeSplitToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
        const numberType = usedDataType === DataType.SPLIT_8 ? DataType.UINT8 : usedDataType === DataType.SPLIT_16 ? DataType.UINT16 : DataType.UINT32;
        return {
            type: "split",
            value: [this.decodeSingleNumber(numberType), this.decodeSingleNumber(numberType)],
        };
    }

    encodeReferenceToken(token: ReducedToken, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getDataType(token));
        const numberType = usedDataType === DataType.REFERENCE_8 ? DataType.UINT8 : usedDataType === DataType.REFERENCE_16 ? DataType.UINT16 : DataType.UINT32;
        const index = token.value;
        this.encodeSingleNumber(index, numberType);
    }

    decodeReferenceToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
        const numberType = usedDataType === DataType.REFERENCE_8 ? DataType.UINT8 : usedDataType === DataType.REFERENCE_16 ? DataType.UINT16 : DataType.UINT32;
        return {
            type: "reference",
            value: this.decodeSingleNumber(numberType),
        };
    }

    encodeComplexToken(token: ReducedToken, dataType?: DataType) {
        if (dataType === undefined) {
            this.encodeDataType(this.dataTypeUtils.getDataType(token));
        }
        const structure = token.value;
        this.encodeNumberArray(structure, DataType.UINT2);
    }

    decodeComplexToken(dataType?: DataType): ReducedToken {
        const usedDataType = dataType ?? this.decodeDataType();
        const structure = this.decodeNumberArray(DataType.UINT2);
        return {
            type: this.dataTypeUtils.dataTypeToType(usedDataType),
            value: structure,
        };
    }

    encodeDataType(dataType: DataType): DataType {
        this.streamDataView.setNextUint8(dataType);
        return dataType;
    }

    decodeDataType(): DataType {
        const dataType = this.streamDataView.getNextUint8();
        return dataType;
    }

    encodeMulti(tokens: ReducedToken[], pos: number, organized: boolean): number {
        if (pos >= tokens.length) {
            this.encodeSingleNumber(0, DataType.UINT8);
            return 0;
        }
        const firstType = this.dataTypeUtils.getDataType(tokens[pos]);
        let multiCount;
        const maxCount = Math.min(tokens.length - pos, 255);
        for (multiCount = 1; multiCount < maxCount; multiCount++) {
            if (this.dataTypeUtils.getDataType(tokens[pos + multiCount]) !== firstType) {
                break;
            }
        }
        //  encode a multi, meaning that the same type is going to get repeated multiple times
        this.encodeSingleNumber(multiCount, DataType.UINT8);
        this.encodeDataType(firstType);
        const multiInfo: MultiInfo = { organized };
        for (let i = 0; i < multiCount; i++) {
            this.encodeToken(tokens[pos + i], firstType, multiInfo);
        }
        return multiCount;
    }

    decodeMulti(tokens: ReducedToken[], organized: boolean): number {
        const count = this.streamDataView.getNextUint8();
        if (!count) {
            return 0;
        }
        const dataType = this.decodeDataType();
        const multiInfo: MultiInfo = { organized };
        for (let i = 0; i < count; i++) {
            const token = this.decodeToken(dataType, multiInfo);
            tokens.push(token);
        }
        return count;
    }

    encodeSingleNumber(value: number, dataType?: DataType) {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getNumberDataType(value));

        switch (usedDataType) {
            case DataType.UINT2:
            case DataType.UINT4:
                throw new Error("Use encode number array.");
            case DataType.UINT8:
                this.streamDataView.setNextUint8(value);
                break;
            case DataType.INT8:
                this.streamDataView.setNextInt8(value);
                break;
            case DataType.UINT16:
                this.streamDataView.setNextUint16(value);
                break;
            case DataType.INT16:
                this.streamDataView.setNextInt16(value);
                break;
            case DataType.UINT32:
                this.streamDataView.setNextUint32(value);
                break;
            case DataType.INT32:
                this.streamDataView.setNextInt32(value);
                break;
            case DataType.FLOAT32:
                this.streamDataView.setNextFloat32(value);
                break;
            case DataType.FLOAT64:
                this.streamDataView.setNextFloat64(value);
                break;
            default:
                throw new Error("Invalid dataType for number: " + usedDataType);
        }
    }

    decodeSingleNumber(dataType?: DataType): number {
        const usedDataType = dataType ?? this.decodeDataType();

        switch (usedDataType) {
            case DataType.UINT2:
            case DataType.UINT4:
                throw new Error("Use decode number array.");
            case DataType.UINT8:
                return this.streamDataView.getNextUint8();
            case DataType.INT8:
                return this.streamDataView.getNextInt8();
            case DataType.UINT16:
                return this.streamDataView.getNextUint16();
            case DataType.INT16:
                return this.streamDataView.getNextInt16();
            case DataType.UINT32:
                return this.streamDataView.getNextUint32();
            case DataType.INT32:
                return this.streamDataView.getNextInt32();
            case DataType.FLOAT32:
                return this.streamDataView.getNextFloat32();
            case DataType.FLOAT64:
                return this.streamDataView.getNextFloat64();
            default:
                throw new Error("Invalid dataType for number: " + usedDataType);
        }
    }

    bit2ToNum([a, b, c, d]: number[]): number {
        return ((a ?? 0) << 0) | ((b ?? 0) << 2) | ((c ?? 0) << 4) | ((d ?? 0) << 6);
    }

    numToBit2(n: number, size: number = 4): number[] {
        return [(n >> 0) & 3, (n >> 2) & 3, (n >> 4) & 3, (n >> 6) & 3].slice(0, size);
    }

    bit4ToNum([a, b]: number[]): number {
        return ((a ?? 0) << 0) | ((b ?? 0) << 4);
    }

    numToBit4(n: number, size: number = 2): number[] {
        return [(n >> 0) & 15, (n >> 4) & 15].slice(0, size);
    }

    encodeNumberArray(array: number[], dataType?: DataType) {
        if (dataType === DataType.UINT2 || dataType === DataType.UINT4) {
            const stride = dataType === DataType.UINT2 ? 4 : 2;
            const transform = dataType === DataType.UINT2 ? this.bit2ToNum : this.bit4ToNum;
            const bytes = [];
            for (let i = 0; i < array.length; i += stride) {
                bytes.push(transform(array.slice(i, i + stride)));
            }
            this.encodeNumberArray(bytes, DataType.UINT8);
            this.encodeSingleNumber(array.length - bytes.length * stride, DataType.INT8);
            return;
        }

        let pos;
        for (pos = 0; pos < array.length;) {
            const size = Math.min(MAX_ARRAY_SIZE, array.length - pos);
            this.encodeSingleNumber(size, DataType.UINT8);
            if (!size) {
                break;
            }

            const bestType: DataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getBestType(array));

            for (let i = 0; i < size; i++) {
                this.encodeSingleNumber(array[pos + i], bestType);
            }

            pos += size;
        }
        if (pos === MAX_ARRAY_SIZE) {
            //  Reached the max size, but the next one is 0.
            this.encodeSingleNumber(0, DataType.UINT8);
        }
    }

    decodeNumberArray(dataType?: DataType): number[] {
        if (dataType === DataType.UINT2 || dataType === DataType.UINT4) {
            const transform = dataType === DataType.UINT2 ? this.numToBit2 : this.numToBit4;
            const structure = [];
            const bytes = this.decodeNumberArray(DataType.UINT8);
            for (let byte of bytes) {
                structure.push(...transform(byte));
            }
            const sizeDiff = this.decodeSingleNumber(DataType.INT8);
            structure.length += sizeDiff;
            return structure;
        }
        let size;
        const numbers = [];
        do {
            size = this.decodeSingleNumber(DataType.UINT8);
            if (!size) {
                break;
            }

            const type: DataType = dataType ?? this.decodeDataType();
            for (let i = 0; i < size; i++) {
                numbers.push(this.decodeSingleNumber(type));
            }
        } while (size >= MAX_ARRAY_SIZE);
        return numbers;
    }

    encodeString(value: string, dataType?: DataType, multiInfo?: MultiInfo): void {
        const usedDataType = dataType ?? this.encodeDataType(this.dataTypeUtils.getStringDataType(value));
        const letterCodes = Array.from(value).map(l => l.charCodeAt(0));
        if (!multiInfo?.organized || multiInfo.lastStringLength !== value.length) {
            letterCodes.push(0);
        }
        // console.log(letterCodes, value, (letterCodes).map((value) => !value ? 0 : value - min + 1));
        const numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        letterCodes.forEach(code => this.encodeSingleNumber(code, numberType));
        if (multiInfo) {
            multiInfo.lastStringLength = value.length;
        }
    }

    decodeString(dataType?: DataType, multiInfo?: MultiInfo): string {
        const usedDataType = dataType ?? this.decodeDataType();
        const charCodes = [];
        const numberType = usedDataType === DataType.STRING ? DataType.UINT8 : DataType.UINT16;
        do {
            const code = this.decodeSingleNumber(numberType);
            if (!code) {
                break;
            }
            charCodes.push(code);
            if (multiInfo?.organized && multiInfo?.lastStringLength && charCodes.length >= multiInfo?.lastStringLength) {
                break;
            }
        } while (true);
        const string = charCodes.map(code => String.fromCharCode(code)).join("");
        if (multiInfo) {
            multiInfo.lastStringLength = string.length;
        }
        return string;
    }
}
