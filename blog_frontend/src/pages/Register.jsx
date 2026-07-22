import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthThemeToggle from '../components/AuthThemeToggle'

const Register = () => {
  const { user, loading, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    about_yourSelf: '',
  })
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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <AuthThemeToggle />
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
            B
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join BlogFeed and start sharing your stories
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

          <div className="mb-4">
            <label htmlFor="reg-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reg-username" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>
            <input
              id="reg-username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reg-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reg-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="reg-about" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              About You (optional)
            </label>
            <textarea
              id="reg-about"
              name="about_yourSelf"
              value={form.about_yourSelf}
              onChange={handleChange}
              autoComplete="off"
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus size={18} />
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
