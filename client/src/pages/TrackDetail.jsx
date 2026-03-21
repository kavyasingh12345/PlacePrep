import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { companyService } from '../services/companyservice.js'
import { trackService } from '../services/trackService.js'
import { testService } from '../services/testService.js'
import { lessonService } from '../services/lessonService.js'
import { initiatePayment } from '../services/paymentService.js'
import { useAuth } from '../context/AuthContext.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

export default function TrackDetail() {
  const { slug }    = useParams()
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [company, setCompany]       = useState(null)
  const [tracks, setTracks]         = useState([])
  const [activeTrack, setActiveTrack] = useState(null)
  const [lessons, setLessons]       = useState([])
  const [tests, setTests]           = useState([])
  const [progress, setProgress]     = useState(null)
  const [enrolled, setEnrolled]     = useState(false)
  const [loading, setLoading]       = useState(true)
  const [enrolling, setEnrolling]   = useState(false)

  useEffect(() => {
    companyService.getBySlug(slug).then(async (c) => {
      setCompany(c)
      const t = await trackService.getByCompany(c._id)
      setTracks(t)
      if (t.length > 0) await selectTrack(t[0])
      setLoading(false)
    })
  }, [slug])

  const selectTrack = async (track) => {
    setActiveTrack(track)
    setLessons([])
    setTests([])
    setEnrolled(false)
    setProgress(null)
  
    const [l, t, e, p] = await Promise.all([
      lessonService.getByTrack(track._id).catch(() => []),
      testService.getByTrack(track._id).catch(() => []),
      trackService.checkEnroll(track._id).catch(() => ({ enrolled: false })),
      lessonService.getProgress(track._id).catch(() => null),
    ])
    setLessons(Array.isArray(l) ? l : [])
    setTests(Array.isArray(t) ? t : [])
    setEnrolled(e?.enrolled || false)
    setProgress(p)
  }

  const handleEnroll = async () => {
    if (!activeTrack) return
    setEnrolling(true)
    try {
      if (activeTrack.isPremium) {
        await initiatePayment({
          trackId:   activeTrack._id,
          user,
          onSuccess: async () => {
            // Re-check enrollment from server after payment
            const e = await trackService.checkEnroll(activeTrack._id)
            setEnrolled(e?.enrolled || true)
            setEnrolling(false)
          },
          onFailure: (msg) => {
            alert(msg)
            setEnrolling(false)
          },
        })
      } else {
        await trackService.enrollFree(activeTrack._id)
        // Re-check enrollment from server to confirm
        const e = await trackService.checkEnroll(activeTrack._id)
        setEnrolled(e?.enrolled || true)
        setEnrolling(false)
      }
    } catch (err) {
      alert(err.message || 'Enrollment failed')
      setEnrolling(false)
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-4" />
      <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Company header */}
      <div className="flex items-center gap-4 mb-8">
        {company?.logo
          ? <img src={company.logo} className="w-14 h-14 object-contain" />
          : <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xl">{company?.name[0]}</div>
        }
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company?.name} Placement Prep</h1>
          <p className="text-sm text-gray-500">CTC: {company?.ctc} · Min CGPA: {company?.minCGPA} · {company?.branches?.join(', ')}</p>
        </div>
      </div>

      {/* Rounds */}
      <div className="flex gap-2 flex-wrap mb-8">
        {company?.rounds?.map(r => (
          <span key={r} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full">{r}</span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Track list */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Prep tracks</h2>
          <div className="flex flex-col gap-2">
            {tracks.map(t => (
              <button key={t._id} onClick={() => selectTrack(t)}
                className={`text-left px-4 py-3 rounded-xl border transition text-sm ${activeTrack?._id === t._id ? 'bg-indigo-50 border-indigo-300 text-indigo-800' : 'border-gray-200 hover:border-indigo-200 text-gray-700'}`}>
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.totalLessons} lessons · {t.duration}</div>
                {t.isPremium && <span className="text-xs text-amber-600">Premium</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Track content */}
        <div className="lg:col-span-2">
          {activeTrack && (
            <>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{activeTrack.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{activeTrack.description}</p>
                  </div>
                  {enrolled
                    ? <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1 rounded-full whitespace-nowrap">✓ Enrolled</span>
                    : <button onClick={handleEnroll} disabled={enrolling}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 whitespace-nowrap">
                        {enrolling ? 'Processing...' : activeTrack.isPremium ? 'Buy — ₹499' : 'Enroll free'}
                      </button>
                  }
                </div>
                {enrolled && progress && (
                  <ProgressBar percentage={progress.percentage} label="Your progress" />
                )}
              </div>

              {/* Lessons */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Lessons ({lessons.length})</h3>
                <div className="flex flex-col gap-2">
                  {lessons.map((l, i) => {
                    const done = progress?.completedLessons?.some(cl => cl._id === l._id || cl === l._id)
                    const canAccess = l.isFree || enrolled
                    return (
                      <div key={l._id}
                        onClick={() => canAccess && navigate(`/lesson/${l._id}`)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition text-sm ${canAccess ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50' : 'opacity-50 cursor-not-allowed'} ${done ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {done ? '✓' : i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{l.title}</p>
                          <p className="text-xs text-gray-400">{l.topic}</p>
                        </div>
                        {!canAccess && <span className="text-gray-400 text-xs">🔒 Premium</span>}
                        {l.isFree && !enrolled && <span className="text-xs text-green-600">Free preview</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Mock tests */}
              {tests.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Mock tests ({tests.length})</h3>
                  <div className="flex flex-col gap-2">
                    {tests.map(t => (
                      <div key={t._id}
                        onClick={() => enrolled && navigate(`/test/${t._id}`)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition text-sm ${enrolled ? 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50' : 'opacity-50 cursor-not-allowed'} border-gray-200`}>
                        <span className="text-xl">🧪</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{t.title}</p>
                          <p className="text-xs text-gray-400">{t.totalQuestions} questions · {t.duration} min</p>
                        </div>
                        {enrolled
                          ? <span className="text-indigo-600 text-xs">Start →</span>
                          : <span className="text-gray-400 text-xs">🔒 Enroll first</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}