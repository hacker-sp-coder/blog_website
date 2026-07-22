import { useEffect, useState } from 'react'
import { Send, User } from 'lucide-react'
import api from '../api/api'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')

  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      const { data } = await api.get(`/blog/comments/getComment/${blogId}`, {
        params: { page: pageNum, limit: 10 },
      })

      const fetched = data.data || []
      setComments((prev) => (append ? [...prev, ...fetched] : fetched))
      setHasMore(fetched.length === 10)
    } catch {
      setError('Failed to load comments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [blogId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    setError('')

    try {
      await api.post(`/blog/comments/addComment/${blogId}`, {
        comment_content: newComment.trim(),
      })
      setNewComment('')
      setPage(1)
      await fetchComments(1, false)
    } catch {
      setError('Failed to add comment.')
    } finally {
      setSubmitting(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchComments(nextPage, true)
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-slate-100">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <User size={18} />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-white">
                <User size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {comment.userId?.name || 'User'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    @{comment.userId?.username || 'user'}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    · {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {comment.comment_content}
                </p>
              </div>
            </div>
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={loadMore}
              className="w-full rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Load more comments
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default CommentSection
