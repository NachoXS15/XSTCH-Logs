import { DataTypes, Sequelize, QueryTypes, QueryError } from "sequelize";
import dotenv from 'dotenv'
import db from "../database/db.js";
const {GETALLCLIENTS} = process.env

export const getAllClients = async (req, res) => {
    try {
        const clients = await db.query(GETALLCLIENTS, {type: QueryTypes.SELECT})
        res.json(clients)
    } catch (error) {
        console.log("Error al traer clientes: ", error.message)
    }
}