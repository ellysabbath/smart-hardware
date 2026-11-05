import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../types'
import { KEYS, load, save, seedUsers } from '../lib/storage'
import { uid } from '../lib/utils'

interface AuthContextType {
  user: User | null
  users: User[]
  setUsers: (users: User[]) => void
  login: (username: string, password: string) => boolean
  register: (data: Omit<User, 'id' | 'active' | 'role'> & { role?: User['role'] }) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsersState] = useState<User[]>(() => load(KEYS.users, seedUsers))
  const [user, setUser] = useState<User | null>(() => load(KEYS.currentUser, null))

  useEffect(() => save(KEYS.users, users), [users])

  useEffect(() => {
    if (user) save(KEYS.currentUser, user)
    else localStorage.removeItem(KEYS.currentUser)
  }, [user])

  const setUsers = (u: User[]) => setUsersState(u)

  const login = (username: string, password: string) => {
    const found = users.find(u => u.username === username && u.password === password)
    if (found && found.active) {
      setUser(found)
      return true
    }
    return false
  }

  const register = (data: Omit<User, 'id' | 'active' | 'role'> & { role?: User['role'] }) => {
    // Hakikisha username haijatumika
    if (users.some(u => u.username === data.username)) {
      return false
    }
    
    // Kama hana branchId (mfano kama ni seller au warehouse), weka default au mruhusu admin amsaidie baadaye
    // Kwa mfumo huu, tunaweka active: false kwanza ili Admin amridhie
    const newUser: User = {
      id: uid(),
      name: data.name,
      username: data.username,
      password: data.password,
      role: data.role || 'seller',
      branchId: data.branchId,
      active: false, // Mpya hawezi kuingia mpaka Admin am-approve
    }
    
    setUsersState(prev => [...prev, newUser])
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, users, setUsers, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}