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
import type { PurchaseItem } from '../../types'
import { fmtTsh } from '../../lib/utils'
import { Plus, Trash2, Truck } from 'lucide-react'

interface Line { productId: string; qty: number; price: number }

export default function PurchasesPage() {
  const { products, suppliers, purchases, addPurchase } = useData()
  const [open, setOpen] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [lines, setLines] = useState<Line[]>([])
  const [productToAdd, setProductToAdd] = useState('')

  const linesDetailed = lines.map(l => {
    const p = products.find(x => x.id === l.productId)!
    return { ...l, product: p }
  }).filter(l => l.product)
  const total = linesDetailed.reduce((s, l) => s + l.price * l.qty, 0)

  const addLine = () => {
    if (!productToAdd) return
    const p = products.find(x => x.id === productToAdd)!
    if (lines.some(l => l.productId === productToAdd)) {
      setLines(lines.map(l => l.productId === productToAdd ? { ...l, qty: l.qty + 1 } : l))
    } else {
      setLines([...lines, { productId: productToAdd, qty: 1, price: p.buyPrice }])
    }
    setProductToAdd('')
  }

  const save = () => {
    const sup = suppliers.find(s => s.id === supplierId)
    if (!sup || lines.length === 0) return
    const items: PurchaseItem[] = linesDetailed.map(l => ({
      productId: l.product.id, productName: l.product.name, qty: l.qty, price: l.price,
    }))
    addPurchase({ supplierId, supplierName: sup.name, items, total, status: 'pending' })
    setOpen(false); setSupplierId(''); setLines([])
  }

  return (
    <Layout title="Ununuzi (LPO)">
      <div className="flex justify-end mb-5">
        <Button onClick={() => { setSupplierId(''); setLines([]); setOpen(true) }}>
          <span className="flex items-center gap-2"><Plus size={16} /> LPO Mpya</span>
        </Button>
      </div>

      <Card>
        <Table head={['LPO', 'Msambazaji', 'Bidhaa', 'Jumla', 'Hali', 'Tarehe', '']}>
          {purchases.map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <Td className="font-mono text-xs">{p.lpoNo}</Td>
              <Td>{p.supplierName}</Td>
              <Td>{p.items.length} bidhaa</Td>
              <Td className="font-medium">{fmtTsh(p.total)}</Td>
              <Td><Badge color={p.status === 'received' ? 'green' : p.status === 'partial' ? 'amber' : 'blue'}>{p.status}</Badge></Td>
              <Td className="text-xs">{p.createdAt.slice(0, 10)}</Td>
              <Td>
                <button className="text-xs text-brand-600 hover:underline" title="Angalia">
                  <Truck size={14} />
                </button>
              </Td>
            </tr>
          ))}
          {purchases.length === 0 && (
            <tr><td colSpan={7} className="text-center py-10 text-slate-500">Hakuna LPO bado</td></tr>
          )}
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Oda Mpya ya Ununuzi (LPO)" size="lg">
        <div className="space-y-4">
          <Select label="Msambazaji" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
            <option value="">— Chagua —</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>

          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={productToAdd} onChange={e => setProductToAdd(e.target.value)}>
                <option value="">— Ongeza bidhaa —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>
            <Button onClick={addLine} disabled={!productToAdd}>Ongeza</Button>
          </div>

          {linesDetailed.length > 0 && (
            <table className="w-full text-sm border">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-2 py-1">Bidhaa</th>
                  <th className="text-right px-2 py-1">Idadi</th>
                  <th className="text-right px-2 py-1">Bei</th>
                  <th className="text-right px-2 py-1">Jumla</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {linesDetailed.map(l => (
                  <tr key={l.productId} className="border-b">
                    <td className="px-2 py-1">{l.product.name}</td>
                    <td className="text-right px-2 py-1">
                      <input type="number" value={l.qty}
                        onChange={e => setLines(lines.map(x => x.productId === l.productId ? { ...x, qty: Number(e.target.value) || 1 } : x))}
                        className="w-16 border rounded px-2 py-1 text-right" />
                    </td>
                    <td className="text-right px-2 py-1">
                      <input type="number" value={l.price}
                        onChange={e => setLines(lines.map(x => x.productId === l.productId ? { ...x, price: Number(e.target.value) || 0 } : x))}
                        className="w-24 border rounded px-2 py-1 text-right" />
                    </td>
                    <td className="text-right px-2 py-1 font-medium">{fmtTsh(l.price * l.qty)}</td>
                    <td className="text-right px-2 py-1">
                      <button onClick={() => setLines(lines.filter(x => x.productId !== l.productId))}
                        className="text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="text-right text-lg font-bold">Jumla: <span className="text-brand-600">{fmtTsh(total)}</span></div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save} disabled={!supplierId || lines.length === 0}>Hifadhi LPO</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}