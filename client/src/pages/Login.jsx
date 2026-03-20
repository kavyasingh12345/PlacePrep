import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Login to continue your placement prep</p>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"/></div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">or</div>
        </div>

        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.53 24.56c0-1.67-.15-3.27-.42-4.82H24v9.12h13.22c-.57 3.01-2.3 5.56-4.9 7.27v6.04h7.93c4.64-4.27 7.28-10.57 7.28-17.61z"/><path fill="#34A853" d="M24 48c6.63 0 12.19-2.2 16.25-5.95l-7.93-6.04c-2.2 1.47-5.01 2.34-8.32 2.34-6.4 0-11.82-4.32-13.75-10.13H2.04v6.24C6.08 42.87 14.41 48 24 48z"/><path fill="#FBBC05" d="M10.25 28.22A14.37 14.37 0 0 1 9.75 24c0-1.47.25-2.9.5-4.22v-6.24H2.04A24.02 24.02 0 0 0 0 24c0 3.87.93 7.53 2.04 10.46l8.21-6.24z"/><path fill="#EA4335" d="M24 9.53c3.61 0 6.84 1.24 9.39 3.67l7.03-7.03C36.18 2.38 30.62 0 24 0 14.41 0 6.08 5.13 2.04 13.54l8.21 6.24C12.18 13.85 17.6 9.53 24 9.53z"/></svg>
          Continue with Google
        </a>

        <p className="mt-5 text-center text-sm text-gray-500">
          No account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}