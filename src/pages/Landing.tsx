import { Link } from 'react-router-dom'
import {
  ArrowRight, LogIn, KeyRound, ShieldCheck, Sparkles,
  Smartphone, CheckCircle2, Package, Receipt, Users,
  TrendingUp, Wallet, HandCoins, Building2, Lock,
  Phone, Store, ChevronRight,
} from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* ============================================================ */}
      {/* NAVBAR */}
      {/* ============================================================ */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">
              S
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">SMART HARDWARE</div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Duka la Vifaa vya Ujenzi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/forgot-password"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition"
            >
              <KeyRound size={14} />
              Umesahau Nywila?
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold mb-6">
              <Sparkles size={12} />
              Mfumo wa Kisasa wa Usimamizi wa Duka
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Karibu{' '}
              <span className="text-brand-600">SMART HARDWARE</span>
            </h1>
            <p className="text-slate-600 mt-6 text-base md:text-lg leading-relaxed">
              Mfumo kamili wa kusimamia duka la vifaa vya ujenzi.
              Mauzo, stoki, wateja, wafanyakazi, mishahara, faida, na zaka —
              vyote mahali pamoja.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
              >
                <LogIn size={18} />
                Ingia Kwenye Akaunti
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <KeyRound size={16} />
                Umesahau Nywila?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES SECTION */}
      {/* ============================================================ */}
      <section className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-wider text-brand-600 font-semibold mb-2">
              Vipengele
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Kila Kitu Unachohitaji
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
              Mfumo mmoja unaojumuisha kila kitu kwa ajili ya biashara yako ya vifaa vya ujenzi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold mb-4">
                <ShieldCheck size={12} />
                Usalama wa Akaunti
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Tayari Kuanza?
              </h2>
              <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
                Ingia kwenye akaunti yako au tengeneza mpya. Kama umesahau nywila,
                tunaweza kukusaidia kwa OTP kwa simu yako. Usalama wa akaunti
                yako ni kipaumbele chetu.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
                >
                  <LogIn size={16} />
                  Ingia Sasa
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <KeyRound size={16} />
                  Umesahau Nywila?
                </Link>
              </div>
            </div>

            {/* Right: Auth links */}
            <div className="space-y-2.5">
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
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center text-sm font-bold">
                  S
                </div>
                <div>
                  <div className="font-bold text-sm">SMART HARDWARE</div>
                  <div className="text-xs text-slate-500">Duka la Vifaa vya Ujenzi</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Mfumo wa kisasa wa usimamizi wa duka la vifaa vya ujenzi.
                Mauzo, stoki, wateja, wafanyakazi, faida, zaka — vyote mahali pamoja.
              </p>
            </div>

            <div>
              <div className="font-semibold text-sm text-slate-900 mb-3">Mipangilio</div>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>
                  <Link to="/login" className="hover:text-brand-600 inline-flex items-center gap-1.5 transition">
                    <LogIn size={12} />
                    Ingia
                  </Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="hover:text-brand-600 inline-flex items-center gap-1.5 transition">
                    <KeyRound size={12} />
                    Umesahau Nywila
                  </Link>
                </li>
                <li>
                  <Link to="/reset-password" className="hover:text-brand-600 inline-flex items-center gap-1.5 transition">
                    <Lock size={12} />
                    Weka Nywila Mpya
                  </Link>
                </li>
                <li>
                  <Link to="/reset-complete" className="hover:text-brand-600 inline-flex items-center gap-1.5 transition">
                    <CheckCircle2 size={12} />
                    Reset Imekamilika
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-sm text-slate-900 mb-3">Mawasiliano</div>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="inline-flex items-center gap-1.5">
                  <Phone size={12} />
                  0754-000-111
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Smartphone size={12} />
                  0712-000-222
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Store size={12} />
                  Kwembe, Pugu, Kariakoo
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>© 2026 SMART HARDWARE. Haki zote zimehifadhiwa.</div>
            <div>v1.0.0 - Demo</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ============================================================
// Feature Card (nyeupe, bila rangi ya background)
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
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-brand-500 hover:shadow-md transition-all">
      <div className="w-11 h-11 rounded-lg bg-slate-50 text-slate-700 grid place-items-center">
        <Icon size={20} />
      </div>
      <div className="font-semibold text-sm mt-3 text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</div>
    </div>
  )
}

// ============================================================
// Auth Link (nyeupe, bila rangi ya background)
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
      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-brand-500 hover:bg-slate-50 transition group"
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