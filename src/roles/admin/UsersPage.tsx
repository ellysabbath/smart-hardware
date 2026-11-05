import { useState } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ConfirmModal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import type { User, Role } from '../../types'
import { uid } from '../../lib/utils'
import { Plus, Trash2, Shield, UserCheck, UserX } from 'lucide-react'

const empty: Omit<User, 'id'> = { name: '', username: '', password: '', role: 'seller', active: true }

export default function UsersPage() {
  const { users, setUsers } = useAuth()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [delId, setDelId] = useState<string | null>(null)

  const save = () => {
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) return
    setUsers([...users, { ...form, id: uid() }])
    setOpen(false); setForm(empty)
  }

  const toggle = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u))
  }

  const confirmDelete = () => {
    if (delId) { setUsers(users.filter(u => u.id !== delId)); setDelId(null) }
  }

  return (
    <Layout title="Usimamizi wa Watumiaji">
      <div className="flex justify-end mb-5">
        <Button onClick={() => { setForm(empty); setOpen(true) }}>
          <span className="flex items-center gap-2"><Plus size={16} /> Mtumiaji Mpya</span>
        </Button>
      </div>

      <Card>
        <Table head={['Jina', 'Username', 'Wajibu', 'Hali', 'Vitendo']}>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-slate-50">
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-medium">{u.name}</span>
                </div>
              </Td>
              <Td className="font-mono text-xs">{u.username}</Td>
              <Td>
                <Badge color={
                  u.role === 'admin' ? 'red' : u.role === 'owner' ? 'purple'
                    : u.role === 'warehouse' ? 'amber' : 'blue'
                }>{u.role}</Badge>
              </Td>
              <Td>
                {u.active
                  ? <Badge color="green"><span className="flex items-center gap-1"><UserCheck size={10} /> Active</span></Badge>
                  : <Badge color="red"><span className="flex items-center gap-1"><UserX size={10} /> Disabled</span></Badge>}
              </Td>
              <Td>
                <div className="flex gap-2">
                  <button onClick={() => toggle(u.id)} className="text-xs text-brand-600 hover:underline">
                    {u.active ? 'Zima' : 'Washa'}
                  </button>
                  <button onClick={() => setDelId(u.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Mtumiaji Mpya" size="md">
        <div className="space-y-3">
          <Input label="Jina Kamili *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Username *" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <Input label="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <Select label="Wajibu (Role)" value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value as Role })}>
            <option value="admin">Admin — Anaona kila kitu</option>
            <option value="seller">Muuzaji — POS tu</option>
            <option value="warehouse">Mhazini — Stoo tu</option>
            <option value="owner">Mmiliki — Ripoti tu</option>
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save}>Hifadhi</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!delId}
        title="Futa Mtumiaji"
        message="Una uhakika unataka kufuta mtumiaji huyu? Hataweza ku-access system tena."
        confirmText="Futa"
        onConfirm={confirmDelete}
        onCancel={() => setDelId(null)}
      />
    </Layout>
  )
}