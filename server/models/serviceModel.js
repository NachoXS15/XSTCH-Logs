import { Sequelize, DataTypes } from "sequelize";
import db from "../database/db.js";
const serviceModel = db.define('servicios', {
    id: {type: DataTypes.INET, primaryKey: true, allowNull: true},
    id_servicio: {type: DataTypes.INET, allowNull: true},
    nombre_servicio: {type: DataTypes.TEXT}
})

export default serviceModel