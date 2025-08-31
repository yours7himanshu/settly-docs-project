import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { latestActivities } from '../controllers/activity.controller.js'

const router = Router()

router.use(requireAuth)
router.get('/', latestActivities)

export default router

