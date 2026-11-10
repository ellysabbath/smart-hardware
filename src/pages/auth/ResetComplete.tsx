import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, LogIn } from 'lucide-react'

export default function ResetComplete() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-bold mt-4">Nywila Imebadilishwa</h1>
          <p className="text-sm text-slate-500 mt-2">
            Nywila yako mpya imehifadhiwa kwa mafanikio. Sasa unaweza kuingia
            kwenye akaunti yako.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
          >
            <LogIn size={14} />
            Ingia Sasa
            <ArrowRight size={14} />
          </Link>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-brand-600"
            >
              Rudi Nyumbani
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}