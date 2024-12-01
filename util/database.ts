import { Sequelize } from "sequelize";

const sequelize = new Sequelize("rishisingh", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
