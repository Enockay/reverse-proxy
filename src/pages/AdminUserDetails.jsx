import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import {
  ArrowLeft,
  User,
  Router,
  Receipt,
  Trash2,
  Loader,
  AlertCircle
} from 'lucide-react'

function AdminUserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState('')
  const [balanceReason, setBalanceReason] = useState('')

  const isSelf = currentUser?._id === id

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/admin/users/${id}`)
      setData(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (patch) => {
    setError('')
    setSaving(true)
    try {
      const response = await api.patch(`/api/admin/users/${id}`, patch)
      setData(prev => ({ ...prev, user: response.data.user }))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleBalanceSubmit = async (e) => {
    e.preventDefault()
    const amount = Number(balanceAmount)
    if (!amount) return
    await updateUser({ balanceAdjustment: amount, balanceAdjustmentReason: balanceReason || undefined })
    setBalanceAmount('')
    setBalanceReason('')
    fetchUser()
  }

  const handleDelete = async () => {
    if (!confirm(`Delete ${data.user.name}? This will also delete their routers. This cannot be undone.`)) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      navigate('/admin/users')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-red-600">
        {error}
      </div>
    )
  }

  const { user, routers, transactions } = data

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/admin/users')} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{user.name}</h1>
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${user.role === 'admin' ? 'text-purple-700 bg-purple-50' : 'text-gray-600 bg-gray-100'}`}>
          {user.role}
        </span>
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${user.isActive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
          {user.isActive ? 'Active' : 'Deactivated'}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Account info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            Account
          </h2>
          <div className="space-y-2 text-xs text-gray-600 mb-4">
            <div><span className="text-gray-400">Email:</span> {user.email}</div>
            <div><span className="text-gray-400">Balance:</span> ${user.balance?.toFixed(2)}</div>
            <div><span className="text-gray-400">Email verified:</span> {user.emailVerified ? 'Yes' : 'No'}</div>
            <div><span className="text-gray-400">Joined:</span> {new Date(user.createdAt).toLocaleString()}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={saving || (isSelf && user.role === 'admin')}
              onClick={() => updateUser({ role: user.role === 'admin' ? 'user' : 'admin' })}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title={isSelf ? "You can't change your own role" : ''}
            >
              {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
            </button>
            <button
              disabled={saving || (isSelf && user.isActive)}
              onClick={() => updateUser({ isActive: !user.isActive })}
              className={`px-3 py-1.5 text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                user.isActive ? 'text-red-700 bg-red-50 hover:bg-red-100' : 'text-green-700 bg-green-50 hover:bg-green-100'
              }`}
              title={isSelf ? "You can't deactivate your own account" : ''}
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              disabled={isSelf}
              onClick={handleDelete}
              className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ml-auto"
              title={isSelf ? "You can't delete your own account" : 'Delete user'}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </button>
          </div>
        </div>

        {/* Balance adjustment */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Adjust Balance</h2>
          <form onSubmit={handleBalanceSubmit} className="space-y-2">
            <input
              type="number"
              step="0.01"
              placeholder="Amount (use negative to deduct)"
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Reason (optional)"
              value={balanceReason}
              onChange={(e) => setBalanceReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={saving || !balanceAmount}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : 'Apply Adjustment'}
            </button>
          </form>
        </div>

        {/* Routers */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
            <Router className="w-4 h-4 mr-2 text-gray-500" />
            Routers ({routers.length})
          </h2>
          {routers.length === 0 ? (
            <p className="text-xs text-gray-400">No routers</p>
          ) : (
            <div className="space-y-2">
              {routers.map(r => (
                <Link
                  key={r.id}
                  to={`/admin/routers/${r.id}`}
                  className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50 text-xs"
                >
                  <span className="text-gray-900 font-medium">{r.name}</span>
                  <span className={`px-2 py-0.5 rounded ${r.status === 'active' ? 'text-green-700 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>
                    {r.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center mb-3">
            <Receipt className="w-4 h-4 mr-2 text-gray-500" />
            Recent Transactions
          </h2>
          {transactions.length === 0 ? (
            <p className="text-xs text-gray-400">No transactions</p>
          ) : (
            <div className="space-y-2">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded text-xs">
                  <div>
                    <div className="text-gray-900">{t.description}</div>
                    <div className="text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="text-gray-700 font-medium">${t.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUserDetails
