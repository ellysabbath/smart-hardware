import { type ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { Menu } from 'lucide-react'

export default function Layout({ children, title }: { children: ReactNode; title: string }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded hover:bg-slate-100"
              aria-label="Fungua menyu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base lg:text-lg font-semibold text-slate-800 truncate">
              {title}
            </h1>
          </div>
          <div className="text-xs lg:text-sm text-slate-500 hidden sm:block whitespace-nowrap">
            {new Date().toLocaleDateString('sw-TZ', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            })}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}