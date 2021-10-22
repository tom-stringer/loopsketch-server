import PathVariableTypeError from "../../../interface/src/errors/PathVariableTypeError";
import { validatePathInt } from "../../src/validation/request-validation";

describe("parsePathInt", () => {
    test("parses path integer", () => {
        expect(validatePathInt("123")).toBe(123);
    });

    test("parses zero path integer", () => {
        expect(validatePathInt("0")).toBe(0);
    });

    test("throws for empty string", () => {
        expect(() => validatePathInt("")).toThrow(PathVariableTypeError);
    });

    test("throws for alphanumeric string", () => {
        expect(() => validatePathInt("123x")).toThrow(PathVariableTypeError);
        expect(() => validatePathInt("x123")).toThrow(PathVariableTypeError);
    });

    test("throws for non-continuous string", () => {
        expect(() => validatePathInt("1 23")).toThrow(PathVariableTypeError);
        expect(() => validatePathInt("x 123")).toThrow(PathVariableTypeError);
    });
});
