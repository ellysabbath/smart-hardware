import { useState } from 'react'
import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Table, Td } from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import { fmtTsh, MONTHS_SW, today, addDays } from '../../lib/utils'
import { Lock, Unlock, Calendar, Clock } from 'lucide-react'

export default function WorkingPeriodPage() {
  const { workingPeriods, openPeriod, closePeriod, monthlyReports } = useData()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [deadline, setDeadline] = useState(addDays(today(), 7))

  const active = workingPeriods.find(p => p.status === 'open')

  const reportsFor = (periodId: string) =>
    monthlyReports.filter(r => r.periodId === periodId)

  return (
    <Layout title="Muda wa Kazi (Working Period)">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-2">Kipindi Kinachoendelea</div>
          {active ? (
            <>
              <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                <Calendar size={22} />
                {MONTHS_SW[active.month - 1]} {active.year}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Clock size={12} /> Deadline ya ripoti: {active.reportDeadline}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Ripoti zilizowasilishwa: {reportsFor(active.id).filter(r =>
                  r.status !== 'draft'
                ).length} / {reportsFor(active.id).length}
              </div>
              <Button variant="danger" className="mt-4 w-full"
                onClick={() => closePeriod(active.id)}>
                <span className="flex items-center gap-2 justify-center">
                  <Lock size={16} /> Funga Kipindi & Auto-submit Ripoti
                </span>
              </Button>
            </>
          ) : (
            <div className="text-slate-400">Hakuna kipindi wazi</div>
          )}
        </Card>

        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-2">Fungua Kipindi Kipya</div>
          <div className="flex gap-2 mb-3">
            <select value={month} onChange={e => setMonth(Number(e.target.value))}
              className="flex-1 border rounded px-2 py-2 text-sm">
              {MONTHS_SW.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))}
              className="w-24 border rounded px-2 py-2 text-sm" />
          </div>
          <Input label="Deadline ya Ripoti" type="date" value={deadline}
            onChange={e => setDeadline(e.target.value)} />
          <Button className="w-full mt-3" onClick={() => openPeriod(year, month, deadline)}>
            <span className="flex items-center gap-2 justify-center">
              <Unlock size={16} /> Fungua Kipindi
            </span>
          </Button>
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b font-semibold">Historia ya Vipindi</div>
        <Table head={['Kipindi', 'Hali', 'Ilifunguliwa', 'Ilifungwa', 'Deadline', 'Ripoti']}>
          {[...workingPeriods].reverse().map(p => {
            const rp = reportsFor(p.id)
            const submitted = rp.filter(r =>
              r.status === 'submitted' || r.status === 'auto_submitted' ||
              r.status === 'approved' || r.status === 'edited'
            ).length
            return (
              <tr key={p.id} className="hover:bg-slate-50">
                <Td className="font-medium">{MONTHS_SW[p.month - 1]} {p.year}</Td>
                <Td>
                  <Badge color={p.status === 'open' ? 'green' : p.status === 'closed' ? 'slate' : 'red'}>
                    {p.status === 'open' ? 'Wazi' : p.status === 'closed' ? 'Imefungwa' : 'Imefungwa (Locked)'}
                  </Badge>
                </Td>
                <Td className="text-xs">{p.openedAt.slice(0, 16).replace('T', ' ')}</Td>
                <Td className="text-xs">{p.closedAt?.slice(0, 16).replace('T', ' ') || '—'}</Td>
                <Td className="text-xs">{p.reportDeadline}</Td>
                <Td className="text-xs">{submitted}/{rp.length}</Td>
              </tr>
            )
          })}
          {workingPeriods.length === 0 && (
            <tr><td colSpan={6} className="text-center py-10 text-slate-500">Hakuna vipindi</td></tr>
          )}
        </Table>
      </Card>
    </Layout>
  )
}