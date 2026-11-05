import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { type Customer } from '../../types'
import { fmtTsh } from '../../lib/utils'
import { Plus, User, Phone, MessageSquare } from 'lucide-react'

const empty: Omit<Customer, 'id' | 'createdAt'> = {
  name: '', phone: '', email: '', type: 'mteja', balance: 0,
}

export default function CustomersPage() {
  const { customers, sales, addCustomer, updateCustomer } = useData()
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Customer | null>(null)
  const [form, setForm] = useState(empty)
  const [viewCust, setViewCust] = useState<Customer | null>(null)

  const openNew = () => { setEdit(null); setForm(empty); setOpen(true) }
  const openEdit = (c: Customer) => {
    setEdit(c)
    const { id, createdAt, ...rest } = c
    setForm(rest); setOpen(true)
  }
  const save = () => {
    if (!form.name.trim() || !form.phone.trim()) return
    if (edit) updateCustomer({ ...edit, ...form })
    else addCustomer(form)
    setOpen(false)
  }

  const debts = customers.filter(c => c.balance > 0)
  const totalDebt = debts.reduce((s, c) => s + c.balance, 0)

  const customerSales = (id: string) => sales.filter(s => s.customerId === id)

  return (
    <Layout title="Wateja (Customers)">
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card className="p-4"><div className="text-xs text-slate-500">Wateja Wote</div><div className="text-2xl font-bold">{customers.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-slate-500">Wenye Madeni</div><div className="text-2xl font-bold text-red-600">{debts.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-slate-500">Jumla ya Madeni</div><div className="text-2xl font-bold text-red-600">{fmtTsh(totalDebt)}</div></Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={openNew}><span className="flex items-center gap-2"><Plus size={16} /> Mteja Mpya</span></Button>
      </div>

      <Card>
        <Table head={['Jina', 'Simu', 'Aina', 'Deni', 'Manunuzi', 'Vitendo']}>
          {customers.map(c => (
            <tr key={c.id} className="hover:bg-slate-50">
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-xs">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{c.name}</span>
                </div>
              </Td>
              <Td className="text-sm">{c.phone}</Td>
              <Td><Badge color="blue">{c.type}</Badge></Td>
              <Td className={c.balance > 0 ? 'text-red-600 font-semibold' : 'text-slate-400'}>
                {c.balance > 0 ? fmtTsh(c.balance) : '—'}
              </Td>
              <Td>{customerSales(c.id).length}</Td>
              <Td>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setViewCust(c)} className="text-brand-600 hover:underline">Ona</button>
                  <button onClick={() => openEdit(c)} className="text-blue-600 hover:underline">Badilisha</button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Badilisha Mteja' : 'Mteja Mpya'} size="md">
        <div className="space-y-3">
          <Input label="Jina *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Simu *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="07xxxxxxxx" />
          <Input label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Select label="Aina" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
            <option value="mteja">Mteja wa Kawaida</option>
            <option value="fundi">Fundi</option>
            <option value="mjenzi">Mjenzi</option>
            <option value="kampuni">Kampuni</option>
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save}>Hifadhi</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewCust} onClose={() => setViewCust(null)} title={viewCust?.name || ''} size="lg">
        {viewCust && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><User size={14} className="inline mr-1" /> {viewCust.name}</div>
              <div><Phone size={14} className="inline mr-1" /> {viewCust.phone}</div>
              <div className="col-span-2">
                <b>Deni la Sasa:</b> <span className={viewCust.balance > 0 ? 'text-red-600 font-bold' : 'text-emerald-600'}>
                  {fmtTsh(viewCust.balance)}
                </span>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="font-semibold mb-2">Historia ya Manunuzi</div>
              <Table head={['Risiti', 'Jumla', 'Tarehe', 'Hali']}>
                {customerSales(viewCust.id).map(s => (
                  <tr key={s.id}>
                    <Td className="font-mono text-xs">{s.receiptNo}</Td>
                    <Td>{fmtTsh(s.total)}</Td>
                    <Td className="text-xs">{s.createdAt.slice(0, 10)}</Td>
                    <Td><Badge color={s.status === 'completed' ? 'green' : 'amber'}>{s.status}</Badge></Td>
                  </tr>
                ))}
                {customerSales(viewCust.id).length === 0 && (
                  <tr><td colSpan={4} className="text-center py-4 text-slate-500">Hakuna manunuzi</td></tr>
                )}
              </Table>
            </div>
            {viewCust.balance > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800 flex items-start gap-2">
                <MessageSquare size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <b>Ukumbusho wa Deni:</b> Ndugu {viewCust.name}, deni lako la {fmtTsh(viewCust.balance)} linahitaji kulipwa.
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  )
}