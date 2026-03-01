import { useState, useEffect } from 'react'
import api from '../services/api'
import { Router, Wifi, Calendar, AlertTriangle, TrendingUp, Bell, X } from 'lucide-react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [stats, setStats] = useState({
    totalRouters: 0,
    onlineRouters: 0,
    expiringIn7Days: 0,
    expired: 0,
    offlineRouters: []
  })
  const [loading, setLoading] = useState(true)
  const [alertDismissed, setAlertDismissed] = useState(false)
  const [alertPeriod, setAlertPeriod] = useState('Day')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [routersRes] = await Promise.all([
        api.get('/api/routers')
      ])

      const routers = routersRes.data.routers || []
      const now = new Date()
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      // Calculate statistics
      const totalRouters = routers.length
      const onlineRouters = routers.filter(r => r.isOnline || r.status === 'active').length
      const expiringIn7Days = routers.filter(r => {
        if (!r.expirationDate) return false
        const expDate = new Date(r.expirationDate)
        return expDate > now && expDate <= sevenDaysFromNow
      }).length
      const expired = routers.filter(r => {
        if (!r.expirationDate) return false
        return new Date(r.expirationDate) <= now
      }).length
      const offlineRouters = routers.filter(r => !r.isOnline && r.status !== 'active')

      setStats({
        totalRouters,
        onlineRouters,
        expiringIn7Days,
        expired,
        offlineRouters
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 min-h-full">
      {/* Alert Banner */}
      {!alertDismissed && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center flex-1">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Verify Your WhatsApp Number!</p>
              <p className="text-xs text-blue-700 mt-1">
                You haven't verified your WhatsApp number yet. Please verify it to receive important alerts and stay secure.
              </p>
            </div>
            <button className="ml-4 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center">
              <span className="mr-1">✓</span>
              Verify Now
            </button>
            <button
              onClick={() => setAlertDismissed(true)}
              className="ml-3 text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Routers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRouters}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Router className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Online Routers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onlineRouters}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Wifi className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Expiring In 7 Days</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringIn7Days}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Historical Bandwidth Report */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Historical Bandwidth Report</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Bandwidth data will appear here</p>
            </div>
          </div>
        </div>

        {/* Router Offline Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Router Offline Alert</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-1 mb-4 border-b border-gray-200">
            {['Day', 'Week', 'Month'].map((period) => (
              <button
                key={period}
                onClick={() => setAlertPeriod(period)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  alertPeriod === period
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Offline Routers List */}
          <div className="space-y-3">
            {stats.offlineRouters.length === 0 ? (
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No offline routers</p>
                  <p className="text-xs text-gray-400 mt-1">All routers are online</p>
                </div>
              </div>
            ) : (
              stats.offlineRouters.slice(0, 5).map((router) => (
                <div
                  key={router.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{router.name}</p>
                      <p className="text-xs text-gray-500">
                        Last seen: {router.lastSeen ? new Date(router.lastSeen).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/routers/${router.id}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    View →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
