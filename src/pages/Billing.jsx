import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { Wallet, Plus, Eye, Calendar, FileText, Filter, ChevronDown } from 'lucide-react'

function Billing() {
  const [billing, setBilling] = useState({
    userBalance: 0,
    lastMonthPayments: 0,
    lastMonthInvoices: 0,
    currency: 'USD'
  })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [transactionType, setTransactionType] = useState('all')
  const [monthsFilter, setMonthsFilter] = useState('3')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    fetchBillingData()
  }, [transactionType, monthsFilter, pagination.page])

  const fetchBillingData = async () => {
    try {
      const [summaryRes, transactionsRes] = await Promise.all([
        api.get('/api/billing/summary'),
        api.get('/api/billing/transactions', {
          params: {
            page: pagination.page,
            limit: pagination.limit,
            type: transactionType !== 'all' ? transactionType : undefined,
            months: monthsFilter
          }
        })
      ])

      setBilling(summaryRes.data.billing || {})
      setTransactions(transactionsRes.data.transactions || [])
      setPagination(prev => ({
        ...prev,
        total: transactionsRes.data.pagination?.total || 0,
        pages: transactionsRes.data.pagination?.pages || 0
      }))
    } catch (error) {
      console.error('Failed to fetch billing:', error)
    } finally {
      setLoading(false)
    }
  }


  const formatCurrency = (amount) => {
    return `${billing.currency || 'USD'} ${parseFloat(amount || 0).toFixed(2)}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Billing & Payment History</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">User Balance</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(billing.userBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Add Balance</p>
              <Link
                to="/billing/add-balance"
                className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Balance
              </Link>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Last Month Payments</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(billing.lastMonthPayments)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Last Month Invoices</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(billing.lastMonthInvoices)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>


      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-sm font-semibold text-gray-900">Billing & Payment History</h2>
          <div className="flex items-center space-x-2">
            <select
              value={transactionType}
              onChange={(e) => {
                setTransactionType(e.target.value)
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Transaction Types</option>
              <option value="payment">Payments</option>
              <option value="invoice">Invoices</option>
            </select>
            <select
              value={monthsFilter}
              onChange={(e) => {
                setMonthsFilter(e.target.value)
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">View</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-xs text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900 capitalize">
                        {tx.type} #{tx.transactionId ? (tx.transactionId.split('-')[1] || tx.transactionId.slice(-6)) : tx.id?.slice(-6) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {tx.date ? formatDate(tx.date) : 'N/A'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                      {formatCurrency(tx.amount || 0)}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">
                      {tx.description || 'N/A'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Billing
