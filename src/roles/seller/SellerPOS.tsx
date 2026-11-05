import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { Card } from '../../components/ui/Card'
import type { Product, SaleItem, PaymentSplit } from '../../types'
import { fmtTsh, monthLabel } from '../../lib/utils'
import { Search, Trash2, Plus, Minus, ShoppingCart, CheckCircle2, AlertTriangle, Lock } from 'lucide-react'

interface CartLine { productId: string; qty: number; unit: string }

export default function SellerPOS() {
  const { user } = useAuth()
  const { products, customers, addSale, activePeriod, isPeriodOpen, branches } = useData()

  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [discount, setDiscount] = useState(0)
  const [customerId, setCustomerId] = useState('')
  const [walkInName, setWalkInName] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [receipt, setReceipt] = useState<{ no: string; total: number; paid: number } | null>(null)

  const [payCash, setPayCash] = useState(0)
  const [payMpesa, setPayMpesa] = useState(0)
  const [payTigo, setPayTigo] = useState(0)
  const [payBank, setPayBank] = useState(0)
  const [payCredit, setPayCredit] = useState(0)

  const periodOpen = isPeriodOpen()
  const myBranch = branches.find(b => b.id === user?.branchId)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return products.filter(p => p.stock > 0).slice(0, 24)
    return products.filter(p =>
      p.stock > 0 && (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q)
      )
    ).slice(0, 40)
  }, [products, search])

  const cartDetailed = cart.map(c => {
    const p = products.find(x => x.id === c.productId)!
    return { ...c, product: p }
  }).filter(c => c.product)

  const subtotal = cartDetailed.reduce((s, c) => s + c.product.sellPrice * c.qty, 0)
  const total = Math.max(0, subtotal - discount)
  const paid = payCash + payMpesa + payTigo + payBank + payCredit
  const change = paid - total

  const addToCart = (p: Product) => {
    if (!periodOpen) return
    setCart(prev => {
      const idx = prev.findIndex(c => c.productId === p.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { productId: p.id, qty: 1, unit: p.unit }]
    })
  }

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) setCart(cart.filter(c => c.productId !== productId))
    else setCart(cart.map(c => c.productId === productId ? { ...c, qty } : c))
  }

  const clearCart = () => {
    setCart([]); setDiscount(0); setCustomerId(''); setWalkInName('')
    setPayCash(0); setPayMpesa(0); setPayTigo(0); setPayBank(0); setPayCredit(0)
  }

  const openCheckout = () => {
    if (cart.length === 0 || !periodOpen) return
    setPayCash(total)
    setPayMpesa(0); setPayTigo(0); setPayBank(0); setPayCredit(0)
    setCheckoutOpen(true)
  }

  const finalize = () => {
    if (paid < total || !periodOpen) return
    const customer = customers.find(c => c.id === customerId)
    const customerName = customer?.name || walkInName || 'Mteja wa Kawaida'

    const items: SaleItem[] = cartDetailed.map(c => ({
      productId: c.product.id, productName: c.product.name, qty: c.qty, unit: c.product.unit,
      price: c.product.sellPrice, buyPrice: c.product.buyPrice,
    }))

    const payments: PaymentSplit[] = []
    if (payCash > 0) payments.push({ method: 'cash', amount: payCash })
    if (payMpesa > 0) payments.push({ method: 'mpesa', amount: payMpesa })
    if (payTigo > 0) payments.push({ method: 'tigopesa', amount: payTigo })
    if (payBank > 0) payments.push({ method: 'bank', amount: payBank })
    if (payCredit > 0) payments.push({ method: 'credit', amount: payCredit })

    const sale = addSale({
      branchId: user?.branchId || '', 
      customerId: customerId || undefined, customerName,
      items, subtotal, discount, total, payments,
      createdBy: user?.name || '', status: 'completed',
    })

    setReceipt({ no: sale.receiptNo, total, paid })
    setCheckoutOpen(false)
    clearCart()
  }

  return (
    <Layout title={`Mauzo - POS (${myBranch?.name || 'Duka'})`}>
      {activePeriod && (
        <div className={`mb-4 rounded-lg p-3 text-sm flex items-center gap-2 ${
          periodOpen ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {periodOpen ? <CheckCircle2 size={16} /> : <Lock size={16} />}
          <div>Kipindi cha kazi: <b>{monthLabel(activePeriod.month, activePeriod.year)}</b>{periodOpen ? ' — kipo wazi, unaweza kufanya mauzo.' : ' — kimefungwa. Subiri Admin afungue kipya.'}</div>
        </div>
      )}

      {!periodOpen && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 flex items-start gap-2">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <div><b>Mauzo yamezuiwa.</b> Hakuna kipindi cha kazi kilichofunguliwa kwa duka lako.</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="p-4 mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Scan barcode au tafuta bidhaa..." className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" disabled={!periodOpen} />
            </div>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(p => (
              <button key={p.id} onClick={() => addToCart(p)} disabled={!periodOpen} className="text-left bg-white border border-slate-200 rounded-lg p-3 hover:border-brand-500 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="text-xs text-slate-500 mb-1 truncate">{p.category}</div>
                <div className="font-medium text-sm text-slate-800 line-clamp-2 mb-1">{p.name}</div>
                <div className="text-brand-600 font-semibold text-sm">{fmtTsh(p.sellPrice)}</div>
                <div className="text-xs text-slate-500 mt-1">Stoo: {p.stock} {p.unit}</div>
              </button>
            ))}
            {filtered.length === 0 && <div className="col-span-full py-12 text-center text-slate-500">Hakuna bidhaa zilizopatikana</div>}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2"><ShoppingCart size={18} /> Kikapu ({cart.length})</div>
              {cart.length > 0 && <button onClick={clearCart} className="text-xs text-red-600 hover:underline">Futa</button>}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cartDetailed.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">Bonyeza bidhaa kuongeza kwenye kikapu</div>}
              {cartDetailed.map(c => (
                <div key={c.productId} className="bg-slate-50 rounded-lg p-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{c.product.name}</div><div className="text-xs text-slate-500">{fmtTsh(c.product.sellPrice)} / {c.product.unit}</div></div>
                    <button onClick={() => setQty(c.productId, 0)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setQty(c.productId, c.qty - 1)} className="w-7 h-7 rounded bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"><Minus size={12} /></button>
                      <input type="number" value={c.qty} onChange={e => setQty(c.productId, Number(e.target.value) || 0)} className="w-14 text-center border border-slate-300 rounded py-1 text-sm" />
                      <button onClick={() => setQty(c.productId, c.qty + 1)} className="w-7 h-7 rounded bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"><Plus size={12} /></button>
                    </div>
                    <div className="text-sm font-semibold text-slate-800">{fmtTsh(c.product.sellPrice * c.qty)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="font-medium">{fmtTsh(subtotal)}</span></div>
              <div className="flex justify-between text-sm items-center"><span className="text-slate-600">Punguzo</span><input type="number" value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} className="w-28 text-right border border-slate-300 rounded px-2 py-1 text-sm" /></div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200"><span>JUMLA</span><span className="text-brand-600">{fmtTsh(total)}</span></div>
              <Button onClick={openCheckout} disabled={cart.length === 0 || !periodOpen} className="w-full mt-2">{periodOpen ? 'Lipa / Checkout' : 'Kipindi Kimefungwa'}</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Checkout Modal... (Kama ilivyokuwa kwenye code yako ya awali, hakuna mabadiliko makubwa zaidi ya kuongeza branchId kwenye finalize) */}
      <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Malipo (Checkout)" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Mteja" value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="">— Mteja wa Kawaida —</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
            </Select>
            {!customerId && <Input label="Jina la Mteja (walk-in)" value={walkInName} onChange={e => setWalkInName(e.target.value)} placeholder="Hiari" />}
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex justify-between text-lg font-bold mb-1"><span>Jumla ya Kulipa</span><span className="text-brand-600">{fmtTsh(total)}</span></div>
            <div className="text-xs text-slate-500">Subtotal {fmtTsh(subtotal)} - Punguzo {fmtTsh(discount)}</div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Mgawanyo wa Malipo (Split Payment)</div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Cash (Tsh)" type="number" value={payCash} onChange={e => setPayCash(Number(e.target.value) || 0)} />
              <Input label="M-Pesa (Tsh)" type="number" value={payMpesa} onChange={e => setPayMpesa(Number(e.target.value) || 0)} />
              <Input label="Tigo Pesa (Tsh)" type="number" value={payTigo} onChange={e => setPayTigo(Number(e.target.value) || 0)} />
              <Input label="Benki (Tsh)" type="number" value={payBank} onChange={e => setPayBank(Number(e.target.value) || 0)} />
              <Input label="Deni / Credit (Tsh)" type="number" value={payCredit} onChange={e => setPayCredit(Number(e.target.value) || 0)} />
            </div>
          </div>

          <div className="flex justify-between text-sm border-t pt-3"><span>Jumla Iliyolipwa</span><span className="font-medium">{fmtTsh(paid)}</span></div>
          <div className={`flex justify-between text-sm font-semibold ${change < 0 ? 'text-red-600' : 'text-emerald-600'}`}><span>{change < 0 ? 'Inapungua' : 'Chenji'}</span><span>{fmtTsh(Math.abs(change))}</span></div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>Ghairi</Button>
            <Button onClick={finalize} disabled={paid < total || cart.length === 0}><span className="flex items-center gap-2"><CheckCircle2 size={16} /> Kamilisha Mauzo</span></Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Risiti" size="sm">
        {receipt && (
          <div className="text-center space-y-3">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
            <div className="text-lg font-bold">Mauzo Yamekamilika!</div>
            <div className="bg-slate-50 rounded-lg p-4 text-left text-sm space-y-1">
              <div className="flex justify-between"><span>Risiti:</span><span className="font-mono">{receipt.no}</span></div>
              <div className="flex justify-between"><span>Jumla:</span><span className="font-bold">{fmtTsh(receipt.total)}</span></div>
              <div className="flex justify-between"><span>Ilipwa:</span><span>{fmtTsh(receipt.paid)}</span></div>
              <div className="flex justify-between text-emerald-600 font-semibold"><span>Chenji:</span><span>{fmtTsh(receipt.paid - receipt.total)}</span></div>
            </div>
            <Button onClick={() => setReceipt(null)} className="w-full">Sawa</Button>
          </div>
        )}
      </Modal>
    </Layout>
  )
}