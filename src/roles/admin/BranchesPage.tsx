import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Plus, Store } from 'lucide-react'

const empty = { name: '', location: '', phone: '', active: true }

export default function BranchesPage() {
  const { branches, addBranch } = useData()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)

  const save = () => {
    if (!form.name.trim() || !form.location.trim()) return
    addBranch(form)
    setOpen(false); setForm(empty)
  }

  return (
    <Layout title="Usimamizi wa Maduka (Branches)">
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-slate-500">Duka Kuu na maduka mengine</div>
        <Button onClick={() => { setForm(empty); setOpen(true) }}>
          <span className="flex items-center gap-2"><Plus size={16} /> Duka Jipya</span>
        </Button>
      </div>

      <Card>
        <Table head={['Jina la Duka', 'Mahali', 'Simu', 'Hali']}>
          {branches.map(b => (
            <tr key={b.id} className="hover:bg-slate-50">
              <Td className="font-medium flex items-center gap-2">
                <Store size={16} className="text-brand-600" />
                {b.name}
              </Td>
              <Td>{b.location}</Td>
              <Td>{b.phone}</Td>
              <Td><Badge color={b.active ? 'green' : 'red'}>{b.active ? 'Wazi' : 'Imefungwa'}</Badge></Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Ongeza Duka Jipya" size="md">
        <div className="space-y-3">
          <Input label="Jina la Duka *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Mahali (Location) *" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <Input label="Simu" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save}>Hifadhi Duka</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}