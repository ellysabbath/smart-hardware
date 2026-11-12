import { Link } from 'react-router-dom'
import {
  ArrowRight, LogIn, KeyRound, ShieldCheck, Sparkles,
  CheckCircle2, Package, Receipt, Users,
  TrendingUp, Wallet, HandCoins, Building2, Lock,
  ChevronRight, ShoppingCart, Briefcase, Crown,
} from 'lucide-react'
import Footer from '../components/Footer'

export default function Landing() {
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
                SUNRISE GLASSES 
              </div>
              <div className="font-bold text-xs sm:text-sm leading-tight truncate">
                 &  ALUMINIUM
              </div>
              <div className="text-[10px] text-slate-500 leading-tight truncate">
                Duka la Vifaa vya Ujenzi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/forgot-password"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition"
            >
              <KeyRound size={14} />
              Umesahau Nywila?
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-brand-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-brand-700 transition"
            >
              <LogIn size={14} />
              Ingia
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
              Mfumo wa Kisasa wa Usimamizi wa Duka
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Karibu{' '}
              <span className="text-brand-600">
                SUNRISE GLASSES  
              </span><br/>
                <span className="text-brand-500">
                 &  ALUMINIUM PROFILES
              </span>
            </h1>
            <p className="text-slate-600 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed px-2">
              Mfumo kamili wa kusimamia duka la vifaa vya ujenzi.
              Mauzo, stoki, wateja, wafanyakazi, mishahara, faida, na zaka —
              vyote mahali pamoja.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-10 px-2 sm:px-0">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-brand-700 transition"
              >
                <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                Ingia Kwenye Akaunti
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Link>
              <Link
                to="/forgot-password"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-700 rounded-xl text-sm sm:text-base font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <KeyRound size={16} />
                Umesahau Nywila?
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
            <div className="inline-flex items-center gap-2 px-3 py-1  rounded-full border border-slate-200 bg-white text-slate-600 text-[10px] sm:text-xs font-semibold mb-3">
              <Sparkles size={12} />
              Sunrise Portals
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Ingia Kama
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-xs sm:text-sm px-2">
              Chagua jukumu lako ili kuona dashibodi inayokufaa. Kila portal ina
              vipengele maalum kwa ajili ya kazi zako.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            <PortalCard
              to="/mteja"
              Icon={ShoppingCart}
              title="Mteja"
              desc="Nunua bidhaa, angalia quotation, orders, na deni lako"
              badge="Mteja Portal"
            />
            <PortalCard
              to="/muuzaji"
              Icon={Briefcase}
              title="Muuzaji"
              desc="POS, risiti, pokea bidhaa, wateja, na ripoti za duka"
              badge="Muuzaji Duka"
            />
            <PortalCard
              to="/mmiliki"
              Icon={Crown}
              title="Mmiliki"
              desc="Dashboard, maduka, faida, mishahara, zaka, na ripoti zote"
              badge="Mmiliki Dashboard"
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
              Vipengele
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
              Kila Kitu Unachohitaji
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-xs sm:text-sm px-2">
              Mfumo mmoja unaojumuisha kila kitu kwa ajili ya biashara yako ya vifaa vya ujenzi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            <FeatureCard Icon={Package} title="Stoki" desc="Fuatilia bidhaa kwa wakati halisi" />
            <FeatureCard Icon={Receipt} title="Mauzo & Risiti" desc="POS ya haraka na risiti za dijitali" />
            <FeatureCard Icon={Users} title="Wateja & Madeni" desc="Historia na madeni ya wateja" />
            <FeatureCard Icon={TrendingUp} title="Faida & Ripoti" desc="Ripoti kamili za biashara" />
            <FeatureCard Icon={Wallet} title="Mishahara" desc="Malipo kwa M-Pesa au benki" />
            <FeatureCard Icon={HandCoins} title="Zaka & Sadaka" desc="Hesabu ya kiotomatiki 10% + 10%" />
            <FeatureCard Icon={Building2} title="Maduka Mengi" desc="Simamia maduka yote kwa pamoja" />
            <FeatureCard Icon={ShieldCheck} title="Usalama" desc="Audit trail na backup ya kila siku" />
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
                Usalama wa Akaunti
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Tayari Kuanza?
              </h2>
              <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
                Ingia kwenye akaunti yako au tengeneza mpya. Kama umesahau nywila,
                tunaweza kukusaidia kwa OTP kwa simu yako. Usalama wa akaunti
                yako ni kipaumbele chetu.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
                >
                  <LogIn size={16} />
                  Ingia Sasa
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <KeyRound size={16} />
                  Umesahau Nywila?
                </Link>
              </div>
            </div>

            {/* Right: Auth links */}
            <div className="space-y-2 sm:space-y-2.5">
              <AuthLink
                to="/login"
                Icon={LogIn}
                title="Ingia (Login)"
                desc="Namba ya simu + nywila"
              />
              <AuthLink
                to="/forgot-password"
                Icon={KeyRound}
                title="Umesahau Nywila?"
                desc="Pata OTP kwa namba yako ya simu"
              />
              <AuthLink
                to="/reset-password"
                Icon={Lock}
                title="Weka Nywila Mpya"
                desc="Baada ya OTP kuthibitishwa"
              />
              <AuthLink
                to="/reset-complete"
                Icon={CheckCircle2}
                title="Reset Imekamilika"
                desc="Rudi kuingia kwa akaunti yako"
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
}: {
  to: string
  Icon: React.ElementType
  title: string
  desc: string
  badge: string
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
        Ingia
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