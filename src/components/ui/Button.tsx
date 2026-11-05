import type  { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary', size = 'md', children, className = '', ...rest
}: Props) {
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    ghost: 'hover:bg-slate-100 text-slate-700',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
  }
  const sizes = {
    sm: 'px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-2 text-sm',
    lg: 'px-4 sm:px-5 py-2.5 text-sm sm:text-base',
  }
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}