import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { type Sale } from '../../types'
import { fmtTsh } from '../../lib/utils'
import { Receipt, Undo2 } from 'lucide-react'

export default function SalesHistoryPage() {
  const { sales, returnSale } = useData()
  const [view, setView] = useState<Sale | null>(null)
  const [returnOpen, setReturnOpen] = useState(false)
  const [returnQty, setReturnQty] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')

  const filtered = sales.filter(s =>
    !search || s.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  )

  const openReturn = (s: Sale) => {
    setReturnQty({})
    setView(s)
    setReturnOpen(true)
  }

  const doReturn = () => {
    if (!view) return
    const items = Object.entries(returnQty)
      .filter(([, qty]) => qty > 0)
      .map(([productId, qty]) => ({ productId, qty }))
    if (items.length === 0) return
    returnSale(view.id, items)
    setReturnOpen(false)
    setView(null)
  }

  return (
    <Layout title="Historia ya Mauzo">
      <div className="flex gap-3 mb-5">
        <Input placeholder="Tafuta risiti au mteja..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
      </div>

      <Card>
        <Table head={['Risiti', 'Mteja', 'Bidhaa', 'Jumla', 'Malipo', 'Hali', 'Tarehe', '']}>
          {filtered.map(s => (
            <tr key={s.id} className="hover:bg-slate-50">
              <Td><span className="font-mono text-xs">{s.receiptNo}</span></Td>
              <Td>{s.customerName}</Td>
              <Td>{s.items.length} bidhaa</Td>
              <Td className="font-medium">{fmtTsh(s.total)}</Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {s.payments.map((p, k) => (
                    <Badge key={k} color={
                      p.method === 'cash' ? 'green' : p.method === 'credit' ? 'red' : 'blue'
                    }>{p.method}</Badge>
                  ))}
                </div>
              </Td>
              <Td>
                <Badge color={
                  s.status === 'completed' ? 'green' : s.status === 'returned' ? 'red' : 'amber'
                }>{s.status === 'completed' ? 'Imekamilika' : s.status === 'returned' ? 'Imerudishwa' : 'Rudisha kidogo'}</Badge>
              </Td>
              <Td><span className="text-xs text-slate-500">{s.createdAt.slice(0, 16).replace('T', ' ')}</span></Td>
              <Td>
                <div className="flex gap-2">
                  <button onClick={() => setView(s)} title="Ona risiti" className="text-brand-600 hover:bg-blue-50 p-1 rounded">
                    <Receipt size={16} />
                  </button>
                  {s.status === 'completed' && (
                    <button onClick={() => openReturn(s)} title="Rudisha bidhaa" className="text-red-600 hover:bg-red-50 p-1 rounded">
                      <Undo2 size={16} />
                    </button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={8} className="text-center py-10 text-slate-500">Hakuna mauzo bado</td></tr>
          )}
        </Table>
      </Card>

      {/* VIEW RECEIPT */}
      <Modal open={!!view && !returnOpen} onClose={() => setView(null)} title={`Risiti ${view?.receiptNo || ''}`} size="md">
        {view && (
          <div className="space-y-3">
            <div className="text-center border-b pb-3">
              <div className="font-bold text-lg">SMART HARDWARE</div>
              <div className="text-xs text-slate-500">TIN: 123-456-789 | VRN: 98765432A</div>
            </div>
            <div className="text-xs space-y-1">
              <div><b>Risiti:</b> {view.receiptNo}</div>
              <div><b>Mteja:</b> {view.customerName}</div>
              <div><b>Tarehe:</b> {view.createdAt.slice(0, 16).replace('T', ' ')}</div>
              <div><b>Muuzaji:</b> {view.createdBy}</div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-2 py-1">Bidhaa</th>
                  <th className="text-right px-2 py-1">Idadi</th>
                  <th className="text-right px-2 py-1">Bei</th>
                  <th className="text-right px-2 py-1">Jumla</th>
                </tr>
              </thead>
              <tbody>
                {view.items.map((i, k) => (
                  <tr key={k} className="border-b">
                    <td className="px-2 py-1">{i.productName}</td>
                    <td className="text-right px-2 py-1">{i.qty} {i.unit}</td>
                    <td className="text-right px-2 py-1">{fmtTsh(i.price)}</td>
                    <td className="text-right px-2 py-1">{fmtTsh(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right text-sm space-y-1 border-t pt-2">
              <div>Subtotal: {fmtTsh(view.subtotal)}</div>
              <div>Punguzo: {fmtTsh(view.discount)}</div>
              <div className="text-lg font-bold">Jumla: {fmtTsh(view.total)}</div>
            </div>
            <div className="text-xs space-y-1 border-t pt-2">
              {view.payments.map((p, k) => (
                <div key={k} className="flex justify-between"><span>{p.method}</span><span>{fmtTsh(p.amount)}</span></div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* RETURN */}
      <Modal open={returnOpen} onClose={() => setReturnOpen(false)} title="Rudisha Bidhaa" size="md">
        {view && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Weka idadi ya kurudisha kwa kila bidhaa:</p>
            <table className="w-full text-sm border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-2 py-1">Bidhaa</th>
                  <th className="text-right px-2 py-1">Iliuzwa</th>
                  <th className="text-right px-2 py-1">Rudisha</th>
                </tr>
              </thead>
              <tbody>
                {view.items.map(i => (
                  <tr key={i.productId} className="border-b">
                    <td className="px-2 py-1">{i.productName}</td>
                    <td className="text-right px-2 py-1">{i.qty}</td>
                    <td className="text-right px-2 py-1">
                      <input type="number" min={0} max={i.qty}
                        value={returnQty[i.productId] || 0}
                        onChange={e => setReturnQty({ ...returnQty, [i.productId]: Math.min(i.qty, Math.max(0, Number(e.target.value) || 0)) })}
                        className="w-20 border rounded px-2 py-1 text-right" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setReturnOpen(false)}>Ghairi</Button>
              <Button variant="danger" onClick={doReturn}>Rudisha & Rejesha Pesa</Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}