import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import {
  ArrowLeft,
  User,
  Wifi,
  Activity,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  RefreshCw,
  Loader
} from 'lucide-react'

function AdminRouterDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [router, setRouter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pinging, setPinging] = useState(false)
  const [pingResult, setPingResult] = useState(null)
  const [reconnecting, setReconnecting] = useState(false)
  const [reconnectMessage, setReconnectMessage] = useState('')

  useEffect(() => {
    fetchRouterDetails()
  }, [id])

  const fetchRouterDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/admin/routers/${id}`)
      if (response.data.success) {
        setRouter(response.data.router)
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load router details')
    } finally {
      setLoading(false)
    }
  }

  const handlePing = async () => {
    if (!router?.wireguardConfig?.clientName) return
    setPinging(true)
    setPingResult(null)
    try {
      const routerIp = router.vpnIp?.split('/')[0]
      const response = await api.post(`/api/clients/${router.wireguardConfig.clientName}/ping`, {
        target: routerIp,
        count: 3
      })
      setPingResult({ success: response.data.success, message: response.data.message || `${routerIp} is reachable` })
    } catch (err) {
      setPingResult({ success: false, message: err.response?.data?.message || 'Ping failed' })
    } finally {
      setPinging(false)
    }
  }

  const handleReconnect = async () => {
    setReconnecting(true)
    setReconnectMessage('')
    try {
      await api.post(`/api/admin/routers/${id}/reconnect`)
      setReconnectMessage('Proxy restarted successfully')
    } catch (err) {
      setReconnectMessage(err.response?.data?.error || 'Failed to restart proxy')
    } finally {
      setReconnecting(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-green-700 bg-green-50', icon: CheckCircle, text: 'Active' },
      pending: { color: 'text-amber-700 bg-amber-50', icon: Clock, text: 'Pending' },
      inactive: { color: 'text-gray-600 bg-gray-100', icon: AlertCircle, text: 'Inactive' },
      offline: { color: 'text-red-700 bg-red-50', icon: AlertCircle, text: 'Offline' }
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !router) {
    return (
      <div className="card text-center py-12 bg-white rounded-lg border border-gray-200">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">{error || 'Router not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/admin/routers')}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{router.name}</h1>
        {getStatusBadge(router.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Owner card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            Owner
          </h2>
          {router.owner ? (
            <div className="space-y-1 text-xs text-gray-600">
              <div><span className="text-gray-400">Name:</span> {router.owner.name}</div>
              <div><span className="text-gray-400">Email:</span> {router.owner.email}</div>
              <div><span className="text-gray-400">User ID:</span> {router.owner.id}</div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Owner account no longer exists</p>
          )}
        </div>

        {/* Connection card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
            <Wifi className="w-4 h-4 mr-2 text-gray-500" />
            Connection
          </h2>
          <div className="space-y-1 text-xs text-gray-600 mb-3">
            <div><span className="text-gray-400">VPN IP:</span> {router.vpnIp || 'N/A'}</div>
            <div><span className="text-gray-400">Winbox port:</span> {router.ports?.winbox}</div>
            <div><span className="text-gray-400">SSH port:</span> {router.ports?.ssh}</div>
            <div><span className="text-gray-400">API port:</span> {router.ports?.api}</div>
            <div><span className="text-gray-400">Last seen:</span> {router.lastSeen ? new Date(router.lastSeen).toLocaleString() : 'Never'}</div>
            <div><span className="text-gray-400">First connected:</span> {router.firstConnectedAt ? new Date(router.firstConnectedAt).toLocaleString() : 'Never'}</div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handlePing}
              disabled={pinging || !router.wireguardConfig?.clientName}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {pinging ? <Loader className="w-3 h-3 mr-1 animate-spin" /> : <Zap className="w-3 h-3 mr-1" />}
              Ping
            </button>
            <button
              onClick={handleReconnect}
              disabled={reconnecting}
              className="px-3 py-1.5 text-xs font-medium text-cyan-700 bg-cyan-50 rounded hover:bg-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {reconnecting ? <Loader className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
              Reconnect Proxy
            </button>
          </div>

          {pingResult && (
            <p className={`mt-2 text-xs ${pingResult.success ? 'text-green-700' : 'text-red-700'}`}>{pingResult.message}</p>
          )}
          {reconnectMessage && (
            <p className="mt-2 text-xs text-gray-600">{reconnectMessage}</p>
          )}
        </div>

        {/* Routerboard info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
            <Activity className="w-4 h-4 mr-2 text-gray-500" />
            Routerboard
          </h2>
          {router.routerboardInfo ? (
            <div className="space-y-1 text-xs text-gray-600">
              <div><span className="text-gray-400">Model:</span> {router.routerboardInfo.model || 'N/A'}</div>
              <div><span className="text-gray-400">Uptime:</span> {router.routerboardInfo.uptime || 'N/A'}</div>
              <div><span className="text-gray-400">CPU load:</span> {router.routerboardInfo.cpuLoad ?? 'N/A'}</div>
              <div><span className="text-gray-400">Firmware:</span> {router.routerboardInfo.firmware || 'N/A'}</div>
              <div><span className="text-gray-400">Serial:</span> {router.routerboardInfo.serialNumber || 'N/A'}</div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No routerboard data yet - router hasn&apos;t checked in</p>
          )}
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
            <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
            Subscription
          </h2>
          {router.subscription ? (
            <div className="space-y-1 text-xs text-gray-600">
              <div><span className="text-gray-400">Status:</span> {router.subscription.status}</div>
              <div><span className="text-gray-400">Plan:</span> {router.subscription.planType}</div>
              <div><span className="text-gray-400">Price/month:</span> ${router.subscription.pricePerMonth}</div>
              <div><span className="text-gray-400">Renews:</span> {router.subscription.currentPeriodEnd ? new Date(router.subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No subscription record</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminRouterDetails
