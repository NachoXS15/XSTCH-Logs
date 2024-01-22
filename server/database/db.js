import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path: './.env'})
const {DATABASE, USER, HOST, PASSWORD} = process.env

const db = new Sequelize(DATABASE, USER, PASSWORD || null, {
    host: HOST,
    dialect: 'mysql',
})

export default db;