import Document from '../models/Document.js'
import { embedText } from '../services/gemini.js'

function cosineSimilarity(a, b) {
  const len = Math.min(a.length, b.length)
  let dot = 0
  let a2 = 0
  let b2 = 0
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i]
    a2 += a[i] * a[i]
    b2 += b[i] * b[i]
  }
  if (a2 === 0 || b2 === 0) return 0
  return dot / (Math.sqrt(a2) * Math.sqrt(b2))
}

export async function textSearch(req, res, next) {
  try {
    const { q } = req.query
    if (!q) return res.json([])
    
    const filter = { $text: { $search: q } }
    
    // Regular users can only search their own documents
    // Admins can search all documents
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin'
    if (!isAdmin) {
      filter.createdBy = req.user.id
    }
    
    const docs = await Document.find(filter).limit(20)
    res.json(docs)
  } catch (e) {
    next(e)
  }
}

export async function semanticSearch(req, res, next) {
  try {
    const { q } = req.query
    if (!q) return res.json([])
    
    const queryEmbedding = await embedText(q)
    
    const filter = {}
    
    // Regular users can only search their own documents
    // Admins can search all documents
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin'
    if (!isAdmin) {
      filter.createdBy = req.user.id
    }
    
    const docs = await Document.find(filter).limit(200)
    const scored = docs
      .map(d => ({ doc: d, score: cosineSimilarity(queryEmbedding, d.embedding || []) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(s => ({ ...s.doc.toObject(), _score: s.score }))
    res.json(scored)
  } catch (e) {
    next(e)
  }
}

