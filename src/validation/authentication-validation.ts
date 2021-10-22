import AuthenticationRequiredError from "../../../interface/src/errors/AuthenticationRequiredError";
import { ValidationTemplate } from "./request-validation";

export const LOGIN_TEMPLATE: ValidationTemplate = {
    username: "string",
    password: "string",
};

export const REGISTER_TEMPLATE: ValidationTemplate = {
    username: "string",
    email: "string",
    password1: "string",
    password2: "string",
};

/**
 * @throws AuthenticationRequiredError
 */
export const validateAuthentication = (session?: Express.Session) => {
    if (!session || !session.userId) {
        throw new AuthenticationRequiredError();
    }
};
