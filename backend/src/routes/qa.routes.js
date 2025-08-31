import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { ask } from '../controllers/qa.controller.js'

const router = Router()

router.use(requireAuth)
router.post('/', ask)

export default router

