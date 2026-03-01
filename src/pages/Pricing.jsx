import { DollarSign, CheckCircle } from 'lucide-react'

function Pricing() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Pricing</h1>
        <p className="text-xs text-gray-600 mt-1">Our pricing plans for MikroTik routers</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Monthly Plan</h3>
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-2xl font-bold text-gray-900">$10</span>
              <span className="text-xs text-gray-600">/month per router</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Unlimited bandwidth
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                24/7 support
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Public access ports (Winbox, SSH, API)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Automatic WireGuard configuration
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Free Trial</h3>
            <p className="text-xs text-blue-800">
              New accounts get a <strong>1-week free trial</strong> for their first router. No credit card required!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
