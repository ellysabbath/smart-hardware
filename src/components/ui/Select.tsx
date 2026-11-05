import { type SelectHTMLAttributes, forwardRef, type ReactNode } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: ReactNode
}

const Select = forwardRef<HTMLSelectElement, Props>(({ label, children, className = '', ...rest }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${className}`}
      {...rest}
    >
      {children}
    </select>
  </div>
))

export default Select