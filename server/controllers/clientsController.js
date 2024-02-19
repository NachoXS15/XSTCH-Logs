import { DataTypes, Sequelize, QueryTypes, QueryError, where } from "sequelize";
import dotenv from 'dotenv'
import db from "../database/db.js";
import clientModel from "../models/clientModel.js";
const {GETALLCLIENTS} = process.env

export const getAllClients = async (req, res) => {
    try {
        const clients = await db.query(GETALLCLIENTS, {type: QueryTypes.SELECT})
        res.json(clients)
    } catch (error) {
        console.log("Error al traer clientes: ", error.message)
    }
}

export const getOneClient = async(req, res) => {
    try {
        const client = await clientModel.findOne({where: {id: req.params.id}})
        console.log(client)
        res.json(client)
    } catch (error) {
        console.log("error al traer un coso: ", error.message)
    }
}

export const postClient = async(req, res) => {
    try {
        await clientModel.create(req.body)
        res.json({
            operation: 'ok'
        })
    } catch (error) {
        console.log("error al crear: ", error.message)
    }
}

export const updateCliente = async(req, res) => {
    try {
        await clientModel.update(req.body, {where: {id: req.params.id}});
        res.json({
            operation: 'ok'
        })
    } catch (error) {
        throw new Error("error al actualizar")
    }
}

export const deleteCliente = async(req, res) => {
    try {
        await clientModel.destroy({where: {id: req.params.id}})
        res.json({
            operation: 'ok'
        })
    } catch (error) {
        throw new Error("error al eliminar")
    }
}