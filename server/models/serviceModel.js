import { Sequelize, DataTypes } from "sequelize";
import db from "../database/db.js";
const clientModel = db.define('servicios', {
    id_servicio: {type: DataTypes.INET, primaryKey: true, allowNull: true},
    nombre_servicio: {type: DataTypes.TEXT}
})

export default clientModel