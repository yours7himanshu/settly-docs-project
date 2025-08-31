import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Search as SearchIcon, FileText, Brain, BookOpen } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import DocCard from '../components/DocCard.jsx'
import api from '../lib/http.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Search() {
  const [q, setQ] = useState('')
  const [textResults, setTextResults] = useState([])
  const [semanticResults, setSemanticResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('text')
  const { token } = useAuth()

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }, [token])

  async function run() {
    if (!q.trim()) {
      toast.error('Please enter a search query')
      return
    }
    
    setLoading(true)
    try {
      const [t, s] = await Promise.all([
        api.get(`/search/text?q=${encodeURIComponent(q)}`),
        api.get(`/search/semantic?q=${encodeURIComponent(q)}`)
      ])
      setTextResults(t.data)
      setSemanticResults(s.data)
      toast.success(`Found ${t.data.length} text results and ${s.data.length} semantic results`)
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentResults = activeTab === 'text' ? textResults : semanticResults

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Documents</h1>
          <p className="text-gray-600">Find documents using text search or AI-powered semantic search.</p>
        </div>
        
        <div className="card p-6 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); run(); }} className="flex gap-4">
            <div className="flex-1">
              <input 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg" 
                placeholder="Search for documents, topics, or concepts..." 
                value={q} 
                onChange={e => setQ(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              onClick={run} 
              disabled={loading}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {(textResults.length > 0 || semanticResults.length > 0) && (
          <div className="mb-6">
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'text'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                Text Results ({textResults.length})
              </button>
              <button
                onClick={() => setActiveTab('semantic')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'semantic'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Brain className="w-4 h-4" />
                Semantic Results ({semanticResults.length})
              </button>
            </div>
          </div>
        )}
        
        <div className="grid gap-6">
          {currentResults.length === 0 && (textResults.length > 0 || semanticResults.length > 0) ? (
            <div className="card p-12 text-center">
              <SearchIcon className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} results found</h3>
              <p className="text-gray-600">Try switching to the other search type or adjusting your query.</p>
            </div>
          ) : currentResults.length === 0 && !loading ? (
            <div className="card p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search</h3>
              <p className="text-gray-600">Enter a search query above to find relevant documents.</p>
            </div>
          ) : (
            currentResults.map(d => <DocCard key={d._id} doc={d} />)
          )}
        </div>
      </div>
    </div>
  )
}

