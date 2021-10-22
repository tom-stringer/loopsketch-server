import { Sequelize } from "sequelize-typescript";
import LoopModel from "./models/LoopModel";
import UserModel from "./models/UserModel";
import FollowsRelationship from "./relationships/FollowsRelationship";
import env from "../../env/env";
import { Dialect } from "sequelize";
import TrackModel from "./models/TrackModel";
import { Logger } from "log4js";
import logger from "../decorators/logger";

export default class Repository {
    public readonly sequelize: Sequelize;

    @logger
    private readonly logger!: Logger;

    constructor() {
        this.sequelize = new Sequelize({
            database: env.DB.DATABASE,
            dialect: env.DB.DIALECT as Dialect,
            username: env.DB.USERNAME,
            password: env.DB.PASSWORD,
            models: [UserModel, LoopModel, FollowsRelationship, TrackModel],
            logging: (sql) => this.logger.debug(sql),
        });
    }
}
