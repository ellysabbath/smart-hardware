import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ConfirmModal'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import type { Product, Unit } from '../../types'
import { fmtTsh, daysBetween, today } from '../../lib/utils'
import { Plus, Pencil, Trash2, AlertTriangle, MapPin, Search, Package } from 'lucide-react'

const CATEGORIES = ['Saruji', 'Nondo', 'Mabati', 'Mbao', 'Rangi', 'Bomba', 'Umeme', 'Zana']

const UNITS: { value: Unit; label: string }[] = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'm', label: 'Mita (m)' },
  { value: 'ft', label: 'Futi (ft)' },
  { value: 'm3', label: 'Mita za Ujazo (m³)' },
  { value: 'bag', label: 'Mfuko (bag)' },
  { value: 'box', label: 'Box' },
]

const empty: Omit<Product, 'id' | 'createdAt'> = {
  sku: '', name: '', category: 'Saruji', unit: 'bag',
  buyPrice: 0, sellPrice: 0, stock: 0,
  location: '', supplier: '', reorderLevel: 0,
  barcode: '', description: '', imageUrl: '', expiryDate: '',
  alternateUnits: [],
}

export default function ProductsPage() {
  const { user } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useData()

  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt'>>(empty)
  const [delId, setDelId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const canEdit = user?.role === 'admin' || user?.role === 'warehouse'
  const canSeeBuyPrice = user?.role !== 'seller'

  // FR38 — fast search across name / SKU / barcode / category
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products.filter(p => {
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      const matchCat = !catFilter || p.category === catFilter
      return matchSearch && matchCat
    })
  }, [products, search, catFilter])

  const openNew = () => {
    setEdit(null)
    setForm(empty)
    setErrors({})
    setOpen(true)
  }

  const openEdit = (p: Product) => {
    setEdit(p)
    const { id, createdAt, ...rest } = p
    setForm(rest)
    setErrors({})
    setOpen(true)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Jina la bidhaa linahitajika'
    if (!form.sku.trim()) e.sku = 'SKU inahitajika'
    if (!form.barcode.trim()) e.barcode = 'Barcode inahitajika'
    if (form.sellPrice <= 0) e.sellPrice = 'Bei ya mauzo iwe zaidi ya 0'
    if (form.buyPrice < 0) e.buyPrice = 'Bei ya ununuzi si sahihi'
    if (form.stock < 0) e.stock = 'Stoo si sahihi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    if (edit) {
      updateProduct({ ...edit, ...form })
    } else {
      addProduct(form)
    }
    setOpen(false)
  }

  const confirmDelete = () => {
    if (delId) {
      deleteProduct(delId)
      setDelId(null)
    }
  }

  // FR5 — expiry badge
  const expiryStatus = (p: Product) => {
    if (!p.expiryDate) return null
    const days = daysBetween(today(), p.expiryDate)
    if (days < 0) return { label: 'Imeisha', color: 'red' as const }
    if (days <= 30) return { label: `Siku ${days}`, color: 'amber' as const }
    return null
  }

  // FR21 — reorder level badge
  const stockStatus = (p: Product) => {
    if (p.stock === 0) return { label: 'Hakuna', color: 'red' as const }
    if (p.stock <= p.reorderLevel) return { label: 'Chini', color: 'amber' as const }
    return { label: 'Sawa', color: 'green' as const }
  }

  const totalStockValue = products.reduce((s, p) => s + p.stock * p.buyPrice, 0)
  const lowStockCount = products.filter(p => p.stock <= p.reorderLevel).length
  const expiringCount = products.filter(p => p.expiryDate && daysBetween(today(), p.expiryDate) <= 30).length

  return (
    <Layout title="Bidhaa (Products)">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tafuta jina, SKU, barcode..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Makundi yote</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {canEdit && (
          <Button onClick={openNew}>
            <span className="flex items-center gap-2"><Plus size={16} /> Ongeza Bidhaa</span>
          </Button>
        )}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-3">
          <div className="text-xs text-slate-500">Jumla ya Bidhaa</div>
          <div className="text-xl font-bold text-slate-800">{products.length}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-slate-500">Zinazoisha Stoo</div>
          <div className="text-xl font-bold text-amber-600">{lowStockCount}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-slate-500">Zinaisha (Expiry)</div>
          <div className="text-xl font-bold text-red-600">{expiringCount}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-slate-500">Thamani ya Stoo</div>
          <div className="text-lg font-bold text-emerald-600">{fmtTsh(totalStockValue)}</div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Package size={48} className="mx-auto mb-3 text-slate-300" />
            <p>Hakuna bidhaa zilizopatikana.</p>
          </div>
        ) : (
          <Table
            head={[
              'Bidhaa', 'SKU / Barcode', 'Aina', 'Stoo',
              canSeeBuyPrice ? 'Bei Kununua' : '',
              'Bei Kuuza', 'Mahali', 'Hali', 'Vitendo',
            ].filter(Boolean)}
          >
            {filtered.map(p => {
              const stockS = stockStatus(p)
              const expS = expiryStatus(p)
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <Td>
                    <div className="flex items-center gap-2">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                          <Package size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-800">{p.name}</div>
                        {p.supplier && <div className="text-xs text-slate-500">{p.supplier}</div>}
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="text-xs font-mono text-slate-600">{p.sku}</div>
                    <div className="text-xs text-slate-400">{p.barcode}</div>
                  </Td>
                  <Td><Badge color="blue">{p.category}</Badge></Td>
                  <Td>
                    <div className="font-medium">
                      {p.stock} <span className="text-xs text-slate-500">{p.unit}</span>
                    </div>
                    {p.stock <= p.reorderLevel && (
                      <div className="text-xs text-amber-600">Min: {p.reorderLevel}</div>
                    )}
                  </Td>
                  {canSeeBuyPrice && <Td>{fmtTsh(p.buyPrice)}</Td>}
                  <Td className="font-medium text-emerald-700">{fmtTsh(p.sellPrice)}</Td>
                  <Td>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <MapPin size={12} /> {p.location || '—'}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-1">
                      <Badge color={stockS.color}>{stockS.label}</Badge>
                      {expS && (
                        <Badge color={expS.color}>
                          <span className="flex items-center gap-1">
                            <AlertTriangle size={10} /> {expS.label}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </Td>
                  <Td>
                    {canEdit ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
                          title="Badilisha"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDelId(p.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600"
                          title="Futa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </Td>
                </tr>
              )
            })}
          </Table>
        )}
      </Card>

      {/* Add / Edit modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={edit ? `Badilisha: ${edit.name}` : 'Ongeza Bidhaa Mpya'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Jina la Bidhaa *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            placeholder="Mfano: Saruji Dangote 50kg"
          />

          <Input
            label="SKU Code *"
            value={form.sku}
            onChange={e => setForm({ ...form, sku: e.target.value })}
            error={errors.sku}
            placeholder="Mfano: SAR-DAN-50"
          />

          <Select
            label="Aina (Category)"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Select
            label="Kipimo (Unit of Measure)"
            value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value as Unit })}
          >
            {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </Select>

          <Input
            label="Bei ya Kununua (Tsh)"
            type="number"
            value={form.buyPrice}
            onChange={e => setForm({ ...form, buyPrice: Number(e.target.value) })}
            error={errors.buyPrice}
          />

          <Input
            label="Bei ya Kuuza (Tsh) *"
            type="number"
            value={form.sellPrice}
            onChange={e => setForm({ ...form, sellPrice: Number(e.target.value) })}
            error={errors.sellPrice}
          />

          <Input
            label="Stoo ya Sasa"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
            error={errors.stock}
          />

          <Input
            label="Kiwango cha Chini (Reorder Level)"
            type="number"
            value={form.reorderLevel}
            onChange={e => setForm({ ...form, reorderLevel: Number(e.target.value) })}
          />

          <Input
            label="Mahali ilipo (Location)"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="Mfano: Shed A, Raka 3"
          />

          <Input
            label="Msambazaji (Supplier)"
            value={form.supplier}
            onChange={e => setForm({ ...form, supplier: e.target.value })}
            placeholder="Mfano: Dangote Cement"
          />

          <Input
            label="Barcode *"
            value={form.barcode}
            onChange={e => setForm({ ...form, barcode: e.target.value })}
            error={errors.barcode}
            placeholder="Mfano: SAR001"
          />

          <Input
            label="Tarehe ya Kuisha (Expiry)"
            type="date"
            value={form.expiryDate || ''}
            onChange={e => setForm({ ...form, expiryDate: e.target.value })}
          />

          <Input
            label="URL ya Picha"
            value={form.imageUrl || ''}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
          />

          <Input
            label="Maelezo"
            value={form.description || ''}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={() => setOpen(false)}>Ghairi</Button>
          <Button onClick={submit}>{edit ? 'Hifadhi Mabadiliko' : 'Ongeza Bidhaa'}</Button>
        </div>
      </Modal>

      {/* Delete confirmation (modal, not window.confirm) */}
      <ConfirmModal
        open={!!delId}
        title="Futa Bidhaa"
        message={
          <p>
            Una uhakika unataka kufuta bidhaa hii? Kitendo hiki hakiwezi kurudishwa.
          </p>
        }
        confirmText="Futa"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDelId(null)}
      />
    </Layout>
  )
}