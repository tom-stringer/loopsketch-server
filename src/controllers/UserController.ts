import { StatusCodes } from "http-status-codes";
import ResponseService from "../services/ResponseService";
import {
    getUserById,
    getUserFollowers,
    getUserFollowersCount,
    getUserFollowing,
    getUserFollowingCount,
    getUserFromModel,
} from "../services/user-service";
import { ApiResponse, CountResponseData } from "../types/response-types";
import { UserListResponseData, UserResponseData } from "../types/user-types";
import { validatePathInt } from "../validation/request-validation";
import { injectable } from "tsyringe";
import { Controller, Get, Params } from "@decorators/express";
import Res from "../decorators/express/Res";

@Controller("/users")
@injectable()
export default class UserController {
    constructor(private readonly responseService: ResponseService) {}

    /** Get user by ID. */
    @Get("/:id")
    private async getUser(@Params("id") id: string, @Res() res: ApiResponse<UserResponseData>) {
        try {
            const idNumber = validatePathInt(id);

            const user = getUserFromModel(await getUserById(idNumber));
            this.responseService.sendData<UserResponseData>(res, StatusCodes.OK, { user });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Get user's follower count. */
    @Get("/:id/followers/count")
    private async getUserFollowersCount(@Params("id") id: string, @Res() res: ApiResponse<CountResponseData>) {
        try {
            const idNumber = validatePathInt(id);

            // Throws if user doesn't exist.
            await getUserById(idNumber);

            const count = await getUserFollowersCount(idNumber);
            this.responseService.sendData<CountResponseData>(res, StatusCodes.OK, { count });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Get user's followers. */
    @Get("/:id/followers")
    private async getUserFollowers(@Params("id") id: string, @Res() res: ApiResponse<UserListResponseData>) {
        try {
            const idNumber = validatePathInt(id);

            // Throws if user doesn't exist.
            await getUserById(idNumber);

            const followers = (await getUserFollowers(idNumber)).map((model) => getUserFromModel(model));
            this.responseService.sendData<UserListResponseData>(res, StatusCodes.OK, { users: followers });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Get count of users that this user is following. */
    @Get("/:id/following/count")
    private async getUserFollowingCount(@Params("id") id: string, @Res() res: ApiResponse<CountResponseData>) {
        try {
            const idNumber = validatePathInt(id);

            // Throws if user doesn't exist.
            await getUserById(idNumber);

            const count = await getUserFollowingCount(idNumber);
            this.responseService.sendData<CountResponseData>(res, StatusCodes.OK, { count });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }

    /** Get users that this user is following. */
    @Get("/:id/following")
    private async getUserFollowing(@Params("id") id: string, @Res() res: ApiResponse<UserListResponseData>) {
        try {
            const idNumber = validatePathInt(id);

            // Throws if user doesn't exist.
            await getUserById(idNumber);

            const following = (await getUserFollowing(idNumber)).map((model) => getUserFromModel(model));
            this.responseService.sendData<UserListResponseData>(res, StatusCodes.OK, { users: following });
        } catch (error) {
            this.responseService.sendError(res, error);
        }
    }
}
