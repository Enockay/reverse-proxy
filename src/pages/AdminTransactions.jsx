import { useState, useEffect } from 'react'
import api from '../services/api'
import { Receipt, ChevronLeft, ChevronRight, Wallet, FileText } from 'lucide-react'

const STATUS_STYLES = {
  pending: 'text-amber-700 bg-amber-50',
  completed: 'text-green-700 bg-green-50',
  failed: 'text-red-700 bg-red-50',
  refunded: 'text-gray-600 bg-gray-100'
}

const TYPE_STYLES = {
  payment: 'text-blue-700 bg-blue-50',
  invoice: 'text-purple-700 bg-purple-50',
  refund: 'text-orange-700 bg-orange-50'
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ totalCompletedPayments: 0, totalCompletedInvoiced: 0 })
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => fetchTransactions(1), 300)
    return () => clearTimeout(timeout)
  }, [typeFilter, statusFilter, searchTerm])

  const fetchTransactions = async (page = pagination.page) => {
    setLoading(true)
    try {
      const response = await api.get('/api/admin/transactions', {
        params: {
          page,
          limit: pagination.limit,
          ...(typeFilter && { type: typeFilter }),
          ...(statusFilter && { status: statusFilter }),
          ...(searchTerm && { search: searchTerm })
        }
      })
      setTransactions(response.data.transactions || [])
      setSummary(response.data.summary || summary)
      setPagination(response.data.pagination || pagination)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Transactions</h1>
        <div className="flex items-center space-x-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All types</option>
            <option value="payment">Payment</option>
            <option value="invoice">Invoice</option>
            <option value="refund">Refund</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <input
            type="text"
            placeholder="Search by user, description, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 inline-flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-600 bg-blue-50">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Payments Collected (all time)</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalCompletedPayments)}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 inline-flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-orange-600 bg-orange-50">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Subscription Revenue Billed (all time)</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalCompletedInvoiced)}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No transactions found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {t.user ? <>{t.user.name}<div className="text-gray-400">{t.user.email}</div></> : <span className="italic text-gray-400">Deleted user</span>}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-900 max-w-xs truncate">{t.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${TYPE_STYLES[t.type] || ''}`}>{t.type}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_STYLES[t.status] || ''}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{t.paymentMethod}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 font-medium text-right">{formatCurrency(t.amount)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">Showing {transactions.length} of {pagination.total} transactions</div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchTransactions(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </button>
              <span className="text-xs text-gray-600">Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => fetchTransactions(pagination.page + 1)}
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

export default AdminTransactions
