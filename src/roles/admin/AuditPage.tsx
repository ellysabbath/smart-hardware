import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { Shield, Search } from 'lucide-react'

export default function AuditPage() {
  const { audit } = useData()
  const [search, setSearch] = useState('')
  const [userFilter, setUserFilter] = useState('')

  const users = Array.from(new Set(audit.map(a => a.userName)))
  const filtered = audit.filter(a => {
    const matchSearch = !search || a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase())
    const matchUser = !userFilter || a.userName === userFilter
    return matchSearch && matchUser
  })

  return (
    <Layout title="Kumbukumbu ya Vitendo (Audit Trail)">
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tafuta kitendo au maelezo..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
        </div>
        <Select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="max-w-xs">
          <option value="">Watumiaji wote</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </Select>
      </div>

      <Card>
        <div className="px-4 py-3 border-b flex items-center gap-2 text-sm text-slate-500">
          <Shield size={16} /> Jumla ya vitendo: {filtered.length}
        </div>
        <Table head={['Tarehe & Saa', 'Mtumiaji', 'Kitendo', 'Maelezo']}>
          {filtered.slice(0, 200).map(a => (
            <tr key={a.id} className="hover:bg-slate-50">
              <Td className="text-xs whitespace-nowrap">{a.timestamp.slice(0, 19).replace('T', ' ')}</Td>
              <Td><span className="font-medium">{a.userName}</span></Td>
              <Td>
                <Badge color={
                  a.action.includes('DELETE') ? 'red'
                    : a.action.includes('CREATE') ? 'green'
                      : a.action === 'SALE' ? 'blue'
                        : 'slate'
                }>{a.action}</Badge>
              </Td>
              <Td className="text-sm text-slate-700">{a.details}</Td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center py-10 text-slate-500">Hakuna vitendo</td></tr>
          )}
        </Table>
      </Card>
    </Layout>
  )
}