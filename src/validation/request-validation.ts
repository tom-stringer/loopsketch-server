import { isEqual } from "lodash";
import PropertyTypeError from "../../../interface/src/errors/PropertyTypeError";
import RequestSyntaxError from "../../../interface/src/errors/RequestSyntaxError";
import PathVariableTypeError from "../../../interface/src/errors/PathVariableTypeError";

export type ValidationTemplate = {
    [key: string]: string;
};

/**
 * Validate generic request body, for a given template.
 * @throws RequestSyntaxError
 * @throws PropertyTypeError
 */
export const validateRequest = (body: { [key: string]: any }, template: ValidationTemplate) => {
    if (!body || !isEqual(Object.keys(body), Object.keys(template))) {
        throw new RequestSyntaxError();
    }

    Object.keys(body).forEach((prop) => {
        const value = body[prop];

        if (typeof value !== template[prop]) {
            throw new PropertyTypeError(prop, template[prop], typeof value);
        }
    });
};

/**
 * Attempts to return path variable string parsed as an integer.
 *
 * @param variable path variable string
 * @param variableName optional variable name for error message, default is "id"
 * @returns path variable parsed to integer
 * @throws PathVariableTypeError
 */
export const validatePathInt = (variable: string, variableName = "id") => {
    const digitsOnly = /^\d+$/;
    if (!digitsOnly.test(variable)) {
        throw new PathVariableTypeError(variableName, "number", "NaN");
    }

    const int = parseInt(variable, 10);
    if (Number.isNaN(int)) {
        throw new PathVariableTypeError(variableName, "number", "NaN");
    }

    return int;
};
