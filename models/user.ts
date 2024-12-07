import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../util/database";

// Define the attributes of the User model
interface UserAttributes {
    id: string;
    email: string;
    password: string;
    name: string;
}

// Define optional attributes for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

// Extend the Model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public email!: string;
    public password!: string;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the model
User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize, // Pass your Sequelize instance
        tableName: 'users',
    }
);

export default User;
