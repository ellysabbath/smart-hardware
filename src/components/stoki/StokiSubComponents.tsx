import {
  ShoppingBag, AlertTriangle, Calendar, PackageX, RotateCcw,
  RefreshCcw, Clock, CheckCircle2, XCircle, TrendingDown,
} from 'lucide-react'
import type {
  AinaMarekebishoStoki,
  HaliMarekebisho,
} from '../../types'

// ============================================================
// AINA META
// ============================================================
export const AINA_META: Record<
  AinaMarekebishoStoki,
  { label: string; color: string; Icon: React.ElementType; desc: string }
> = {
  mauzo: {
    label: 'Mauzo',
    color: 'text-brand-700 border-brand-200',
    Icon: ShoppingBag,
    desc: 'Bidhaa imeuzwa',
  },
  uharibifu: {
    label: 'Uharibifu',
    color: 'text-red-700 border-red-200',
    Icon: AlertTriangle,
    desc: 'Bidhaa imeharibika (mfano: saruji imekauka)',
  },
  expiry: {
    label: 'Expiry',
    color: 'text-amber-700 border-amber-200',
    Icon: Calendar,
    desc: 'Bidhaa imeisha muda (mfano: rangi imeganda)',
  },
  upotevu: {
    label: 'Upotevu',
    color: 'text-orange-700 border-orange-200',
    Icon: PackageX,
    desc: 'Bidhaa imepotea (wizi, hesabu mbaya)',
  },
  kurudisha_msambazaji: {
    label: 'Kurudisha',
    color: 'text-purple-700 border-purple-200',
    Icon: RotateCcw,
    desc: 'Bidhaa inarudishwa kwa msambazaji',
  },
  marekebisho: {
    label: 'Marekebisho',
    color: 'text-slate-700 border-slate-200',
    Icon: RefreshCcw,
    desc: 'Marekebisho ya stoki',
  },
}

// ============================================================
// HALI META
// ============================================================
export const HALI_META: Record<
  HaliMarekebisho,
  { label: string; Icon: React.ElementType; color: string }
> = {
  inasubiri: { label: 'Inasubiri', Icon: Clock, color: 'text-amber-700' },
  imethibitishwa: { label: 'Imethibitishwa', Icon: CheckCircle2, color: 'text-emerald-700' },
  imekataliwa: { label: 'Imekataliwa', Icon: XCircle, color: 'text-red-700' },
}

// ============================================================
// STAT CARD (nyeupe + accent border-l)
// ============================================================
type Accent = 'brand' | 'emerald' | 'amber' | 'red'
const ACCENT_BORDER: Record<Accent, string> = {
  brand: 'border-l-brand-500',
  emerald: 'border-l-emerald-500',
  amber: 'border-l-amber-500',
  red: 'border-l-red-500',
}
const ACCENT_TEXT: Record<Accent, string> = {
  brand: 'text-brand-700',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  red: 'text-red-700',
}

export function StokiStat({
  label,
  value,
  Icon,
  accent,
  sub,
}: {
  label: string
  value: string
  Icon: React.ElementType
  accent: Accent
  sub?: string
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${ACCENT_BORDER[accent]} p-4`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className={ACCENT_TEXT[accent]} />
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="text-base md:text-lg font-bold mt-2 truncate text-slate-900">
        {value}
      </div>
      {sub && <div className="text-[10px] text-slate-500 truncate">{sub}</div>}
    </div>
  )
}

export { TrendingDown }