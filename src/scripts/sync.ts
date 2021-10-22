import Repository from "../repository/Repository";
import { SyncOptions } from "sequelize";
import LoggerUtils from "../utils/LoggerUtils";
import UserModel from "../repository/models/UserModel";
import LoopModel from "../repository/models/LoopModel";
import TrackModel from "../repository/models/TrackModel";
import { Model } from "sequelize-typescript";
import FollowsRelationship from "../repository/relationships/FollowsRelationship";
import { container } from "tsyringe";

const logger = new LoggerUtils().getLogger(__filename);
const sequelize = container.resolve(Repository).sequelize;

type ModelMap = Record<string, typeof Model>;
const models: ModelMap = {
    user: UserModel,
    loop: LoopModel,
    track: TrackModel,
    follows: FollowsRelationship,
};

const args = process.argv.slice(2);

// Apply options from optional command flags (-alter or -force).
const options = {} as SyncOptions;
if (args.includes("-alter")) {
    options.alter = true;
} else if (args.includes("-force")) {
    options.force = true;
}

async function syncRepository() {
    await sequelize.sync(options);
    logger.info("Successfully synchronised repository");
}

async function syncModel(model: typeof Model) {
    await model.sync(options);
    logger.info("Successfully synchronised model: %s", model.name);
}

async function main() {
    try {
        const modelNames = args.filter((arg) => !arg.startsWith("-"));

        if (modelNames.length > 0) {
            for (const modelName of modelNames) {
                const model = models[modelName];

                if (model) {
                    logger.info("Found model: %s", modelName);
                    await syncModel(model);
                } else {
                    logger.error("Couldn't find model: %s in model map.", modelName);
                }
            }
        } else {
            logger.info("No models given as command line arguments. Synchronising entire repository.");
            await syncRepository();
        }
    } catch (error) {
        logger.error("Error when trying to synchronise repository with args %s. %s", args, error);
    }
}

main();
