import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image, PenSquare } from 'lucide-react'
import api from '../api/api'

const CreateBlog = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setImage(null)
      setPreview(null)
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    setSubmitting(true)
    setError('')

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('content', content.trim())
    if (image) {
      formData.append('blog_image', image)
    }

    try {
      await api.post('/blog/blog_post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate('/')
    } catch {
      setError('Failed to create post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <PenSquare size={20} />
          <span className="text-sm font-medium">New Post</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Write a blog post</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Share your thoughts with the community
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Cover Image (optional)
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 transition-colors hover:border-blue-300 hover:bg-blue-50/30 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-600 dark:hover:bg-blue-950/20">
            <Image size={32} className="mb-2 text-slate-400 dark:text-slate-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Click to upload an image
            </span>
            <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              PNG, JPG, or WEBP
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {preview && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <img
                src={preview}
                alt="Preview"
                className="h-48 w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBlog
