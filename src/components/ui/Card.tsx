import type  { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between gap-2">
      <h3 className="font-semibold text-slate-800 truncate">{title}</h3>
      {action}
    </div>
  )
}

export function StatCard({
  label, value, sub, icon, color = 'brand',
}: {
  label: string
  value: string
  sub?: string
  icon?: ReactNode
  color?: 'brand' | 'green' | 'red' | 'amber' | 'purple'
}) {
  const colors = {
    brand: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <Card className="p-3 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-1 truncate">{value}</p>
          {sub && <p className="text-[10px] sm:text-xs text-slate-500 mt-1 truncate">{sub}</p>}
        </div>
        {icon && (
          <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${colors[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}