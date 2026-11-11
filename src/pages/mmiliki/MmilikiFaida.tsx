import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useStore } from '../../store/StoreContext'
import { formatTsh } from '../../utils/faida'

export default function MmilikiFaida() {
  const { mauzo, opex, mishahara, faida } = useStore()
  const f = useMemo(() => faida(), [mauzo, opex, mishahara])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Faida / Hasara</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Box label="Mauzo" value={formatTsh(f.mauzo)} tone="text-blue-600" Icon={TrendingUp} />
        <Box label="Faida Ghafi" value={formatTsh(f.faidaGhafi)} tone="text-emerald-600" Icon={TrendingUp} />
        <Box label="Gharama Zote" value={formatTsh(f.jumlaGharama)} tone="text-red-600" Icon={Wallet} />
        <Box label="Faida Safi" value={formatTsh(f.faidaSafi)} tone={f.hasara ? 'text-red-600' : 'text-emerald-700'} Icon={f.hasara ? TrendingDown : TrendingUp} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
        <Row label="Mauzo" value={formatTsh(f.mauzo)} />
        <Row label="COGS" value={formatTsh(f.cogs)} tone="text-amber-700" />
        <Row label="Faida Ghafi" value={formatTsh(f.faidaGhafi)} tone="text-brand-700" bold />
        <Row label="Opex (bila mishahara)" value={formatTsh(f.jumlaOpex)} tone="text-orange-700" />
        <Row label="Mishahara" value={formatTsh(f.jumlaMishahara)} tone="text-purple-700" />
        <Row label="Gharama Zote" value={formatTsh(f.jumlaGharama)} tone="text-red-600" bold />
        <div className="pt-2 mt-2 border-t border-slate-200" />
        <Row label="Faida Safi" value={formatTsh(f.faidaSafi)} tone={f.hasara ? 'text-red-700' : 'text-emerald-700'} bold />
        <Row label="Zaka (10%)" value={formatTsh(f.zaka)} />
        <Row label="Sadaka (10%)" value={formatTsh(f.sadaka)} />
        <Row label="Inayobaki" value={formatTsh(f.inayobaki)} tone="text-emerald-700" bold />
      </div>
    </div>
  )
}

function Box({ label, value, tone, Icon }: { label: string; value: string; tone: string; Icon: React.ElementType }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 grid place-items-center ${tone}`}>
        <Icon size={18} />
      </div>
      <div className="text-xs text-slate-500 mt-3">{label}</div>
      <div className="text-base md:text-lg font-bold text-slate-900 mt-0.5 truncate">{value}</div>
    </div>
  )
}

function Row({ label, value, tone, bold }: { label: string; value: string; tone?: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`${bold ? 'font-bold' : 'font-semibold'} ${tone ?? 'text-slate-900'}`}>{value}</span>
    </div>
  )
}