import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import {
  Router,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'

function AdminRouters() {
  const [routers, setRouters] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRouters(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchTerm, statusFilter])

  const fetchRouters = async (page = pagination.page) => {
    setLoading(true)
    try {
      const response = await api.get('/api/admin/routers', {
        params: {
          page,
          limit: pagination.limit,
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter && { status: statusFilter })
        }
      })
      setRouters(response.data.routers || [])
      setPagination(response.data.pagination || pagination)
    } catch (error) {
      console.error('Failed to fetch routers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'text-green-700 bg-green-50',
      pending: 'text-amber-700 bg-amber-50',
      offline: 'text-red-700 bg-red-50',
      inactive: 'text-gray-600 bg-gray-100'
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[status] || 'text-gray-600 bg-gray-100'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-900">All Routers</h1>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="offline">Offline</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="text"
            placeholder="Search by router or owner..."
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
      ) : routers.length === 0 ? (
        <div className="card text-center py-12 bg-white rounded-lg border border-gray-200">
          <Router className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No routers found</h3>
          <p className="text-xs text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winbox</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSH</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routers.map((router) => (
                  <tr key={router.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{router.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {router.owner ? (
                        <div>
                          <div className="text-gray-900">{router.owner.name}</div>
                          <div className="text-gray-400">{router.owner.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Owner account deleted</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{getStatusBadge(router.status)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{router.ports?.winbox}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{router.ports?.ssh}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{router.ports?.api}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {router.lastSeen ? new Date(router.lastSeen).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Link
                        to={`/admin/routers/${router.id}`}
                        className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors inline-flex items-center"
                        title="View Details"
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
            <div className="text-xs text-gray-600">
              Showing {routers.length} of {pagination.total} routers
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchRouters(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
              <span className="text-xs text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchRouters(pagination.page + 1)}
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

export default AdminRouters
