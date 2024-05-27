import express from "express";
import { prisma } from "../database/db.js";
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const clients = await prisma.clients.findMany();
        res.json(clients)
    } catch (error) {
        console.log(error.message);
    }
})
router.post('/', async(req, res) => {
    try {
        const newClient = await prisma.clients.create({
            data: req.body
        });
        res.json({
            status: 200
        })
        res.json(newClient)
    } catch (error) {
        console.log(error.message);
    }
})

router.patch('/:id', async(req, res) => {
    try {
        await prisma.clients.update({
            where: req.params.id
        })
        res.json({
            status: 200
        })
    } catch (error) {
        console.log("error al actualizar", error.message);
    }
})

router.delete('/:id', async(req, res) => {
    try {
        await prisma.clients.delete({
            where: req.params.id
        })
        res.json({
            status: 200
        })
    } catch (error) {
        console.log("error al Eliminar", error.message);
    }
})

export default router
