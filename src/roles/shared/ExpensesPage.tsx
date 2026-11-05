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
import { Plus, CheckCircle, XCircle, Wallet, AlertTriangle } from 'lucide-react'

const FIXED = ['Kodi ya Duka', 'Mishahara', 'Ulinzi', 'Umeme wa Luku', 'Leseni ya Biashara', 'Bima']
const VARIABLE = ['Mafuta ya Gari', 'Per Diem ya Dereva', 'Mizigo ya Kupakua', 'Mifuko ya Kufungashia', 'Vifaa vya Ofisi', 'Matengenezo']
const CAPITAL = ['Meza Mpya', 'Gari', 'Jengo', 'Kompyuta', 'Furniture']

const empty: Omit<Expense, 'id'> = {
  category: 'variable', subCategory: 'Mafuta ya Gari', description: '', amount: 0,
  date: today(), paidTo: '', paymentMethod: 'Cash', enteredBy: '', status: 'approved', recurring: false,
}

const APPROVAL_THRESHOLD = 100000

export default function ExpensesPage() {
  const { user } = useAuth()
  const { expenses, addExpense, approveExpense } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [filter, setFilter] = useState<'all' | 'fixed' | 'variable' | 'capital' | 'pending'>('all')

  const subs = form.category === 'fixed' ? FIXED : form.category === 'variable' ? VARIABLE : CAPITAL

  const save = () => {
    if (!form.description.trim() || form.amount <= 0) return
    const needsApproval = form.amount > APPROVAL_THRESHOLD && user?.role !== 'admin' && user?.role !== 'owner'
    addExpense({
      ...form,
      enteredBy: user?.name || '',
      status: needsApproval ? 'pending' : 'approved',
    })
    setOpen(false); setForm(empty)
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

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['all', 'fixed', 'variable', 'capital', 'pending'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap ${filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
            {f === 'all' ? 'Zote' : f === 'fixed' ? 'Kudumu' : f === 'variable' ? 'Kubadilika' : f === 'capital' ? 'Mtaji' : 'Zinasubiri'}
          </button>
        ))}
        <div className="flex-1" />
        <Button onClick={() => { setForm(empty); setOpen(true) }}>
          <span className="flex items-center gap-2"><Plus size={16} /> Gharama Mpya</span>
        </Button>
      </div>

      <Card>
        <Table head={['Tarehe', 'Kundi', 'Maelezo', 'Kiasi', 'Malipo', 'Aliyelipwa', 'Hali', '']}>
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
              <Td>
                <Badge color={e.status === 'approved' ? 'green' : e.status === 'pending' ? 'amber' : 'red'}>
                  {e.status === 'approved' ? 'Imeidhinishwa' : e.status === 'pending' ? 'Inasubiri' : 'Imekataliwa'}
                </Badge>
              </Td>
              <Td>
                {e.status === 'pending' && (user?.role === 'admin' || user?.role === 'owner') && (
                  <div className="flex gap-1">
                    <button onClick={() => approveExpense(e.id, true)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded" title="Idhinisha">
                      <CheckCircle size={16} />
                    </button>
                    <button onClick={() => approveExpense(e.id, false)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Kataa">
                      <XCircle size={16} />
                    </button>
                  </div>
                )}
              </Td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={8} className="text-center py-10 text-slate-500">Hakuna gharama</td></tr>
          )}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ongeza Gharama" size="md">
        <div className="space-y-3">
          <Select label="Kundi la Gharama" value={form.category}
            onChange={e => {
              const c = e.target.value as any
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

          {form.amount > APPROVAL_THRESHOLD && user?.role !== 'admin' && user?.role !== 'owner' && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800 flex gap-2">
              <AlertTriangle size={16} className="flex-shrink-0" />
              Kiasi hiki kinazidi {fmtTsh(APPROVAL_THRESHOLD)}. Kitahitaji idhini ya Admin/Mmiliki.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save}>Hifadhi</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}