import express from "express";
import { deleteCliente, getAllClients, getOneClient, postClient, updateCliente } from "../controllers/clientsController.js";
const router = express.Router();

router.get('/', getAllClients)
router.get('/:id', getOneClient)
router.post('/', postClient)
router.put('/:id', updateCliente)
router.delete('/:id', deleteCliente)
export default router
