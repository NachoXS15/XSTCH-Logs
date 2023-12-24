import express from 'express'
import {getAllServices, postService} from '../controllers/serviceController.js'

const router = express.Router()

router.get('/', getAllServices)
router.post('/', postService)

export default router