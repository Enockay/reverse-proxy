import { Share2, Copy, CheckCircle, Loader, Gift, Users, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

function Referrals() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0
  })
  const [referrals, setReferrals] = useState([])

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      
      // Fetch referral code
      const codeResponse = await api.get('/api/referrals/code')
      if (codeResponse.data.success) {
        setReferralCode(codeResponse.data.referralCode)
        setReferralLink(codeResponse.data.referralLink || `${window.location.origin}/signup?ref=${codeResponse.data.referralCode}`)
      }

      // Fetch stats
      const statsResponse = await api.get('/api/referrals/stats')
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats)
      }

      // Fetch referral list
      const referralsResponse = await api.get('/api/referrals')
      if (referralsResponse.data.success) {
        setReferrals(referralsResponse.data.referrals)
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCode = async () => {
    try {
      setGenerating(true)
      const response = await api.get('/api/referrals/code')
      if (response.data.success) {
        setReferralCode(response.data.referralCode)
        setReferralLink(response.data.referralLink || `${window.location.origin}/signup?ref=${response.data.referralCode}`)
      }
    } catch (error) {
      console.error('Failed to generate referral code:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Referrals</h1>
        <p className="text-xs text-gray-600 mt-1">Invite friends and earn rewards</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Referrals</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalReferrals}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-green-600">{stats.completedReferrals}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-yellow-600">{stats.pendingReferrals}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Rewards</p>
              <p className="text-xl font-semibold text-purple-600">${stats.totalRewards.toFixed(2)}</p>
            </div>
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {!referralCode ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-4">You don't have a referral code yet.</p>
              <button
                onClick={handleGenerateCode}
                disabled={generating}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center mx-auto"
              >
                {generating ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Generate Referral Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Your Referral Code
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralCode}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 font-mono font-semibold"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 flex items-center transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Your Referral Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded bg-gray-50 font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 flex items-center transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">How it works</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• Share your referral link or code with friends</li>
              <li>• They sign up using your link</li>
              <li>• You both get rewards when they create their first router</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      {referrals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Your Referrals</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-4 py-2 text-xs text-gray-900">{referral.referredUser?.name || 'N/A'}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{referral.referredUser?.email || 'N/A'}</td>
                    <td className="px-4 py-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        referral.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : referral.status === 'rewarded'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600">
                      {referral.referredUser?.joinedAt 
                        ? new Date(referral.referredUser.joinedAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
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

export default Referrals
