import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, Sparkles, Tag, Trash2, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import api from '../lib/http.js'

export default function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [doc, setDoc] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [generatingTags, setGeneratingTags] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }
    
    try {
      const res = await api.get(`/docs/${id}`)
      const docData = res.data
      setDoc(docData)
      setTitle(docData.title)
      setContent(docData.content)
      setTags(docData.tags?.join(', ') || '')
    } catch (err) {
      toast.error('Failed to load document')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    load()
  }, [token, load])

  async function save() {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      }

      console.log('Saving document:', { id, payload })

      if (id) {
        const response = await api.put(`/docs/${id}`, payload)
        console.log('Update response:', response.data)
        toast.success('Document updated successfully')
        // Navigate back to dashboard after successful update
        setTimeout(() => navigate('/'), 1000)
      } else {
        const res = await api.post('/docs', payload)
        navigate(`/edit/${res.data._id}`)
        toast.success('Document created successfully')
      }
    } catch (err) {
      console.error('Save error:', err)
      console.error('Error response:', err.response?.data)
      toast.error(`Failed to save document: ${err.response?.data?.error || err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function summarize() {
    if (!content.trim()) {
      toast.error('Add some content first')
      return
    }

    setSummarizing(true)
    try {
      const res = await api.post(`/docs/${id}/summarize`)
      setDoc(prev => ({ ...prev, summary: res.data.summary }))
      toast.success('Summary generated successfully')
    } catch (err) {
      toast.error('Failed to generate summary')
    } finally {
      setSummarizing(false)
    }
  }

  async function generateTags() {
    if (!content.trim()) {
      toast.error('Add some content first')
      return
    }

    setGeneratingTags(true)
    try {
      const res = await api.post(`/docs/${id}/tags`)
      setTags(res.data.tags.join(', '))
      toast.success('Tags generated successfully')
    } catch (err) {
      toast.error('Failed to generate tags')
    } finally {
      setGeneratingTags(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    
    try {
      await api.delete(`/docs/${id}`)
      toast.success('Document deleted successfully')
      navigate('/')
    } catch (err) {
      toast.error('Failed to delete document')
    }
    setShowDeleteModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                {id ? 'Edit Document' : 'New Document'} (Admin)
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter document title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your document content here..."
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Actions */}
            {id && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">AI Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={summarize}
                    disabled={summarizing || !content.trim()}
                    className="w-full flex items-center gap-2 px-4 py-2   bg-blue-600 text-white rounded-lg hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    {summarizing ? 'Generating...' : 'Generate Summary'}
                  </button>
                  
                  <button
                    onClick={generateTags}
                    disabled={generatingTags || !content.trim()}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Tag className="w-4 h-4" />
                    {generatingTags ? 'Generating...' : 'Generate Tags'}
                  </button>
                </div>
              </div>
            )}

            {/* Document Info */}
            {doc && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Document Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Author:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {doc.createdBy?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-gray-900">{doc.createdBy?.name || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="text-gray-900 mt-1">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <p className="text-gray-900 mt-1">{new Date(doc.updatedAt).toLocaleDateString()}</p>
                  </div>
                  
                  {doc.versions?.length > 0 && (
                    <div>
                      <span className="text-gray-600">Versions:</span>
                      <p className="text-gray-900 mt-1">{doc.versions.length}</p>
                    </div>
                  )}
                  
                  {doc.summary && (
                    <div>
                      <span className="text-gray-600">AI Summary:</span>
                      <p className="text-gray-700 mt-1 text-sm leading-relaxed">{doc.summary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {id && (
              <div className="card p-6 border-red-200">
                <h3 className="font-semibold text-red-900 mb-4">Danger Zone</h3>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${doc?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
