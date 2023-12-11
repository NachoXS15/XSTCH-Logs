import { Sequelize } from "sequelize";

const db = new Sequelize("xstch", "root", "", {
    host: "localhost",
    dialect: 'mysql'
})

export default db