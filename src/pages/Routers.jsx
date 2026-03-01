import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { 
  Plus, 
  Router, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Copy,
  ExternalLink,
  Settings,
  Edit,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react'

function Routers() {
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [copiedItem, setCopiedItem] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRouters()
  }, [])


  const fetchRouters = async () => {
    try {
      const response = await api.get('/api/routers')
      setRouters(response.data.routers || [])
    } catch (error) {
      console.error('Failed to fetch routers:', error)
    } finally {
      setLoading(false)
    }
  }


  const copyToClipboard = async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemId)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDelete = async (routerId) => {
    if (!confirm('Are you sure you want to delete this router?')) return

    try {
      await api.delete(`/api/routers/${routerId}`)
      fetchRouters()
    } catch (error) {
      console.error('Failed to delete router:', error)
      alert('Failed to delete router')
    }
  }

  const handleDownloadBackup = async (router) => {
    try {
      // Fetch router details to get client name
      const response = await api.get(`/api/routers/${router.id}`)
      const clientName = response.data.router?.wireguardConfig?.clientName
      
      if (clientName) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        window.open(`${apiUrl}/api/clients/${clientName}/autoconfig`, '_blank')
      } else {
        alert('Router configuration not available')
      }
    } catch (error) {
      console.error('Failed to download backup:', error)
      alert('Failed to download router configuration')
    }
  }

  // Filter and paginate routers
  const filteredRouters = routers.filter(router => 
    router.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredRouters.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const paginatedRouters = filteredRouters.slice(startIndex, endIndex)

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="text-xs font-medium text-green-600">Active</span>
    }
    return <span className="text-xs font-medium text-gray-500">{status}</span>
  }

  const getOnlineBadge = (isOnline) => {
    if (isOnline) {
      return <span className="text-xs font-medium text-blue-600">Online</span>
    }
    return <span className="text-xs font-medium text-red-600">Offline</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Router List</h1>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            onClick={() => navigate('/routers/add')}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Router
          </button>
        </div>
      </div>

      {/* Table */}
      {routers.length === 0 ? (
        <div className="card text-center py-12">
          <Router className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No routers yet</h3>
          <p className="text-xs text-gray-600 mb-4">Create your first MikroTik router to get started</p>
          <button
            onClick={() => navigate('/routers/add')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Router
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Entries selector */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-gray-600">entries</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win Port
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Port
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Web Port
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Online
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRouters.map((router, index) => (
                  <tr key={router.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                      {router.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">{router.address || 'vpn.blackie-networks.com'}</span>
                        <button
                          onClick={() => copyToClipboard(router.address || 'vpn.blackie-networks.com', `address-${router.id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy address"
                        >
                          {copiedItem === `address-${router.id}` ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">{router.ports?.winbox}</span>
                        <button
                          onClick={() => copyToClipboard(String(router.ports?.winbox || ''), `winbox-${router.id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy Winbox port"
                        >
                          {copiedItem === `winbox-${router.id}` ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">{router.ports?.api}</span>
                        <button
                          onClick={() => copyToClipboard(String(router.ports?.api || ''), `api-${router.id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy API port"
                        >
                          {copiedItem === `api-${router.id}` ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">{router.ports?.ssh}</span>
                        <button
                          onClick={() => copyToClipboard(String(router.ports?.ssh || ''), `ssh-${router.id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy Web port"
                        >
                          {copiedItem === `ssh-${router.id}` ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {router.expirationDate 
                        ? new Date(router.expirationDate).toLocaleString('en-GB', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getStatusBadge(router.subscriptionStatus || router.status)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {getOnlineBadge(router.isOnline || router.status === 'active')}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {router.routerboardInfo?.uptime ? (
                        <span className="font-medium">{router.routerboardInfo.uptime}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Link
                          to={`/routers/${router.id}`}
                          className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => navigate(`/routers/${router.id}`)}
                          className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded hover:bg-orange-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(router.id)}
                          className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDownloadBackup(router)}
                          className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                          title="Download Backup"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredRouters.length)} of {filteredRouters.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-xs font-medium rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
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

export default Routers
