import { getType } from "./Token";

describe("token", () => {
    it('get dataType array', () => {
        expect(getType([])).toBe("array");
    });
    it('get dataType object', () => {
        expect(getType({})).toBe("object");
    });
    it('get dataType string', () => {
        expect(getType("test1234567890")).toBe("leaf");
    });
    it('get dataType short string', () => {
        expect(getType("abce fghi")).toBe("leaf");
    });
    it('get dataType split', () => {
        expect(getType("abce fghi jklm nopqr")).toBe("split");
    });
    it('get dataType null', () => {
        expect(getType(null)).toBe("leaf");
    });
});