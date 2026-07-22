import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

const ThemeContext = createContext(null)

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
