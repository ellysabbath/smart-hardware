import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register' // 1. Ongeza import ya Register
import AdminDashboard from './roles/admin/AdminDashboard'
import UsersPage from './roles/admin/UsersPage'
import AuditPage from './roles/admin/AuditPage'
import SettingsPage from './roles/admin/SettingsPage'
import WorkingPeriodPage from './roles/admin/WorkingPeriodPage'
import SellerPOS from './roles/seller/SellerPOS'
import QuotationsPage from './roles/seller/QuotationsPage'
import SalesHistoryPage from './roles/seller/SalesHistoryPage'
import StockPage from './roles/warehouse/StockPage'
import GRNPage from './roles/warehouse/GRNPage'
import StockTakePage from './roles/warehouse/StockTakePage'
import OwnerDashboard from './roles/owner/OwnerDashboard'
import ProfitLossPage from './roles/owner/ProfitLossPage'
import ReportsPage from './roles/owner/ReportsPage'

import PurchasesPage from './roles/shared/PurchasesPage'
import CustomersPage from './roles/shared/CustomersPage'
import SuppliersPage from './roles/shared/SuppliersPage'
import ExpensesPage from './roles/shared/ExpensesPage'
import ZakatPage from './roles/shared/ZakatPage'
import MonthlyReportsPage from './roles/shared/MonthlyReportsPage'
import type { Role } from './types'
import ProductsPage from './roles/shared/ProductsPage'
import BranchesPage from './roles/admin/BranchesPage'

function Protected({ children, roles }: { children: React.ReactNode; roles: Role[] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={defaultHome(user.role)} replace />
  return <>{children}</>
}

const defaultHome = (role: Role) =>
  role === 'admin' ? '/dashboard'
    : role === 'seller' ? '/pos'
      : role === 'warehouse' ? '/stock'
        : '/owner'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* 2. Ongeza route ya /register hapa */}
      <Route path="/login" element={user ? <Navigate to={defaultHome(user.role)} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={defaultHome(user.role)} replace /> : <Register />} />

      {/* Admin */}
      <Route path="/dashboard" element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
      <Route path="/users" element={<Protected roles={['admin']}><UsersPage /></Protected>} />
      <Route path="/audit" element={<Protected roles={['admin']}><AuditPage /></Protected>} />
      <Route path="/settings" element={<Protected roles={['admin']}><SettingsPage /></Protected>} />
      <Route path="/working-period" element={<Protected roles={['admin']}><WorkingPeriodPage /></Protected>} />
      <Route path="/branches" element={<Protected roles={['admin']}><BranchesPage /></Protected>} />

      {/* Seller */}
      <Route path="/pos" element={<Protected roles={['seller', 'admin']}><SellerPOS /></Protected>} />
      <Route path="/quotations" element={<Protected roles={['seller', 'admin']}><QuotationsPage /></Protected>} />
      <Route path="/sales" element={<Protected roles={['seller', 'admin', 'owner']}><SalesHistoryPage /></Protected>} />

      {/* Warehouse */}
      <Route path="/stock" element={<Protected roles={['warehouse', 'admin']}><StockPage /></Protected>} />
      <Route path="/grn" element={<Protected roles={['warehouse', 'admin']}><GRNPage /></Protected>} />
      <Route path="/stock-take" element={<Protected roles={['warehouse', 'admin']}><StockTakePage /></Protected>} />

      {/* Owner */}
      <Route path="/owner" element={<Protected roles={['owner', 'admin']}><OwnerDashboard /></Protected>} />
      <Route path="/profit-loss" element={<Protected roles={['owner', 'admin']}><ProfitLossPage /></Protected>} />
      <Route path="/reports" element={<Protected roles={['owner', 'admin']}><ReportsPage /></Protected>} />

      {/* Shared */}
      <Route path="/products" element={<Protected roles={['admin', 'seller', 'warehouse', 'owner']}><ProductsPage /></Protected>} />
      <Route path="/purchases" element={<Protected roles={['admin', 'warehouse']}><PurchasesPage /></Protected>} />
      <Route path="/customers" element={<Protected roles={['admin', 'seller']}><CustomersPage /></Protected>} />
      <Route path="/suppliers" element={<Protected roles={['admin', 'warehouse']}><SuppliersPage /></Protected>} />
      <Route path="/expenses" element={<Protected roles={['admin', 'owner', 'seller']}><ExpensesPage /></Protected>} />
      <Route path="/zakat" element={<Protected roles={['admin', 'owner']}><ZakatPage /></Protected>} />
      <Route path="/monthly-reports" element={<Protected roles={['admin', 'seller', 'owner']}><MonthlyReportsPage /></Protected>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={user ? defaultHome(user.role) : '/login'} replace />} />
    </Routes>
  )
}