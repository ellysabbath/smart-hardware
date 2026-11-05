import { type ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { Menu, AlertTriangle, ClipboardList } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  title: string
}

export default function Layout({ children, title }: LayoutProps) {
  const { user } = useAuth()
  const { monthlyReports, workingPeriods } = useData()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const needsSubmission = user
    ? monthlyReports.filter(r => r.sellerId === user.id && r.status === 'draft')
    : []
  const pendingEditRequests = user
    ? monthlyReports.filter(r => r.editRequest?.status === 'pending')
    : []
  const activePeriod = workingPeriods.find(p => p.status === 'open')

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
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
            {activePeriod && (
              <span className="hidden md:inline text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1 whitespace-nowrap">
                Kipindi: <b>{activePeriod.month}/{activePeriod.year}</b>
              </span>
            )}
          </div>
          <div className="text-xs lg:text-sm text-slate-500 hidden sm:block whitespace-nowrap">
            {new Date().toLocaleDateString('sw-TZ', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4 lg:p-6">
          {needsSubmission.length > 0 && user?.role === 'seller' && (
            <Link
              to="/monthly-reports"
              className="block mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2"
            >
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                Una ripoti <b>{needsSubmission.length}</b> ambayo bado ni rasimu. Tafadhali wasilisha kabla ya deadline.
              </div>
            </Link>
          )}

          {pendingEditRequests.length > 0 && user?.role === 'admin' && (
            <Link
              to="/monthly-reports"
              className="block mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2"
            >
              <ClipboardList size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                Maombi <b>{pendingEditRequests.length}</b> ya mabadiliko ya ripoti yanasubiri uamuzi wako.
              </div>
            </Link>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}