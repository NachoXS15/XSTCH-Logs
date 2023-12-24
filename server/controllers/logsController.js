import { DataTypes, Sequelize, QueryTypes } from "sequelize";
import logModel from "../models/logModel.js";
import db from "../database/db.js";
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const {GETALLLOGS} = process.env


export const getAllLogs = async (req, res) => {
    try {
        //const logs = await logModel.findAll();
        const logs = await db.query(GETALLLOGS, {type: QueryTypes.SELECT});
        res.json(logs);
    } catch (error) {
        console.log(error)
    }
}

export const getOneLog = async (req, res) => {
    try {
        const log = await logModel.findOne({where: {id_log: req.params.id_log}});
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
        const log = await logModel.destroy({where: {id: req.params.id}});
        res.json({
            "operation": "ok"
        });
    } catch (error) {
        console.log(error)
    }
}