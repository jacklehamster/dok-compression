import { DataType, DataTypeUtils } from "./DataType";

describe("DataType", () => {
    let dataTypeUtils: DataTypeUtils;

    beforeEach(() => {
        dataTypeUtils = new DataTypeUtils();
    });

    it("satisfy dataType decimal", () => {
        expect(dataTypeUtils.numberSatisfyDataType(1.5, DataType.FLOAT32)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(1.123456789123456789, DataType.FLOAT32)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(1.123456789123456789, DataType.FLOAT64)).toBe(true);
    });

    it("satisfy dataType integer", () => {
        expect(dataTypeUtils.numberSatisfyDataType(1, DataType.UINT2)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(5, DataType.UINT2)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(5, DataType.UINT4)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(17, DataType.UINT4)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(200, DataType.UINT8)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(300, DataType.UINT8)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(-100, DataType.INT8)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(-200, DataType.INT8)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(60000, DataType.UINT16)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(70000, DataType.UINT16)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(-30000, DataType.INT16)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(-40000, DataType.INT16)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(100000, DataType.UINT32)).toBe(true);
        expect(dataTypeUtils.numberSatisfyDataType(-100000, DataType.UINT32)).toBe(false);
        expect(dataTypeUtils.numberSatisfyDataType(-100000, DataType.INT32)).toBe(true);
    });

    it("find best number type", () => {
        expect(dataTypeUtils.getBestType([1, 2, 3])).toBe(DataType.UINT8);
        expect(dataTypeUtils.getBestType([1, 10, -100])).toBe(DataType.INT8);
        expect(dataTypeUtils.getBestType([1, 10, 0.5])).toBe(DataType.FLOAT32);
        expect(dataTypeUtils.getBestType([1, 10, 0.123456789])).toBe(DataType.FLOAT64);
        expect(dataTypeUtils.getNumberDataType(100)).toBe(DataType.UINT8);
    });

    it("recognize string type", () => {
        expect(dataTypeUtils.getStringDataType("abc")).toBe(DataType.STRING);
    });
});
