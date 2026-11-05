import { useState, useMemo } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { fmtTsh, MONTHS_SW, MONTHS_SHORT, monthLabel } from '../../lib/utils'
import { FileText, Send, Edit, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const statusLabel = (s: string) => ({
  draft: 'Rasimu',
  submitted: 'Imewasilishwa',
  auto_submitted: 'Imewasilishwa (Auto)',
  approved: 'Imeidhinishwa',
  edit_requested: 'Mabadiliko Yameombwa',
  edited: 'Imeruhusiwa Kubadilishwa',
}[s] || s)

const statusColor = (s: string): 'green' | 'blue' | 'purple' | 'amber' | 'teal' | 'slate' => ({
  draft: 'slate' as const,
  submitted: 'blue' as const,
  auto_submitted: 'purple' as const,
  approved: 'green' as const,
  edit_requested: 'amber' as const,
  edited: 'teal' as const,
}[s] || 'slate' as const)

export default function MonthlyReportsPage() {
  const { user } = useAuth()
  const {
    monthlyReports, workingPeriods,
    getOrCreateMonthlyReport, updateMonthlyReport, submitMonthlyReport,
    requestReportEdit, decideReportEdit, approveMonthlyReport,
  } = useData()

  const [editModal, setEditModal] = useState<string | null>(null)
  const [requestModal, setRequestModal] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const [filterSeller, setFilterSeller] = useState('')
  const [filterYear, setFilterYear] = useState<number | ''>('')
  const [filterMonth, setFilterMonth] = useState<number | ''>('')

  const isSeller = user?.role === 'seller'
  const isAdmin = user?.role === 'admin'
  const isOwner = user?.role === 'owner'

  const activePeriod = workingPeriods.find(p => p.status === 'open')

  const myReportForActive = activePeriod && isSeller
    ? monthlyReports.find(r =>
        r.sellerId === user?.id &&
        r.year === activePeriod.year &&
        r.month === activePeriod.month
      )
    : null

  const filtered = useMemo(() => {
    return monthlyReports.filter(r => {
      if (isSeller && r.sellerId !== user?.id) return false
      if (filterSeller && r.sellerName !== filterSeller) return false
      if (filterYear && r.year !== filterYear) return false
      if (filterMonth && r.month !== filterMonth) return false
      return true
    }).sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month))
  }, [monthlyReports, isSeller, user, filterSeller, filterYear, filterMonth])

  const allSellers = Array.from(new Set(monthlyReports.map(r => r.sellerName)))

  const startEdit = (id: string) => {
    const r = monthlyReports.find(x => x.id === id)
    setNotes(r?.notes || '')
    setEditModal(id)
  }

  const saveEdit = () => {
    if (!editModal) return
    updateMonthlyReport(editModal, { notes })
    setEditModal(null)
  }

  const sendEditRequest = () => {
    if (!requestModal || !reason.trim()) return
    requestReportEdit(requestModal, reason)
    setRequestModal(null); setReason('')
  }

  const pendingEditRequests = filtered.filter(r => r.editRequest?.status === 'pending')

  return (
    <Layout title="Ripoti za Mwezi (Monthly Reports)">
      {isAdmin && pendingEditRequests.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            Kuna maombi <b>{pendingEditRequests.length}</b> ya kubadilisha ripoti yanasubiri uamuzi wako.
          </div>
        </div>
      )}

      {isSeller && activePeriod && (
        <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold flex items-center gap-2">
                <FileText size={16} /> Kipindi: {monthLabel(activePeriod.month, activePeriod.year)}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Deadline: {activePeriod.reportDeadline}
              </div>
              {myReportForActive && (
                <div className="text-xs mt-2">
                  Hali ya ripoti yako: <Badge color={statusColor(myReportForActive.status)}>
                    {statusLabel(myReportForActive.status)}
                  </Badge>
                </div>
              )}
            </div>
            {!myReportForActive && (
              <Button onClick={() => getOrCreateMonthlyReport(
                user!.id, user!.name, activePeriod.year, activePeriod.month
              )}>
                Andaa Ripoti ya Mwezi
              </Button>
            )}
            {myReportForActive && myReportForActive.status === 'draft' && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => startEdit(myReportForActive.id)}>
                  <span className="flex items-center gap-1"><Edit size={14} /> Maelezo</span>
                </Button>
                <Button onClick={() => submitMonthlyReport(myReportForActive.id)}>
                  <span className="flex items-center gap-1"><Send size={14} /> Wasilisha</span>
                </Button>
              </div>
            )}
            {myReportForActive && myReportForActive.status === 'approved' && !myReportForActive.editRequest && (
              <Button variant="outline" onClick={() => setRequestModal(myReportForActive.id)}>
                Omba Mabadiliko
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Muuzaji</label>
          <select value={filterSeller} onChange={e => setFilterSeller(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm">
            <option value="">Wote</option>
            {allSellers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Mwezi</label>
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value ? Number(e.target.value) : '')}
            className="border rounded px-2 py-1.5 text-sm">
            <option value="">Yote</option>
            {MONTHS_SHORT.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Mwaka</label>
          <input type="number" placeholder="Mwaka" value={filterYear}
            onChange={e => setFilterYear(e.target.value ? Number(e.target.value) : '')}
            className="w-24 border rounded px-2 py-1.5 text-sm" />
        </div>
        <Button variant="outline" onClick={() => {
          setFilterSeller(''); setFilterMonth(''); setFilterYear('')
        }}>Safisha</Button>
      </div>

      <Card>
        <Table head={['Kipindi', 'Muuzaji', 'Mauzo', 'COGS', 'Faida Ghafi', 'Gharama', 'Faida Halisi', 'Hali', 'Vitendo']}>
          {filtered.map(r => (
            <tr key={r.id} className="hover:bg-slate-50">
              <Td className="whitespace-nowrap">{MONTHS_SHORT[r.month - 1]} {r.year}</Td>
              <Td>{r.sellerName}</Td>
              <Td>{fmtTsh(r.salesTotal)}</Td>
              <Td className="text-xs text-slate-600">{fmtTsh(r.cogs)}</Td>
              <Td>{fmtTsh(r.grossProfit)}</Td>
              <Td className="text-xs text-amber-600">{fmtTsh(r.expensesTotal)}</Td>
              <Td className={r.netProfit >= 0 ? 'text-emerald-600 font-semibold' : 'text-red-600'}>
                {fmtTsh(r.netProfit)}
              </Td>
              <Td>
                <Badge color={statusColor(r.status)}>{statusLabel(r.status)}</Badge>
                {r.editRequest?.status === 'pending' && (
                  <div className="text-[10px] text-amber-600 mt-1">
                    Ombi: {r.editRequest.reason.slice(0, 40)}...
                  </div>
                )}
              </Td>
              <Td>
                <div className="flex gap-1 flex-wrap text-xs">
                  {isSeller && r.sellerId === user?.id && r.status === 'draft' && (
                    <>
                      <button onClick={() => startEdit(r.id)} className="text-blue-600 hover:underline">Badilisha</button>
                      <button onClick={() => submitMonthlyReport(r.id)} className="text-emerald-600 hover:underline">Wasilisha</button>
                    </>
                  )}
                  {isSeller && r.sellerId === user?.id && r.status === 'approved' && !r.editRequest && (
                    <button onClick={() => setRequestModal(r.id)} className="text-amber-600 hover:underline">Omba Mabadiliko</button>
                  )}
                  {isAdmin && (r.status === 'submitted' || r.status === 'auto_submitted') && (
                    <button onClick={() => approveMonthlyReport(r.id)} className="text-emerald-600 hover:underline">
                      <span className="flex items-center gap-1"><CheckCircle size={12} /> Idhinisha</span>
                    </button>
                  )}
                  {isAdmin && r.editRequest?.status === 'pending' && (
                    <>
                      <button onClick={() => decideReportEdit(r.id, true)} className="text-emerald-600 hover:underline">Kubali</button>
                      <button onClick={() => decideReportEdit(r.id, false)} className="text-red-600 hover:underline">Kataa</button>
                    </>
                  )}
                  {(isAdmin || isOwner) && r.notes && (
                    <span className="text-slate-400" title={r.notes}>📝</span>
                  )}
                </div>
              </Td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={9} className="text-center py-10 text-slate-500">Hakuna ripoti</td></tr>
          )}
        </Table>
      </Card>

      {/* EDIT NOTES MODAL */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Badilisha Maelezo ya Ripoti" size="md">
        <p className="text-sm text-slate-600 mb-2">Ongeza maelezo kuhusu mauzo, changamoto, au mambo mengine muhimu:</p>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          className="w-full border rounded p-2 text-sm h-32" />
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline" onClick={() => setEditModal(null)}>Ghairi</Button>
          <Button onClick={saveEdit}>Hifadhi</Button>
        </div>
      </Modal>

      {/* REQUEST EDIT MODAL */}
      <Modal open={!!requestModal} onClose={() => setRequestModal(null)} title="Omba Kubadilisha Ripoti" size="md">
        <p className="text-sm text-slate-600 mb-2">
          Ripoti yako imekwisha idhinishwa. Eleza sababu kwa nini unataka kuibadilisha:
        </p>
        <textarea value={reason} onChange={e => setReason(e.target.value)}
          className="w-full border rounded p-2 text-sm h-24" />
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline" onClick={() => setRequestModal(null)}>Ghairi</Button>
          <Button onClick={sendEditRequest} disabled={!reason.trim()}>Tuma Ombi</Button>
        </div>
      </Modal>
    </Layout>
  )
}