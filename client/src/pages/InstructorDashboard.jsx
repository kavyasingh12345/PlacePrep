import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import { companyService } from '../services/temp123.js'

const ROUNDS = ['aptitude', 'technical', 'verbal', 'hr', 'coding']
const DIFFICULTIES = ['easy', 'medium', 'hard']
const CATEGORIES = ['fullpack', 'aptitude', 'technical', 'verbal', 'hr']

export default function InstructorDashboard() {
  const { user } = useAuth()
  const [companies, setCompanies] = useState([])
  const [tracks, setTracks] = useState([])
  const [tab, setTab] = useState('tracks')
  const [message, setMessage] = useState({ text: '', type: 'success' })
  const [submitting, setSubmitting] = useState(false)

  // ── Track form state ──
  const [newTrack, setNewTrack] = useState({
    company: '', title: '', description: '', category: 'fullpack', isPremium: false,
  })

  // ── Question form state ──
  const [selectedTrackQ, setSelectedTrackQ] = useState('')
  const [trackQuestions, setTrackQuestions] = useState([])
  const [loadingQ, setLoadingQ] = useState(false)
  const [question, setQuestion] = useState({
    text: '', options: ['', '', '', ''], correctIndex: 0,
    explanation: '', round: 'aptitude', topic: '', difficulty: 'easy',
  })

  // ── Lesson form state ──
  const [selectedTrackL, setSelectedTrackL] = useState('')
  const [trackLessons, setTrackLessons] = useState([])
  const [loadingL, setLoadingL] = useState(false)
  const [lesson, setLesson] = useState({
    title: '', topic: '', description: '', order: 1, isFree: false,
    videoUrl: '', notesUrl: '',
  })

  // ── Mock test form state ──
  const [selectedTrackM, setSelectedTrackM] = useState('')
  const [mockQuestions, setMockQuestions] = useState([])
  const [trackTests, setTrackTests] = useState([])
  const [mockTest, setMockTest] = useState({
    title: '', duration: 30, totalQuestions: 10,
    passingScore: 40, negativeMarking: false,
  })
  const [sections, setSections] = useState([
    { name: 'Aptitude', questionCount: 4, questions: [] },
    { name: 'Technical', questionCount: 3, questions: [] },
    { name: 'Verbal', questionCount: 3, questions: [] },
  ])

  useEffect(() => {
    companyService.getAll().then(setCompanies)
    fetchMyTracks()
  }, [])

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: 'success' }), 4000)
  }

  const fetchMyTracks = async () => {
    try {
      const data = await api.get('/tracks/my')
      setTracks(Array.isArray(data) ? data : [])
    } catch {
      setTracks([])
    }
  }

  const fetchQuestionsForTrack = async (trackId) => {
    if (!trackId) return
    setLoadingQ(true)
    try {
      const data = await api.get(`/questions/track/${trackId}`, { params: { limit: 200 } })
      setTrackQuestions(Array.isArray(data) ? data : [])
    } catch { setTrackQuestions([]) }
    finally { setLoadingQ(false) }
  }

  const fetchLessonsForTrack = async (trackId) => {
    if (!trackId) return
    setLoadingL(true)
    try {
      const data = await api.get(`/lessons/track/${trackId}`)
      setTrackLessons(Array.isArray(data) ? data : [])
    } catch { setTrackLessons([]) }
    finally { setLoadingL(false) }
  }

  const fetchTestsForTrack = async (trackId) => {
    if (!trackId) return
    try {
      const [q, t] = await Promise.all([
        api.get(`/questions/track/${trackId}`, { params: { limit: 200 } }),
        api.get(`/tests/track/${trackId}`),
      ])
      setMockQuestions(Array.isArray(q) ? q : [])
      setTrackTests(Array.isArray(t) ? t : [])
    } catch { setMockQuestions([]); setTrackTests([]) }
  }

  // ══ TRACK HANDLERS ══════════════════════════════════════

  const handleCreateTrack = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/tracks', newTrack)
      showMsg('✓ Track created! Submit it for admin approval.')
      setNewTrack({ company: '', title: '', description: '', category: 'fullpack', isPremium: false })
      fetchMyTracks()
      setTab('tracks')
    } catch (err) { showMsg('Error: ' + err.message, 'error') }
    finally { setSubmitting(false) }
  }

  const submitForApproval = async (trackId) => {
    try {
      await api.patch(`/tracks/${trackId}`, { submittedForApproval: true })
      showMsg('✓ Submitted for admin approval!')
      fetchMyTracks()
    } catch (err) { showMsg('Error: ' + err.message, 'error') }
  }

  const deleteTrack = async (trackId) => {
    if (!window.confirm('Delete this track? This cannot be undone.')) return
    try {
      await api.delete(`/tracks/${trackId}`)
      setTracks(prev => prev.filter(t => t._id !== trackId))
      showMsg('✓ Track deleted successfully.')
    } catch (err) {
      showMsg('Error deleting: ' + (err.message || 'Failed'), 'error')
    }
  }

  // ══ QUESTION HANDLERS ═══════════════════════════════════

  const handleAddQuestion = async (e) => {
    e.preventDefault()
    if (question.options.some(o => o.trim() === ''))
      return showMsg('Please fill all 4 options.', 'error')
    setSubmitting(true)
    try {
      await api.post('/questions', { ...question, track: selectedTrackQ })
      showMsg('✓ Question added!')
      setQuestion({
        text: '', options: ['', '', '', ''], correctIndex: 0,
        explanation: '', round: 'aptitude', topic: '', difficulty: 'easy',
      })
      fetchQuestionsForTrack(selectedTrackQ)
    } catch (err) { showMsg('Error: ' + err.message, 'error') }
    finally { setSubmitting(false) }
  }

  const deleteQuestion = async (qId) => {
    await api.delete(`/questions/${qId}`).catch(() => {})
    setTrackQuestions(prev => prev.filter(q => q._id !== qId))
    showMsg('Question deleted.')
  }

  const updateOption = (idx, val) => {
    setQuestion(prev => {
      const opts = [...prev.options]
      opts[idx] = val
      return { ...prev, options: opts }
    })
  }

  // ══ LESSON HANDLERS ═════════════════════════════════════

  const handleAddLesson = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/lessons', { ...lesson, trackId: selectedTrackL })
      showMsg('✓ Lesson added!')
      setLesson({ title: '', topic: '', description: '', order: trackLessons.length + 2, isFree: false, videoUrl: '', notesUrl: '' })
      fetchLessonsForTrack(selectedTrackL)
    } catch (err) { showMsg('Error: ' + err.message, 'error') }
    finally { setSubmitting(false) }
  }

  const deleteLesson = async (lessonId) => {
    await api.delete(`/lessons/${lessonId}`).catch(() => {})
    setTrackLessons(prev => prev.filter(l => l._id !== lessonId))
    showMsg('Lesson deleted.')
  }

  // ══ MOCK TEST HANDLERS ══════════════════════════════════

  const updateSection = (i, field, val) => {
    setSections(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  const toggleQuestionInSection = (sectionIdx, qId) => {
    setSections(prev => prev.map((s, idx) => {
      if (idx !== sectionIdx) return s
      const already = s.questions.includes(qId)
      return {
        ...s,
        questions: already
          ? s.questions.filter(id => id !== qId)
          : [...s.questions, qId],
      }
    }))
  }

  const handleCreateMockTest = async (e) => {
    e.preventDefault()
    const totalQ = sections.reduce((sum, s) => sum + s.questions.length, 0)
    if (totalQ === 0) return showMsg('Please assign questions to at least one section.', 'error')

    setSubmitting(true)
    try {
      const payload = {
        ...mockTest,
        track: selectedTrackM,
        totalQuestions: totalQ,
        sections: sections.map(s => ({
          name: s.name,
          questionCount: s.questions.length,
          questions: s.questions,
        })).filter(s => s.questions.length > 0),
      }
      await api.post('/tests', payload)
      showMsg('✓ Mock test created! Students can now take this test.')
      setMockTest({ title: '', duration: 30, totalQuestions: 10, passingScore: 40, negativeMarking: false })
      setSections([
        { name: 'Aptitude', questionCount: 4, questions: [] },
        { name: 'Technical', questionCount: 3, questions: [] },
        { name: 'Verbal', questionCount: 3, questions: [] },
      ])
      fetchTestsForTrack(selectedTrackM)
    } catch (err) { showMsg('Error: ' + err.message, 'error') }
    finally { setSubmitting(false) }
  }

  // ══ SHARED UI HELPERS ═══════════════════════════════════

  const TrackSelector = ({ value, onChange, label }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value} required
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition bg-white"
      >
        <option value="">Select a track</option>
        {tracks.map(t => (
          <option key={t._id} value={t._id}>
            {t.title} — {t.company?.name || ''}
          </option>
        ))}
      </select>
    </div>
  )

  const TABS = [
    { id: 'tracks',    label: '📋 My tracks' },
    { id: 'create',    label: '➕ Create track' },
    { id: 'lessons',   label: '🎬 Add lessons' },
    { id: 'questions', label: '❓ Add questions' },
    { id: 'mocktest',  label: '🧪 Create mock test' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Instructor dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome, {user?.name}</p>
      </div>

      {message.text && (
        <div className={`mb-5 p-3 rounded-xl text-sm border ${
          message.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              tab === t.id
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ MY TRACKS ══════════════════════════════════════ */}
      {tab === 'tracks' && (
        <div>
          {tracks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-3">No tracks yet.</p>
              <button onClick={() => setTab('create')}
                className="bg-green-600 text-white px-5 py-2 rounded-full text-sm hover:bg-green-700 transition">
                Create your first track →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tracks.map(t => (
                <div key={t._id} className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-gray-900">{t.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          t.status === 'published'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {t.status === 'published' ? '✓ Published' : '⏳ Draft'}
                        </span>
                        {t.isPremium && (
                          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Premium</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {t.company?.name} · {t.category} · {t.totalLessons || 0} lessons
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      {t.status === 'draft' && (
                        <button onClick={() => submitForApproval(t._id)}
                          className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-indigo-700 transition">
                          Submit for approval
                        </button>
                      )}
                      <button onClick={() => { setSelectedTrackL(t._id); fetchLessonsForTrack(t._id); setTab('lessons') }}
                        className="border border-green-300 text-green-700 px-3 py-1.5 rounded-full text-xs hover:bg-green-50 transition">
                        + Lessons
                      </button>
                      <button onClick={() => { setSelectedTrackQ(t._id); fetchQuestionsForTrack(t._id); setTab('questions') }}
                        className="border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full text-xs hover:bg-blue-50 transition">
                        + Questions
                      </button>
                      <button onClick={() => { setSelectedTrackM(t._id); fetchTestsForTrack(t._id); setTab('mocktest') }}
                        className="border border-purple-300 text-purple-700 px-3 py-1.5 rounded-full text-xs hover:bg-purple-50 transition">
                        + Mock test
                      </button>
                      <button onClick={() => deleteTrack(t._id)}
                        className="border border-red-200 text-red-500 px-3 py-1.5 rounded-full text-xs hover:bg-red-50 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                  {t.status === 'draft' && (
                    <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                      Draft — click <strong>Submit for approval</strong> to send to admin for publishing.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ CREATE TRACK ════════════════════════════════════ */}
      {tab === 'create' && (
        <div className="max-w-lg">
          <form onSubmit={handleCreateTrack} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <select required value={newTrack.company}
                onChange={e => setNewTrack(p => ({ ...p, company: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition bg-white">
                <option value="">Select company</option>
                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Track title</label>
              <input required value={newTrack.title}
                onChange={e => setNewTrack(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. TCS NQT Complete Prep"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={newTrack.description} rows={3}
                onChange={e => setNewTrack(p => ({ ...p, description: e.target.value }))}
                placeholder="What does this track cover?"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={newTrack.category}
                  onChange={e => setNewTrack(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input type="checkbox" id="isPremium" checked={newTrack.isPremium}
                  onChange={e => setNewTrack(p => ({ ...p, isPremium: e.target.checked }))}
                  className="w-4 h-4 accent-green-600" />
                <label htmlFor="isPremium" className="text-sm text-gray-700">Premium (₹499)</label>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
              After creating: add lessons + questions → submit for approval → admin publishes it.
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-green-700 transition disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create track'}
            </button>
          </form>
        </div>
      )}

      {/* ══ ADD LESSONS ═════════════════════════════════════ */}
      {tab === 'lessons' && (
        <div>
          <TrackSelector
            value={selectedTrackL}
            label="Select track to add lessons to"
            onChange={id => { setSelectedTrackL(id); fetchLessonsForTrack(id) }}
          />

          {selectedTrackL && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Add lesson form */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Add new lesson</h2>
                <form onSubmit={handleAddLesson} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson title</label>
                    <input required value={lesson.title}
                      onChange={e => setLesson(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Introduction to Percentages"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                    <input required value={lesson.topic}
                      onChange={e => setLesson(p => ({ ...p, topic: e.target.value }))}
                      placeholder="e.g. Percentages, Arrays, OS"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Cloudinary / YouTube)</label>
                    <input value={lesson.videoUrl}
                      onChange={e => setLesson(p => ({ ...p, videoUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes PDF URL (optional)</label>
                    <input value={lesson.notesUrl}
                      onChange={e => setLesson(p => ({ ...p, notesUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={lesson.description} rows={2}
                      onChange={e => setLesson(p => ({ ...p, description: e.target.value }))}
                      placeholder="What will students learn?"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input type="number" min={1} value={lesson.order}
                        onChange={e => setLesson(p => ({ ...p, order: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-400 transition" />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input type="checkbox" id="isFree" checked={lesson.isFree}
                        onChange={e => setLesson(p => ({ ...p, isFree: e.target.checked }))}
                        className="w-4 h-4 accent-green-600" />
                      <label htmlFor="isFree" className="text-sm text-gray-700">Free preview</label>
                    </div>
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-green-700 transition disabled:opacity-50">
                    {submitting ? 'Adding...' : '+ Add lesson'}
                  </button>
                </form>
              </div>

              {/* Lessons list */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Lessons in this track ({trackLessons.length})
                </h2>
                {loadingL ? (
                  <div className="text-gray-400 text-sm">Loading...</div>
                ) : trackLessons.length === 0 ? (
                  <div className="text-gray-400 text-sm">No lessons yet. Add your first one!</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {trackLessons.sort((a, b) => a.order - b.order).map(l => (
                      <div key={l._id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-green-50 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {l.order}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{l.title}</p>
                          <p className="text-xs text-gray-400">{l.topic} {l.isFree && '· Free preview'}</p>
                        </div>
                        <button onClick={() => deleteLesson(l._id)}
                          className="text-red-400 hover:text-red-600 text-xs flex-shrink-0">
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ ADD QUESTIONS ═══════════════════════════════════ */}
      {tab === 'questions' && (
        <div>
          <TrackSelector
            value={selectedTrackQ}
            label="Select track to add questions to"
            onChange={id => { setSelectedTrackQ(id); fetchQuestionsForTrack(id) }}
          />

          {selectedTrackQ && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Add question form */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Add new question</h2>
                <form onSubmit={handleAddQuestion} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question text</label>
                    <textarea required value={question.text} rows={3}
                      onChange={e => setQuestion(p => ({ ...p, text: e.target.value }))}
                      placeholder="Enter the question..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 transition resize-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options (select correct one)</label>
                    <div className="flex flex-col gap-2">
                      {question.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="radio" name="correct" checked={question.correctIndex === idx}
                            onChange={() => setQuestion(p => ({ ...p, correctIndex: idx }))}
                            className="accent-green-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-500 w-5">{String.fromCharCode(65 + idx)}.</span>
                          <input
                            required value={opt}
                            onChange={e => updateOption(idx, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                            className={`flex-1 px-3 py-2 rounded-xl border text-sm focus:outline-none transition ${
                              question.correctIndex === idx
                                ? 'border-green-400 bg-green-50 focus:border-green-500'
                                : 'border-gray-200 focus:border-blue-400'
                            }`} />
                        </div>
                      ))}
                      <p className="text-xs text-gray-400">Select the radio button next to the correct answer</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
                    <textarea value={question.explanation} rows={2}
                      onChange={e => setQuestion(p => ({ ...p, explanation: e.target.value }))}
                      placeholder="Why is this the correct answer?"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 transition resize-none" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Round</label>
                      <select value={question.round}
                        onChange={e => setQuestion(p => ({ ...p, round: e.target.value }))}
                        className="w-full px-2 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-400 transition bg-white">
                        {ROUNDS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
                      <select value={question.difficulty}
                        onChange={e => setQuestion(p => ({ ...p, difficulty: e.target.value }))}
                        className="w-full px-2 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-400 transition bg-white">
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Topic</label>
                      <input value={question.topic}
                        onChange={e => setQuestion(p => ({ ...p, topic: e.target.value }))}
                        placeholder="e.g. DSA"
                        className="w-full px-2 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-400 transition" />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition disabled:opacity-50">
                    {submitting ? 'Adding...' : '+ Add question'}
                  </button>
                </form>
              </div>

              {/* Questions list */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Questions in this track ({trackQuestions.length})
                </h2>
                {loadingQ ? (
                  <div className="text-gray-400 text-sm">Loading...</div>
                ) : trackQuestions.length === 0 ? (
                  <div className="text-gray-400 text-sm">No questions yet. Add some!</div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
                    {trackQuestions.map((q, i) => (
                      <div key={q._id} className="bg-white border border-gray-200 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm text-gray-900 font-medium leading-snug flex-1">
                            {i + 1}. {q.text}
                          </p>
                          <button onClick={() => deleteQuestion(q._id)}
                            className="text-red-400 hover:text-red-600 text-xs flex-shrink-0">
                            Delete
                          </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {q.options?.map((opt, idx) => (
                            <span key={idx} className={`text-xs px-2 py-0.5 rounded-lg ${
                              idx === q.correctIndex
                                ? 'bg-green-100 text-green-700 font-medium'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {String.fromCharCode(65 + idx)}. {opt}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-1.5">
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{q.round}</span>
                          <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{q.difficulty}</span>
                          {q.topic && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{q.topic}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ CREATE MOCK TEST ════════════════════════════════ */}
      {tab === 'mocktest' && (
        <div>
          <TrackSelector
            value={selectedTrackM}
            label="Select track to create mock test for"
            onChange={id => { setSelectedTrackM(id); fetchTestsForTrack(id) }}
          />

          {selectedTrackM && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Mock test form */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Create mock test</h2>

                {mockQuestions.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                    ⚠️ No questions found for this track. Please add questions first from the <strong>Add questions</strong> tab.
                  </div>
                ) : (
                  <form onSubmit={handleCreateMockTest} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test title</label>
                      <input required value={mockTest.title}
                        onChange={e => setMockTest(p => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. TCS NQT Mock Test 1"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input type="number" min={5} value={mockTest.duration}
                          onChange={e => setMockTest(p => ({ ...p, duration: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Passing score (%)</label>
                        <input type="number" min={1} max={100} value={mockTest.passingScore}
                          onChange={e => setMockTest(p => ({ ...p, passingScore: Number(e.target.value) }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 transition" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="negMark" checked={mockTest.negativeMarking}
                        onChange={e => setMockTest(p => ({ ...p, negativeMarking: e.target.checked }))}
                        className="w-4 h-4 accent-purple-600" />
                      <label htmlFor="negMark" className="text-sm text-gray-700">Negative marking (−0.25 per wrong)</label>
                    </div>

                    {/* Sections */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Assign questions to sections
                        <span className="text-xs text-gray-400 ml-2">
                          ({sections.reduce((s, sec) => s + sec.questions.length, 0)} / {mockQuestions.length} assigned)
                        </span>
                      </label>

                      {sections.map((section, si) => (
                        <div key={si} className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                            <input
                              value={section.name}
                              onChange={e => updateSection(si, 'name', e.target.value)}
                              className="font-medium text-sm text-gray-800 bg-transparent border-none outline-none w-32"
                            />
                            <span className="text-xs text-gray-500">
                              {section.questions.length} questions selected
                            </span>
                          </div>
                          <div className="p-3 max-h-48 overflow-y-auto">
                            {mockQuestions
                              .filter(q => q.round === section.name.toLowerCase() ||
                                sections.every((s, i) => i === si || !s.questions.includes(q._id)) ||
                                section.questions.includes(q._id))
                              .map(q => (
                                <label key={q._id} className="flex items-start gap-2 mb-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={section.questions.includes(q._id)}
                                    onChange={() => toggleQuestionInSection(si, q._id)}
                                    className="mt-0.5 accent-purple-600 flex-shrink-0"
                                  />
                                  <span className="text-xs text-gray-700 leading-snug">{q.text}</span>
                                  <span className="text-xs text-gray-400 flex-shrink-0">[{q.round}]</span>
                                </label>
                              ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>

                    <button type="submit" disabled={submitting}
                      className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-purple-700 transition disabled:opacity-50">
                      {submitting ? 'Creating...' : '🧪 Create mock test'}
                    </button>
                  </form>
                )}
              </div>

              {/* Existing tests */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Existing tests ({trackTests.length})
                </h2>
                {trackTests.length === 0 ? (
                  <div className="text-gray-400 text-sm">No mock tests yet for this track.</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {trackTests.map(t => (
                      <div key={t._id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t.totalQuestions} questions · {t.duration} min · Pass: {t.passingScore}%
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {t.sections?.map(s => (
                            <span key={s.name} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                              {s.name}: {s.questionCount}q
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
