import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BookOpen, Plus, Search, MessageCircle, User, LogOut, Home } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  function isActive(path) {
    return location.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'
  }

  return (
    <div className="w-full border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            <BookOpen className="w-6 h-6" />
            Settyl Co.
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`flex items-center gap-2 text-sm transition-colors ${isActive('/')}`}>
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/search" className={`flex items-center gap-2 text-sm transition-colors ${isActive('/search')}`}>
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link to="/qa" className={`flex items-center gap-2 text-sm transition-colors ${isActive('/qa')}`}>
              <MessageCircle className="w-4 h-4" />
              Team Q&A
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/docs/new" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Document
          </Link>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors font-medium p-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-10 h-8" />
              {/* <span className="hidden sm:inline">Logout</span> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

