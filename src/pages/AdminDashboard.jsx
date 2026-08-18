import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import {
  Users,
  Router,
  Wallet,
  Receipt,
  Wifi,
  WifiOff,
  Clock,
  MinusCircle,
  LifeBuoy,
  ArrowRight
} from 'lucide-react'
import { formatCurrency } from '../components/admin/IncomeCharts'

const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b'
}

function StatTile({ icon: Icon, label, value, accent = 'text-blue-600 bg-blue-50' }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

function StatusTile({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}1a`, color }}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/admin/analytics')
      setAnalytics(response.data.analytics)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-red-600">
        {error || 'No analytics available'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>

      {/* Top-level stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatTile icon={Users} label="Total Users" value={analytics.users.total} accent="text-blue-600 bg-blue-50" />
        <StatTile icon={Router} label="Total Routers" value={analytics.routers.total} accent="text-cyan-600 bg-cyan-50" />
      </div>

      {/* Income summary - full breakdown & charts live on the dedicated Income tab */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Income</h2>
          <Link to="/admin/income" className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center">
            View income details
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatTile
            icon={Wallet}
            label="Payments Collected (all time)"
            value={formatCurrency(analytics.revenue.payments.allTime)}
            accent="text-blue-600 bg-blue-50"
          />
          <StatTile
            icon={Receipt}
            label="Subscription Revenue (all time)"
            value={formatCurrency(analytics.revenue.invoiced.allTime)}
            accent="text-orange-600 bg-orange-50"
          />
        </div>
      </div>

      {/* Router connection metrics */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Router Connection Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusTile icon={Wifi} label="Active / Online" value={analytics.routers.byStatus.active || 0} color={STATUS.good} />
          <StatusTile icon={Clock} label="Pending" value={analytics.routers.byStatus.pending || 0} color={STATUS.warning} />
          <StatusTile icon={WifiOff} label="Offline" value={analytics.routers.byStatus.offline || 0} color={STATUS.critical} />
          <StatusTile icon={MinusCircle} label="Inactive" value={analytics.routers.byStatus.inactive || 0} color="#898781" />
        </div>
      </div>

      {/* Users & support summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            Users
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div><span className="text-gray-400">Active:</span> {analytics.users.active}</div>
            <div><span className="text-gray-400">Inactive:</span> {analytics.users.inactive}</div>
            <div><span className="text-gray-400">In trial:</span> {analytics.users.inTrial}</div>
            <div><span className="text-gray-400">Admins:</span> {analytics.users.admins}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <LifeBuoy className="w-4 h-4 mr-2 text-gray-500" />
            Support Tickets
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div><span className="text-gray-400">Open:</span> {analytics.support.byStatus.open || 0}</div>
            <div><span className="text-gray-400">In progress:</span> {analytics.support.byStatus.in_progress || 0}</div>
            <div><span className="text-gray-400">Resolved:</span> {analytics.support.byStatus.resolved || 0}</div>
            <div><span className="text-gray-400">Closed:</span> {analytics.support.byStatus.closed || 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
