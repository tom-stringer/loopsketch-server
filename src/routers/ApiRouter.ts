import { Router } from "express";
import { attachControllerInstances } from "@decorators/express";
import { injectable } from "tsyringe";
import StatusController from "../controllers/StatusController";
import AuthenticationController from "../controllers/AuthenticationController";
import LoopController from "../controllers/LoopController";
import UserController from "../controllers/UserController";
import { TrackController } from "../controllers/TrackController";

/**
 * Main top-level router mounted at /api.
 * All API controllers are attached to this router.
 */
@injectable()
export default class ApiRouter {
    public readonly router = Router();

    constructor(
        private readonly statusController: StatusController,
        private readonly authenticationController: AuthenticationController,
        private readonly loopController: LoopController,
        private readonly userController: UserController,
        private readonly trackController: TrackController
    ) {
        attachControllerInstances(this.router, [
            this.statusController,
            this.authenticationController,
            this.loopController,
            this.userController,
            this.trackController,
        ]);
    }
}
