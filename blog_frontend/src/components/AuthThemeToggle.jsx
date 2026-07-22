import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const AuthThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed right-4 top-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}

export default AuthThemeToggle
