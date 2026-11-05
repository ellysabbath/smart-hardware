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
import type  { Quotation, SaleItem } from '../../types'
import { fmtTsh, addDays, today } from '../../lib/utils'
import { Plus, Trash2, FileText, ArrowRight } from 'lucide-react'

interface Line { productId: string; qty: number }

export default function QuotationsPage() {
  const { user } = useAuth()
  const { products, customers, quotations, addQuotation, convertQuotation } = useData()
  const [open, setOpen] = useState(false)
  const [viewQ, setViewQ] = useState<Quotation | null>(null)
  const [customerId, setCustomerId] = useState('')
  const [name, setName] = useState('')
  const [lines, setLines] = useState<Line[]>([])
  const [discount, setDiscount] = useState(0)
  const [productToAdd, setProductToAdd] = useState('')

  const linesDetailed = lines.map(l => {
    const p = products.find(x => x.id === l.productId)!
    return { ...l, product: p }
  }).filter(l => l.product)
  const subtotal = linesDetailed.reduce((s, l) => s + l.product.sellPrice * l.qty, 0)
  const total = subtotal - discount

  const reset = () => {
    setCustomerId(''); setName(''); setLines([]); setDiscount(0); setProductToAdd('')
  }

  const addLine = () => {
    if (!productToAdd) return
    if (lines.some(l => l.productId === productToAdd)) {
      setLines(lines.map(l => l.productId === productToAdd ? { ...l, qty: l.qty + 1 } : l))
    } else {
      setLines([...lines, { productId: productToAdd, qty: 1 }])
    }
    setProductToAdd('')
  }

  const save = () => {
    if (lines.length === 0) return
    const customer = customers.find(c => c.id === customerId)
    const items: SaleItem[] = linesDetailed.map(l => ({
      productId: l.product.id, productName: l.product.name, qty: l.qty,
      unit: l.product.unit, price: l.product.sellPrice, buyPrice: l.product.buyPrice,
    }))
    addQuotation({
      customerId: customerId || undefined,
      customerName: customer?.name || name || 'Mteja',
      items, subtotal, discount, total,
      validUntil: addDays(today(), 7),
      createdBy: user?.name || '',
      converted: false,
    })
    reset(); setOpen(false)
  }

  const convert = (q: Quotation) => {
    convertQuotation(q)
    setViewQ(null)
  }

  return (
    <Layout title="Nukuu za Bei (Quotations)">
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-slate-500">Nukuu zote za bei zinazotolewa kwa wateja</div>
        <Button onClick={() => { reset(); setOpen(true) }}>
          <span className="flex items-center gap-2"><Plus size={16} /> Nukuu Mpya</span>
        </Button>
      </div>

      <Card>
        {quotations.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <FileText size={48} className="mx-auto mb-3 text-slate-300" />
            <p>Hakuna nukuu bado.</p>
          </div>
        ) : (
          <Table head={['Namba', 'Mteja', 'Jumla', 'Halali Hadi', 'Hali', 'Vitendo']}>
            {quotations.map(q => (
              <tr key={q.id} className="hover:bg-slate-50">
                <Td><span className="font-mono text-xs">{q.quotationNo}</span></Td>
                <Td>{q.customerName}</Td>
                <Td className="font-medium">{fmtTsh(q.total)}</Td>
                <Td>{q.validUntil}</Td>
                <Td>
                  {q.converted
                    ? <Badge color="green">Imeuzwa</Badge>
                    : new Date(q.validUntil) < new Date()
                      ? <Badge color="red">Imeisha</Badge>
                      : <Badge color="amber">Hai</Badge>}
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => setViewQ(q)} className="text-xs text-brand-600 hover:underline">Ona</button>
                    {!q.converted && (
                      <button onClick={() => convert(q)} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                        <ArrowRight size={12} /> Badilisha kuwa Invoice
                      </button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* NEW QUOTATION */}
      <Modal open={open} onClose={() => setOpen(false)} title="Nukuu Mpya ya Bei" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Mteja" value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="">— Chagua —</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            {!customerId && (
              <Input label="Jina la Mteja" value={name} onChange={e => setName(e.target.value)} />
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Select value={productToAdd} onChange={e => setProductToAdd(e.target.value)}>
                <option value="">— Ongeza bidhaa —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {fmtTsh(p.sellPrice)}</option>)}
              </Select>
            </div>
            <Button onClick={addLine} disabled={!productToAdd}>Ongeza</Button>
          </div>

          {linesDetailed.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table head={['Bidhaa', 'Bei', 'Idadi', 'Jumla', '']}>
                {linesDetailed.map(l => (
                  <tr key={l.productId}>
                    <Td>{l.product.name}</Td>
                    <Td>{fmtTsh(l.product.sellPrice)}</Td>
                    <Td>
                      <input type="number" value={l.qty}
                        onChange={e => setLines(lines.map(x => x.productId === l.productId ? { ...x, qty: Number(e.target.value) || 1 } : x))}
                        className="w-16 border rounded px-2 py-1 text-sm" />
                    </Td>
                    <Td className="font-medium">{fmtTsh(l.product.sellPrice * l.qty)}</Td>
                    <Td>
                      <button onClick={() => setLines(lines.filter(x => x.productId !== l.productId))}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={14} /></button>
                    </Td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal:</span><span>{fmtTsh(subtotal)}</span></div>
            <div className="flex justify-between items-center">
              <span>Punguzo:</span>
              <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value) || 0)}
                className="w-28 text-right border rounded px-2 py-1" />
            </div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Jumla:</span><span className="text-brand-600">{fmtTsh(total)}</span>
            </div>
            <div className="text-xs text-slate-500">Halali kwa siku 7 tangu leo</div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
            <Button onClick={save} disabled={lines.length === 0}>Hifadhi Nukuu</Button>
          </div>
        </div>
      </Modal>

      {/* VIEW QUOTATION */}
      <Modal open={!!viewQ} onClose={() => setViewQ(null)} title={viewQ?.quotationNo || ''} size="md">
        {viewQ && (
          <div className="space-y-3">
            <div className="text-center border-b pb-3">
              <div className="font-bold text-lg">SMART HARDWARE</div>
              <div className="text-xs text-slate-500">Nukuu ya Bei</div>
            </div>
            <div className="text-sm space-y-1">
              <div><b>Mteja:</b> {viewQ.customerName}</div>
              <div><b>Tarehe:</b> {viewQ.createdAt.slice(0, 10)}</div>
              <div><b>Halali hadi:</b> {viewQ.validUntil}</div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr>
                <th className="text-left px-2 py-1">Bidhaa</th>
                <th className="text-right px-2 py-1">Idadi</th>
                <th className="text-right px-2 py-1">Bei</th>
                <th className="text-right px-2 py-1">Jumla</th>
              </tr></thead>
              <tbody>
                {viewQ.items.map((i, k) => (
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
              <div>Subtotal: {fmtTsh(viewQ.subtotal)}</div>
              <div>Punguzo: {fmtTsh(viewQ.discount)}</div>
              <div className="text-lg font-bold">Jumla: {fmtTsh(viewQ.total)}</div>
            </div>
            {!viewQ.converted && (
              <Button onClick={() => convert(viewQ)} className="w-full">
                Badilisha kuwa Invoice
              </Button>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  )
}