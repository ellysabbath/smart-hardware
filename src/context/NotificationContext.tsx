import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Notification, KundiNotification } from '../types'
import { notifications as notificationsDemo } from '../data/demo'

interface NotificationCtx {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllRead: () => void
  futa: (id: string) => void
  futaZote: () => void
  getNotification: (id: string) => Notification | undefined
  filterByKundi: (kundi: KundiNotification | 'zote') => Notification[]
  search: (q: string) => Notification[]
}

const NotificationContext = createContext<NotificationCtx | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationsDemo
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const futa = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const futaZote = () => {
    setNotifications([])
  }

  const getNotification = (id: string) =>
    notifications.find((n) => n.id === id)

  const filterByKundi = (kundi: KundiNotification | 'zote') => {
    if (kundi === 'zote') return notifications
    return notifications.filter((n) => n.kundi === kundi)
  }

  const search = (q: string) => {
    const query = q.toLowerCase().trim()
    if (!query) return notifications
    return notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        (n.maelezo?.toLowerCase().includes(query) ?? false)
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllRead,
        futa,
        futaZote,
        getNotification,
        filterByKundi,
        search,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx)
    throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}