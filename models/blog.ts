import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../util/database";

// Define the attributes of the User model
interface BlogAttributes {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    draft: boolean;
    html: string;
    views: number;
    canonicalUrl: string;
    userId: string;
    tags: string;
}

// Define optional attributes for creation
interface BlogCreationAttributes extends Optional<BlogAttributes, 'id'> { }

// Extend the Model class
class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
    public id!: string;
    public title!: string;
    public description!: string;
    public thumbnailUrl!: string;
    public draft!: boolean;
    public html!: string;
    public views!: number;
    public canonicalUrl!: string;
    public userId!: string;
    public tags!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialize the model
Blog.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        thumbnailUrl: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        draft: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        html: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        canonicalUrl: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        tags: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    },
    {
        sequelize, // Pass your Sequelize instance
        tableName: 'blog',
    }
)
export default Blog;


// Information on DataTypes.TEXT
// https://stackoverflow.com/questions/13932750/tinytext-text-mediumtext-and-longtext-maximum-storage-sizes

// Type | Maximum length
// -----------+-------------------------------------
//   TINYTEXT |           255 (2 8−1) bytes
//       TEXT |        65,535 (216−1) bytes = 64 KiB
// MEDIUMTEXT |    16,777,215 (224−1) bytes = 16 MiB
//   LONGTEXT | 4,294,967,295 (232−1) bytes =  4 GiB

// Type | A= worst case (x/3) | B = best case (x) | words estimate (A/4.5) - (B/4.5)
// -----------+---------------------------------------------------------------------------
//   TINYTEXT |              85     | 255               | 18 - 56
//       TEXT |          21,845     | 65,535            | 4,854.44 - 14,563.33  
// MEDIUMTEXT |       5,592,415     | 16,777,215        | 1,242,758.8 - 3,728,270
//   LONGTEXT |   1,431,655,765     | 4,294,967,295     | 318,145,725.5 - 954,437,176.6
