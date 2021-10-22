import { Request } from "express";
import InvalidFileRequestError from "../../../interface/src/errors/InvalidFileRequestError";

export default class FileValidation {
    static validateFileRequest(req: Request) {
        if (!req.files || !req.files["file"]) {
            throw new InvalidFileRequestError();
        }
    }
}
