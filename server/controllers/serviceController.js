import { QueryTypes } from 'sequelize'
import db from '../database/db.js'
import dotenv from 'dotenv'
import serviceModel from '../models/serviceModel.js'
dotenv.config({path: '../env'})

export const getAllServices = async (req, res) => {
    try {
        const services = await serviceModel.findAll()
        res.json(services)
    } catch (error) {
        console.log("error al traer datos: ", error.messsage)
    }
}




export const postService = async(req, res) => {
    try {
        await serviceModel.create(req.body)
        res.json({
            operation: 'ok'
        })
    } catch (error) {
        console.log("error al crear: ", error.message)
    }
}