import { Sequelize } from "sequelize";

const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PORT, DATABASE_PASSWORD } = process.env;

const sequelize = new Sequelize(DATABASE_NAME!, DATABASE_USER!, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  dialect: "mysql",
  port: parseInt(DATABASE_PORT!),
});

export default sequelize;
