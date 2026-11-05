import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import { Card } from '../../components/ui/Card'
import  type { Supplier } from '../../types'
import { fmtTsh } from '../../lib/utils'
import { Plus, Truck } from 'lucide-react'

const empty: Omit<Supplier, 'id'> = { name: '', phone: '', email: '', balance: 0 }

export default function SuppliersPage() {
  const { suppliers, purchases, addSupplier } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)

  const save = () => {
    if (!form.name.trim()) return
    addSupplier(form)
    setOpen(false); setForm(empty)
  }

  const supplierPurchases = (name: string) => purchases.filter(p => p.supplierName === name)

  return (
    <Layout title="Wasambazaji (Suppliers)">
      <div className="flex justify-end mb-5">
        <Button onClick={() => { setForm(empty); setOpen(true) }}>
          <span className="flex items-center gap-2"><Plus size={16} /> Msambazaji Mpya</span>
        </Button>
      </div>

      <Card>
        <Table head={['Jina', 'Simu', 'Email', 'Deni la Sisi', 'Manunuzi', 'Bei ya Mwisho']}>
          {suppliers.map(s => {
            const sp = supplierPurchases(s.name)
            const lastP = sp[0]?.total || 0
            return (
              <tr key={s.id} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-slate-400" />
                    <span className="font-medium">{s.name}</span>
                  </div>
                </Td>
                <Td className="text-sm">{s.phone}</Td>
                <Td className="text-sm text-slate-500">{s.email || '—'}</Td>
                <Td className={s.balance > 0 ? 'text-red-600 font-semibold' : 'text-slate-400'}>
                  {s.balance > 0 ? fmtTsh(s.balance) : '—'}
                </Td>
                <Td>{sp.length} LPO</Td>
                <Td>{lastP > 0 ? fmtTsh(lastP) : '—'}</Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Msambazaji Mpya" size="md">
        <div className="space-y-3">
          <Input label="Jina *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Simu" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Deni la Sisi (Tsh)" type="number" value={form.balance}
            onChange={e => setForm({ ...form, balance: Number(e.target.value) || 0 })} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save}>Hifadhi</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}