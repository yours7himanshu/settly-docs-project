import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { createDoc, listDocs, getDoc, updateDoc, deleteDoc, summarizeDoc, generateDocTags } from '../controllers/docs.controller.js'

const router = Router()

router.use(requireAuth)

router.get('/', listDocs)
router.post('/', createDoc)
router.get('/:id', getDoc)
router.put('/:id', updateDoc)
router.delete('/:id', deleteDoc)
router.post('/:id/summarize', summarizeDoc)
router.post('/:id/tags', generateDocTags)

export default router

