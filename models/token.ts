import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../util/database";

// Define the attributes of the Token model
interface TokenAttributes {
    id: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
}

// Define optional attributes for creation
interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> { }

// Extend the Model class
class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
    public id!: string;
    public accessToken!: string;
    public refreshToken!: string;
    public userId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Token.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        accessToken: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize, // Pass your Sequelize instance
        tableName: 'token',
    }
);

export default Token;
