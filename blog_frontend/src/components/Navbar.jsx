import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, PenSquare, LogOut, User, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            B
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:inline">
            BlogFeed
          </span>
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-1">
          <NavLink to="/" end className={linkClass}>
            <Home size={18} />
            <span className="hidden sm:inline">Feed</span>
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            <PenSquare size={18} />
            <span className="hidden sm:inline">Write</span>
          </NavLink>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`
            }
          >
            <User size={18} />
          </NavLink>
        </nav>

        <div className="ml-1 shrink-0 border-l border-slate-200 pl-3 dark:border-slate-700">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
