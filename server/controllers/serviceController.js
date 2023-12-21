import { QueryTypes } from 'sequelize'
import db from '../database/db.js'
import dotenv from 'dotenv'
dotenv.config({path: '../env'})

export const getAllServices = async (req, res) => {
    try {
        const services = await db.query("SELECT * FROM servicios", {type: QueryTypes.SELECT})
        res.json(services)
    } catch (error) {
        console.log("error al traer datos: ", error.messsage)
    }
}