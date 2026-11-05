import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import type { Purchase } from '../../types'
import { fmtTsh } from '../../lib/utils'
import { Package, AlertCircle } from 'lucide-react'

export default function GRNPage() {
  const { purchases, grns, receivePurchase } = useData()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Purchase | null>(null)
  const [received, setReceived] = useState<Record<string, number>>({})

  const pending = purchases.filter(p => p.status !== 'received')

  const startReceiving = (p: Purchase) => {
    setSelected(p)
    setReceived(Object.fromEntries(p.items.map(i => [i.productId, i.qty])))
    setOpen(true)
  }

  const submit = () => {
    if (!selected) return
    const items = Object.entries(received).map(([productId, qty]) => ({ productId, qty }))
    receivePurchase(selected.id, items)
    setOpen(false)
    setSelected(null)
  }

  return (
    <Layout title="Kupokea Mizigo (GRN)">
      <div className="mb-5 text-sm text-slate-500">
        Rekodi mizigo iliyopokelewa dhidi ya LPO. System itaonyesha upungufu.
      </div>

      <Card className="mb-5">
        <div className="p-4 border-b border-slate-200 font-semibold">Oda Zinazosubiri Kupokelewa</div>
        <Table head={['LPO', 'Msambazaji', 'Jumla', 'Hali', 'Tarehe', '']}>
          {pending.map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <Td className="font-mono text-xs">{p.lpoNo}</Td>
              <Td>{p.supplierName}</Td>
              <Td className="font-medium">{fmtTsh(p.total)}</Td>
              <Td><Badge color={p.status === 'partial' ? 'amber' : 'blue'}>{p.status}</Badge></Td>
              <Td className="text-xs">{p.createdAt.slice(0, 10)}</Td>
              <Td>
                <Button size="sm" onClick={() => startReceiving(p)}>
                  <span className="flex items-center gap-1"><Package size={14} /> Pokea</span>
                </Button>
              </Td>
            </tr>
          ))}
          {pending.length === 0 && (
            <tr><td colSpan={6} className="text-center py-10 text-slate-500">Hakuna oda zinazosubiri</td></tr>
          )}
        </Table>
      </Card>

      <Card>
        <div className="p-4 border-b border-slate-200 font-semibold">Historia ya GRN</div>
        <Table head={['GRN', 'LPO', 'Tarehe', 'Bidhaa Zilizopokelewa', '']}>
          {grns.map(g => {
            const purch = purchases.find(p => p.id === g.purchaseId)
            const shortages = g.items.filter(i => i.received < i.ordered)
            return (
              <tr key={g.id} className="hover:bg-slate-50">
                <Td className="font-mono text-xs">{g.grnNo}</Td>
                <Td className="font-mono text-xs">{purch?.lpoNo || '—'}</Td>
                <Td className="text-xs">{g.createdAt.slice(0, 16).replace('T', ' ')}</Td>
                <Td>{g.items.map(i => `${i.productName}: ${i.received}/${i.ordered}`).join(', ')}</Td>
                <Td>
                  {shortages.length > 0 && (
                    <Badge color="red">
                      <span className="flex items-center gap-1"><AlertCircle size={10} /> Upungufu</span>
                    </Badge>
                  )}
                </Td>
              </tr>
            )
          })}
          {grns.length === 0 && (
            <tr><td colSpan={5} className="text-center py-10 text-slate-500">Hakuna GRN bado</td></tr>
          )}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={`Pokea Mizigo - ${selected?.lpoNo || ''}`} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="text-sm text-slate-600">Ingiza idadi iliyopokelewa. System itaonyesha upungufu.</div>
            <table className="w-full text-sm border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-2 py-1">Bidhaa</th>
                  <th className="text-right px-2 py-1">Iliyoagizwa</th>
                  <th className="text-right px-2 py-1">Imepokelewa</th>
                  <th className="text-right px-2 py-1">Upungufu</th>
                </tr>
              </thead>
              <tbody>
                {selected.items.map(i => {
                  const rec = received[i.productId] || 0
                  const diff = i.qty - rec
                  return (
                    <tr key={i.productId} className="border-b">
                      <td className="px-2 py-1">{i.productName}</td>
                      <td className="text-right px-2 py-1">{i.qty}</td>
                      <td className="text-right px-2 py-1">
                        <input type="number" min={0} value={rec}
                          onChange={e => setReceived({ ...received, [i.productId]: Number(e.target.value) || 0 })}
                          className="w-20 border rounded px-2 py-1 text-right" />
                      </td>
                      <td className={`text-right px-2 py-1 ${diff > 0 ? 'text-red-600 font-medium' : 'text-slate-400'}`}>
                        {diff > 0 ? diff : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
              <Button onClick={submit}>Kamilisha GRN</Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}