import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Footer from './Footer'
import SmsToast from './SmsToast'

export default function Layout({ role }: { role: 'mteja' | 'muuzaji' | 'mmiliki' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar role={role} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* SMS Toast — inaonekana juu ya kila kitu */}
      <SmsToast />
    </div>
  )
}