export function errorHandler(err, req, res, next) {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation error', details: err.errors || err.issues })
  }
  if (err?.code === 11000) {
    return res.status(409).json({ error: 'Duplicate key' })
  }
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid token' })
  }
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ error: message })
}

