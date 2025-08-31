import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Sparkles, Tag, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import api from '../lib/http.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Editor({ mode }) {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [tagsLoading, setTagsLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/docs/${id}`)
      setDoc(data)
      setTitle(data.title)
      setContent(data.content)
      setTags((data.tags || []).join(', '))
    } catch {
      toast.error('Failed to load document')
      navigate('/')
    }
  }, [id, navigate])

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if (mode === 'edit' && id) load()
  }, [token, id, mode, load])

  async function save() {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }
    
    setLoading(true)
    try {
      const payload = { title, content, tags: tags.split(',').map(t => t.trim()).filter(Boolean) }
      if (mode === 'create') {
        const { data } = await api.post('/docs', payload)
        toast.success('Document created successfully!')
        navigate(`/docs/${data._id}`)
      } else {
        await api.put(`/docs/${id}`, payload)
        toast.success('Document updated successfully!')
        await load()
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to save document'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function summarize() {
    setSummaryLoading(true)
    try {
      await api.post(`/docs/${id}/summarize`)
      await load()
      toast.success('Summary generated successfully!')
    } catch {
      toast.error('Failed to generate summary')
    } finally {
      setSummaryLoading(false)
    }
  }

  async function genTags() {
    setTagsLoading(true)
    try {
      await api.post(`/docs/${id}/tags`)
      await load()
      toast.success('Tags generated successfully!')
    } catch {
      toast.error('Failed to generate tags')
    } finally {
      setTagsLoading(false)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      await api.delete(`/docs/${id}`)
      toast.success('Document deleted successfully')
      navigate('/')
    } catch {
      toast.error('Failed to delete document')
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'create' ? 'Create New Document' : 'Edit Document'}
          </h1>
          <p className="text-gray-600">
            {mode === 'create' 
              ? 'Write your document and let AI help with summaries and tags.' 
              : 'Update your document and explore AI-powered features.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-medium" 
                    placeholder="Enter a descriptive title..." 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[400px] resize-y" 
                    placeholder="Write your document content here..." 
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    placeholder="e.g. documentation, tutorial, guide" 
                    value={tags} 
                    onChange={e => setTags(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={save} 
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : mode === 'create' ? 'Create Document' : 'Save Changes'}
                </button>
                
                {mode === 'edit' && (
                  <>
                    <button 
                      onClick={summarize} 
                      disabled={summaryLoading}
                      className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {summaryLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Summary
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={genTags} 
                      disabled={tagsLoading}
                      className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {tagsLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Tag className="w-4 h-4" />
                          Generate Tags
                        </>
                      )}
                    </button>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <button 
                        onClick={() => setShowDeleteModal(true)} 
                        className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Document
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {doc?.summary && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{doc.summary}</p>
              </div>
            )}
          </div>
        </div>
        
        {doc && doc.versions && doc.versions.length > 0 && (
          <div className="card p-6 mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">📚 Version History</h3>
            <div className="space-y-4">
              {doc.versions.slice().reverse().map((v, idx) => (
                <div key={idx} className="border-l-2 border-blue-200 pl-4">
                  <div className="font-medium text-gray-900">{v.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Updated on {new Intl.DateTimeFormat('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(v.updatedAt))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone and will permanently remove the document and all its versions.`}
        loading={deleteLoading}
      />
    </div>
  )
}

