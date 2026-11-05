import { useState } from 'react'
import Layout from '../../components/Layout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Card } from '../../components/ui/Card'
import { KEYS, save } from '../../lib/storage'
import { Download, Trash2, Database, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const [clearOpen, setClearOpen] = useState(false)

  const exportData = () => {
    const data: Record<string, any> = {}
    Object.values(KEYS).forEach(k => {
      const raw = localStorage.getItem(k)
      if (raw) data[k] = JSON.parse(raw)
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smart-hardware-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <Layout title="Mipangilio ya System">
      <div className="grid gap-4 max-w-2xl">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <Download className="text-brand-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <div className="font-semibold mb-1">Backup ya Data</div>
              <div className="text-sm text-slate-600 mb-3">
                Pakua nakala ya data yote (bidhaa, mauzo, wateja, n.k.) kama faili la JSON.
              </div>
              <Button onClick={exportData}>Pakua Backup</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <Database className="text-slate-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <div className="font-semibold mb-1">Hifadhi (Storage)</div>
              <div className="text-sm text-slate-600 mb-2">
                System hii inahifadhi data kwenye kivinjari (localStorage). Hakuna server.
              </div>
              <div className="text-xs text-slate-500 bg-slate-100 rounded p-2 font-mono">
                Keys: {Object.values(KEYS).length} groups<br />
                Size: ~{Math.round(Object.values(KEYS).reduce((s, k) => s + (localStorage.getItem(k)?.length || 0), 0) / 1024)} KB
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
            <div className="flex-1">
              <div className="font-semibold mb-1 text-red-700">Eneo la Hatari</div>
              <div className="text-sm text-slate-600 mb-3">
                Futa data yote ya system. Hii haiwezi kurudishwa. Hakikisha umepakua backup kwanza.
              </div>
              <Button variant="danger" onClick={() => setClearOpen(true)}>
                <span className="flex items-center gap-2"><Trash2 size={16} /> Futa Data Yote</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={clearOpen} onClose={() => setClearOpen(false)} title="Futa Data Yote" size="sm">
        <p className="text-slate-700 mb-4">
          ⚠️ Una uhakika kabisa? Data yote ya system itafutwa na kurudishwa kwa mipangilio ya mwanzo.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setClearOpen(false)}>Ghairi</Button>
          <Button variant="danger" onClick={clearAll}>Futa Kila Kitu</Button>
        </div>
      </Modal>
    </Layout>
  )
}