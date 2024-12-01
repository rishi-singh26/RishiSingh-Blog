import { DataTypes } from "sequelize";

import sequelize from "../util/database";

const Blog = sequelize.define("blog", {
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
    thumbNailImageUrl: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    draft: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    html: {
        type: DataTypes.STRING(10000),
        allowNull: false,
    },
});

export default Blog;
