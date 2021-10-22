import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import UserModel from "../models/UserModel";

@Table({ tableName: "follows", timestamps: false })
export default class FollowsRelationship extends Model<FollowsRelationship> {
    @ForeignKey(() => UserModel)
    @Column(DataType.INTEGER.UNSIGNED)
    followerId!: number;

    @ForeignKey(() => UserModel)
    @Column(DataType.INTEGER.UNSIGNED)
    followingId!: number;
}
