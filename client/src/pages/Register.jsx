import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'Mech', 'Civil', 'Other']
const YEARS    = [2025, 2026, 2027, 2028]

const ROLES = [
  {
    value: 'student',
    label: 'Student',
    desc:  'Browse companies, take mock tests, track progress',
    icon:  '🎓',
    color: 'border-indigo-400 bg-indigo-50',
    text:  'text-indigo-700',
  },
  {
    value: 'instructor',
    label: 'Instructor',
    desc:  'Create tracks, upload lessons, add questions',
    icon:  '👨‍🏫',
    color: 'border-green-400 bg-green-50',
    text:  'text-green-700',
  },
  {
    value: 'admin',
    label: 'Admin',
    desc:  'Manage users, approve tracks, send drive alerts',
    icon:  '🛡️',
    color: 'border-red-400 bg-red-50',
    text:  'text-red-700',
  },
]

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [step, setStep]       = useState(1)  // step 1 = pick role, step 2 = fill form
  const [form, setForm]       = useState({
    name: '', email: '', password: '',
    branch: '', college: '', gradYear: '',
    role: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleRoleSelect = (role) => {
    setForm(p => ({ ...p, role }))
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      console.log('registered user:', user)
  
      if (user?.role === 'admin')           navigate('/admin')
      else if (user?.role === 'instructor') navigate('/instructor')
      else                                  navigate('/companies')
  
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md">

        {/* Step 1 — Pick role */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Join PlacePrep</h1>
            <p className="text-sm text-gray-500 mb-6">Who are you signing up as?</p>

            <div className="flex flex-col gap-3">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  onClick={() => handleRoleSelect(r.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition hover:shadow-sm ${form.role === r.value ? r.color : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <span style={{fontSize:'24px'}}>{r.icon}</span>
                    <div>
                      <p className={`font-semibold text-sm ${form.role === r.value ? r.text : 'text-gray-900'}`}>
                        {r.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    </div>
                    <span className="ml-auto text-gray-400">→</span>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already registered?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
            </p>
          </>
        )}

        {/* Step 2 — Fill form */}
        {step === 2 && (
          <>
            {/* Header with selected role badge */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-gray-600 transition text-sm"
              >
                ←
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create your account</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-gray-500">Signing up as</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    form.role === 'admin'      ? 'bg-red-50 text-red-700 border-red-200' :
                    form.role === 'instructor' ? 'bg-green-50 text-green-700 border-green-200' :
                    'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {ROLES.find(r => r.value === form.role)?.icon} {form.role}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text" required
                  value={form.name} onChange={set('name')}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email" required
                  value={form.email} onChange={set('email')}
                  placeholder="you@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                />
              </div>

              {/* Branch + Grad year — only for student */}
              {form.role === 'student' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <select
                      required value={form.branch} onChange={set('branch')}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 transition bg-white"
                    >
                      <option value="">Select</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grad year</label>
                    <select
                      required value={form.gradYear} onChange={set('gradYear')}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 transition bg-white"
                    >
                      <option value="">Select</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* College — for student and instructor */}
              {(form.role === 'student' || form.role === 'instructor') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {form.role === 'instructor' ? 'Organization / College' : 'College name'}
                  </label>
                  <input
                    type="text"
                    value={form.college} onChange={set('college')}
                    placeholder={form.role === 'instructor' ? 'Where do you teach?' : 'Your college name'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 transition"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password" required minLength={8}
                  value={form.password} onChange={set('password')}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                />
              </div>

              {/* Role specific note */}
              {form.role === 'instructor' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
                  As an instructor you can create tracks and upload lessons. Your tracks go live after admin approval.
                </div>
              )}
              {form.role === 'admin' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  Admin accounts have full platform access — user management, track approval, and drive alerts.
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className={`w-full text-white py-2.5 rounded-xl font-medium text-sm transition disabled:opacity-50 ${
                  form.role === 'admin'      ? 'bg-red-600 hover:bg-red-700' :
                  form.role === 'instructor' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Creating account...' : `Create ${form.role} account`}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Already registered?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}