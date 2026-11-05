import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { UserPlus, CheckCircle } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const { branches } = useData()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    branchId: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      setError('Tafadhali jaza sehemu zote muhimu.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Neno la siri na uthibitisho wake hazifanani.')
      return
    }

    if (form.password.length < 4) {
      setError('Neno la siri liwe na herufi angalau 4.')
      return
    }

    if (!form.branchId) {
      setError('Tafadhali chagua duka unalotaka kufanyia kazi.')
      return
    }

    // Tunaruhusu kujisajili kama 'seller' tu mwanzoni
    const successRegister = register({
      name: form.name,
      username: form.username,
      password: form.password,
      branchId: form.branchId,
      role: 'seller', // Default role kwa anayejisajili
    })

    if (successRegister) {
      setSuccess(true)
    } else {
      setError('Jina la mtumiaji (username) limeshatumika. Tafadhali chagua lingine.')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-brand-900 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <CheckCircle size={64} className="mx-auto text-emerald-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Usajili Umefanikiwa!</h1>
          <p className="text-slate-600 text-sm mb-6">
            Akaunti yako imeundwa. Tafadhali subiri Admin aku-idhinishie (Activate) ili uweze kuingia kwenye mfumo.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Rudi Kwenye Kuingia
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-brand-900 p-4 py-10">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl mb-3">
            SH
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Sajili Akaunti</h1>
          <p className="text-sm text-slate-500">Ungana na SMART HARDWARE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Jina Kamili *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Mfano: Juma Bakari"
            autoFocus
          />

          <Input
            label="Username (Jina la Kuingia) *"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="Mfano: juma123"
          />

          <Select
            label="Chagua Duka Lako *"
            value={form.branchId}
            onChange={e => setForm({ ...form, branchId: e.target.value })}
          >
            <option value="">— Chagua Duka —</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.location})</option>
            ))}
          </Select>

          <Input
            label="Neno la Siri *"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Weka neno la siri"
          />

          <Input
            label="Rudia Neno la Siri *"
            type="password"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Rudia neno la siri"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full">
            <span className="flex items-center justify-center gap-2">
              <UserPlus size={18} /> Sajili
            </span>
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Una akaunti tayari?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Ingia Hapa
          </Link>
        </div>
      </div>

      {/* Modal ya Error (Inafaa kama unataka kutumia Modal badala ya div) */}
      <Modal open={!!error} onClose={() => setError('')} title="Hitilafu" size="sm">
        <p className="mb-4 text-slate-700">{error}</p>
        <div className="flex justify-end">
          <Button onClick={() => setError('')}>Sawa</Button>
        </div>
      </Modal>
    </div>
  )
}