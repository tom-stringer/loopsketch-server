import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseService from "../services/ResponseService";
import {
    createLoop,
    getAllLoops,
    getAllLoopsForUser,
    getLoopById,
    getLoopFromModel,
    updateLoop,
} from "../services/loop-service";
import { CreateLoopRequest, LoopListResponseData, LoopResponseData, UpdateLoopRequest } from "../types/loop-types";
import { ApiResponse } from "../types/response-types";
import { validateAuthentication } from "../validation/authentication-validation";
import {
    validateCreateLoopRequest,
    validateUpdateLoopRequest,
    validateUserOwnsLoop,
} from "../validation/loop-validation";
import { validatePathInt } from "../validation/request-validation";
import { injectable } from "tsyringe";
import { Body, Controller, Delete, Get, Params, Post, Put } from "@decorators/express";
import Res from "../decorators/express/Res";
import Req from "../decorators/express/Req";
import { Logger } from "log4js";
import logger from "../decorators/logger";

@Controller("/loops")
@injectable()
export default class LoopController {
    @logger
    private readonly logger!: Logger;

    constructor(private readonly responseService: ResponseService) {}

    /** Get all loops created by given user. */
    @Get("/user/:userId")
    private async getLoopsForUser(@Params("userId") userId: string, @Res() res: ApiResponse<LoopListResponseData>) {
        try {
            const userIdNumber = validatePathInt(userId, "userId");

            const models = await getAllLoopsForUser(userIdNumber);
            const loops = models.map((model) => getLoopFromModel(model));
            this.responseService.sendData<LoopListResponseData>(res, StatusCodes.OK, { loops });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Get loop by ID. */
    @Get("/:id")
    private async getLoop(@Params("id") id: string, @Res() res: ApiResponse<LoopResponseData>) {
        try {
            const idNumber = validatePathInt(id);

            const loop = getLoopFromModel(await getLoopById(idNumber));
            this.responseService.sendData<LoopResponseData>(res, StatusCodes.OK, { loop });
            this.logger.info("Got loop %d", loop.id);
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Get all loops. */
    @Get("/")
    private async getAllLoops(@Res() res: ApiResponse<LoopListResponseData>) {
        try {
            const models = await getAllLoops();
            const loops = models.map((model) => getLoopFromModel(model));
            this.responseService.sendData<LoopListResponseData>(res, StatusCodes.OK, { loops });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Create new loop. */
    @Post("/")
    private async createLoop(
        @Body() body: CreateLoopRequest,
        @Req() req: Request,
        @Res() res: ApiResponse<LoopResponseData>
    ) {
        try {
            validateAuthentication(req.session);
            validateCreateLoopRequest(body);

            const loop = getLoopFromModel(await createLoop(req.body, req.session!.userId));
            this.responseService.sendData<LoopResponseData>(res, StatusCodes.CREATED, { loop });
            this.logger.info("Created loop %d", loop.id);
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Update loop. */
    @Put("/:id")
    private async updateLoop(
        @Params("id") id: string,
        @Body() body: UpdateLoopRequest,
        @Req() req: Request,
        @Res() res: ApiResponse<LoopResponseData>
    ) {
        try {
            validateAuthentication(req.session);
            validateUpdateLoopRequest(body);

            const idNumber = validatePathInt(id);

            const loop = req.body;
            const model = await getLoopById(idNumber);
            validateUserOwnsLoop(req.session!.userId, model);
            const updated = getLoopFromModel(await updateLoop(model, loop));
            this.responseService.sendData(res, StatusCodes.OK, { loop: updated });

            this.logger.info("Updated loop %d", model.id);
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    @Delete("/:id")
    /** Delete loop. */
    private async deleteLoop(@Params("id") id: string, @Req() req: Request, @Res() res: ApiResponse<undefined>) {
        try {
            validateAuthentication(req.session);

            const idNumber = validatePathInt(id);

            const loop = await getLoopById(idNumber);

            validateUserOwnsLoop(req.session!.userId, loop);

            loop.destroy();
            this.responseService.sendData(res, StatusCodes.OK, undefined);
            this.logger.info("Deleted loop %d", loop.id);
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }
}
