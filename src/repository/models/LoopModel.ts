import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import UserModel from "./UserModel";

@Table({ tableName: "loop" })
export default class LoopModel extends Model<LoopModel> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(30))
    title!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    tempo!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    barLength!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER.UNSIGNED)
    barCount!: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    instruments!: string;

    @ForeignKey(() => UserModel)
    @Column(DataType.INTEGER.UNSIGNED)
    userId!: number;

    @BelongsTo(() => UserModel)
    user!: UserModel;
}
