export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

export const fmtTsh = (n: number) => 'Tsh ' + Math.round(n).toLocaleString('en-US')

export const today = () => new Date().toISOString().slice(0, 10)

export const now = () => new Date().toISOString()

export const daysBetween = (a: string, b: string) =>
  Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000)

export const addDays = (date: string, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const MONTHS_SW = [
  'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
  'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba',
]

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des',
]

export const monthLabel = (month: number, year: number) =>
  `${MONTHS_SW[month - 1]} ${year}`

export const monthKey = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, '0')}`