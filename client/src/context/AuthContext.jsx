import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getMe()
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (creds) => {
    const data = await authService.login(creds)
    // API returns { user: {...} } and axios interceptor returns data directly
    // so data = { user: {...} }, meaning data.user is the actual user
    const user = data.user || data
    console.log('actual user:', user)
    setUser(user)
    return user
  }
  
  const register = async (formData) => {
    const data = await authService.register(formData)
    const user = data.user || data
    console.log('actual user:', user)
    setUser(user)
    return user
  }
  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }))

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}