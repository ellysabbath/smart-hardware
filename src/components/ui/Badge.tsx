import { type ReactNode } from 'react'

export default function Badge({ children, color = 'slate' }:
  { children: ReactNode; color?: 'slate' | 'green' | 'red' | 'amber' | 'blue' | 'purple' }) {
  const colors = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>{children}</span>
}