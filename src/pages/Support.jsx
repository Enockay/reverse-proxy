import { MessageSquare, Plus, Clock, CheckCircle } from 'lucide-react'
import { useState } from 'react'

function Support() {
  const [tickets] = useState([])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Support Tickets</h1>
          <p className="text-xs text-gray-600 mt-1">Manage your support requests</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No tickets yet</h3>
          <p className="text-xs text-gray-600 mb-4">Create a new support ticket to get help</p>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticket #</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-4 py-2 text-xs text-gray-900">{ticket.id}</td>
                    <td className="px-4 py-2 text-xs text-gray-900">{ticket.subject}</td>
                    <td className="px-4 py-2 text-xs">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">{ticket.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Support
