import { useState, useEffect } from 'react'
import api from '../services/api.js'

export default function AdminDashboard() {
  const [stats, setStats]       = useState(null)
  const [users, setUsers]       = useState([])
  const [tracks, setTracks]     = useState([])
  const [tab, setTab]           = useState('stats')
  const [alert, setAlert]       = useState({ companyName: '', role: '', date: '', branches: '', gradYear: '' })
  const [sending, setSending]   = useState(false)
  const [message, setMessage]   = useState('')

  useEffect(() => {
    api.get('/admin/stats').then(setStats)
  }, [])

  const loadUsers = () => {
    api.get('/admin/users').then(setUsers)
    setTab('users')
  }

  const loadTracks = async () => {
    try {
      const companies = await api.get('/companies')
      const all = []
      for (const c of companies) {
        const tracks = await api.get(`/tracks/company/${c._id}`)
        if (Array.isArray(tracks)) all.push(...tracks)
      }
  
      // Also fetch draft tracks via the instructor /tracks/my won't work for admin
      // So we need a separate admin endpoint — use this workaround:
      // Get all tracks by fetching each company's tracks including drafts
      setTracks(all)
    } catch (err) {
      console.error('Failed to load tracks:', err)
    }
    setTab('tracks')
  }

  const approveTrack = async (trackId) => {
    try {
      await api.patch(`/admin/tracks/${trackId}/approve`)
      setTracks(prev => prev.map(t =>
        t._id === trackId ? { ...t, status: 'published' } : t
      ))
      setMessage('✓ Track approved and published!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error: ' + (err.message || 'Failed to approve'))
    }
  }

  const rejectTrack = async (trackId) => {
    try {
      await api.patch(`/admin/tracks/${trackId}/approve`, { status: 'draft' })
      setTracks(prev => prev.map(t =>
        t._id === trackId ? { ...t, status: 'draft' } : t
      ))
      showMsg('Track unpublished — moved back to draft.')
    } catch (err) {
      setMessage('Error: ' + err.message)
    }
  }

  const changeRole = async (userId, role) => {
    await api.patch(`/admin/users/${userId}/role`, { role })
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u))
  }

  const sendAlert = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await api.post('/admin/drive-alert', {
        ...alert,
        branches: alert.branches.split(',').map(b => b.trim()),
        gradYear: Number(alert.gradYear) || undefined,
      })
      setMessage(res.message)
      setAlert({ companyName: '', role: '', date: '', branches: '', gradYear: '' })
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSending(false)
    }
  }

  const TABS = [
    { id: 'stats',  label: '📊 Stats',          onClick: () => setTab('stats') },
    { id: 'tracks', label: '✅ Approve tracks',  onClick: loadTracks },
    { id: 'users',  label: '👥 Users',           onClick: loadUsers },
    { id: 'alert',  label: '📢 Drive alert',     onClick: () => setTab('alert') },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the entire PlacePrep platform</p>
      </div>

      {message && (
        <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={t.onClick}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              tab === t.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Stats ── */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ['Total users',      stats.totalUsers,       'bg-blue-50   text-blue-700'],
            ['Companies',        stats.totalCompanies,   'bg-purple-50 text-purple-700'],
            ['Published tracks', stats.totalTracks,      'bg-green-50  text-green-700'],
            ['Paid enrollments', stats.totalEnrollments, 'bg-amber-50  text-amber-700'],
          ].map(([label, value, color]) => (
            <div key={label} className={`${color} rounded-2xl p-5 text-center`}>
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-xs mt-1 opacity-80">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Approve Tracks ── */}
      {tab === 'tracks' && (
        <div>
          {tracks.length === 0
            ? <div className="text-center py-16 text-gray-400">
                No tracks found. Instructors need to create tracks first.
              </div>
            : <div className="flex flex-col gap-3">
                {/* Draft tracks first */}
                {tracks.filter(t => t.status === 'draft').length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                      Pending approval ({tracks.filter(t => t.status === 'draft').length})
                    </p>
                    {tracks.filter(t => t.status === 'draft').map(t => (
                      <div key={t._id}
                        className="bg-white border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{t.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {t.company?.name || 'Unknown company'} · {t.category} · {t.totalLessons} lessons
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                          <button
                            onClick={() => approveTrack(t._id)}
                            className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-green-700 transition">
                            ✓ Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Published tracks */}
                {tracks.filter(t => t.status === 'published').length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1 mt-4">
                      Published ({tracks.filter(t => t.status === 'published').length})
                    </p>
                    {tracks.filter(t => t.status === 'published').map(t => (
                      <div key={t._id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{t.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {t.company?.name || 'Unknown company'} · {t.category} · {t.totalLessons} lessons
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                            ✓ Published
                          </span>
                          <button
                            onClick={() => rejectTrack(t._id)}
                            className="border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-red-50 transition">
                            Unpublish
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
          }
        </div>
      )}

      {/* ── Users ── */}
      {tab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {users.length === 0
            ? <div className="text-center py-10 text-gray-400">Loading users...</div>
            : <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Branch</th>
                    <th className="px-4 py-3 text-left">Current role</th>
                    <th className="px-4 py-3 text-left">Change role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.branch || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                          u.role === 'admin'      ? 'bg-red-50 text-red-700 border-red-200' :
                          u.role === 'instructor' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={e => changeRole(u._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-indigo-400">
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* ── Drive Alert ── */}
      {tab === 'alert' && (
        <div className="max-w-lg">
          <p className="text-sm text-gray-500 mb-4">
            Send an email drive alert to all eligible students instantly.
          </p>
          <form onSubmit={sendAlert} className="flex flex-col gap-4">
            {[
              ['companyName', 'Company name',            'e.g. TCS'],
              ['role',        'Role / position',         'e.g. System Engineer'],
              ['date',        'Drive date',              'e.g. April 15, 2025'],
              ['branches',    'Eligible branches',       'CSE, IT, ECE'],
              ['gradYear',    'Graduation year (optional)', '2025'],
            ].map(([field, label, placeholder]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  value={alert[field]}
                  onChange={e => setAlert(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 transition"
                />
              </div>
            ))}
            <button
              type="submit" disabled={sending}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-50">
              {sending ? 'Sending...' : '📢 Send drive alert to all students'}
            </button>
          </form>
        </div>
      )}

    </div>
  )
}