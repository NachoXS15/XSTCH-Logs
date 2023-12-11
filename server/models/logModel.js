import { DataTypes } from "sequelize";
import db from "../database/db.js";

const logModel = db.define("logs", {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: true },
    id_log: { type: DataTypes.INET },
    id_cliente: { type: DataTypes.INET },
    precio: { type: DataTypes.INET },
    id_servicio: { type: DataTypes.INET },
    egreso: { type: DataTypes.DATE },
    estado: { type: DataTypes.STRING },
    pago: { type: DataTypes.STRING },
});

export default logModel;
