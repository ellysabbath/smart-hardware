import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Document, AinaDocument, HaliDocument } from '../types'

interface OngezaDocumentInput {
  jina: string
  aina: AinaDocument
  format: 'pdf' | 'csv' | 'excel'
  dukaId: string
  dukaJina: string
  ukubwa: string
  kipindi: string
  aliyezalisha: string
}

interface DocumentCtx {
  documents: Document[]
  ongezaDocument: (data: OngezaDocumentInput) => Document
  futa: (id: string) => void
  getDocument: (id: string) => Document | undefined
}

const DocumentContext = createContext<DocumentCtx | null>(null)

const DOCUMENTS_DEMO: Document[] = [
  {
    id: 'DOC-2026-001',
    jina: 'Ripoti ya Mauzo - Wiki 1 Nov',
    aina: 'mauzo',
    format: 'pdf',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    ukubwa: '245 KB',
    tarehe: '09 Nov 2026',
    muda: '15:30',
    hali: 'tayari',
    aliyezalisha: 'Juma Hassan',
    kipindi: '01 Nov - 07 Nov 2026',
  },
  {
    id: 'DOC-2026-002',
    jina: 'Ripoti ya Stoki - Novemba',
    aina: 'stoki',
    format: 'excel',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    ukubwa: '128 KB',
    tarehe: '09 Nov 2026',
    muda: '14:15',
    hali: 'tayari',
    aliyezalisha: 'Juma Hassan',
    kipindi: 'Novemba 2026',
  },
  {
    id: 'DOC-2026-003',
    jina: 'Ripoti ya Wateja - Q4 2026',
    aina: 'wateja',
    format: 'csv',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    ukubwa: '56 KB',
    tarehe: '08 Nov 2026',
    muda: '10:00',
    hali: 'tayari',
    aliyezalisha: 'Juma Hassan',
    kipindi: 'Okt - Des 2026',
  },
  {
    id: 'DOC-2026-004',
    jina: 'Ripoti ya Madeni - Novemba',
    aina: 'madeni',
    format: 'pdf',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    ukubwa: '180 KB',
    tarehe: '07 Nov 2026',
    muda: '16:45',
    hali: 'tayari',
    aliyezalisha: 'Juma Hassan',
    kipindi: 'Novemba 2026',
  },
  {
    id: 'DOC-2026-005',
    jina: 'Ripoti ya Jumla - Novemba',
    aina: 'jumla',
    format: 'pdf',
    dukaId: 'd1',
    dukaJina: 'Smart Hardware - Kwembe',
    ukubwa: '320 KB',
    tarehe: '06 Nov 2026',
    muda: '09:30',
    hali: 'inasindika',
    aliyezalisha: 'Juma Hassan',
    kipindi: 'Novemba 2026',
  },
]

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(DOCUMENTS_DEMO)

  const ongezaDocument: DocumentCtx['ongezaDocument'] = (data) => {
    const doc: Document = {
      ...data,
      id: `DOC-${new Date().getFullYear()}-${String(documents.length + 6).padStart(3, '0')}`,
      tarehe: new Date().toLocaleDateString('sw-TZ', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      muda: new Date().toLocaleTimeString('sw-TZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      hali: 'tayari',
    }
    setDocuments((prev) => [doc, ...prev])
    return doc
  }

  const futa = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  const getDocument = (id: string) => documents.find((d) => d.id === id)

  return (
    <DocumentContext.Provider value={{ documents, ongezaDocument, futa, getDocument }}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocuments() {
  const ctx = useContext(DocumentContext)
  if (!ctx) throw new Error('useDocuments must be used within DocumentProvider')
  return ctx
}