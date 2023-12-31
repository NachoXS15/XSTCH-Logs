import { DataTypes } from "sequelize";
import logModel from "../models/logModel.js";


export const getAllLogs = async (req, res) => {
    try {
        const logs = await logModel.findAll();
        res.json(logs);
    } catch (error) {
        console.log(error)
    }
}

export const getOneLog = async (req, res) => {
    try {
        const log = await logModel.findAll({where: {id_log: req.params.id_log}});
        res.json(log);
    } catch (error) {
        console.log(error)
    }
}

export const createLog = async (req, res) => {
    try {
        await logModel.create(req.body);
        res.json({
            "message": "operation ok"
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateLog = async (req, res) => {
    try {
        await logModel.update(req.body);
        res.json({
            "message": "operation ok"
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteLog = async (req, res) => {
    try {
        const log = await logModel.destroy({where: {id_log: req.params.id_log}});
        res.json(log);
    } catch (error) {
        console.log(error)
    }
}