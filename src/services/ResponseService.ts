import { ApiResponse } from "../types/response-types";
import ApiError from "../../../interface/src/errors/ApiError";
import ServerError from "../../../interface/src/errors/ServerError";
import { Logger } from "log4js";
import logger from "../decorators/logger";

export default class ResponseService {
    @logger
    private readonly logger!: Logger;

    /**
     * Respond to the client with the given data. Response error will be undefined.
     */
    public sendData<D>(res: ApiResponse<D>, status: number, data: D) {
        return res.status(status).json({
            data,
        });
    }

    /**
     * Respond to the client with the given error. Response data will be undefined.
     * @throws error if it is not instanceof ServerError
     */
    public sendError(res: ApiResponse<any>, error: Error) {
        if (error instanceof ApiError) {
            const parsedError: ApiError = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
            delete parsedError.stack;

            res.status(parsedError.status).json({
                error: {
                    status: parsedError.status,
                    data: parsedError,
                },
            });
        } else {
            this.logger.error("Undefined error encountered: %s", error);
            this.sendError(res, new ServerError());
        }
    }
}
