import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export function requireRole(role) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    
    // Handle admin user from env variables
    if (req.user.id === 'admin' && req.user.role === 'admin') {
      if (role === 'admin') return next()
      return res.status(403).json({ error: 'Forbidden' })
    }
    
    // Handle regular database users
    const user = await User.findById(req.user.id)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (user.role !== role) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}

