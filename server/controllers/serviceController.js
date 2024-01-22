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

export const getOneService = async(req, res) => {
    try {
        const service = await serviceModel.findOne({where: {id: req.params.id}})
        res.json(service)
    } catch (error) {
        console.log(error.message)
    }
}

export const updateService = async (req, res) =>{
    try {
        await serviceModel.update(req.body, {where: {id: req.params.id}})
        res.json({
            operation: 'ok'
        })
    } catch (error) {
        console.error(error.message)
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

export const deleteService = async (req, res) => {
    try {
        await serviceModel.destroy({where: {id: req.params.id}})
        res.json({
            operation: 'ok'
        })
    } catch (error) {
        console.log("error: ", error.message)
    }
}