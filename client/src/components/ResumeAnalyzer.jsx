import { useState } from 'react'
import api from '../services/api.js'

const ScoreRing = ({ score, label, color }) => {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const filled = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none"
            stroke="currentColor" strokeWidth="8"
            className="text-gray-100" />
          <circle cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  )
}

const Badge = ({ text, color }) => {
  const colors = {
    green:  'bg-green-50 text-green-700 border-green-200',
    red:    'bg-red-50 text-red-600 border-red-200',
    blue:   'bg-blue-50 text-blue-700 border-blue-200',
    amber:  'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colors[color]}`}>
      {text}
    </span>
  )
}

export default function ResumeAnalyzer({ companies }) {
  const [file, setFile]           = useState(null)
  const [companyId, setCompanyId] = useState('')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState('')

  const handleAnalyze = async () => {
    if (!file)      return setError('Please upload your resume PDF')
    if (!companyId) return setError('Please select a company')

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('companyId', companyId)

      const data = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const importanceColor = { high: 'red', medium: 'amber', low: 'blue' }

  return (
    <div className="max-w-4xl">

      {/* Upload section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-1">AI Resume Analyzer</h2>
        <p className="text-sm text-gray-500 mb-5">
          Upload your resume and select a company — our AI will give you an ATS score,
          missing keywords, skills gap and improvement tips.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume (PDF only, max 5MB)
            </label>
            <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition ${
              file ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
            }`}>
              <span className="text-xl">{file ? '✅' : '📄'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {file ? file.name : 'Click to upload resume'}
                </p>
                <p className="text-xs text-gray-400">
                  {file ? `${(file.size / 1024).toFixed(0)} KB` : 'PDF format only'}
                </p>
              </div>
              <input type="file" accept=".pdf" className="hidden"
                onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>

          {/* Company select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target company
            </label>
            <select value={companyId}
              onChange={e => setCompanyId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 transition bg-white">
              <option value="">Select a company</option>
              {companies.map(c => (
                <option key={c._id} value={c._id}>{c.name} — {c.ctc}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <button onClick={handleAnalyze} disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75"/>
              </svg>
              Analyzing your resume with AI...
            </>
          ) : '🤖 Analyze my resume'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-5">

          {/* Score cards */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-5">
              Analysis for {result.company.name} · {result.company.ctc}
            </h3>
            <div className="flex items-center justify-around flex-wrap gap-6">
              <ScoreRing score={result.analysis.atsScore}       label="ATS Score"        color="#6366f1" />
              <ScoreRing score={result.analysis.matchPercentage} label="Job Match %"      color="#10b981" />
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-gray-900">
                  {result.analysis.presentKeywords?.length || 0}
                </div>
                <span className="text-xs text-gray-500">Keywords matched</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-bold text-red-500">
                  {result.analysis.missingKeywords?.length || 0}
                </div>
                <span className="text-xs text-gray-500">Keywords missing</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-5 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <p className="text-sm text-indigo-800 leading-relaxed">
                {result.analysis.summary}
              </p>
            </div>
          </div>

          {/* Strengths */}
          {result.analysis.strengths?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">💪 Your strengths</h3>
              <div className="flex flex-wrap gap-2">
                {result.analysis.strengths.map((s, i) => (
                  <Badge key={i} text={s} color="green" />
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">✅ Present keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.analysis.presentKeywords?.map((k, i) => (
                  <Badge key={i} text={k} color="green" />
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">❌ Missing keywords</h3>
              <div className="flex flex-wrap gap-2">
                {result.analysis.missingKeywords?.map((k, i) => (
                  <Badge key={i} text={k} color="red" />
                ))}
              </div>
            </div>
          </div>

          {/* Skills gap */}
          {result.analysis.skillsGap?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📊 Skills gap analysis</h3>
              <div className="flex flex-col gap-3">
                {result.analysis.skillsGap.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl">
                    <Badge text={s.importance} color={importanceColor[s.importance] || 'blue'} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{s.skill}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {result.analysis.improvements?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">🔧 Resume improvements</h3>
              <div className="flex flex-col gap-3">
                {result.analysis.improvements.map((imp, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {imp.section}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-red-600 mb-1">⚠️ {imp.issue}</p>
                      <p className="text-sm text-green-700">✅ {imp.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}