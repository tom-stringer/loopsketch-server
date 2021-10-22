import "../../src/repository/repository";
import { Transaction } from "sequelize";
import repository from "../../src/repository/repository";
import UserModel from "../../src/repository/models/UserModel";
import LoopModel from "../../src/repository/models/LoopModel";
import FollowsRelationship from "../../src/repository/relationships/FollowsRelationship";
import { getLogger } from "../../src/utils/log-utils";

const logger = getLogger(__filename);
let transaction: Transaction;

export async function clearDatabase() {
    transaction = await repository.transaction();
    try {
        await LoopModel.destroy({ where: {}, transaction });
        await FollowsRelationship.destroy({ where: {}, transaction });
        await UserModel.destroy({ where: {}, transaction });
    } catch (error) {
        logger.error("Error when clearing database: %s", error);
        await transaction.rollback();
    }
}

export async function restoreDatabase() {
    await transaction.rollback();
}
