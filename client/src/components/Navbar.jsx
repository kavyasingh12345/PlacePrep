import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
        Place<span className="text-gray-900">Prep</span>
      </Link>

      <div className="flex items-center gap-6 text-sm">
        {user ? (
          <>
            <Link to="/companies"   className="text-gray-600 hover:text-indigo-600 transition">Companies</Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-indigo-600 transition">Leaderboard</Link>
            <Link to="/progress"    className="text-gray-600 hover:text-indigo-600 transition">My Progress</Link>
            {user.role === 'instructor' && (
              <Link to="/instructor" className="text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-indigo-600 transition">Admin</Link>
            )}
            <Link to="/dashboard" className="flex items-center gap-2">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                : <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">{user.name[0]}</div>
              }
            </Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition text-xs">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="text-gray-600 hover:text-indigo-600 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-indigo-700 transition">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}