import bcrypt from "bcryptjs";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import PropertyMatchError from "../../../interface/src/errors/PropertyMatchError";
import RecordConflictError from "../../../interface/src/errors/RecordConflictError";
import RecordNotFoundError from "../../../interface/src/errors/RecordNotFountError";
import UserModel from "../repository/models/UserModel";
import { createUser, getUserByEmail, getUserById, getUserByUsername, getUserFromModel } from "../services/user-service";
import { LoginRequest, RegisterRequest } from "../types/authentication-types";
import { ApiResponse } from "../types/response-types";
import { UserResponseData } from "../types/user-types";
import { LOGIN_TEMPLATE, REGISTER_TEMPLATE, validateAuthentication } from "../validation/authentication-validation";
import { validateRequest } from "../validation/request-validation";
import AuthenticationError from "../../../interface/src/errors/AuthenticationError";
import AuthenticationService from "../services/AuthenticationService";
import ResponseService from "../services/ResponseService";
import { injectable } from "tsyringe";
import { Controller, Get, Post } from "@decorators/express";
import { Logger } from "log4js";
import logger from "../decorators/logger";

@Controller("/authentication")
@injectable()
export default class AuthenticationController {
    @logger
    private readonly logger!: Logger;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly responseService: ResponseService
    ) {}

    /** Get authentication status. */
    @Get("/")
    private async authenticationStatus(req: Request, res: ApiResponse<UserResponseData>) {
        try {
            validateAuthentication(req.session);
            const user = getUserFromModel(await getUserById(req.session!.userId));
            this.responseService.sendData(res, StatusCodes.OK, { user });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Log user in. */
    @Post("/login")
    private async login(req: Request<{}, {}, LoginRequest>, res: ApiResponse<UserResponseData>) {
        try {
            validateRequest(req.body, LOGIN_TEMPLATE);
            const { username, password } = req.body;

            const user = await getUserByUsername(username);

            const passwordCorrect = await bcrypt.compare(password, user.password);
            if (!passwordCorrect) {
                this.responseService.sendError(res, new AuthenticationError(username));
            }

            req.session!.userId = user.id;
            this.responseService.sendData(res, StatusCodes.OK, { user: getUserFromModel(user) });

            this.logger.info("User '%s' (id = %d) logged in", user.username, user.id);
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Register user. */
    @Post("/register")
    private async register(req: Request<{}, {}, RegisterRequest>, res: ApiResponse<UserResponseData>) {
        try {
            validateRequest(req.body, REGISTER_TEMPLATE);
            const { username, email, password1, password2 } = req.body;

            // Check if passwords match.
            if (password1 !== password2) {
                throw new PropertyMatchError("password1", "password2");
            }

            // Check if username is taken.
            try {
                await getUserByUsername(username);
                throw new RecordConflictError(username, UserModel.tableName);
            } catch (error) {
                if (!(error instanceof RecordNotFoundError)) {
                    throw error;
                }
            }

            // Check if email is taken.
            try {
                await getUserByEmail(email);
                throw new RecordConflictError(email, UserModel.tableName);
            } catch (error) {
                if (!(error instanceof RecordNotFoundError)) {
                    throw error;
                }
            }

            // Valid input. Register user.
            const password = await this.authenticationService.hashPassword(password1);
            const user = await createUser(username, email, password);
            req.session!.userId = user.id;
            this.responseService.sendData(res, StatusCodes.CREATED, { user: getUserFromModel(user) });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Log user out. */
    @Get("/logout")
    private async logout(req: Request, res: ApiResponse<undefined>) {
        try {
            validateAuthentication(req.session);
            req.session!.destroy(() => {});

            this.responseService.sendData(res, StatusCodes.OK, undefined);
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }
}
