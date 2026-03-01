import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Trash2, 
  Globe, 
  Server, 
  Activity, 
  Settings, 
  Download,
  ExternalLink,
  Wifi,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader
} from 'lucide-react'

function RouterDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [router, setRouter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedItem, setCopiedItem] = useState(null)
  const [pinging, setPinging] = useState(false)
  const [pingResult, setPingResult] = useState(null)

  useEffect(() => {
    fetchRouterDetails()
  }, [id])

  const fetchRouterDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/routers/${id}`)
      if (response.data.success) {
        setRouter(response.data.router)
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load router details')
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this router? This action cannot be undone.')) return

    try {
      await api.delete(`/api/routers/${id}`)
      navigate('/routers')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete router')
    }
  }

  const handlePing = async () => {
    if (!router?.wireguardConfig?.clientName) return

    setPinging(true)
    setPingResult(null)

    try {
      // Ping the router's VPN IP instead of server IP
      const routerIp = router.wireguardConfig?.ip?.split('/')[0]
      const response = await api.post(`/api/clients/${router.wireguardConfig.clientName}/ping`, {
        target: routerIp,
        count: 3
      })
      setPingResult({
        success: response.data.success,
        message: response.data.message || `Router (${routerIp}) is reachable`,
        result: response.data.result
      })
    } catch (error) {
      const routerIp = router.wireguardConfig?.ip?.split('/')[0] || 'router'
      setPingResult({
        success: false,
        message: error.response?.data?.message || `Router (${routerIp}) is not reachable`,
        error: error.response?.data?.details
      })
    } finally {
      setPinging(false)
    }
  }

  const handleDownloadConfig = async () => {
    if (!router?.wireguardConfig?.clientName) return

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      window.open(`${apiUrl}/api/clients/${router.wireguardConfig.clientName}/autoconfig`, '_blank')
    } catch (error) {
      setError('Failed to download configuration')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'green', icon: CheckCircle, text: 'Active' },
      pending: { color: 'yellow', icon: Clock, text: 'Pending' },
      inactive: { color: 'gray', icon: AlertCircle, text: 'Inactive' },
      offline: { color: 'red', icon: AlertCircle, text: 'Offline' }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        config.color === 'green' ? 'bg-green-100 text-green-800' :
        config.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
        config.color === 'red' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error && !router) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/routers')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Routers
        </button>
      </div>
    )
  }

  if (!router) return null

  const winboxUrl = router.ports?.winbox 
    ? `winbox://${router.address || 'app.blackie-networks.com'}:${router.ports.winbox}`
    : null

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/routers')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{router.name}</h1>
            <p className="text-sm text-gray-600 mt-0.5">Router Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(router.status)}
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Router
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Ping Result */}
      {pingResult && (
        <div className={`border rounded-lg p-4 ${
          pingResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`flex items-center text-sm ${
            pingResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {pingResult.success ? (
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            )}
            <span>{pingResult.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Connection Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Connection Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">Status</span>
                <div>{getStatusBadge(router.status)}</div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">Created At</span>
                <span className="text-sm font-medium text-gray-900">
                  {router.createdAt 
                    ? new Date(router.createdAt).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })
                    : 'N/A'}
                </span>
              </div>
              {router.firstConnectedAt && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">First Connected</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(router.firstConnectedAt).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {router.lastSeen && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Last Seen</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(router.lastSeen).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Public Access Ports Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Server className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Public Access Ports</h2>
            </div>
            <div className="space-y-3">
              {router.ports?.winbox && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Winbox</div>
                    <div className="text-sm font-mono text-gray-900">
                      {router.address || 'app.blackie-networks.com'}:{router.ports.winbox}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(`${router.address || 'app.blackie-networks.com'}:${router.ports.winbox}`, 'winbox')}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Copy Winbox address"
                    >
                      {copiedItem === 'winbox' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {winboxUrl && (
                      <a
                        href={winboxUrl}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Open in Winbox"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
              {router.ports?.ssh && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">SSH</div>
                    <div className="text-sm font-mono text-gray-900">
                      {router.address || 'app.blackie-networks.com'}:{router.ports.ssh}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${router.address || 'app.blackie-networks.com'}:${router.ports.ssh}`, 'ssh')}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Copy SSH address"
                  >
                    {copiedItem === 'ssh' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
              {router.ports?.api && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">API</div>
                    <div className="text-sm font-mono text-gray-900">
                      {router.address || 'app.blackie-networks.com'}:{router.ports.api}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${router.address || 'vpn.blackie-networks.com'}:${router.ports.api}`, 'api')}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Copy API address"
                  >
                    {copiedItem === 'api' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Router Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Router Actions</h2>
            </div>
            <div className="space-y-2">
              <button
                onClick={handlePing}
                disabled={pinging}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pinging ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Pinging...
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Ping Router
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadConfig}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Config
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Auto-Configure Command Card */}
          {router.wireguardConfig?.clientName && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <Settings className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Auto-Configure Command</h2>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Run this command in your MikroTik router terminal to automatically download and configure WireGuard:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 relative group">
                <code className="text-xs text-green-400 font-mono break-all block pr-12">
                  {(() => {
                    const apiUrl = import.meta.env.VITE_API_URL || 'https://vpn.blackie-networks.com'
                    const clientName = router.wireguardConfig.clientName
                    return `/tool/fetch url="${apiUrl}/api/clients/${clientName}/autoconfig" dst-path=autoconfig.rsc; /import file-name=autoconfig.rsc`
                  })()}
                </code>
                <button
                  onClick={() => {
                    const apiUrl = import.meta.env.VITE_API_URL || 'https://vpn.blackie-networks.com'
                    const clientName = router.wireguardConfig.clientName
                    const command = `/tool/fetch url="${apiUrl}/api/clients/${clientName}/autoconfig" dst-path=autoconfig.rsc; /import file-name=autoconfig.rsc`
                    copyToClipboard(command, 'autoconfig-command')
                  }}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-green-400 transition-colors bg-gray-800 rounded"
                  title="Copy command"
                >
                  {copiedItem === 'autoconfig-command' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Instructions:</strong> Copy the command above, paste it into your MikroTik router terminal (Terminal, SSH, or Winbox), and press Enter. The router will automatically download and apply the WireGuard configuration.
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {winboxUrl && (
                <a
                  href={winboxUrl}
                  className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Open in Winbox
                </a>
              )}
              <button
                onClick={() => navigate(`/routers/${id}`)}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Router
              </button>
              <button
                onClick={() => navigate('/routers')}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Routers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouterDetails
