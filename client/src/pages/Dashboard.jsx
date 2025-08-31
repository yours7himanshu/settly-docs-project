import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar.jsx'
import DocCard from '../components/DocCard.jsx'
import api from '../lib/http.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const [docs, setDocs] = useState([])
  const [activity, setActivity] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const { token, user } = useAuth()

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    load()
  }, [token, selectedTag])

  async function load() {
    try {
      const qs = new URLSearchParams()
      if (selectedTag) qs.set('tag', selectedTag)
      const [d1, d2] = await Promise.all([
        api.get(`/docs?${qs.toString()}`),
        api.get('/activity')
      ])
      setDocs(d1.data)
      setActivity(d2.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back, <span className="font-medium text-gray-900">{user?.name}</span>! Manage your documents and stay updated.</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{docs.length}</div>
                  <div className="text-gray-600">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{Array.from(new Set(docs.flatMap(d => d.tags || []))).length}</div>
                  <div className="text-gray-600">Tags</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Documents Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">My Documents</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage and organize your personal documents</p>
                  </div>
                </div>
              </div>
              
              {/* Tag Filter */}
              {Array.from(new Set(docs.flatMap(d => d.tags || []))).length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Filter by tags:</h3>
                    {selectedTag && (
                      <span className="text-xs text-gray-500">
                        Showing documents with "{selectedTag}" tag
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(docs.flatMap(d => d.tags || []))).map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)} 
                        className={`text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          selectedTag === tag 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {selectedTag && (
                      <button 
                        onClick={() => setSelectedTag('')} 
                        className="text-sm px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-medium transition-all duration-200"
                      >
                        ✕ Clear filter
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Grid */}
              <div className="p-6">
                {docs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {selectedTag ? 'No documents match your current filter. Try removing the filter or create a new document.' : 'You haven\'t created any documents yet. Start by creating your first document to begin organizing your knowledge.'}
                    </p>
                    <button 
                      onClick={() => window.location.href = '/docs/new'} 
                      className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Create your first document
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {docs.map(d => <DocCard key={d._id} doc={d} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Team Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Team Activity</h3>
                <p className="text-sm text-gray-600 mt-1">Recent document changes</p>
              </div>
              
              <div className="p-6">
                {activity.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((a) => (
                      <div key={a._id} className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{a.user?.name}</span>
                          <span className="text-gray-600"> {a.action}d </span>
                          <span className="font-medium text-gray-900">{a.document?.title}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(new Date(a.createdAt))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

