import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

async function generate(model, prompt) {
  if (!genAI) return ''
  const m = genAI.getGenerativeModel({ model })
  const res = await m.generateContent(prompt)
  const text = res.response.text()
  return text
}

export async function summarizeContent(content) {
  const prompt = `Summarize the following document in 2-3 sentences:\n\n${content}`
  return generate('gemini-1.5-flash', prompt)
}

export async function generateTags(content) {
  const prompt = `Read the content and return 3-8 short tags, comma-separated, lowercase, no punctuation other than commas:\n\n${content}`
  const text = await generate('gemini-1.5-flash', prompt)
  return text
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
}

export async function embedText(content) {
  if (!genAI) return []
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const res = await model.embedContent(content)
    const values = res.embedding?.values || []
    return values
  } catch {
    return []
  }
}

export async function answerQuestion(question, context) {
  const prompt = `You are a helpful assistant. Use only the provided context to answer. If unsure, say you don't know.\n\nContext:\n${context}\n\nQuestion: ${question}`
  return generate('gemini-1.5-flash', prompt)
}

