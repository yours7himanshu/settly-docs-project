import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Bot, Lightbulb, Clock, Book, HelpCircle } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import api from '../lib/http.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function QA() {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }, [token])

  async function ask() {
    if (!q.trim()) {
      toast.error('Please enter a question')
      return
    }
    
    setLoading(true)
    try {
      const { data } = await api.post('/qa', { q })
      setAnswer(data.answer)
      setSources(data.contextDocs || [])
      setHistory(prev => [{ question: q, answer: data.answer, sources: data.contextDocs || [] }, ...prev.slice(0, 4)])
      toast.success('Answer generated successfully!')
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to generate answer'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Q&A</h1>
          <p className="text-gray-600">Ask questions about your team's documents and get AI-powered answers with sources.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <form onSubmit={(e) => { e.preventDefault(); ask(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Question</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px] resize-y" 
                    placeholder="Ask anything about your team's documents... e.g., 'How do we handle user authentication?' or 'What are our deployment procedures?'" 
                    value={q} 
                    onChange={e => setQ(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  onClick={ask} 
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      Ask AI
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {answer && (
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold text-gray-900">Answer</h3>
                </div>
                <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {answer}
                </div>
                
                {sources.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Book className="w-4 h-4 text-blue-600" />
                      Sources
                    </h4>
                    <div className="space-y-2">
                      {sources.map(s => (
                        <div key={s.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="font-medium text-blue-900">{s.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Recent Questions
              </h3>
              
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No questions asked yet. Start by asking something about your team's documents!</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                        {item.question}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-3">
                        {item.answer.substring(0, 100)}...
                      </div>
                      <button 
                        onClick={() => {
                          setQ(item.question)
                          setAnswer(item.answer)
                          setSources(item.sources)
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2 transition-colors"
                      >
                        View full answer →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="card p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Tips
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Ask specific questions for better answers</li>
                <li>• Reference document types or topics</li>
                <li>• Use natural language - no need for keywords</li>
                <li>• Questions are answered using your team's documents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

