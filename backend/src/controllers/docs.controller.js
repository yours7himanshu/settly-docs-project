import { z } from 'zod'
import Document from '../models/Document.js'
import Activity from '../models/Activity.js'
import { summarizeContent, generateTags, embedText } from '../services/gemini.js'

const DocSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()).optional()
})

export async function createDoc(req, res, next) {
  try {
    const { title, content, tags } = DocSchema.parse(req.body)
    const summary = await summarizeContent(content)
    const autoTags = await generateTags(content)
    const embedding = await embedText(`${title}\n${content}`)
    const doc = await Document.create({
      title,
      content,
      tags: Array.from(new Set([...(tags || []), ...autoTags])),
      summary,
      createdBy: req.user.id,
      embedding,
      versions: []
    })
    // Create activity for all users (including admin)
    if (req.user.id === 'admin') {
      await Activity.create({ 
        user: req.user.id, 
        document: doc._id, 
        action: 'create',
        userName: 'Administrator',
        userRole: 'admin'
      })
    } else {
      await Activity.create({ user: req.user.id, document: doc._id, action: 'create' })
    }
    res.status(201).json(doc)
  } catch (e) {
    next(e)
  }
}

export async function listDocs(req, res, next) {
  try {
    const { tag, q, mine } = req.query
    const filter = {}
    
    // Regular users can only see their own documents
    // Admins can see all documents
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin'
    if (!isAdmin) {
      filter.createdBy = req.user.id
    }
    
    if (tag) filter.tags = tag
    if (q) filter.$text = { $search: q }
    if (mine === 'true') filter.createdBy = req.user.id
    
    const docs = await Document.find(filter).populate('createdBy', 'name email role').sort({ updatedAt: -1 })
    res.json(docs)
  } catch (e) {
    next(e)
  }
}

export async function getDoc(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id).populate('createdBy', 'name email role')
    if (!doc) return res.status(404).json({ error: 'Not found' })
    
    // Check if user has permission to view this document
    const isOwner = String(doc.createdBy._id) === String(req.user.id)
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin'
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied. You can only view your own documents.' })
    }
    
    res.json(doc)
  } catch (e) {
    next(e)
  }
}

export async function updateDoc(req, res, next) {
  try {
    const { title, content, tags } = DocSchema.partial().parse(req.body)
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    const isOwner = String(doc.createdBy) === String(req.user.id)
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin'
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' })
    // Only create version history for database users (not env admin)
    if (req.user.id !== 'admin') {
      doc.versions.push({ title: doc.title, content: doc.content, tags: doc.tags, summary: doc.summary, updatedBy: req.user.id })
    }
    if (title !== undefined) doc.title = title
    if (content !== undefined) doc.content = content
    if (tags !== undefined) doc.tags = tags
    if (content !== undefined) {
      doc.summary = await summarizeContent(doc.content)
      doc.embedding = await embedText(`${doc.title}\n${doc.content}`)
    }
    await doc.save()
    // Create activity for all users (including admin)
    if (req.user.id === 'admin') {
      await Activity.create({ 
        user: req.user.id, 
        document: doc._id, 
        action: 'update',
        userName: 'Administrator',
        userRole: 'admin'
      })
    } else {
      await Activity.create({ user: req.user.id, document: doc._id, action: 'update' })
    }
    res.json(doc)
  } catch (e) {
    next(e)
  }
}

export async function deleteDoc(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    const isOwner = String(doc.createdBy) === String(req.user.id)
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin'
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' })
    await doc.deleteOne()
    // Create activity for all users (including admin)
    if (req.user.id === 'admin') {
      await Activity.create({ 
        user: req.user.id, 
        document: doc._id, 
        action: 'delete',
        userName: 'Administrator',
        userRole: 'admin'
      })
    } else {
      await Activity.create({ user: req.user.id, document: doc._id, action: 'delete' })
    }
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
}

export async function summarizeDoc(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    doc.summary = await summarizeContent(doc.content)
    await doc.save()
    res.json({ summary: doc.summary })
  } catch (e) {
    next(e)
  }
}

export async function generateDocTags(req, res, next) {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    const tags = await generateTags(doc.content)
    doc.tags = Array.from(new Set([...(doc.tags || []), ...tags]))
    await doc.save()
    res.json({ tags: doc.tags })
  } catch (e) {
    next(e)
  }
}

