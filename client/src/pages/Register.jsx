import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../lib/http.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()

  async function onSubmit(e) {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      setToken(data.token)
      setUser(data.user)
      toast.success(`Welcome to TeamDocs, ${data.user.name}!`)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join TeamDocs and start collaborating</p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors" 
                placeholder="Enter your full name" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors" 
                placeholder="Enter your email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors" 
                placeholder="Choose a password (min 6 chars)" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account? {' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

