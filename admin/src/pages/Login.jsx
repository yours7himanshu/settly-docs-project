import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Shield } from 'lucide-react'
import api from '../lib/http.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()

  async function onSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.')
        return
      }
      setToken(data.token)
      setUser(data.user)
      toast.success(`Welcome, ${data.user.name}!`)
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="card p-8 border-2">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-gray-600">Administrative access to TeamDocs</p>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors" 
                placeholder="Enter admin email" 
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
                placeholder="Enter password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Admin Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ⚠️ Admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

