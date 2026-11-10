import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'

// ---------- MTEJA ----------
import MtejaHome from './pages/mteja/MtejaHome'
import MtejaBidhaa from './pages/mteja/MtejaBidhaa'
import MtejaQuotation from './pages/mteja/MtejaQuotation'
import MtejaOrders from './pages/mteja/MtejaOrders'
import MtejaOrder from './pages/mteja/MtejaOrder'
import MtejaDeni from './pages/mteja/MtejaDeni'

// ---------- MUUZAJI ----------
import MuuzajiPOS from './pages/muuzaji/MuuzajiPOS'
import MuuzajiRisiti from './pages/muuzaji/MuuzajiRisiti'
import MuuzajiPokeaBidhaa from './pages/muuzaji/MuuzajiPokeaBidhaa'
import MuuzajiWateja from './pages/muuzaji/MuuzajiWateja'
import MuuzajiCarts from './pages/muuzaji/MuuzajiCarts'
import MuuzajiRipoti from './pages/muuzaji/MuuzajiRipoti'
import MuuzajiMatumizi from './pages/muuzaji/MuuzajiMatumizi'

// ---------- MMILIKI ----------
import MmilikiDashboard from './pages/mmiliki/MmilikiDashboard'
import MmilikiMaduka from './pages/mmiliki/MmilikiMaduka'
import MmilikiWafanyakazi from './pages/mmiliki/MmilikiWafanyakazi'
import MmilikiFaida from './pages/mmiliki/MmilikiFaida'
import MmilikiZaka from './pages/mmiliki/MmilikiZaka'

// ---------- SHARED (Mmiliki + Admin) ----------
import UingizaVifaa from './pages/mmiliki/UingizaVifaa'
import MmilikiMauzo from './pages/mmiliki/MmilikiMauzo'
import Notifications from './pages/shared/Notifications'
import NotificationDetail from './pages/shared/NotificationDetail'
import MmilikiOrders from './pages/mmiliki/MmilikiOrders'
import MmilikiWateja from './pages/mmiliki/MmilikiWateja'
import MmilikiMatumizi from './pages/mmiliki/MmilikiMatumizi'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/notifications" element={<Notifications />} />
         <Route path="/notifications/:id" element={<NotificationDetail />} />

        {/* ================= MTEJA ================= */}
        <Route path="/mteja" element={<Layout role="mteja" />}>
          <Route index element={<MtejaHome />} />
          <Route path="bidhaa" element={<MtejaBidhaa />} />
          <Route path="quotation" element={<MtejaQuotation />} />
          <Route path="orders" element={<MtejaOrders />} />
          <Route path="order/:id" element={<MtejaOrder />} />
          <Route path="deni" element={<MtejaDeni />} />
        </Route>

        {/* ================= MUUZAJI ================= */}
        <Route path="/muuzaji" element={<Layout role="muuzaji" />}>
          <Route index element={<MuuzajiPOS />} />
          <Route path="risiti" element={<MuuzajiRisiti />} />
          <Route path="pokea" element={<MuuzajiPokeaBidhaa />} />
          <Route path="wateja" element={<MuuzajiWateja />} />
          <Route path="carts" element={<MuuzajiCarts />} />
          <Route path="ripoti" element={<MuuzajiRipoti />} />
          <Route path="matumizi" element={<MuuzajiMatumizi />} />
          {/* Muuzaji athibitishe maingizo ya vifaa */}
          <Route path="uingiza" element={<MuuzajiPokeaBidhaa />} />
        </Route>

        {/* ================= MMILIKI ================= */}
        <Route path="/mmiliki" element={<Layout role="mmiliki" />}>
          <Route index element={<MmilikiDashboard />} />
          <Route path="maduka" element={<MmilikiMaduka />} />
          <Route path="wafanyakazi" element={<MmilikiWafanyakazi />} />
          <Route path="faida" element={<MmilikiFaida />} />
          <Route path="zaka" element={<MmilikiZaka />} />
          <Route path="mauzo" element={<MmilikiMauzo />} />
          {/* Ingiza Vifaa (Mmiliki) */}
          <Route path="matumizi" element={<MmilikiMatumizi />} />
          <Route path="uingiza" element={<UingizaVifaa role="mmiliki" />} />
          <Route path="orders" element={<MmilikiOrders />} />
          <Route path="wateja" element={<MmilikiWateja />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<Layout role="mmiliki" />}>
          <Route path="uingiza" element={<UingizaVifaa role="admin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}