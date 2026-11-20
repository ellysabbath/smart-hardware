
import { NavLink, useNavigate } from 'react-router-dom'
import type { ElementType } from 'react'

import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Store,
  Wallet,
  TrendingUp,
  HandCoins,
  Receipt,
  FileText,
  X,
  ShoppingBag,
  UserPlus,
  Bell,
  BarChart3,
  Truck,
  PackagePlus,
  LogOutIcon,
  ArrowBigLeft,
  BellCheckIcon,
  HouseCog,
  HouseCogIcon,
  PackageX,
  CircleDollarSign,
  Banknote,
  PersonStanding,
  CogIcon,
} from 'lucide-react'

import { useLanguage } from '../i18n/LanguageContext'

// ============================================================
// TYPES
// ============================================================

type UserRole = 'mteja' | 'muuzaji' | 'mmiliki'

interface NavItem {
  to: string
  label: string
  icon: ElementType
}

interface SidebarProps {
  role: UserRole
  open: boolean
  onClose: () => void
}

// ============================================================
// NAVIGATION ITEMS
// ============================================================

const navByRole: Record<UserRole, NavItem[]> = {
  // ----------------------------------------------------------
  // CUSTOMER
  // ----------------------------------------------------------

  mteja: [
    { to: '/mteja', label: 'Nyumbani', icon: Home },
    { to: '/mteja/bidhaa', label: 'Bidhaa', icon: Package },
    { to: '/mteja/quotation', label: 'Quotation', icon: FileText },
    { to: '/mteja/deni', label: 'Deni Langu', icon: Wallet },
    { to: '/mteja/orders', label: 'Order Zangu', icon: ShoppingBag },
    { to: '/mteja/profile', label: 'Wasifu', icon: PersonStanding },
    { to: '/mteja/settings', label: 'Mipangilio', icon: CogIcon },
  ],

  // ----------------------------------------------------------
  // SELLER
  // ----------------------------------------------------------

  muuzaji: [
    { to: '/muuzaji', label: 'POS', icon: ShoppingCart },
    { to: '/muuzaji/risiti', label: 'Risiti za Leo', icon: Receipt },
    { to: '/muuzaji/pokea', label: 'Pokea Bidhaa', icon: Truck },
    { to: '/muuzaji/wateja', label: 'Wateja', icon: UserPlus },
    { to: '/muuzaji/ripoti-bidhaa', label: 'Ripoti za Stoo', icon: PackageX },
    { to: '/muuzaji/store-manage', label: 'Dhibiti Stoo', icon: HouseCogIcon },
    { to: '/muuzaji/mshahara', label: 'Mshahara Wangu', icon: CircleDollarSign },
    { to: '/muuzaji/carts', label: 'Carts Zinazosubiri', icon: Bell },
    { to: '/muuzaji/matumizi', label: 'Maombi ya Matumizi', icon: Wallet },
    { to: '/muuzaji/ripoti', label: 'Ripoti za Duka', icon: BarChart3 },
    { to: '/muuzaji/profile', label: 'Wasifu', icon: PersonStanding },
    { to: '/muuzaji/settings', label: 'Mipangilio', icon: CogIcon },
  ],

  // ----------------------------------------------------------
  // OWNER
  // ----------------------------------------------------------

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
    { to: '/mmiliki/store-manage', label: 'Dhibiti Stoo', icon: HouseCog },
    { to: '/mmiliki/notifications', label: 'Taarifa', icon: BellCheckIcon },
    { to: '/mmiliki/profile', label: 'Wasifu', icon: PersonStanding },
    { to: '/mmiliki/settings', label: 'Mipangilio', icon: CogIcon },
    { to: '/', label: 'Toka', icon: LogOutIcon },
  ],
}

// ============================================================
// ROLE LABELS
// ============================================================

const roleLabels = {
  sw: {
    mteja: 'Portal ya Mteja',
    muuzaji: 'Mfumo wa Muuzaji',
    mmiliki: 'Dashibodi ya Mmiliki',
  },

  en: {
    mteja: 'Customer Portal',
    muuzaji: 'Seller Dashboard',
    mmiliki: 'Owner Dashboard',
  },
}

// ============================================================
// MENU TRANSLATIONS
// ============================================================

const menuTranslations: Record<string, { sw: string; en: string }> = {
  Nyumbani: {
    sw: 'Nyumbani',
    en: 'Home',
  },
  Bidhaa: {
    sw: 'Bidhaa',
    en: 'Products',
  },
  Quotation: {
    sw: 'Quotation',
    en: 'Quotation',
  },
  'Deni Langu': {
    sw: 'Deni Langu',
    en: 'My Debt',
  },
  'Order Zangu': {
    sw: 'Order Zangu',
    en: 'My Orders',
  },
  Wasifu: {
    sw: 'Wasifu',
    en: 'Profile',
  },
  Mipangilio: {
    sw: 'Mipangilio',
    en: 'Settings',
  },
  POS: {
    sw: 'POS',
    en: 'POS',
  },
  'Risiti za Leo': {
    sw: 'Risiti za Leo',
    en: "Today's Receipts",
  },
  'Pokea Bidhaa': {
    sw: 'Pokea Bidhaa',
    en: 'Receive Products',
  },
  Wateja: {
    sw: 'Wateja',
    en: 'Customers',
  },
  'Ripoti za Stoo': {
    sw: 'Ripoti za Stoo',
    en: 'Stock Reports',
  },
  'Dhibiti Stoo': {
    sw: 'Dhibiti Stoo',
    en: 'Manage Store',
  },
  'Mshahara Wangu': {
    sw: 'Mshahara Wangu',
    en: 'My Salary',
  },
  'Carts Zinazosubiri': {
    sw: 'Carts Zinazosubiri',
    en: 'Pending Carts',
  },
  'Maombi ya Matumizi': {
    sw: 'Maombi ya Matumizi',
    en: 'Expense Requests',
  },
  'Ripoti za Duka': {
    sw: 'Ripoti za Duka',
    en: 'Store Reports',
  },
  Dashboard: {
    sw: 'Dashboard',
    en: 'Dashboard',
  },
  Maduka: {
    sw: 'Maduka',
    en: 'Stores',
  },
  Wafanyakazi: {
    sw: 'Wafanyakazi',
    en: 'Employees',
  },
  'Faida/Hasara': {
    sw: 'Faida/Hasara',
    en: 'Profit/Loss',
  },
  'Mauzo na Faida': {
    sw: 'Mauzo na Faida',
    en: 'Sales and Profit',
  },
  'Ripoti za Bidhaa': {
    sw: 'Ripoti za Bidhaa',
    en: 'Product Reports',
  },
  Mishahara: {
    sw: 'Mishahara',
    en: 'Salaries',
  },
  'Zaka & Sadaka': {
    sw: 'Zaka & Sadaka',
    en: 'Zakat & Donations',
  },
  'Ingiza Vifaa': {
    sw: 'Ingiza Vifaa',
    en: 'Add Stock',
  },
  'Order Zote': {
    sw: 'Order Zote',
    en: 'All Orders',
  },
  Taarifa: {
    sw: 'Taarifa',
    en: 'Notifications',
  },
  Toka: {
    sw: 'Toka',
    en: 'Logout',
  },
}

// ============================================================
// SIDEBAR COMPONENT
// ============================================================

export default function Sidebar({
  role,
  open,
  onClose,
}: SidebarProps) {
  const navigate = useNavigate()

  // Global language context
  const { language } = useLanguage()

  const isSwahili = language === 'sw'

  const currentRoleLabel = roleLabels[language][role]

  // Translate menu labels
  const translateLabel = (label: string): string => {
    return (
      menuTranslations[label]?.[language] ?? label
    )
  }

  // ==========================================================
  // SIDEBAR CONTENT
  // ==========================================================

  const content = (
    <>
      {/* HEADER */}

      <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0">

        <div className="flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">
            S
          </div>

          <div className="min-w-0">

            <div className="font-semibold text-sm leading-tight">
              SUNRISE GLASSES & ALUMINIUM PROFILES
            </div>

            <div className="text-xs text-slate-500 mt-1">
              {currentRoleLabel}
            </div>

          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={isSwahili ? 'Funga menyu' : 'Close menu'}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100"
        >
          <X size={18} />
        </button>

      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">

        {navByRole[role].map((item) => {

          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >

              <Icon size={18} />

              <span>
                {translateLabel(item.label)}
              </span>

            </NavLink>
          )
        })}

      </nav>

      {/* FOOTER */}

      <div className="p-3 border-t border-slate-200 shrink-0">

        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-slate-100 text-left"
        >

          <ArrowBigLeft size={18} />

          {isSwahili ? 'Badilisha Mtumiaji' : 'Switch User'}

        </button>

      </div>
    </>
  )

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <>
      {/* DESKTOP SIDEBAR */}

      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col h-screen sticky top-0">

        {content}

      </aside>

      {/* MOBILE DRAWER */}

      {open && (

        <div className="lg:hidden fixed inset-0 z-50">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">

            {content}

          </aside>

        </div>

      )}
    </>
  )
}
