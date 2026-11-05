import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, Warehouse,
  FileText, Receipt, Wallet, TrendingUp, Shield, BarChart3, Heart, LogOut, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { type  Role } from '../types'

interface NavItem { to: string; label: string; icon: React.ReactNode; roles: Role[] }

const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['admin'] },
  { to: '/owner', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['owner'] },
  { to: '/pos', label: 'Mauzo (POS)', icon: <ShoppingCart size={18} />, roles: ['seller', 'admin'] },
  { to: '/quotations', label: 'Nukuu za Bei', icon: <FileText size={18} />, roles: ['seller', 'admin'] },
  { to: '/sales', label: 'Historia ya Mauzo', icon: <Receipt size={18} />, roles: ['seller', 'admin', 'owner'] },
  { to: '/products', label: 'Bidhaa', icon: <Package size={18} />, roles: ['admin', 'warehouse', 'seller', 'owner'] },
  { to: '/stock', label: 'Stoo', icon: <Warehouse size={18} />, roles: ['admin', 'warehouse'] },
  { to: '/stock-take', label: 'Hesabu ya Ghala', icon: <BarChart3 size={18} />, roles: ['admin', 'warehouse'] },
  { to: '/purchases', label: 'Ununuzi (LPO)', icon: <Truck size={18} />, roles: ['admin', 'warehouse'] },
  { to: '/grn', label: 'Kupokea Mizigo', icon: <Package size={18} />, roles: ['admin', 'warehouse'] },
  { to: '/suppliers', label: 'Wasambazaji', icon: <Truck size={18} />, roles: ['admin', 'warehouse'] },
  { to: '/customers', label: 'Wateja', icon: <Users size={18} />, roles: ['admin', 'seller'] },
  { to: '/expenses', label: 'Gharama (OPEX)', icon: <Wallet size={18} />, roles: ['admin', 'owner', 'seller'] },
  { to: '/profit-loss', label: 'Faida/Hasara', icon: <TrendingUp size={18} />, roles: ['admin', 'owner'] },
  { to: '/reports', label: 'Ripoti', icon: <BarChart3 size={18} />, roles: ['admin', 'owner'] },
  { to: '/zakat', label: 'Zaka & Sadaka', icon: <Heart size={18} />, roles: ['admin', 'owner'] },
  { to: '/users', label: 'Watumiaji', icon: <Shield size={18} />, roles: ['admin'] },
  { to: '/audit', label: 'Audit Trail', icon: <FileText size={18} />, roles: ['admin'] },
  { to: '/settings', label: 'Mipangilio', icon: <Shield size={18} />, roles: ['admin'] },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const items = NAV.filter(n => user && n.roles.includes(user.role))

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-64
          bg-slate-900 text-slate-200 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center font-bold">
              SH
            </div>
            <div>
              <div className="font-bold text-white text-sm">SMART HARDWARE</div>
              <div className="text-xs text-slate-400">POS System</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {items.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-brand-600 text-white border-r-2 border-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {n.icon}
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{user?.name}</div>
              <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-xs bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white py-2 rounded transition"
          >
            <LogOut size={14} /> Ondoka
          </button>
        </div>
      </aside>
    </>
  )
}