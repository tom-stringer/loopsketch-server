import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";
import UserModel from "./UserModel";

@Table({ tableName: "track" })
export default class TrackModel extends Model<TrackModel> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Column(DataType.STRING(30))
    title!: string;

    @ForeignKey(() => UserModel)
    @Column(DataType.INTEGER.UNSIGNED)
    userId!: number;

    @BelongsTo(() => UserModel)
    user!: UserModel;
}
