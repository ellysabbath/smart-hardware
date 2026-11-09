export default function Badge({ children, color = 'slate' }: { children: React.ReactNode; color?: 'slate' | 'green' | 'red' | 'amber' }) {
  const map = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${map[color]}`}>{children}</span>
}