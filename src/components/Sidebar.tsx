import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Package, ShoppingCart, Users, Store, Wallet, TrendingUp, HandCoins, Receipt, FileText, X, ShoppingBag, TruckIcon, UserPlus, Bell, BarChart3, Truck, PackagePlus, LogOutIcon, ArrowBigLeft, BellCheckIcon, StopCircle, HouseCog, HouseCogIcon, PackageX, DollarSign, CircleDollarSign, Banknote } from 'lucide-react'

const navByRole: Record<string, { to: string; label: string; icon: React.ElementType }[]> = {
  mteja: [
    { to: '/mteja', label: 'Nyumbani', icon: Home },
    { to: '/mteja/bidhaa', label: 'Bidhaa', icon: Package },
    { to: '/mteja/quotation', label: 'Quotation', icon: FileText },
    { to: '/mteja/deni', label: 'Deni Langu', icon: Wallet },
    { to: '/mteja/orders', label: 'Order Zangu', icon: ShoppingBag }, 
  ],
  muuzaji: [
    { to: '/muuzaji', label: 'POS', icon: ShoppingCart },
    { to: '/muuzaji/risiti', label: 'Risiti za Leo', icon: Receipt },
    { to: '/muuzaji/pokea', label: 'Pokea Bidhaa', icon: Truck },
    { to: '/muuzaji/wateja', label: 'Wateja', icon: UserPlus },
    { to: '/muuzaji/store-manage', label: 'ripoti za stoo', icon: UserPlus },
    { to: '/muuzaji/ripoti-bidhaa', label: 'hali ya bidhaa', icon: HouseCogIcon },
    { to: '/muuzaji/mshahara', label: 'Mshahara Wangu', icon: CircleDollarSign },
    { to: '/muuzaji/carts', label: 'Carts Zinazosubiri', icon: Bell },
    { to: '/muuzaji/matumizi', label: 'Maombi ya Matumizi', icon: Wallet }, // MPYA
    { to: '/muuzaji/ripoti', label: 'Ripoti za Duka', icon: BarChart3 },
  ],
mmiliki: [
  { to: '/mmiliki', label: 'Dashboard', icon: Home },
  { to: '/mmiliki/maduka', label: 'Maduka', icon: Store },
  { to: '/mmiliki/wafanyakazi', label: 'Wafanyakazi', icon: Users },
  { to: '/mmiliki/faida', label: 'Faida/Hasara', icon: TrendingUp },
  { to: '/mmiliki/mauzo', label: 'Mauzo na Faida', icon: TrendingUp }, 
  { to: '/mmiliki/ripoti-bidhaa', label: 'Ripoti za Bidhaa', icon: PackageX },
   { to: '/mmiliki/mishahara', label: 'Mishahara', icon: Banknote },
  { to: '/mmiliki/zaka', label: 'Zaka & Sadaka', icon: HandCoins },
   { to: '/mmiliki/uingiza', label: 'Ingiza Vifaa', icon: PackagePlus },
   { to: '/mmiliki/wateja', label: 'Wateja', icon: UserPlus },
    { to: '/mmiliki/orders', label: 'Order Zote', icon: ShoppingBag }, 
    { to: '/mmiliki/matumizi', label: 'Maombi ya Matumizi', icon: Wallet },
      { to: '/mmiliki/store-manage', label: 'store', icon: HouseCog },
    { to: '/mmiliki/notifications', label: 'notifications', icon: BellCheckIcon },
     { to: '/', label: 'toka', icon: LogOutIcon }, 
   

],
}

const roleLabels = {
  mteja: 'Mteja Portal',
  muuzaji: 'Muuzaji Duka',
  mmiliki: 'Mmiliki Dashboard',
}

interface SidebarProps {
  role: 'mteja' | 'muuzaji' | 'mmiliki'
  open: boolean
  onClose: () => void
}

export default function Sidebar({ role, open, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const content = (
    <>
      <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">S</div>
          <div>
            <div className="font-semibold text-sm">SMART HARDWARE</div>
            <div className="text-xs text-slate-500">{roleLabels[role]}</div>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100">
          <X size={18} />
        </button>
      </div>

      {/* Nav — scrollable */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navByRole[role].map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === `/${role}`}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <n.icon size={18} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-200 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="w-full text-sm text-slate-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-slate-100 text-left"
        >
          <ArrowBigLeft/>Badilisha Mtumiaji
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}