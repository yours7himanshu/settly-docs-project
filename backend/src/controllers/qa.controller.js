import Document from '../models/Document.js'
import { embedText, answerQuestion } from '../services/gemini.js'

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

export async function ask(req, res, next) {
  try {
    const { q } = req.body
    if (!q) return res.status(400).json({ error: 'Missing q' })
    
    const queryEmbedding = await embedText(q)
    
    const filter = {}
    
    // Regular users can only ask questions about their own documents
    // Admins can ask questions about all documents
    const isAdmin = req.user.role === 'admin' || req.user.id === 'admin'
    if (!isAdmin) {
      filter.createdBy = req.user.id
    }
    
    const docs = await Document.find(filter).limit(200)
    const top = docs
      .map(d => ({ doc: d, score: cosineSimilarity(queryEmbedding, d.embedding || []) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.doc)
    const context = top.map(d => `Title: ${d.title}\nSummary: ${d.summary}\nContent: ${d.content}`).join('\n\n')
    const answer = await answerQuestion(q, context)
    res.json({ answer, contextDocs: top.map(d => ({ id: d._id, title: d.title })) })
  } catch (e) {
    next(e)
  }
}

