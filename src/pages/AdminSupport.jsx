import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { LifeBuoy, ChevronLeft, ChevronRight, Eye } from 'lucide-react'

const STATUS_STYLES = {
  open: 'text-blue-700 bg-blue-50',
  in_progress: 'text-amber-700 bg-amber-50',
  resolved: 'text-green-700 bg-green-50',
  closed: 'text-gray-600 bg-gray-100'
}

const PRIORITY_STYLES = {
  low: 'text-gray-600 bg-gray-100',
  medium: 'text-blue-700 bg-blue-50',
  high: 'text-amber-700 bg-amber-50',
  urgent: 'text-red-700 bg-red-50'
}

function AdminSupport() {
  const [tickets, setTickets] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => fetchTickets(1), 300)
    return () => clearTimeout(timeout)
  }, [statusFilter, searchTerm])

  const fetchTickets = async (page = pagination.page) => {
    setLoading(true)
    try {
      const response = await api.get('/api/admin/support-tickets', {
        params: {
          page,
          limit: pagination.limit,
          ...(statusFilter && { status: statusFilter }),
          ...(searchTerm && { search: searchTerm })
        }
      })
      setTickets(response.data.tickets || [])
      setPagination(response.data.pagination || pagination)
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Support Tickets</h1>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <input
            type="text"
            placeholder="Search by subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
          <LifeBuoy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No tickets found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{t.subject}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {t.user ? <>{t.user.name}<div className="text-gray-400">{t.user.email}</div></> : <span className="italic text-gray-400">Deleted user</span>}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{t.category}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${PRIORITY_STYLES[t.priority] || ''}`}>{t.priority}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_STYLES[t.status] || ''}`}>{t.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{new Date(t.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Link
                        to={`/admin/support/${t.id}`}
                        className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors inline-flex items-center"
                        title="View"
                      >
                        <Eye className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">Showing {tickets.length} of {pagination.total} tickets</div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchTickets(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
              <span className="text-xs text-gray-600">Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => fetchTickets(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSupport
