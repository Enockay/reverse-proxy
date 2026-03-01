import { FileText, Download, ExternalLink } from 'lucide-react'

function Documents() {
  const documents = [
    { name: 'Getting Started Guide', type: 'PDF', size: '2.5 MB' },
    { name: 'MikroTik Configuration Guide', type: 'PDF', size: '1.8 MB' },
    { name: 'API Documentation', type: 'PDF', size: '3.2 MB' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Documents</h1>
        <p className="text-xs text-gray-600 mt-1">Download guides and documentation</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {documents.map((doc, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 flex items-center">
                <Download className="w-3 h-3 mr-1" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Documents
