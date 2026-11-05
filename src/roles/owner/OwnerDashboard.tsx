import Layout from '../../components/Layout'
import { useData } from '../../context/DataContext'
import { Card, StatCard } from '../../components/ui/Card'
import { fmtTsh, today, daysBetween } from '../../lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Users, Heart, AlertTriangle } from 'lucide-react'

export default function OwnerDashboard() {
  const { sales, expenses, customers, products, zakat } = useData()

  const todaySales = sales.filter(s => s.createdAt.slice(0, 10) === today())
  const revenue = todaySales.reduce((s, x) => s + x.total, 0)
  const cogs = todaySales.reduce((s, x) => s + x.items.reduce((y, i) => y + i.buyPrice * i.qty, 0), 0)
  const opex = expenses.filter(e => e.date === today() && e.status === 'approved').reduce((s, e) => s + e.amount, 0)
  const netProfit = revenue - cogs - opex
  const zakatOwed = netProfit * 0.2
  const debts = customers.reduce((s, c) => s + c.balance, 0)
  const expiring = products.filter(p => p.expiryDate && daysBetween(today(), p.expiryDate) <= 30).length
  const unpaidZakat = zakat.filter(z => !z.paid).reduce((s, z) => s + z.total, 0)

  return (
    <Layout title="Dashboard - Mmiliki">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Mauzo ya Leo" value={fmtTsh(revenue)} icon={<DollarSign />} />
        <StatCard label="Faida Halisi (Leo)" value={fmtTsh(netProfit)}
          icon={netProfit >= 0 ? <TrendingUp /> : <TrendingDown />}
          color={netProfit >= 0 ? 'green' : 'red'} />
        <StatCard label="Madeni ya Wateja" value={fmtTsh(debts)} icon={<Users />} color="red" />
        <StatCard label="Zaka Inadaiwa" value={fmtTsh(unpaidZakat)} icon={<Heart />} color="purple" />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-1">Faida Ghafi (Leo)</div>
          <div className="text-xl font-bold">{fmtTsh(revenue - cogs)}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-1">Gharama za Uendeshaji (Leo)</div>
          <div className="text-xl font-bold text-amber-600">{fmtTsh(opex)}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-500 mb-1">Bidhaa Zinaisha</div>
          <div className="text-xl font-bold text-red-600">{expiring}</div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <div className="flex items-start gap-3">
          <Heart className="text-emerald-600" size={28} />
          <div className="flex-1">
            <div className="text-xs text-emerald-700 uppercase tracking-wide font-semibold mb-1">Kwa Bwana Leo</div>
            <div className="text-2xl font-bold text-emerald-800">
              Zaka {fmtTsh(netProfit * 0.1)} + Sadaka {fmtTsh(netProfit * 0.1)} = {fmtTsh(zakatOwed)}
            </div>
            <div className="text-xs text-emerald-700 mt-2">
              Faida baada ya Mungu (kwako): <b>{fmtTsh(netProfit - zakatOwed)}</b>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  )
}