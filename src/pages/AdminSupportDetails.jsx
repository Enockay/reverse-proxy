import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ArrowLeft, Send, Loader, ShieldAlert } from 'lucide-react'

const STATUS_STYLES = {
  open: 'text-blue-700 bg-blue-50',
  in_progress: 'text-amber-700 bg-amber-50',
  resolved: 'text-green-700 bg-green-50',
  closed: 'text-gray-600 bg-gray-100'
}

function AdminSupportDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchTicket()
  }, [id])

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/admin/support-tickets/${id}`)
      setTicket(response.data.ticket)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    try {
      await api.post(`/api/admin/support-tickets/${id}/messages`, { message: reply })
      setReply('')
      fetchTicket()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const handleStatusChange = async (status) => {
    setUpdatingStatus(true)
    try {
      await api.patch(`/api/admin/support-tickets/${id}`, { status })
      fetchTicket()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !ticket) {
    return <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-red-600">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigate('/admin/support')} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{ticket.subject}</h1>
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_STYLES[ticket.status] || ''}`}>{ticket.status.replace('_', ' ')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Conversation</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {ticket.messages.map((msg) => (
              <div key={msg.id} className={`p-3 rounded-lg text-xs ${msg.isAdmin ? 'bg-cyan-50 border border-cyan-100' : 'bg-gray-50 border border-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 flex items-center">
                    {msg.isAdmin && <ShieldAlert className="w-3 h-3 mr-1 text-cyan-600" />}
                    {msg.userName || 'Deleted user'}
                  </span>
                  <span className="text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </div>

          {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{error}</div>}

          {ticket.status !== 'closed' && (
            <form onSubmit={handleReply} className="flex items-end gap-2 pt-2 border-t border-gray-100">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply..."
                rows={2}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              />
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Details</h2>
            <div className="space-y-1 text-xs text-gray-600">
              <div><span className="text-gray-400">User:</span> {ticket.user ? `${ticket.user.name} (${ticket.user.email})` : 'Deleted user'}</div>
              <div><span className="text-gray-400">Category:</span> {ticket.category}</div>
              <div><span className="text-gray-400">Priority:</span> {ticket.priority}</div>
              <div><span className="text-gray-400">Created:</span> {new Date(ticket.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {['open', 'in_progress', 'resolved', 'closed'].map((s) => (
                <button
                  key={s}
                  disabled={updatingStatus || ticket.status === s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                    ticket.status === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSupportDetails
