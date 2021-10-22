import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from "sequelize-typescript";
import LoopModel from "./LoopModel";
import FollowsRelationship from "../relationships/FollowsRelationship";

@Table({ tableName: "user" })
export default class UserModel extends Model<UserModel> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    id!: number;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(15))
    username!: string;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING(320))
    email!: string;

    @AllowNull(false)
    @Column(DataType.STRING(60))
    password!: string;

    @HasMany(() => LoopModel)
    loops!: LoopModel[];

    @BelongsToMany(() => UserModel, () => FollowsRelationship, "followingId", "followerId")
    followers!: UserModel[];

    @BelongsToMany(() => UserModel, () => FollowsRelationship, "followerId", "followingId")
    following!: UserModel[];
}
