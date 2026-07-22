import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, AtSign, FileText, PenSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'
import PostCard from '../components/PostCard'
import { useReactions } from '../hooks/useReactions'

const Profile = () => {
  const { user, profile, updateProfile } = useAuth()
  const { getReaction, toggleReaction, reactingId } = useReactions()
  const [activeTab, setActiveTab] = useState('info')
  const [myPosts, setMyPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [postsLoaded, setPostsLoaded] = useState(false)

  const fetchMyPosts = async () => {
    if (!user?.id) return

    setLoadingPosts(true)
    try {
      let currentPage = 1
      let totalPages = 1
      const allPosts = []

      while (currentPage <= totalPages) {
        const { data } = await api.get('/blog/feed', {
          params: { page: currentPage, limit: 10 },
        })

        totalPages = data.totalPages
        const mine = data.data.filter((post) => {
          const authorId = post.author?._id || post.author
          return String(authorId) === String(user.id)
        })
        allPosts.push(...mine)
        currentPage += 1
      }

      setMyPosts(allPosts)

      if (allPosts.length > 0 && (!profile?.name || !profile?.username)) {
        const author = allPosts[0].author
        updateProfile({
          name: profile?.name || author?.name,
          username: profile?.username || author?.username,
        })
      }
    } finally {
      setLoadingPosts(false)
      setPostsLoaded(true)
    }
  }

  useEffect(() => {
    if (activeTab === 'posts' && !postsLoaded) {
      fetchMyPosts()
    }
  }, [activeTab, postsLoaded, user?.id])

  const handleReaction = (blogId, action) => {
    toggleReaction(blogId, action, (likes, dislikes) => {
      setMyPosts((prev) =>
        prev.map((post) =>
          post._id === blogId ? { ...post, likes_count: likes, dislikes_count: dislikes } : post,
        ),
      )
    })
  }

  const tabs = [
    { id: 'info', label: 'Profile', icon: User },
    { id: 'posts', label: 'My Posts', icon: FileText },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account and view your posts
        </p>
      </div>

      <div className="mb-6 flex gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 dark:border-slate-800">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <User size={36} />
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="flex items-start gap-3">
              <User size={18} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Name
                </p>
                <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                  {profile?.name || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AtSign size={18} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Username
                </p>
                <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                  {profile?.username ? `@${profile.username}` : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Email
                </p>
                <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                  {profile?.email || '—'}
                </p>
              </div>
            </div>

            {profile?.about_yourSelf && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  About
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {profile.about_yourSelf}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FileText size={16} />
              View My Posts
            </button>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          {loadingPosts ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
            </div>
          ) : myPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <PenSquare size={32} className="mx-auto mb-3 text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400">You haven&apos;t published any posts yet.</p>
              <Link
                to="/create"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Write your first post
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {myPosts.length} post{myPosts.length !== 1 ? 's' : ''} published
              </p>
              {myPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={(id) => handleReaction(id, 'like')}
                  onDislike={(id) => handleReaction(id, 'dislike')}
                  isLiking={reactingId === post._id}
                  userReaction={getReaction(post._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
