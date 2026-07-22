import { Link } from 'react-router-dom'
import {
  Heart,
  ThumbsDown,
  MessageCircle,
  Eye,
  User,
} from 'lucide-react'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const truncateContent = (content, maxLength = 200) => {
  if (content.length <= maxLength) return content
  return `${content.slice(0, maxLength).trim()}…`
}

const PostCard = ({ post, onLike, onDislike, isLiking, userReaction }) => {
  const authorName = post.author?.name || 'Unknown'
  const authorUsername = post.author?.username || 'user'
  const isLiked = userReaction === 'like'
  const isDisliked = userReaction === 'dislike'

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-lg dark:hover:shadow-black/20">
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <User size={20} />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{authorName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              @{authorUsername} · {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        <Link to={`/post/${post._id}`} state={{ post }} className="block group">
          <h2 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
            {post.title}
          </h2>
          {post.blog_image && (
            <div className="mb-4 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
              <img
                src={post.blog_image}
                alt={post.title}
                className="h-56 w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            </div>
          )}
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            {truncateContent(post.content)}
          </p>
          {post.content.length > 200 && (
            <span className="mt-2 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
              Read more
            </span>
          )}
        </Link>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onLike(post._id)}
            disabled={isLiking}
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
            onClick={() => onDislike(post._id)}
            disabled={isLiking}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50 ${
              isDisliked
                ? 'text-black hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ThumbsDown size={18} className={isDisliked ? 'fill-current' : ''} />
            <span>{post.dislikes_count ?? 0}</span>
          </button>
          <Link
            to={`/post/${post._id}`}
            state={{ post }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
          >
            <MessageCircle size={18} />
            <span>{post.comment_count ?? 0}</span>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
          <Eye size={18} />
          <span>{post.views_count ?? 0}</span>
        </div>
      </div>
    </article>
  )
}

export default PostCard
