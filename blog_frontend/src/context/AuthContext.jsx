import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAccessToken, getAccessToken } from '../api/api'

const AuthContext = createContext(null)

const PROFILE_KEY = 'userProfile'

const loadStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY))
  } catch {
    return null
  }
}

const persistProfile = (profile) => {
  if (profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } else {
    localStorage.removeItem(PROFILE_KEY)
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(loadStoredProfile)
  const [loading, setLoading] = useState(true)

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates }
      persistProfile(next)
      return next
    })
  }

  const fetchMe = async () => {
    const token = getAccessToken()
    if (!token) {
      setUser(null)
      return null
    }

    const { data } = await api.get('/auth/getMe')
    const userData = { id: data.decoded.id }
    setUser(userData)

    const stored = loadStoredProfile()
    if (stored?.id === userData.id) {
      setProfile(stored)
    } else {
      setProfile({ id: userData.id })
      persistProfile({ id: userData.id })
    }

    return userData
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchMe()
      } catch {
        setAccessToken(null)
        setUser(null)
        setProfile(null)
        persistProfile(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAccessToken(data.accessToken)
    const userData = await fetchMe()

    const stored = loadStoredProfile()
    if (stored?.id === userData.id) {
      updateProfile({ ...stored, email })
    } else {
      updateProfile({ id: userData.id, email })
    }

    return data
  }

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    setAccessToken(data.accessToken)
    const userData = await fetchMe()

    updateProfile({
      id: userData.id,
      username: formData.username,
      name: formData.name,
      email: formData.email,
      about_yourSelf: formData.about_yourSelf || '',
    })

    return data
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    setProfile(null)
    persistProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, register, logout, fetchMe, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
