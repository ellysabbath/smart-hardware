import { useNavigate } from 'react-router-dom'
import { User, Store, Crown } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const roles = [
    { key: 'mteja', title: 'Mteja', desc: 'Agiza, ona deni, pata risiti', icon: User, path: '/mteja' },
    { key: 'muuzaji', title: 'Muuzaji Duka', desc: 'POS, risiti, mauzo', icon: Store, path: '/muuzaji' },
    { key: 'mmiliki', title: 'Mmiliki', desc: 'Maduka, faida, zaka', icon: Crown, path: '/mmiliki' },
  ]
  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white grid place-items-center font-bold text-xl">S</div>
            <h1 className="text-3xl font-bold">SMART HARDWARE</h1>
          </div>
          <p className="text-slate-600">Chagua mtumiaji kuingia kwenye demo</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => navigate(r.path)}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-lg transition text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 grid place-items-center mb-4">
                <r.icon size={24} />
              </div>
              <h2 className="font-semibold text-lg">{r.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}