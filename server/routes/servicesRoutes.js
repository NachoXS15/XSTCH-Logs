import express from 'express'
import { prisma } from '../database/db.js';
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const services = await prisma.servicios.findMany();
        res.json(services)
    } catch (error) {
        console.log(error.message);
    }
})
router.post('/', async(req, res) => {
    try {
        const newService = await prisma.servicios.create({
            data: req.body
        });
        res.json({
            status: 200
        })
        res.json(newService)
    } catch (error) {
        console.log(error.message);
    }
})

router.patch('/:id', async(req, res) => {
    try {
        await prisma.servicios.update({
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
        await prisma.servicios.delete({
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