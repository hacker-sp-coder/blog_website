import { useCallback, useEffect, useState } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

const getStorageKey = (userId) => `reactions_${userId}`

const loadReactions = (userId) => {
  if (!userId) return {}
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(userId)) || '{}')
  } catch {
    return {}
  }
}

const saveReactions = (userId, reactions) => {
  if (!userId) return
  localStorage.setItem(getStorageKey(userId), JSON.stringify(reactions))
}

export const useReactions = () => {
  const { user } = useAuth()
  const [reactions, setReactions] = useState({})
  const [reactingId, setReactingId] = useState(null)

  useEffect(() => {
    if (user?.id) {
      setReactions(loadReactions(user.id))
    } else {
      setReactions({})
    }
  }, [user?.id])

  const getReaction = useCallback(
    (blogId) => reactions[blogId] ?? null,
    [reactions],
  )

  const toggleReaction = useCallback(
    async (blogId, action, onSuccess) => {
      if (!user) return

      setReactingId(blogId)
      try {
        const { data } = await api.post(`/blog/reactions/${blogId}`, { action })

        const nextReaction = data.msg === 'Reaction removed' ? null : action
        setReactions((prev) => {
          const updated = { ...prev }
          if (nextReaction === null) {
            delete updated[blogId]
          } else {
            updated[blogId] = nextReaction
          }
          saveReactions(user.id, updated)
          return updated
        })

        onSuccess?.(data.likes, data.dislikes)
      } finally {
        setReactingId(null)
      }
    },
    [user],
  )

  return { getReaction, toggleReaction, reactingId }
}
