import { mock, mockReset } from "jest-mock-extended";
import { Request, Response } from "express";
import ApiController from "../../src/controllers/ApiController";
import { StatusCodes } from "http-status-codes";

const req = mock<Request>();
const res = mock<Response>();

let apiController: ApiController;

beforeEach(() => {
    apiController = new ApiController();
    mockReset(req);
    mockReset(res);
});

describe("Server status", () => {
    it("Returns 200 OK", async () => {
        res.status.mockReturnThis();
        res.send.mockReturnThis();

        apiController.getServerStatus(req, res);

        expect(res.status).toBeCalledWith(StatusCodes.OK);
        expect(res.send).toBeCalledWith("OK");
    });
});
