import { Sequelize } from "sequelize";

const db = new Sequelize("logs", "root", "", {
    host: "localhost",
    dialect: 'mysql'
})

export default db