export function validateEnv() {
  const missing = []
  if (!process.env.MONGO_URI) missing.push('MONGO_URI')
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET')
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set; AI features will be limited')
  }
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL (or ADMIN_EMAILS) or ADMIN_PASSWORD not set; admin access will be limited to database users')
  }
}

