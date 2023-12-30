import { Sequelize, DataTypes } from "sequelize";
import db from "../database/db.js";

const clientModel = db.define("clientes", {
    id: {type: DataTypes.INET, primaryKey: true, allowNull: true},
    id_cliente: {type: DataTypes.INET},
    nombre_cliente: {type: DataTypes.TEXT}
})

export default clientModel