import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import api from '../api/api'
import PostCard from '../components/PostCard'
import { useReactions } from '../hooks/useReactions'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const { getReaction, toggleReaction, reactingId } = useReactions()

  const fetchFeed = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true)
      else setLoading(true)

      const { data } = await api.get('/blog/feed', {
        params: { page: pageNum, limit: 10 },
      })

      setPosts((prev) => (append ? [...prev, ...data.data] : data.data))
      setTotalPages(data.totalPages)
      setPage(data.page)
      setError('')
    } catch {
      setError('Failed to load feed. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  const handleReaction = (blogId, action) => {
    toggleReaction(blogId, action, (likes, dislikes) => {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === blogId
            ? { ...post, likes_count: likes, dislikes_count: dislikes }
            : post,
        ),
      )
    }).catch(() => {
      setError('Failed to update reaction.')
    })
  }

  const loadMore = () => {
    if (page < totalPages) {
      fetchFeed(page + 1, true)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your Feed</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Discover stories from the community
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchFeed(1, false)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">No posts yet. Be the first to write one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={(id) => handleReaction(id, 'like')}
              onDislike={(id) => handleReaction(id, 'dislike')}
              isLiking={reactingId === post._id}
              userReaction={getReaction(post._id)}
            />
          ))}

          {page < totalPages && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {loadingMore ? 'Loading...' : 'Load more posts'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Home
