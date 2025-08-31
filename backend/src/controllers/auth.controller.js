import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../models/User.js'

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })

export async function register(req, res, next) {
  try {
    const { name, email, password } = RegisterSchema.parse(req.body)
    
    // Prevent registration with admin email from env
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
      return res.status(409).json({ error: 'This email is reserved for admin access' })
    }
    
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'Email already in use' })
    
    const passwordHash = await bcrypt.hash(password, 10)
    // All registered users are regular users (no admin role from registration)
    const user = await User.create({ name, email, passwordHash, role: 'user' })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    console.log('Login attempt:', req.body)
    const { email, password } = LoginSchema.parse(req.body)
    
    // Check if this is admin login from env variables
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS?.replace(/"/g, '')
    const adminPassword = process.env.ADMIN_PASSWORD?.replace(/"/g, '')
    
    console.log('Admin login attempt:', { 
      adminEmailFound: !!adminEmail,
      adminPasswordFound: !!adminPassword,
      inputEmail: email
    })
    
    if (adminEmail && adminPassword && email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      // Admin login from env
      console.log('Admin login successful')
      const adminUser = {
        id: 'admin',
        name: 'Administrator',
        email: adminEmail,
        role: 'admin'
      }
      const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.json({ token, user: adminUser })
    }
    
    // Regular user login from database
    console.log('Checking regular user login')
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    console.error('Login error:', e)
    next(e)
  }
}

