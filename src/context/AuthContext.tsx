import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type User } from '../types'
import { load, save, KEYS } from '../lib/storage'
import { seedUsers } from '../lib/seed'

interface AuthCtx {
  user: User | null
  users: User[]
  login: (u: string, p: string) => boolean
  logout: () => void
  setUsers: (u: User[]) => void
}

const Ctx = createContext<AuthCtx>(null as any)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsersState] = useState<User[]>(() => {
    const stored = load<User[]>(KEYS.users, [])
    if (stored.length === 0) {
      save(KEYS.users, seedUsers)
      return seedUsers
    }
    return stored
  })
  const [user, setUser] = useState<User | null>(() => load<User | null>(KEYS.currentUser, null))

  useEffect(() => {
    save(KEYS.currentUser, user)
  }, [user])

  const setUsers = (u: User[]) => {
    setUsersState(u)
    save(KEYS.users, u)
  }

  const login = (username: string, password: string) => {
    const found = users.find(u => u.username === username && u.password === password && u.active)
    if (found) {
      setUser(found)
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  return <Ctx.Provider value={{ user, users, login, logout, setUsers }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)