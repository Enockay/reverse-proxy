import { useState, useEffect } from 'react'
import api from '../services/api'
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react'

const STATUS_STYLES = {
  pending: 'text-amber-700 bg-amber-50',
  completed: 'text-blue-700 bg-blue-50',
  rewarded: 'text-green-700 bg-green-50'
}

function AdminReferrals() {
  const [referrals, setReferrals] = useState([])
  const [summary, setSummary] = useState({ pending: 0, completed: 0, rewarded: 0 })
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchReferrals(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const fetchReferrals = async (page = pagination.page) => {
    setLoading(true)
    try {
      const response = await api.get('/api/admin/referrals', {
        params: {
          page,
          limit: pagination.limit,
          ...(statusFilter && { status: statusFilter })
        }
      })
      setReferrals(response.data.referrals || [])
      setSummary(response.data.summary || summary)
      setPagination(response.data.pagination || pagination)
    } catch (error) {
      console.error('Failed to fetch referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Referrals</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rewarded">Rewarded</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{summary.pending}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{summary.completed}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Rewarded</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{summary.rewarded}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : referrals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
          <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No referrals found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {r.referrer ? <>{r.referrer.name}<div className="text-gray-400">{r.referrer.email}</div></> : <span className="italic text-gray-400">Deleted user</span>}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {r.referred ? <>{r.referred.name}<div className="text-gray-400">{r.referred.email}</div></> : <span className="italic text-gray-400">Deleted user</span>}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-mono text-gray-600">{r.referralCode}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_STYLES[r.status] || ''}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {r.rewardGiven ? `$${r.rewardAmount?.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">Showing {referrals.length} of {pagination.total} referrals</div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchReferrals(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
              <span className="text-xs text-gray-600">Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => fetchReferrals(pagination.page + 1)}
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

export default AdminReferrals
