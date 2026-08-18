import { useState, useEffect } from 'react'
import { CheckCircle, Clock } from 'lucide-react'
import api from '../services/api'

function trialCountdown(trialEndsAt) {
  const msLeft = new Date(trialEndsAt).getTime() - Date.now()
  if (msLeft <= 0) return null
  const totalHours = Math.floor(msLeft / (1000 * 60 * 60))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  if (days > 0) return `${days}d ${hours}h remaining`
  const minutes = Math.floor((msLeft / (1000 * 60)) % 60)
  return `${hours}h ${minutes}m remaining`
}

function Pricing() {
  const [pricing, setPricing] = useState(null)
  const [trialSubscription, setTrialSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [, setNow] = useState(Date.now())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricingRes, summaryRes] = await Promise.all([
          api.get('/api/settings/pricing'),
          api.get('/api/billing/summary')
        ])
        setPricing(pricingRes.data)
        const trial = (summaryRes.data.subscriptions || []).find(
          (s) => s.planType === 'trial' && s.trialEndsAt && new Date(s.trialEndsAt).getTime() > Date.now()
        )
        setTrialSubscription(trial || null)
      } catch (error) {
        console.error('Failed to fetch pricing data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Keep the countdown live without re-fetching
  useEffect(() => {
    if (!trialSubscription) return
    const interval = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [trialSubscription])

  const price = pricing ? Number(pricing.routerMonthlyPrice).toFixed(pricing.routerMonthlyPrice % 1 === 0 ? 0 : 2) : null
  const trialDays = pricing?.trialDays ?? 7
  const countdown = trialSubscription ? trialCountdown(trialSubscription.trialEndsAt) : null

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
              <span className="text-2xl font-bold text-gray-900">{loading ? '—' : `$${price}`}</span>
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

          {countdown ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-amber-900 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                Trial Active - {trialSubscription.routerName}
              </h3>
              <p className="text-xs text-amber-800">
                <strong>{countdown}</strong> in your free trial. After it ends, this router bills at ${price}/month from your wallet balance.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Free Trial</h3>
              <p className="text-xs text-blue-800">
                New accounts get a <strong>{trialDays}-day free trial</strong> for their first router. No credit card required!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Pricing
