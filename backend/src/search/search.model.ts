import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'search_history', timestamps: false })
export class SearchHistory extends Model<SearchHistory> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    search_term: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    search_timestamp: Date;
}
