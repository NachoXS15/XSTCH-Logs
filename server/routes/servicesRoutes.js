import express from 'express'
import {deleteService, getAllServices, postService} from '../controllers/serviceController.js'

const router = express.Router()

router.get('/', getAllServices)
router.post('/', postService)
router.delete('/:id', deleteService)

export default router