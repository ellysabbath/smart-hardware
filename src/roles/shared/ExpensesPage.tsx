import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import type { Expense } from '../../types'
import { fmtTsh, today } from '../../lib/utils'
import { Plus, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react'

const FIXED = ['Kodi ya Duka', 'Mishahara', 'Ulinzi', 'Umeme wa Luku', 'Leseni ya Biashara', 'Bima']
const VARIABLE = ['Mafuta ya Gari', 'Per Diem ya Dereva', 'Mizigo ya Kupakua', 'Mifuko ya Kufungashia', 'Vifaa vya Ofisi', 'Matengenezo']
const CAPITAL = ['Meza Mpya', 'Gari', 'Jengo', 'Kompyuta', 'Furniture']

const empty: Omit<Expense, 'id'> = {
  category: 'variable', subCategory: 'Mafuta ya Gari', description: '', amount: 0,
  date: today(), paidTo: '', paymentMethod: 'Cash', enteredBy: '', status: 'pending',
  recurring: false, requestedBy: '',
}

export default function ExpensesPage() {
  const { user } = useAuth()
  const { expenses, addExpense, approveExpense } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [filter, setFilter] = useState<'all' | 'fixed' | 'variable' | 'capital' | 'pending'>('all')
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const subs = form.category === 'fixed' ? FIXED : form.category === 'variable' ? VARIABLE : CAPITAL
  const isAdmin = user?.role === 'admin'

  const save = () => {
    if (!form.description.trim() || form.amount <= 0) return
    // ADMIN anaweza ku-approve papo hapo; wengine wote wanaingia 'pending'
    addExpense({
      ...form,
      enteredBy: user?.name || '',
      requestedBy: user?.name || '',
      status: isAdmin ? 'approved' : 'pending',
      approvedBy: isAdmin ? user?.name : undefined,
      approvedAt: isAdmin ? new Date().toISOString() : undefined,
    })
    setOpen(false); setForm(empty)
  }

  const confirmReject = () => {
    if (!rejectId) return
    approveExpense(rejectId, false, user?.name || 'admin', rejectReason || 'Imekataliwa na admin')
    setRejectId(null); setRejectReason('')
  }

  const filtered = expenses.filter(e => {
    if (filter === 'all') return true
    if (filter === 'pending') return e.status === 'pending'
    return e.category === filter
  })

  const totals = {
    fixed: expenses.filter(e => e.category === 'fixed' && e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    variable: expenses.filter(e => e.category === 'variable' && e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    capital: expenses.filter(e => e.category === 'capital' && e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    pending: expenses.filter(e => e.status === 'pending').length,
  }

  return (
    <Layout title="Gharama za Uendeshaji (OPEX)">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-xs text-slate-500">Kudumu</div><div className="text-xl font-bold">{fmtTsh(totals.fixed)}</div></Card>
        <Card className="p-4"><div className="text-xs text-slate-500">Kubadilika</div><div className="text-xl font-bold">{fmtTsh(totals.variable)}</div></Card>
        <Card className="p-4"><div className="text-xs text-slate-500">Mtaji</div><div className="text-xl font-bold">{fmtTsh(totals.capital)}</div></Card>
        <Card className="p-4"><div className="text-xs text-slate-500">Zinasubiri Idhini</div><div className="text-xl font-bold text-amber-600">{totals.pending}</div></Card>
      </div>

      {!isAdmin && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            Gharama zote unazounda zinaingia kama <b>"Inasubiri"</b> hadi Admin azidhinishe.
            Ukishaidhinishwa tu ndipo itahesabika kwenye gharama halisi za duka.
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['all', 'fixed', 'variable', 'capital', 'pending'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap ${filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
            {f === 'all' ? 'Zote' : f === 'fixed' ? 'Kudumu' : f === 'variable' ? 'Kubadilika' : f === 'capital' ? 'Mtaji' : 'Zinasubiri'}
          </button>
        ))}
        <div className="flex-1" />
        <Button onClick={() => { setForm({ ...empty, enteredBy: user?.name || '', requestedBy: user?.name || '' }); setOpen(true) }}>
          <span className="flex items-center gap-2"><Plus size={16} /> Gharama Mpya</span>
        </Button>
      </div>

      <Card>
        <Table head={['Tarehe', 'Kundi', 'Maelezo', 'Kiasi', 'Malipo', 'Aliyelipwa', 'Aliyeomba', 'Hali', '']}>
          {filtered.map(e => (
            <tr key={e.id} className="hover:bg-slate-50">
              <Td className="text-xs">{e.date}</Td>
              <Td>
                <Badge color={e.category === 'fixed' ? 'blue' : e.category === 'variable' ? 'amber' : 'purple'}>
                  {e.category === 'fixed' ? 'Kudumu' : e.category === 'variable' ? 'Kubadilika' : 'Mtaji'}
                </Badge>
                <div className="text-xs text-slate-500 mt-1">{e.subCategory}</div>
              </Td>
              <Td>
                <div className="font-medium">{e.description}</div>
                {e.recurring && <span className="text-xs text-slate-500">↻ Kila mwezi</span>}
              </Td>
              <Td className="font-medium">{fmtTsh(e.amount)}</Td>
              <Td className="text-xs">{e.paymentMethod}</Td>
              <Td className="text-sm">{e.paidTo}</Td>
              <Td className="text-xs text-slate-600">{e.requestedBy || e.enteredBy}</Td>
              <Td>
                <Badge color={e.status === 'approved' ? 'green' : e.status === 'pending' ? 'amber' : 'red'}>
                  {e.status === 'approved' ? 'Imeidhinishwa' : e.status === 'pending' ? 'Inasubiri Admin' : 'Imekataliwa'}
                </Badge>
                {e.approvedBy && e.status === 'approved' && (
                  <div className="text-[10px] text-slate-500 mt-1">Na: {e.approvedBy}</div>
                )}
                {e.rejectionReason && e.status === 'rejected' && (
                  <div className="text-[10px] text-red-600 mt-1">{e.rejectionReason}</div>
                )}
              </Td>
              <Td>
                {e.status === 'pending' && isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => approveExpense(e.id, true, user?.name || 'admin')}
                      className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"
                      title="Idhinisha">
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => { setRejectId(e.id); setRejectReason('') }}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                      title="Kataa">
                      <XCircle size={16} />
                    </button>
                  </div>
                )}
                {e.status === 'pending' && !isAdmin && (
                  <span className="text-[10px] text-slate-400">Inasubiri admin</span>
                )}
              </Td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={9} className="text-center py-10 text-slate-500">Hakuna gharama</td></tr>
          )}
        </Table>
      </Card>

      {/* CREATE */}
      <Modal open={open} onClose={() => setOpen(false)} title="Ongeza Gharama" size="md">
        <div className="space-y-3">
          <Select label="Kundi la Gharama" value={form.category}
            onChange={e => {
              const c = e.target.value as Expense['category']
              const firstSub = c === 'fixed' ? FIXED[0] : c === 'variable' ? VARIABLE[0] : CAPITAL[0]
              setForm({ ...form, category: c, subCategory: firstSub })
            }}>
            <option value="fixed">Kudumu (Fixed)</option>
            <option value="variable">Kubadilika (Variable)</option>
            <option value="capital">Mtaji (Capital)</option>
          </Select>

          <Select label="Aina" value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })}>
            {subs.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>

          <Input label="Maelezo *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <Input label="Kiasi (Tsh) *" type="number" value={form.amount}
            onChange={e => setForm({ ...form, amount: Number(e.target.value) || 0 })} />
          <Input label="Tarehe" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Input label="Aliyelipwa" value={form.paidTo} onChange={e => setForm({ ...form, paidTo: e.target.value })} />
          <Select label="Njia ya Malipo" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
            <option>Cash</option><option>M-Pesa</option><option>Tigo Pesa</option><option>Benki</option>
          </Select>
          <Input label="Namba ya Risiti" value={form.receiptNo || ''} onChange={e => setForm({ ...form, receiptNo: e.target.value })} />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.recurring}
              onChange={e => setForm({ ...form, recurring: e.target.checked })} />
            Gharama ya kujirudia kila mwezi
          </label>

          {!isAdmin && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800 flex gap-2">
              <Send size={16} className="flex-shrink-0" />
              Gharama hii itatumwa kwa Admin kwa idhini. Haitahesabika kama gharama halisi hadi idhinishwe.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save}>{isAdmin ? 'Hifadhi & Idhinisha' : 'Tuma kwa Idhini'}</Button>
          </div>
        </div>
      </Modal>

      {/* REJECT */}
      <Modal open={!!rejectId} onClose={() => setRejectId(null)} title="Kataa Gharama" size="sm">
        <p className="text-sm text-slate-600 mb-3">Eleza sababu ya kukataa (hiari):</p>
        <Input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Mfano: Risiti haipo" />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setRejectId(null)}>Ghairi</Button>
          <Button variant="danger" onClick={confirmReject}>Kataa</Button>
        </div>
      </Modal>
    </Layout>
  )
}