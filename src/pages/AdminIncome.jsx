import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { Wallet, Receipt, TrendingUp, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react'
import { IncomeCard, SEQUENTIAL_BLUE, SEQUENTIAL_ORANGE } from '../components/admin/IncomeCharts'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

function StatTile({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

function PlanMixChart({ byPlanType }) {
  const total = (byPlanType.trial || 0) + (byPlanType.monthly || 0)
  const trialPct = total ? (byPlanType.trial / total) * 100 : 0
  const monthlyPct = total ? (byPlanType.monthly / total) * 100 : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Subscription Mix</h2>
      {total === 0 ? (
        <p className="text-xs text-gray-400">No active subscriptions</p>
      ) : (
        <>
          <div className="w-full h-6 rounded-full overflow-hidden flex bg-gray-100 mb-3">
            {trialPct > 0 && <div style={{ width: `${trialPct}%`, backgroundColor: SEQUENTIAL_ORANGE }} />}
            {monthlyPct > 0 && <div style={{ width: `${monthlyPct}%`, backgroundColor: SEQUENTIAL_BLUE }} />}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: SEQUENTIAL_ORANGE }} />
              <span className="text-gray-600">Trial: {byPlanType.trial || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: SEQUENTIAL_BLUE }} />
              <span className="text-gray-600">Paying (monthly): {byPlanType.monthly || 0}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function AdminIncome() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/admin/analytics')
      setAnalytics(response.data.analytics)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load income data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-red-600">
        {error || 'No income data available'}
      </div>
    )
  }

  const stale = analytics.subscriptions?.stalePastDueTrials || 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-lg font-semibold text-gray-900">Income</h1>
        <Link
          to="/admin/transactions"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center"
        >
          View all transactions
          <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      {stale > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <span>
            {stale} trial subscription{stale === 1 ? '' : 's'} {stale === 1 ? 'is' : 'are'} past its trial end date and hasn&apos;t converted to paid yet.
            The billing cron that handles this was fixed and will pick these up on their next scheduled run - no action needed unless the count stays non-zero after that.
          </span>
        </div>
      )}

      {/* Recurring revenue - computed from live subscriptions, not transaction history,
          so it's meaningful even before any billing cycle has completed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={TrendingUp} label="MRR (paying subscriptions)" value={formatCurrency(analytics.revenue.mrr)} accent="text-green-600 bg-green-50" />
        <StatTile icon={Sparkles} label="Potential MRR (if trials convert)" value={formatCurrency(analytics.revenue.potentialMrr)} accent="text-purple-600 bg-purple-50" />
        <StatTile icon={Wallet} label="Payments Collected (all time)" value={formatCurrency(analytics.revenue.payments.allTime)} accent="text-blue-600 bg-blue-50" />
        <StatTile icon={Receipt} label="Subscription Revenue (all time)" value={formatCurrency(analytics.revenue.invoiced.allTime)} accent="text-orange-600 bg-orange-50" />
      </div>

      <PlanMixChart byPlanType={analytics.subscriptions?.byPlanType || { trial: 0, monthly: 0 }} />

      <p className="text-xs text-gray-500">
        Payments and Subscription Revenue below are kept separate rather than summed - adding them would
        double-count balance that&apos;s deposited once (a payment) and later spent (an invoice).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeCard
          icon={Wallet}
          title="Payments Collected"
          subtitle="Wallet top-ups via PayPal / PayStack"
          chartColor={SEQUENTIAL_BLUE}
          data={analytics.revenue.payments.last30Days}
          allTime={analytics.revenue.payments.allTime}
          thisMonth={analytics.revenue.payments.thisMonth}
          emptyLabel="No payments collected in the last 30 days"
        />
        <IncomeCard
          icon={Receipt}
          title="Subscription Revenue"
          subtitle="Router subscriptions billed from balance"
          chartColor={SEQUENTIAL_ORANGE}
          data={analytics.revenue.invoiced.last30Days}
          allTime={analytics.revenue.invoiced.allTime}
          thisMonth={analytics.revenue.invoiced.thisMonth}
          emptyLabel="No subscriptions billed in the last 30 days"
        />
      </div>
    </div>
  )
}

export default AdminIncome
