import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  ThumbsDown,
  MessageCircle,
  Eye,
  User,
} from 'lucide-react'
import api from '../api/api'
import CommentSection from '../components/CommentSection'
import { useReactions } from '../hooks/useReactions'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const PostDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const [post, setPost] = useState(location.state?.post || null)
  const [loading, setLoading] = useState(!location.state?.post)
  const [error, setError] = useState('')
  const { getReaction, toggleReaction, reactingId } = useReactions()

  const userReaction = getReaction(id)
  const isLiked = userReaction === 'like'
  const isDisliked = userReaction === 'dislike'

  useEffect(() => {
    const incrementView = async () => {
      const viewedKey = `viewed_${id}`
      if (sessionStorage.getItem(viewedKey)) return

      try {
        await api.post(`/blog/views/${id}`)
        sessionStorage.setItem(viewedKey, 'true')
        setPost((prev) =>
          prev ? { ...prev, views_count: (prev.views_count ?? 0) + 1 } : prev,
        )
      } catch {
        // View increment is non-critical
      }
    }

    incrementView()
  }, [id])

  useEffect(() => {
    if (post) return

    const findPostInFeed = async () => {
      try {
        let currentPage = 1
        let totalPages = 1

        while (currentPage <= totalPages) {
          const { data } = await api.get('/blog/feed', {
            params: { page: currentPage, limit: 10 },
          })

          totalPages = data.totalPages
          const found = data.data.find((b) => b._id === id)
          if (found) {
            setPost(found)
            setLoading(false)
            return
          }
          currentPage += 1
        }

        setError('Post not found.')
      } catch {
        setError('Failed to load post.')
      } finally {
        setLoading(false)
      }
    }

    findPostInFeed()
  }, [id, post])

  const handleReaction = (action) => {
    toggleReaction(id, action, (likes, dislikes) => {
      setPost((prev) => ({
        ...prev,
        likes_count: likes,
        dislikes_count: dislikes,
      }))
    }).catch(() => {
      setError('Failed to update reaction.')
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">{error || 'Post not found.'}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft size={16} />
          Back to feed
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft size={16} />
        Back to feed
      </Link>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <User size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {post.author?.name || 'Unknown'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                @{post.author?.username || 'user'} · {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">
            {post.title}
          </h1>

          {post.blog_image && (
            <div className="mb-8 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
              <img
                src={post.blog_image}
                alt={post.title}
                className="max-h-[480px] w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-slate max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {post.content}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 sm:px-8 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleReaction('like')}
              disabled={reactingId === id}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                isLiked
                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/20 dark:hover:text-red-400'
              }`}
            >
              <Heart size={18} className={isLiked ? 'fill-red-500' : ''} />
              <span>{post.likes_count ?? 0}</span>
            </button>
            <button
              type="button"
              onClick={() => handleReaction('dislike')}
              disabled={reactingId === id}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
                isDisliked
                  ? 'text-black hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ThumbsDown size={18} className={isDisliked ? 'fill-current' : ''} />
              <span>{post.dislikes_count ?? 0}</span>
            </button>
            <div className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
              <MessageCircle size={18} />
              <span>{post.comment_count ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
            <Eye size={18} />
            <span>{post.views_count ?? 0} views</span>
          </div>
        </div>
      </article>

      <CommentSection blogId={id} />
    </div>
  )
}

export default PostDetail
