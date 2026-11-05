export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

export const fmtTsh = (n: number) =>
  'Tsh ' + Math.round(n).toLocaleString('en-US')

export const today = () => new Date().toISOString().slice(0, 10)

export const now = () => new Date().toISOString()

export const daysBetween = (a: string, b: string) =>
  Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000)

export const addDays = (date: string, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}