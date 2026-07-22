import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthThemeToggle from '../components/AuthThemeToggle'

const Login = () => {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <AuthThemeToggle />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
            B
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue to BlogFeed
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="login-email"
              name="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="login-password"
              name="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn size={18} />
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
