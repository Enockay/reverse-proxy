import { useState, useEffect } from 'react'
import api from '../services/api'
import {
  Laptop,
  Smartphone,
  Monitor,
  HardDrive,
  Wifi,
  WifiOff,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload
} from 'lucide-react'

const DEVICE_ICONS = {
  laptop: Laptop,
  phone: Smartphone,
  desktop: Monitor,
  other: HardDrive
}

function formatBytes(value) {
  const bytes = Number(value)
  if (!value || !Number.isFinite(bytes)) return '0 B'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** exponent).toFixed(exponent === 0 ? 0 : 2)} ${units[exponent]}`
}

function timeAgo(date) {
  if (!date) return 'Never'
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 0) return 'Just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function AdminDevices() {
  const [devices, setDevices] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [onlineFilter, setOnlineFilter] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDevices(1)
    }, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, typeFilter, onlineFilter])

  const fetchDevices = async (page = pagination.page) => {
    setLoading(true)
    try {
      const response = await api.get('/api/admin/devices', {
        params: {
          page,
          limit: pagination.limit,
          ...(searchTerm && { search: searchTerm }),
          ...(typeFilter && { deviceType: typeFilter }),
          ...(onlineFilter && { online: onlineFilter })
        }
      })
      setDevices(response.data.devices || [])
      setPagination(response.data.pagination || pagination)
    } catch (error) {
      console.error('Failed to fetch devices:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-900">All Devices</h1>
        <div className="flex items-center space-x-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All types</option>
            <option value="laptop">Laptop</option>
            <option value="phone">Phone</option>
            <option value="desktop">Desktop</option>
            <option value="other">Other</option>
          </select>
          <select
            value={onlineFilter}
            onChange={(e) => setOnlineFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Any status</option>
            <option value="true">Connected</option>
            <option value="false">Not connected</option>
          </select>
          <input
            type="text"
            placeholder="Search by device or owner..."
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
      ) : devices.length === 0 ? (
        <div className="card text-center py-12 bg-white rounded-lg border border-gray-200">
          <Laptop className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No devices found</h3>
          <p className="text-xs text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tunnel Address</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Connected</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((d) => {
                  const Icon = DEVICE_ICONS[d.deviceType] || HardDrive
                  return (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center text-xs font-medium text-gray-900">
                          <Icon className="w-4 h-4 mr-2 text-gray-400" />
                          {d.name}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-600">
                        {d.owner ? (
                          <div>
                            <div className="text-gray-900">{d.owner.name}</div>
                            <div className="text-gray-400">{d.owner.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Owner account deleted</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap font-mono text-xs text-gray-600">{d.vpnIp?.split('/')[0]}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {d.online ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded text-green-700 bg-green-50">
                            <Wifi className="w-3 h-3 mr-1" />Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded text-gray-500 bg-gray-100">
                            <WifiOff className="w-3 h-3 mr-1" />Not connected
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-600">{timeAgo(d.lastHandshake)}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center" title="Received">
                            <Download className="w-3 h-3 mr-0.5 text-gray-400" />
                            {formatBytes(d.transferRx)}
                          </span>
                          <span className="inline-flex items-center" title="Sent">
                            <Upload className="w-3 h-3 mr-0.5 text-gray-400" />
                            {formatBytes(d.transferTx)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-600">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Showing {devices.length} of {pagination.total} devices
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchDevices(pagination.page - 1)}
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
                onClick={() => fetchDevices(pagination.page + 1)}
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

export default AdminDevices
