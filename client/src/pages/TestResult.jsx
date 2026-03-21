import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api.js'

export default function TestResult() {
  const location   = useLocation()
  const navigate   = useNavigate()
  const { resultId } = useParams()
  const [result, setResult] = useState(location.state || null)
  const [loading, setLoading] = useState(!location.state)

  useEffect(() => {
    if (!result) {
      api.get(`/scores/${resultId}`)
        .then(setResult)
        .finally(() => setLoading(false))
    }
  }, [resultId])

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading result...</div>
  if (!result)  return <div className="flex items-center justify-center min-h-screen text-gray-400">Result not found</div>

  const { score, maxScore, percentage, correct, wrong, skipped, sectionScores, isPassed } = result

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Result card */}
      <div className={`rounded-2xl p-8 text-center mb-8 border ${isPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className={`text-6xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
          {percentage}%
        </div>
        <div className={`text-lg font-semibold mb-1 ${isPassed ? 'text-green-800' : 'text-red-800'}`}>
          {isPassed ? '🎉 Passed!' : '😔 Not passed'}
        </div>
        <p className={`text-sm ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
          Score: {score} / {maxScore}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Correct', value: correct, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { label: 'Wrong',   value: wrong,   color: 'text-red-600',   bg: 'bg-red-50 border-red-200' },
          { label: 'Skipped', value: skipped, color: 'text-gray-600',  bg: 'bg-gray-50 border-gray-200' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border rounded-2xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section scores */}
      {sectionScores?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Section breakdown</h2>
          <div className="flex flex-col gap-3">
            {sectionScores.map(s => (
              <div key={s.section}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{s.section}</span>
                  <span className="font-medium text-gray-900">{s.score}/{s.total}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.round((s.score / s.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)}
          className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-full text-sm hover:border-gray-300 transition">
          Back
        </button>
        <button onClick={() => navigate('/leaderboard')}
          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-full text-sm hover:bg-indigo-700 transition">
          View leaderboard →
        </button>
      </div>
    </div>
  )
}