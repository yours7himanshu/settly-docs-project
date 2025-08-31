import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Shield, LogOut, Trash2, Edit } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import DeleteModal from '../components/DeleteModal.jsx'
import api from '../lib/http.js'

export default function Dashboard() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [docToDelete, setDocToDelete] = useState(null)

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    load()
  }, [token])

  async function load() {
    try {
      setLoading(true)
      const { data } = await api.get('/docs')
      setDocs(data)
    } catch (error) {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  function openDeleteModal(doc) {
    setDocToDelete(doc)
    setShowDeleteModal(true)
  }

  function editDocument(doc) {
    // Navigate to admin edit page - we'll need to create this route
    navigate(`/edit/${doc._id}`)
  }

  async function handleDelete() {
    if (!docToDelete) return
    
    setDeleteLoading(true)
    try {
      await api.delete(`/docs/${docToDelete._id}`)
      toast.success('Document deleted successfully')
      await load()
    } catch {
      toast.error('Failed to delete document')
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
      setDocToDelete(null)
    }
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
            <button 
              onClick={() => { logout(); toast.success('Logged out successfully'); }} 
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-10 h-8" />
              
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Management</h2>
          <p className="text-gray-600">Manage all team documents with administrative privileges.</p>
        </div>

        {loading ? (
          <div className="card p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : docs.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">No documents have been created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {docs.map(d => (
              <div key={d._id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{d.title}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {d.tags?.length || 0} tags
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {d.summary || 'No summary available'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {d.createdBy?.name?.charAt(0) || '?'}
                        </div>
                        <span>by {d.createdBy?.name || 'Unknown'}</span>
                      </div>
                      <span>•</span>
                      <span>Created {formatDate(d.createdAt)}</span>
                      <span>•</span>
                      <span>Updated {formatDate(d.updatedAt)}</span>
                      {d.versions?.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{d.versions.length} versions</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex gap-2">
                    <button 
                      onClick={() => editDocument(d)} 
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-300 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(d)} 
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-300 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${docToDelete?.title}"? This action cannot be undone and will permanently remove the document and all its versions.`}
        loading={deleteLoading}
      />
    </div>
  )
}

