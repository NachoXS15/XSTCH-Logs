import express from 'express'
import {deleteService, getAllServices, getOneService, postService, updateService} from '../controllers/serviceController.js'

const router = express.Router()

router.get('/', getAllServices)
router.get('/:id', getOneService)
router.post('/', postService)
router.put('/:id', updateService)
router.delete('/:id', deleteService)

export default router