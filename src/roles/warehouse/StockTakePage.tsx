import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { fmtTsh } from '../../lib/utils'
import { ClipboardCheck, AlertTriangle } from 'lucide-react'

export default function StockTakePage() {
  const { products, adjustStock } = useData()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const diffs = products.map(p => {
    const counted = counts[p.id] ?? p.stock
    return { p, counted, diff: counted - p.stock }
  })
  const withDiffs = diffs.filter(d => d.diff !== 0)
  const totalShortage = withDiffs.filter(d => d.diff < 0).reduce((s, d) => s + Math.abs(d.diff) * d.p.buyPrice, 0)

  const apply = () => {
    withDiffs.forEach(d => {
      adjustStock(d.p.id, d.diff, 'adjust', `Hesabu ya ghala: ${d.p.stock} → ${d.counted}`)
    })
    setSubmitted(true)
    setConfirmOpen(false)
    setCounts({})
  }

  return (
    <Layout title="Hesabu ya Ghala (Stock Take)">
      <div className="mb-5 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        Hesabu kimwili, kisha ingiza idadi halisi kwenye jedwali. System itaonyesha tofauti (wizi / upotevu).
      </div>

      {submitted && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
          ✓ Hesabu imehifadhiwa. Stoo imesasishwa.
        </div>
      )}

      <Card className="mb-5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-slate-500">Bidhaa zenye tofauti</div>
            <div className="text-2xl font-bold">{withDiffs.length}</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-500">Thamani ya upungufu</div>
            <div className="text-2xl font-bold text-red-600">{fmtTsh(totalShortage)}</div>
          </div>
          <Button onClick={() => setConfirmOpen(true)} disabled={withDiffs.length === 0}>
            <span className="flex items-center gap-2"><ClipboardCheck size={16} /> Hifadhi Hesabu</span>
          </Button>
        </div>
      </Card>

      <Card>
        <Table head={['Bidhaa', 'SKU', 'Stoo ya System', 'Idadi Halisi', 'Tofauti', 'Thamani']}>
          {diffs.map(d => (
            <tr key={d.p.id} className={d.diff !== 0 ? 'bg-amber-50' : ''}>
              <Td className="font-medium">{d.p.name}</Td>
              <Td className="font-mono text-xs">{d.p.sku}</Td>
              <Td>{d.p.stock} {d.p.unit}</Td>
              <Td>
                <input type="number" min={0} value={counts[d.p.id] ?? d.p.stock}
                  onChange={e => setCounts({ ...counts, [d.p.id]: Number(e.target.value) || 0 })}
                  className="w-24 border rounded px-2 py-1 text-sm" />
              </Td>
              <Td>
                {d.diff === 0 ? <span className="text-slate-400">—</span>
                  : d.diff < 0 ? <Badge color="red">Upungufu {d.diff}</Badge>
                  : <Badge color="green">Ziada +{d.diff}</Badge>}
              </Td>
              <Td>{d.diff !== 0 ? fmtTsh(Math.abs(d.diff) * d.p.buyPrice) : '—'}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Thibitisha Hesabu" size="sm">
        <div className="space-y-3">
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
            <div className="text-sm">
              <p className="font-medium">Bidhaa {withDiffs.length} zina tofauti.</p>
              <p className="text-slate-600 mt-1">Stoo itasasishwa kulingana na hesabu halisi. Kitendo hiki hakiwezi kurudishwa.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Ghairi</Button>
            <Button variant="success" onClick={apply}>Thibitisha</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}