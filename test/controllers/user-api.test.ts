import PathVariableTypeError from "../../../interface/src/errors/PathVariableTypeError";
import supertest from "supertest";
import app from "../../src/app";
import { StatusCodes } from "http-status-codes";
import { getUserById, getUserFromModel } from "../../src/services/user-service";
import RecordNotFoundError from "../../../interface/src/errors/RecordNotFountError";
import { mocked } from "ts-jest/utils";
import { User } from "../../../interface/src/types/user-types";
import { validatePathInt } from "../../src/validation/request-validation";

jest.mock("../../src/validation/request-validation");
jest.mock("../../src/services/user-service");
const validatePathIntMock = mocked(validatePathInt);
const getUserByIdMock = mocked(getUserById);
const getUserFromModelMock = mocked(getUserFromModel);

const USERS_LOCATION = "/api/users";
const USER: User = {
    id: 0,
    username: "Tom",
    dateJoined: "some date",
};

beforeEach(() => {
    jest.resetAllMocks();
});

describe("get user by id", () => {
    test("returns error for bad id", async () => {
        validatePathIntMock.mockImplementation(() => {
            throw new PathVariableTypeError("id", "number", "NaN");
        });

        const response = await supertest(app).get(USERS_LOCATION + "/1");
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body.data).toBeUndefined();
        expect(response.body.error.data.name).toBe("PathVariableTypeError");
    });

    test("returns error when user not found", async () => {
        validatePathIntMock.mockReturnValue(1);
        getUserByIdMock.mockImplementation(() => {
            throw new RecordNotFoundError("1", "user");
        });

        const response = await supertest(app).get(USERS_LOCATION + "/1");
        expect(response.status).toBe(StatusCodes.NOT_FOUND);
        expect(response.body.data).toBeUndefined();
        expect(response.body.error.data.name).toBe("RecordNotFoundError");
    });

    test("returns user by id", async () => {
        getUserFromModelMock.mockReturnValue(USER);

        const response = await supertest(app).get(USERS_LOCATION + "/1");
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.data.user).toEqual(USER);
    });
});
