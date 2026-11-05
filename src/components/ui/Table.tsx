import type  { ReactNode } from 'react'

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-3 sm:px-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {head.map(h => (
                <th
                  key={h}
                  className="text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-3 sm:px-4 py-2.5 sm:py-3 ${className}`}>{children}</td>
}