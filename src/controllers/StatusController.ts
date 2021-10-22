import { Controller, Get } from "@decorators/express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../../interface/src/types/response-types";
import ResponseService from "../services/ResponseService";
import { injectable } from "tsyringe";
import Res from "../decorators/express/Res";
import { StatusResponseData } from "../../../interface/src/types/status-types";

@Controller("/status")
@injectable()
export default class StatusController {
    constructor(private readonly responseService: ResponseService) {}

    @Get("/")
    private getStatus(@Res() res: ApiResponse<StatusResponseData>) {
        return this.responseService.sendData<StatusResponseData>(res, StatusCodes.OK, { status: "UP" });
    }
}
