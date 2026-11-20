
import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Menu,
  Settings,
  User,
  LogOut,
  ChevronDown,
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  ArrowRight,
  LogOutIcon,
} from 'lucide-react'

import { searchEverything, type SearchType } from '../utils/search'
import { useCart } from '../context/CartContext'
import { useNotifications } from '../context/NotificationContext'
import { iconForKundi } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

type Role = 'mteja' | 'muuzaji' | 'mmiliki'

interface TopBarProps {
  role: Role
  onMenuClick: () => void
}

interface UserProfile {
  name: string
  email: string
  initials: string
}

const USERS: Record<Role, UserProfile> = {
  mteja: {
    name: 'Dan Ndusiro',
    email: 'dan@email.com',
    initials: 'MM',
  },
  muuzaji: {
    name: 'Dan Ndusiro',
    email: 'dan@smarthardware.co.tz',
    initials: 'JH',
  },
  mmiliki: {
    name: 'Dan Ndusiro',
    email: 'dan@smarthardware.co.tz',
    initials: 'MK',
  },
}

export default function TopBar({
  role,
  onMenuClick,
}: TopBarProps) {
  const navigate = useNavigate()

  const user = USERS[role]

  const { t, language } = useLanguage()

  // =====================================================
  // SEARCH STATES
  // =====================================================

  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  // =====================================================
  // OTHER STATES
  // =====================================================

  const [notifOpen, setNotifOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  // =====================================================
  // CONTEXTS
  // =====================================================

  const cart = useCart()

  const showCart = role === 'mteja' || role === 'muuzaji'

  const {
    notifications: notifList,
    unreadCount,
    markAsRead,
    markAllRead,
  } = useNotifications()

  // =====================================================
  // REFS
  // =====================================================

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // =====================================================
  // ROLE-BASED SEARCH
  // =====================================================

  const searchLanguage = language === 'en' ? 'en' : 'sw'

  const results = useMemo(() => {
    return searchEverything(
      query,
      role,
      searchLanguage
    )
  }, [query, role, searchLanguage])

  // =====================================================
  // TRANSLATIONS
  // =====================================================

  const ROLE_LABEL: Record<Role, string> = {
    mteja: t('role.mteja'),
    muuzaji: t('role.muuzaji'),
    mmiliki: t('role.mmiliki'),
  }

  const TYPE_LABEL: Record<SearchType, string> = {
    bidhaa: t('search.type.bidhaa'),
    duka: t('search.type.duka'),
    mtumiaji: t('search.type.mtumiaji'),
    deni: t('search.type.deni'),
    gharama: t('search.type.gharama'),
  }

  // =====================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setSearchOpen(false)
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(target)
      ) {
        setNotifOpen(false)
      }

      if (
        cartRef.current &&
        !cartRef.current.contains(target)
      ) {
        setCartOpen(false)
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotifOpen(false)
        setCartOpen(false)
        setProfileOpen(false)
        setLogoutOpen(false)
      }
    }

    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // =====================================================
  // SEARCH RESULT CLICK
  // =====================================================

  const handleSearchResult = (route?: string) => {
    if (route) {
      navigate(route)
    }

    setQuery('')
    setSearchOpen(false)
  }

  const clearSearch = () => {
    setQuery('')
    setSearchOpen(false)
  }

  // =====================================================
  // DROPDOWN TOGGLES
  // =====================================================

  const toggleNotif = () => {
    setNotifOpen((v) => !v)
    setCartOpen(false)
    setProfileOpen(false)
  }

  const toggleCart = () => {
    setCartOpen((v) => !v)
    setNotifOpen(false)
    setProfileOpen(false)
  }

  const toggleProfile = () => {
    setProfileOpen((v) => !v)
    setNotifOpen(false)
    setCartOpen(false)
  }

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const handleNotifClick = (n: typeof notifList[0]) => {
    markAsRead(n.id)

    setNotifOpen(false)

    if (n.route) {
      navigate(n.route)
    } else {
      navigate(`/${role}/notifications/${n.id}`)
    }
  }

  const handleOnaZote = () => {
    setNotifOpen(false)
    navigate(`/${role}/notifications`)
  }

  // =====================================================
  // CART NAVIGATION
  // =====================================================

  const goToQuotation = () => {
    setCartOpen(false)
    navigate('/mteja/quotation')
  }

  const goToBidhaa = () => {
    setCartOpen(false)

    navigate(
      role === 'muuzaji'
        ? '/muuzaji'
        : '/mteja/bidhaa'
    )
  }

  // =====================================================
  // PROFILE NAVIGATION
  // =====================================================

  const goToProfile = () => {
    setProfileOpen(false)
    navigate(`/${role}/profile`)
  }

  const goToSettings = () => {
    setProfileOpen(false)
    navigate(`/${role}/settings`)
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setProfileOpen(false)
    setLogoutOpen(true)
  }

  const confirmLogout = () => {
    setLogoutOpen(false)
    navigate('/')
  }

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const notifIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return (
          <XCircle
            size={16}
            className="text-red-500"
          />
        )

      case 'warning':
        return (
          <AlertTriangle
            size={16}
            className="text-amber-500"
          />
        )

      case 'success':
        return (
          <CheckCircle2
            size={16}
            className="text-emerald-500"
          />
        )

      default:
        return (
          <Info
            size={16}
            className="text-brand-500"
          />
        )
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">

      <div className="h-16 px-3 md:px-6 flex items-center gap-2 md:gap-3">

        {/* MOBILE MENU */}

        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 shrink-0"
          aria-label={t('topbar.openMenu')}
        >
          <Menu size={22} />
        </button>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          ref={searchRef}
          className="flex-1 min-w-0 relative"
        >
          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder={t('topbar.search')}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-brand-500 outline-none text-sm"
            />

            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-200"
                aria-label={t('common.delete')}
              >
                <X size={14} />
              </button>
            )}

          </div>

          {/* SEARCH RESULTS */}

          {searchOpen && query.trim() && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl max-h-[70vh] overflow-auto">

              {results.length === 0 ? (

                <div className="p-6 text-center text-sm text-slate-500">
                  {t('topbar.noResults', { query })}
                </div>

              ) : (

                <div className="py-1">

                  {results.map((r, i) => (

                    <button
                      key={`${r.type}-${i}`}
                      onClick={() => handleSearchResult(r.route)}
                      className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-left"
                    >

                      <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 grid place-items-center shrink-0">
                        <r.Icon size={16} />
                      </span>

                      <div className="flex-1 min-w-0">

                        <div className="text-sm font-medium truncate">
                          {r.title}
                        </div>

                        <div className="text-xs text-slate-500 truncate">
                          {r.subtitle}
                        </div>

                      </div>

                      <span className="hidden sm:inline text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        {TYPE_LABEL[r.type]}
                      </span>

                    </button>

                  ))}

                </div>

              )}

            </div>
          )}

        </div>

        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div className="flex items-center gap-0.5 md:gap-1 shrink-0">

          {/* LANGUAGE SWITCHER */}

          <LanguageSwitcher />

          {/* =================================================
              CART
          ================================================= */}

          {showCart && (

            <div
              ref={cartRef}
              className="relative"
            >

              <button
                onClick={toggleCart}
                className="relative flex items-center gap-2 px-2 md:px-2.5 py-2 rounded-lg hover:bg-slate-100 transition"
                aria-label={t('cart.title')}
              >

                <div className="relative">

                  <ShoppingCart size={20} />

                  {cart.count > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-brand-600 text-white text-[10px] rounded-full grid place-items-center font-bold">
                      {cart.count > 99 ? '99+' : cart.count}
                    </span>
                  )}

                </div>

                {cart.total > 0 && (
                  <span className="hidden md:inline text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-1 rounded-md whitespace-nowrap">
                    Tsh {cart.total.toLocaleString()}
                  </span>
                )}

              </button>

              {cartOpen && (

                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">

                  {/* CART HEADER */}

                  <div className="p-3 border-b border-slate-100 flex justify-between items-center">

                    <div>

                      <div className="font-semibold text-sm flex items-center gap-1.5">

                        <ShoppingCart
                          size={14}
                          className="text-brand-600"
                        />

                        {t('topbar.cartTitle')}

                        {cart.count > 0 && (
                          <span className="text-[10px] font-bold bg-brand-600 text-white px-1.5 py-0.5 rounded-full">
                            {cart.count}
                          </span>
                        )}

                      </div>

                      <div className="text-xs text-slate-500 mt-0.5">
                        Tsh {cart.total.toLocaleString()}
                      </div>

                    </div>

                    {cart.detailed.length > 0 && (
                      <button
                        onClick={cart.clear}
                        className="text-xs text-red-600 hover:underline font-medium"
                      >
                        {t('topbar.removeAll')}
                      </button>
                    )}

                  </div>

                  {/* CART ITEMS */}

                  <div className="max-h-80 overflow-auto divide-y divide-slate-100">

                    {cart.detailed.length === 0 ? (

                      <div className="p-8 text-center text-sm text-slate-500">

                        <ShoppingCart
                          size={32}
                          className="mx-auto mb-2 text-slate-300"
                        />

                        <div className="font-medium">
                          {t('topbar.cartEmpty')}
                        </div>

                        <div className="text-xs text-slate-400 mt-1">
                          {t('topbar.cartEmptyDesc')}
                        </div>

                      </div>

                    ) : (

                      cart.detailed.map((l) => {

                        const Icon = iconForKundi(l.iconKey)

                        return (

                          <div
                            key={l.id}
                            className="p-3 flex gap-3"
                          >

                            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden grid place-items-center shrink-0 text-slate-600">

                              {l.pichaUrl ? (

                                <img
                                  src={l.pichaUrl}
                                  alt={l.jina}
                                  className="w-full h-full object-cover"
                                />

                              ) : (

                                <Icon size={18} />

                              )}

                            </div>

                            <div className="flex-1 min-w-0">

                              <div className="text-sm font-medium truncate">
                                {l.jina}
                              </div>

                              <div className="text-xs text-slate-500">
                                Tsh {l.bei.toLocaleString()} / {l.uom}
                              </div>

                              <div className="flex items-center gap-1.5 mt-2">

                                <button
                                  onClick={() => cart.dec(l.id)}
                                  className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 grid place-items-center"
                                  aria-label={t('topbar.decrease')}
                                >
                                  <Minus size={12} />
                                </button>

                                <span className="text-sm font-bold w-6 text-center">
                                  {l.wingi}
                                </span>

                                <button
                                  onClick={() => cart.inc(l.id)}
                                  className="w-6 h-6 rounded-md bg-brand-600 text-white hover:bg-brand-700 grid place-items-center"
                                  aria-label={t('topbar.increase')}
                                >
                                  <Plus size={12} />
                                </button>

                                <button
                                  onClick={() => cart.remove(l.id)}
                                  className="ml-auto p-1 rounded-md text-red-500 hover:bg-red-50"
                                  aria-label={t('topbar.remove')}
                                >
                                  <Trash2 size={14} />
                                </button>

                              </div>

                            </div>

                            <div className="text-sm font-bold self-start whitespace-nowrap">
                              Tsh {l.jumla.toLocaleString()}
                            </div>

                          </div>

                        )
                      })

                    )}

                  </div>

                  {/* CART FOOTER */}

                  <div className="p-3 border-t border-slate-100 space-y-2">

                    <div className="flex justify-between text-sm">

                      <span className="font-medium">
                        {t('common.total')}
                      </span>

                      <span className="font-bold text-base">
                        Tsh {cart.total.toLocaleString()}
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-2">

                      <button
                        onClick={goToBidhaa}
                        className="px-3 py-2 rounded-lg bg-slate-100 text-sm hover:bg-slate-200 font-medium"
                      >
                        {t('topbar.continue')}
                      </button>

                      <button
                        onClick={goToQuotation}
                        disabled={cart.detailed.length === 0}
                        className="px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
                      >
                        {t('cart.hali.quotation')}
                        <ArrowRight size={14} />
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div
            ref={notifRef}
            className="relative"
          >

            <button
              onClick={toggleNotif}
              className="relative p-2 rounded-lg hover:bg-slate-100"
              aria-label={t('notif.title')}
            >

              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full grid place-items-center font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}

            </button>

            {notifOpen && (

              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">

                <div className="p-3 border-b border-slate-100 flex justify-between items-center">

                  <div className="font-semibold text-sm">
                    {t('notif.title')}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-brand-600 hover:underline"
                    >
                      {t('topbar.markAllRead')}
                    </button>
                  )}

                </div>

                <div className="max-h-96 overflow-auto divide-y divide-slate-100">

                  {notifList.length === 0 ? (

                    <div className="p-8 text-center text-sm text-slate-500">

                      <Bell
                        size={32}
                        className="mx-auto mb-2 text-slate-300"
                      />

                      {t('notif.empty')}

                    </div>

                  ) : (

                    notifList.map((n) => (

                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`w-full text-left p-3 hover:bg-slate-50 transition ${
                          !n.read ? 'bg-brand-50/40' : ''
                        }`}
                      >

                        <div className="flex gap-2">

                          <div className="mt-0.5 shrink-0">
                            {notifIcon(n.type)}
                          </div>

                          <div className="flex-1 min-w-0">

                            <div className="text-sm font-medium flex items-center gap-2">

                              <span className="truncate">
                                {n.title}
                              </span>

                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                              )}

                            </div>

                            <div className="text-xs text-slate-500 mt-0.5">
                              {n.message}
                            </div>

                            <div className="text-[10px] text-slate-400 mt-1">
                              {n.time}
                            </div>

                          </div>

                          <ArrowRight
                            size={14}
                            className="text-slate-300 shrink-0 mt-1"
                          />

                        </div>

                      </button>

                    ))

                  )}

                </div>

                <div className="p-2 border-t border-slate-100 text-center">

                  <button
                    onClick={handleOnaZote}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    {t('topbar.viewAllNotifications')}
                  </button>

                </div>

              </div>

            )}

          </div>

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >

            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100"
              aria-label={t('topbar.profile')}
            >

              <div className="w-8 h-8 rounded-full bg-brand-600 text-white grid place-items-center text-xs font-bold">
                {user.initials}
              </div>

              <div className="hidden md:block text-left">

                <div className="text-xs font-semibold leading-tight">
                  {user.name}
                </div>

                <div className="text-[10px] text-slate-500 leading-tight">
                  {ROLE_LABEL[role]}
                </div>

              </div>

              <ChevronDown
                size={14}
                className="hidden md:block text-slate-400"
              />

            </button>

            {profileOpen && (

              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">

                <div className="p-3 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-brand-600 text-white grid place-items-center text-sm font-bold">
                      {user.initials}
                    </div>

                    <div className="min-w-0">

                      <div className="text-sm font-semibold truncate">
                        {user.name}
                      </div>

                      <div className="text-xs text-slate-500 truncate">
                        {user.email}
                      </div>

                    </div>

                  </div>

                </div>

                <div className="p-1">

                  <button
                    onClick={goToProfile}
                    className="w-full px-3 py-2 flex items-center gap-2 text-sm rounded-lg hover:bg-slate-100"
                  >
                    <User
                      size={16}
                      className="text-slate-500"
                    />

                    {t('topbar.myProfile')}
                  </button>

                  <button
                    onClick={goToSettings}
                    className="w-full px-3 py-2 flex items-center gap-2 text-sm rounded-lg hover:bg-slate-100"
                  >
                    <Settings
                      size={16}
                      className="text-slate-500"
                    />

                    {t('topbar.settings')}
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 flex items-center gap-2 text-sm rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <LogOut size={16} />

                    {t('topbar.logout')}
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          LOGOUT MODAL
      ===================================================== */}

      {logoutOpen && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setLogoutOpen(false)}
          />

          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">

            <div className="p-5 text-center">

              <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 grid place-items-center mx-auto">

                <LogOutIcon
                  size={26}
                  className="text-red-600"
                />

              </div>

              <h3 className="font-semibold text-slate-900 mt-3">
                {t('topbar.logoutTitle')}
              </h3>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {t('topbar.logoutDesc')}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">

                <button
                  onClick={() => setLogoutOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200"
                >
                  {t('common.cancel')}
                </button>

                <button
                  onClick={confirmLogout}
                  className="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 inline-flex items-center justify-center gap-1.5"
                >

                  <LogOut size={14} />

                  {t('topbar.logoutConfirm')}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </header>
  )
}
