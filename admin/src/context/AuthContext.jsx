import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_user') || 'null') } catch { return null }
  })

  useEffect(() => {
    if (token) localStorage.setItem('admin_token', token)
    else localStorage.removeItem('admin_token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('admin_user', JSON.stringify(user))
    else localStorage.removeItem('admin_user')
  }, [user])

  const value = useMemo(() => ({ token, setToken, user, setUser, logout: () => { setToken(''); setUser(null) } }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

