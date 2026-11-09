export default function StatCard({
  label, value, sub, color = 'brand',
}: { label: string; value: string; sub?: string; color?: 'brand' | 'green' | 'amber' | 'red' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${colors[color]}`}>{label}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}