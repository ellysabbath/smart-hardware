import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

export default function Login() {
  const { login } = useAuth()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!login(u, p)) setErr(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-brand-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl mb-3">
            SH
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">SMART HARDWARE</h1>
          <p className="text-sm text-slate-500">Ingia kwenye system</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Jina la Mtumiaji" value={u} onChange={e => setU(e.target.value)} autoFocus />
          <Input label="Neno la Siri" type="password" value={p} onChange={e => setP(e.target.value)} />
          <Button type="submit" className="w-full">Ingia</Button>
        </form>
        <div className="mt-6 text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          <div className="font-semibold text-slate-700 mb-1">Demo accounts:</div>
          <div className="break-words">
            admin/admin · seller/seller · warehouse/warehouse · owner/owner
          </div>
        </div>
      </div>
      <Modal open={err} onClose={() => setErr(false)} title="Hitilafu ya Kuingia" size="sm">
        <p className="mb-4 text-slate-700">
          Jina la mtumiaji au neno la siri si sahihi. Tafadhali jaribu tena.
        </p>
        <div className="flex justify-end">
          <Button onClick={() => setErr(false)}>Sawa</Button>
        </div>
      </Modal>
    </div>
  )
}