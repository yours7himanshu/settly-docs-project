import { Link } from 'react-router-dom'

export default function DocCard({ doc }) {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <Link 
          to={`/docs/${doc._id}`} 
          className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1"
        >
          {doc.title}
        </Link>
        <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
          {formatDate(doc.updatedAt)}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
        {doc.summary || 'No summary available yet. Click to read the full document.'}
      </div>
      
      {doc.tags && doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {doc.tags.slice(0, 4).map(tag => (
            <span 
              key={tag} 
              className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200"
            >
              {tag}
            </span>
          ))}
          {doc.tags.length > 4 && (
            <span className="text-xs px-3 py-1 bg-gray-50 text-gray-600 rounded-full border">
              +{doc.tags.length - 4} more
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {doc.createdBy?.name?.charAt(0) || '?'}
          </div>
          <span className="text-sm text-gray-600">
            {doc.createdBy?.name || 'Unknown Author'}
          </span>
        </div>
        <Link 
          to={`/docs/${doc._id}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          View →
        </Link>
      </div>
    </div>
  )
}

