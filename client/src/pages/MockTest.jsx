import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { testService } from '../services/testService.js'
import MockTestTimer from '../components/MockTestTimer.jsx'

export default function MockTest() {
  const { testId }  = useParams()
  const navigate    = useNavigate()
  const [test, setTest]       = useState(null)
  const [answers, setAnswers] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const startTime             = useRef(Date.now())

  const allQuestions = test?.sections.flatMap(s => s.questions) || []

  useEffect(() => {
    testService.start(testId)
      .then(data => {
        setTest(data)
        setAnswers(new Array(data.totalQuestions).fill(-1))
      })
      .finally(() => setLoading(false))
  }, [testId])

  const handleAnswer = (idx) => {
    setAnswers(prev => { const a = [...prev]; a[current] = idx; return a })
  }

  const handleSubmit = async () => {
    if (!window.confirm('Submit test? You cannot change answers after this.')) return
    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000)
    const result = await testService.submit({
      testId,
      userAnswers: answers,
      timeTaken,
      companyId: test.companyId,
    })
    navigate(`/test/result/${result.resultId}`, { state: result })
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading test...</div>

  const q = allQuestions[current]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="font-semibold text-gray-900 text-sm">{test.title}</span>
        <MockTestTimer duration={test.duration} onTimeUp={handleSubmit} />
        <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-indigo-700 transition">
          Submit
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {allQuestions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium border transition ${
                i === current ? 'bg-indigo-600 text-white border-indigo-600'
                : answers[i] !== -1 ? 'bg-green-50 text-green-700 border-green-300'
                : 'border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <p className="text-xs text-gray-400 mb-3">Question {current + 1} of {allQuestions.length}</p>
          <p className="font-medium text-gray-900 text-base leading-relaxed mb-6">{q?.text}</p>
          <div className="flex flex-col gap-2.5">
            {q?.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                  answers[current] === idx ? 'border-indigo-400 bg-indigo-50 text-indigo-900' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}>
                <span className="font-medium mr-2 text-gray-400">{String.fromCharCode(65 + idx)}.</span>{opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-30 hover:border-gray-300 transition">
            ← Previous
          </button>
          {current < allQuestions.length - 1
            ? <button onClick={() => setCurrent(p => p + 1)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
                Next →
              </button>
            : <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-700 transition">
                Submit Test
              </button>
          }
        </div>
      </div>
    </div>
  )
}