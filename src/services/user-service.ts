import RecordNotFoundError from "../../../interface/src/errors/RecordNotFountError";
import UserModel from "../repository/models/UserModel";
import { User } from "../types/user-types";
import FollowsRelationship from "../repository/relationships/FollowsRelationship";

export const getUserFromModel = (model: UserModel): User => {
    return {
        id: model.id,
        username: model.username,
        dateJoined: model.createdAt,
    };
};

/**
 * @throws RecordNotFoundError
 */
export const getUserById = async (id: number) => {
    const user = await UserModel.findByPk(id);
    if (!user) {
        throw new RecordNotFoundError(id, UserModel.tableName);
    }
    return user;
};

/**
 * @throws RecordNotFoundError
 */
export const getUserByUsername = async (username: string) => {
    const user = await UserModel.findOne({ where: { username } });
    if (!user) {
        throw new RecordNotFoundError(username, UserModel.tableName);
    }
    return user;
};

/**
 * @throws RecordNotFoundError
 */
export const getUserByEmail = async (email: string) => {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
        throw new RecordNotFoundError(email, UserModel.tableName);
    }
    return user;
};

export const createUser = (username: string, email: string, password: string): Promise<UserModel> => {
    return UserModel.create({
        username: username,
        email: email,
        password: password,
    });
};

export const getUserFollowers = async (id: number) => {
    const relationships = await FollowsRelationship.findAll({
        attributes: ["followerId"],
        where: { followingId: id },
    });
    const followers = [] as UserModel[];

    for (const relationship of relationships) {
        const follower = await UserModel.findByPk(relationship.followerId);

        if (follower !== null) {
            followers.push(follower);
        }
    }

    return followers;
};

export const getUserFollowersCount = (id: number) => {
    return FollowsRelationship.count({
        where: { followingId: id },
    });
};

export const getUserFollowing = async (id: number) => {
    const relationships = await FollowsRelationship.findAll({
        attributes: ["followingId"],
        where: { followerId: id },
    });
    const following = [] as UserModel[];

    for (const relationship of relationships) {
        const follower = await UserModel.findByPk(relationship.followingId);

        if (follower !== null) {
            following.push(follower);
        }
    }

    return following;
};

export const getUserFollowingCount = (id: number): Promise<number> => {
    return FollowsRelationship.count({
        where: { followerId: id },
    });
};
