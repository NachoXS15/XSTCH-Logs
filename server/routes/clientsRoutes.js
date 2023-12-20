import express from "express";
import { getAllClients } from "../controllers/clientsController.js";
const router = express.Router();

router.get('/', getAllClients)

export default router
