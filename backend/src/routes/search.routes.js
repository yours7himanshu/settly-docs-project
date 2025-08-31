import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { textSearch, semanticSearch } from '../controllers/search.controller.js'

const router = Router()

router.use(requireAuth)
router.get('/text', textSearch)
router.get('/semantic', semanticSearch)

export default router

