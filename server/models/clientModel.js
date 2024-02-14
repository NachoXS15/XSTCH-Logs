import { Sequelize, DataTypes } from "sequelize";
import db from "../database/db.js";

const clientModel = db.define("clientesnew", {
    id: {type: DataTypes.INET, primaryKey: true, allowNull: true},
    nombre_cliente: {type: DataTypes.TEXT}
})

export default clientModel