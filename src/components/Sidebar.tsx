import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import {
  LogOut, LayoutDashboard, ShoppingCart, Receipt, Package, Warehouse,
  Truck, ShoppingBag, Users, CreditCard, Heart, CalendarClock,
  FileBarChart, TrendingUp, UserCog, ShieldCheck, Settings, FileText,
  Boxes, ClipboardCheck, X, Store
} from 'lucide-react'
import type { Role } from '../types'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const navByRole: Record<Role, { features: NavItem[] }> = {
  admin: {
    features: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/branches', label: 'Maduka (Branches)', icon: Store },
      { to: '/pos', label: 'POS', icon: ShoppingCart },
      { to: '/sales', label: 'Mauzo', icon: Receipt },
      { to: '/products', label: 'Bidhaa', icon: Package },
      { to: '/stock', label: 'Stoo', icon: Warehouse },
      { to: '/grn', label: 'GRN', icon: Truck },
      { to: '/purchases', label: 'Ununuzi', icon: ShoppingBag },
      { to: '/suppliers', label: 'Wasambazaji', icon: Truck },
      { to: '/customers', label: 'Wateja', icon: Users },
      { to: '/expenses', label: 'Gharama', icon: CreditCard },
      { to: '/zakat', label: 'Zaka', icon: Heart },
      { to: '/working-period', label: 'Muda wa Kazi', icon: CalendarClock },
      { to: '/monthly-reports', label: 'Ripoti za Mwezi', icon: FileBarChart },
      { to: '/reports', label: 'Ripoti', icon: FileText },
      { to: '/profit-loss', label: 'Faida/Hasara', icon: TrendingUp },
      { to: '/users', label: 'Watumiaji', icon: UserCog },
      { to: '/audit', label: 'Audit', icon: ShieldCheck },
      { to: '/settings', label: 'Mipangilio', icon: Settings },
    ],
  },
  seller: {
    features: [
      { to: '/pos', label: 'POS', icon: ShoppingCart },
      { to: '/quotations', label: 'Nukuu', icon: FileText },
      { to: '/sales', label: 'Mauzo', icon: Receipt },
      { to: '/products', label: 'Bidhaa', icon: Package },
      { to: '/customers', label: 'Wateja', icon: Users },
      { to: '/expenses', label: 'Gharama', icon: CreditCard },
      { to: '/monthly-reports', label: 'Ripoti za Mwezi', icon: FileBarChart },
    ],
  },
  warehouse: {
    features: [
      { to: '/stock', label: 'Stoo', icon: Warehouse },
      { to: '/grn', label: 'GRN', icon: Truck },
      { to: '/stock-take', label: 'Hesabu', icon: ClipboardCheck },
      { to: '/purchases', label: 'Ununuzi', icon: ShoppingBag },
      { to: '/suppliers', label: 'Wasambazaji', icon: Truck },
      { to: '/products', label: 'Bidhaa', icon: Boxes },
    ],
  },
  owner: {
    features: [
      { to: '/owner', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/sales', label: 'Mauzo', icon: Receipt },
      { to: '/products', label: 'Bidhaa', icon: Package },
      { to: '/expenses', label: 'Gharama', icon: CreditCard },
      { to: '/zakat', label: 'Zaka', icon: Heart },
      { to: '/monthly-reports', label: 'Ripoti za Mwezi', icon: FileBarChart },
      { to: '/profit-loss', label: 'Faida/Hasara', icon: TrendingUp },
      { to: '/reports', label: 'Ripoti', icon: FileText },
    ],
  },
}

const roleLabel = (role: Role) => ({
  admin: 'Msimamizi',
  seller: 'Muuzaji',
  warehouse: 'Mhazini',
  owner: 'Mmiliki',
}[role])

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const { monthlyReports } = useData()
  const location = useLocation()
  const navigate = useNavigate()

  if (!user) return null
  const items = navByRole[user.role].features

  const pendingEdits = monthlyReports.filter(r => r.editRequest?.status === 'pending')
  const drafts = monthlyReports.filter(r => r.sellerId === user.id && r.status === 'draft')

  const badgeFor = (to: string) => {
    if (to === '/monthly-reports') {
      if (user.role === 'seller' && drafts.length > 0) return drafts.length
      if (user.role === 'admin' && pendingEdits.length > 0) return pendingEdits.length
    }
    return 0
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 bottom-0 z-40 w-64
          bg-[#1f2937] text-slate-300
          flex flex-col transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="bg-[#334155] px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-white text-lg tracking-wide">
           SMART HARDWARE
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded hover:bg-white/10 text-white"
            aria-label="Funga menyu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700">
          <div className="w-11 h-11 rounded-full bg-emerald-300 flex items-center justify-center text-[#1f2937] font-bold text-lg flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate uppercase">
              {user.username}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {roleLabel(user.role)}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          <Link
            to={
              user.role === 'admin' ? '/dashboard'
                : user.role === 'seller' ? '/pos'
                : user.role === 'warehouse' ? '/stock'
                : '/owner'
            }
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
              location.pathname === '/dashboard' ||
              location.pathname === '/pos' ||
              location.pathname === '/stock' ||
              location.pathname === '/owner'
                ? 'bg-[#334155] text-white border-l-2 border-emerald-400'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <div className="px-4 pt-5 pb-2 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
            Features
          </div>

          {items.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.to
            const badge = badgeFor(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  active
                    ? 'bg-[#334155] text-white border-l-2 border-emerald-400'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={18} />
                  <span className="truncate">{item.label}</span>
                </div>
                {badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:bg-red-500/10 w-full px-3 py-2 rounded"
          >
            <LogOut size={16} /> Toka
          </button>
        </div>
      </aside>
    </>
  )
}