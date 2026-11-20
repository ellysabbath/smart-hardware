import { Link } from 'react-router-dom'
import {
  ArrowRight, LogIn, KeyRound, ShieldCheck, Sparkles,
  CheckCircle2, Package, Receipt, Users,
  TrendingUp, Wallet, HandCoins, Building2, Lock,
  ChevronRight, ShoppingCart, Briefcase, Crown,
} from 'lucide-react'
import Footer from '../components/Footer'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../i18n/LanguageContext'

export default function Landing() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ============================================================ */}
      {/* NAVBAR */}
      {/* ============================================================ */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center font-bold shrink-0">
              S
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs sm:text-sm leading-tight truncate">
                {t('landing.brandLine1')}
              </div>
              <div className="font-bold text-xs sm:text-sm leading-tight truncate">
                {t('landing.brandLine2')}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight truncate">
                {t('landing.brandTagline')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* LANGUAGE SWITCHER */}
            <LanguageSwitcher />

            <Link
              to="/forgot-password"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition"
            >
              <KeyRound size={14} />
              {t('landing.forgotPassword')}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-brand-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-brand-700 transition"
            >
              <LogIn size={14} />
              {t('landing.login')}
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold mb-4 sm:mb-6">
              <Sparkles size={12} />
              {t('landing.badge')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              {t('landing.heroWelcome')}{' '}
              <span className="text-brand-600">
                SUNRISE GLASSES
              </span><br/>
              <span className="text-brand-500">
                & ALUMINIUM PROFILES
              </span>
            </h1>
            <p className="text-slate-600 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed px-2">
              {t('landing.heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-10 px-2 sm:px-0">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-brand-700 transition"
              >
                <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                {t('landing.loginAccount')}
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Link>
              <Link
                to="/forgot-password"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-700 rounded-xl text-sm sm:text-base font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <KeyRound size={16} />
                {t('landing.forgotPassword')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* DEMO PORTALS SECTION */}
      {/* ============================================================ */}
      <section className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-600 text-[10px] sm:text-xs font-semibold mb-3">
              <Sparkles size={12} />
              {t('landing.portalsBadge')}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              {t('landing.portalsTitle')}
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-xs sm:text-sm px-2">
              {t('landing.portalsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            <PortalCard
              to="/mteja"
              Icon={ShoppingCart}
              title={t('landing.portal.mteja.title')}
              desc={t('landing.portal.mteja.desc')}
              badge={t('landing.portal.mteja.badge')}
              enterLabel={t('landing.portal.enter')}
            />
            <PortalCard
              to="/muuzaji"
              Icon={Briefcase}
              title={t('landing.portal.muuzaji.title')}
              desc={t('landing.portal.muuzaji.desc')}
              badge={t('landing.portal.muuzaji.badge')}
              enterLabel={t('landing.portal.enter')}
            />
            <PortalCard
              to="/mmiliki"
              Icon={Crown}
              title={t('landing.portal.mmiliki.title')}
              desc={t('landing.portal.mmiliki.desc')}
              badge={t('landing.portal.mmiliki.badge')}
              enterLabel={t('landing.portal.enter')}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES SECTION */}
      {/* ============================================================ */}
      <section className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-brand-600 font-semibold mb-2">
              {t('landing.featuresLabel')}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-xs sm:text-sm px-2">
              {t('landing.featuresDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            <FeatureCard
              Icon={Package}
              title={t('landing.feature.stoki.title')}
              desc={t('landing.feature.stoki.desc')}
            />
            <FeatureCard
              Icon={Receipt}
              title={t('landing.feature.mauzo.title')}
              desc={t('landing.feature.mauzo.desc')}
            />
            <FeatureCard
              Icon={Users}
              title={t('landing.feature.wateja.title')}
              desc={t('landing.feature.wateja.desc')}
            />
            <FeatureCard
              Icon={TrendingUp}
              title={t('landing.feature.faida.title')}
              desc={t('landing.feature.faida.desc')}
            />
            <FeatureCard
              Icon={Wallet}
              title={t('landing.feature.mishahara.title')}
              desc={t('landing.feature.mishahara.desc')}
            />
            <FeatureCard
              Icon={HandCoins}
              title={t('landing.feature.zaka.title')}
              desc={t('landing.feature.zaka.desc')}
            />
            <FeatureCard
              Icon={Building2}
              title={t('landing.feature.maduka.title')}
              desc={t('landing.feature.maduka.desc')}
            />
            <FeatureCard
              Icon={ShieldCheck}
              title={t('landing.feature.usalaama.title')}
              desc={t('landing.feature.usalaama.desc')}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* AUTH LINKS SECTION */}
      {/* ============================================================ */}
      <section className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-semibold mb-4">
                <ShieldCheck size={12} />
                {t('landing.authBadge')}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {t('landing.authTitle')}
              </h2>
              <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
                {t('landing.authDesc')}
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
                >
                  <LogIn size={16} />
                  {t('landing.authLoginNow')}
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <KeyRound size={16} />
                  {t('landing.forgotPassword')}
                </Link>
              </div>
            </div>

            {/* Right: Auth links */}
            <div className="space-y-2 sm:space-y-2.5">
              <AuthLink
                to="/login"
                Icon={LogIn}
                title={t('landing.authLink.login.title')}
                desc={t('landing.authLink.login.desc')}
              />
              <AuthLink
                to="/forgot-password"
                Icon={KeyRound}
                title={t('landing.authLink.forgot.title')}
                desc={t('landing.authLink.forgot.desc')}
              />
              <AuthLink
                to="/reset-password"
                Icon={Lock}
                title={t('landing.authLink.reset.title')}
                desc={t('landing.authLink.reset.desc')}
              />
              <AuthLink
                to="/reset-complete"
                Icon={CheckCircle2}
                title={t('landing.authLink.complete.title')}
                desc={t('landing.authLink.complete.desc')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER — inatumia component ile ile ya Footer */}
      {/* ============================================================ */}
      <Footer />
    </div>
  )
}

// ============================================================
// Portal Card
// ============================================================
function PortalCard({
  to,
  Icon,
  title,
  desc,
  badge,
  enterLabel,
}: {
  to: string
  Icon: React.ElementType
  title: string
  desc: string
  badge: string
  enterLabel: string
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-brand-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-50 text-slate-700 grid place-items-center shrink-0">
          <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
        </div>
        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
          {badge}
        </span>
      </div>
      <div className="font-semibold text-sm sm:text-base mt-3 sm:mt-4 text-slate-900">
        {title}
      </div>
      <div className="text-xs text-slate-500 mt-1 leading-relaxed">
        {desc}
      </div>
      <div className="mt-3 sm:mt-4 flex items-center text-sm text-brand-600 font-semibold">
        {enterLabel}
        <ChevronRight
          size={14}
          className="ml-1 transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  )
}

// ============================================================
// Feature Card
// ============================================================
function FeatureCard({
  Icon,
  title,
  desc,
}: {
  Icon: React.ElementType
  title: string
  desc: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-brand-500 hover:shadow-md transition-all">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-slate-50 text-slate-700 grid place-items-center">
        <Icon size={18} className="sm:w-5 sm:h-5" />
      </div>
      <div className="font-semibold text-sm mt-3 text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</div>
    </div>
  )
}

// ============================================================
// Auth Link
// ============================================================
function AuthLink({
  to,
  Icon,
  title,
  desc,
}: {
  to: string
  Icon: React.ElementType
  title: string
  desc: string
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-white hover:border-brand-500 hover:bg-slate-50 transition group"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-700 grid place-items-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>
        <div className="text-xs text-slate-500 truncate">{desc}</div>
      </div>
      <ChevronRight
        size={16}
        className="text-slate-400 shrink-0 transition group-hover:translate-x-1 group-hover:text-brand-600"
      />
    </Link>
  )
}