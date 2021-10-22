import { Request, Response } from "express";
import { ResponseBody } from "../../../interface/src/types/response-types";
import ResponseService from "../services/ResponseService";
import FileValidation from "../validation/FileValidation";
import fileUpload from "express-fileupload";
import appRootPath from "app-root-path";
import path from "path";
import { validateAuthentication } from "../validation/authentication-validation";
import { injectable } from "tsyringe";
import { Controller, Get, Post } from "@decorators/express";
import Res from "../decorators/express/Res";
import { Logger } from "log4js";
import logger from "../decorators/logger";

// WIP
@Controller("/tracks")
@injectable()
export class TrackController {
    @logger
    private readonly logger!: Logger;

    constructor(private readonly responseService: ResponseService) {}

    @Post("/")
    private async createTrack(req: Request, res: Response<ResponseBody<undefined>>) {
        try {
            validateAuthentication(req.session);
            FileValidation.validateFileRequest(req);

            const file = req.files!["file"] as fileUpload.UploadedFile;

            await file.mv(path.join(appRootPath.toString(), "uploads", "tracks", file.name));
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    @Get("/")
    private async getTrack(@Res() res: Response) {
        res.sendFile(path.join(appRootPath.toString(), "uploads", "images", "stylized-wallpaper.jpg"));
    }
}
