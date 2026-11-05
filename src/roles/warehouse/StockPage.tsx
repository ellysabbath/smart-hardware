import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card, StatCard } from '../../components/ui/Card'
import { fmtTsh, daysBetween, today } from '../../lib/utils'
import { AlertTriangle, Package, Warehouse, ArrowRightLeft, Trash2 } from 'lucide-react'

export default function StockPage() {
  const { products, stockMovements, adjustStock } = useData()
  const [tab, setTab] = useState<'stock' | 'movements'>('stock')
  const [transferOpen, setTransferOpen] = useState(false)
  const [damageOpen, setDamageOpen] = useState(false)
  const [productId, setProductId] = useState('')
  const [qty, setQty] = useState(1)
  const [fromLoc, setFromLoc] = useState('')
  const [toLoc, setToLoc] = useState('')
  const [reason, setReason] = useState('')

  const lowStock = products.filter(p => p.stock <= p.reorderLevel)
  const expiring = products.filter(p => p.expiryDate && daysBetween(today(), p.expiryDate) <= 30)

  const submitTransfer = () => {
    if (!productId || qty <= 0) return
    adjustStock(productId, -qty, 'transfer', `Transfer: ${fromLoc} → ${toLoc}`, toLoc)
    setTransferOpen(false)
    setProductId(''); setQty(1); setFromLoc(''); setToLoc('')
  }

  const submitDamage = () => {
    if (!productId || qty <= 0) return
    adjustStock(productId, -qty, 'damage', reason || 'Uharibifu', undefined)
    setDamageOpen(false)
    setProductId(''); setQty(1); setReason('')
  }

  return (
    <Layout title="Usimamizi wa Stoo">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Jumla ya Bidhaa" value={String(products.length)} icon={<Package />} />
        <StatCard label="Chini ya Kiwango" value={String(lowStock.length)} icon={<AlertTriangle />} color="amber" />
        <StatCard label="Zinaisha (30d)" value={String(expiring.length)} icon={<AlertTriangle />} color="red" />
        <StatCard label="Thamani Stoo" value={fmtTsh(products.reduce((s, p) => s + p.stock * p.buyPrice, 0))} icon={<Warehouse />} color="green" />
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('stock')}
          className={`px-4 py-2 text-sm rounded-lg ${tab === 'stock' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
          Stoo ya Sasa
        </button>
        <button onClick={() => setTab('movements')}
          className={`px-4 py-2 text-sm rounded-lg ${tab === 'movements' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
          Historia ya Mwendo
        </button>
        <div className="flex-1" />
        <Button variant="outline" onClick={() => { setProductId(''); setQty(1); setFromLoc(''); setToLoc(''); setTransferOpen(true) }}>
          <span className="flex items-center gap-2"><ArrowRightLeft size={16} /> Hamisha</span>
        </Button>
        <Button variant="danger" onClick={() => { setProductId(''); setQty(1); setReason(''); setDamageOpen(true) }}>
          <span className="flex items-center gap-2"><Trash2 size={16} /> Rekodi Uharibifu</span>
        </Button>
      </div>

      {tab === 'stock' && (
        <Card>
          <Table head={['Bidhaa', 'SKU', 'Aina', 'Stoo', 'Mahali', 'Kiwango', 'Hali']}>
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <Td className="font-medium">{p.name}</Td>
                <Td className="font-mono text-xs">{p.sku}</Td>
                <Td><Badge color="blue">{p.category}</Badge></Td>
                <Td><b>{p.stock}</b> {p.unit}</Td>
                <Td>{p.location || '—'}</Td>
                <Td>{p.reorderLevel}</Td>
                <Td>
                  {p.stock === 0 ? <Badge color="red">Hakuna</Badge>
                    : p.stock <= p.reorderLevel ? <Badge color="amber">Chini</Badge>
                    : <Badge color="green">Sawa</Badge>}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {tab === 'movements' && (
        <Card>
          <Table head={['Tarehe', 'Bidhaa', 'Aina', 'Qty', 'Kutoka', 'Kwenda', 'Maelezo', 'Aliyeingiza']}>
            {stockMovements.slice(0, 100).map(m => (
              <tr key={m.id} className="hover:bg-slate-50">
                <Td className="text-xs">{m.createdAt.slice(0, 16).replace('T', ' ')}</Td>
                <Td>{m.productName}</Td>
                <Td><Badge color={
                  m.type === 'sale' ? 'blue' : m.type === 'purchase' ? 'green'
                    : m.type === 'damage' ? 'red' : m.type === 'transfer' ? 'purple' : 'slate'
                }>{m.type}</Badge></Td>
                <Td className={m.qty < 0 ? 'text-red-600' : 'text-emerald-600'}><b>{m.qty > 0 ? '+' : ''}{m.qty}</b></Td>
                <Td>{m.fromLocation || '—'}</Td>
                <Td>{m.toLocation || '—'}</Td>
                <Td className="text-xs">{m.note || '—'}</Td>
                <Td className="text-xs">{m.createdBy}</Td>
              </tr>
            ))}
            {stockMovements.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-slate-500">Hakuna historia</td></tr>
            )}
          </Table>
        </Card>
      )}

      {/* TRANSFER MODAL */}
      <Modal open={transferOpen} onClose={() => setTransferOpen(false)} title="Hamisha Stoki" size="md">
        <div className="space-y-4">
          <select value={productId} onChange={e => setProductId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">— Chagua bidhaa —</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} {p.unit})</option>)}
          </select>
          <Input label="Idadi" type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
          <Input label="Kutoka (Location)" value={fromLoc} onChange={e => setFromLoc(e.target.value)} placeholder="Mfano: Kwembe" />
          <Input label="Kwenda (Location)" value={toLoc} onChange={e => setToLoc(e.target.value)} placeholder="Mfano: Pugu" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setTransferOpen(false)}>Ghairi</Button>
            <Button onClick={submitTransfer}>Hamisha</Button>
          </div>
        </div>
      </Modal>

      {/* DAMAGE MODAL */}
      <Modal open={damageOpen} onClose={() => setDamageOpen(false)} title="Rekodi Uharibifu / Upotevu" size="md">
        <div className="space-y-4">
          <select value={productId} onChange={e => setProductId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">— Chagua bidhaa —</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} {p.unit})</option>)}
          </select>
          <Input label="Idadi iliyoharibika" type="number" value={qty} onChange={e => setQty(Number(e.target.value))} />
          <Input label="Sababu / Maelezo" value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Mfano: Saruji imekauka, mbao ziliwa na mchwa" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDamageOpen(false)}>Ghairi</Button>
            <Button variant="danger" onClick={submitDamage}>Rekodi Hasara</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}