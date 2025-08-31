import { Router } from 'express'
import authRoutes from './auth.routes.js'
import docRoutes from './docs.routes.js'
import searchRoutes from './search.routes.js'
import qaRoutes from './qa.routes.js'
import activityRoutes from './activity.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/docs', docRoutes)
router.use('/search', searchRoutes)
router.use('/qa', qaRoutes)
router.use('/activity', activityRoutes)

export default router

