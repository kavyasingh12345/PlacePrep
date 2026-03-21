import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import ProgressBar from '../components/ProgressBar.jsx'

export default function MyProgress() {
  const [enrollments, setEnrollments] = useState([])
  const [scores, setScores]           = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/enrollments/my'),
      api.get('/leaderboard/my'),
    ]).then(([e, s]) => {
      setEnrollments(Array.isArray(e) ? e : [])
      setScores(Array.isArray(s) ? s : [])
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Loading...
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">My progress</h1>
      <p className="text-gray-500 mb-8">Track your preparation across all enrolled companies</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Enrolled tracks', value: enrollments.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Tests attempted', value: scores.length, color: 'bg-green-50 text-green-700' },
          { label: 'Best score', value: scores.length > 0 ? Math.max(...scores.map(s => s.percentage)) + '%' : '—', color: 'bg-amber-50 text-amber-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 text-center`}>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-xs mt-1 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Enrolled tracks */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Enrolled tracks ({enrollments.length})
        </h2>
        {enrollments.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <p className="text-gray-400 mb-3">No tracks enrolled yet.</p>
            <Link to="/companies"
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm hover:bg-indigo-700 transition">
              Browse companies →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrollments.map(e => {
              const track   = e.track
              const company = track?.company
              const progress = e.progressPercentage || 0
              return (
                <Link key={e._id}
                  to={`/companies/${company?.slug}`}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 transition">
                  <div className="flex items-center gap-3 mb-4">
                    {company?.logo
                      ? <img src={company.logo} className="w-9 h-9 object-contain" alt={company.name} />
                      : <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {company?.name?.[0] || 'T'}
                        </div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {track?.title || 'Unknown track'}
                      </p>
                      <p className="text-xs text-gray-500">{company?.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      e.paymentStatus === 'paid'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {e.paymentStatus === 'paid' ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  <ProgressBar percentage={progress} label="Progress" />
                  <p className="text-xs text-gray-400 mt-2">
                    Enrolled {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Test history */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Test history ({scores.length})
        </h2>
        {scores.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400">
            No tests taken yet. Enroll in a track and take a mock test!
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Test</th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-right">Score</th>
                  <th className="px-4 py-3 text-right">Time</th>
                  <th className="px-4 py-3 text-right">Status</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map(s => (
                  <tr key={s._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {s.mockTest?.title || 'Mock test'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {s.company?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${
                        s.percentage >= 60 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {s.percentage}%
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        ({s.score}/{s.maxScore})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                      {Math.floor(s.timeTaken / 60)}m {s.timeTaken % 60}s
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        s.isPassed
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {s.isPassed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}