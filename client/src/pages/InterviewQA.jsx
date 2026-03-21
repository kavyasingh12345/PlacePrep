import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api.js'

const ROUNDS = ['all', 'aptitude', 'technical', 'verbal', 'hr', 'coding']

export default function InterviewQA() {
  const { trackId }             = useParams()
  const [questions, setQuestions] = useState([])
  const [round, setRound]         = useState('all')
  const [expanded, setExpanded]   = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    api.get(`/questions/track/${trackId}`, { params: { limit: 100 } })
      .then(setQuestions)
      .finally(() => setLoading(false))
  }, [trackId])

  const filtered = round === 'all' ? questions : questions.filter(q => q.round === round)

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading questions...</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Interview Q&A</h1>
      <p className="text-gray-500 mb-6">Real questions asked in placement rounds</p>

      {/* Round filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {ROUNDS.map(r => (
          <button key={r} onClick={() => setRound(r)}
            className={`px-3 py-1.5 rounded-full text-sm border transition capitalize ${round === r ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
            {r}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="text-center py-16 text-gray-400">No questions found for this round</div>
        : <div className="flex flex-col gap-3">
            {filtered.map((q, i) => (
              <div key={q._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 capitalize flex-shrink-0 ${
                      q.round === 'hr'        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                      : q.round === 'technical' ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : q.round === 'aptitude'  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}>{q.round}</span>
                    <p className="font-medium text-gray-900 text-sm leading-relaxed">{q.text}</p>
                  </div>
                  <span className="text-gray-400 flex-shrink-0">{expanded === i ? '▲' : '▼'}</span>
                </button>

                {expanded === i && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    {/* Options for MCQ */}
                    {q.options?.length > 0 && (
                      <div className="flex flex-col gap-1.5 my-3">
                        {q.options.map((opt, idx) => (
                          <div key={idx} className={`px-3 py-2 rounded-xl text-sm ${idx === q.correctIndex ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-gray-50 text-gray-600'}`}>
                            <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                            {idx === q.correctIndex && <span className="ml-2 text-green-600 font-medium">✓ Correct</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Explanation */}
                    {q.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                        <span className="font-medium">Explanation: </span>{q.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  )
}