// src/context/DocumentContext.tsx
import {  type ReactNode } from 'react'
import { useStore } from '../store/StoreContext'
import type { Document } from '../types'

// Re-export kutoka StoreContext — hakuna useState tofauti
interface DocumentCtx {
  documents: Document[]
  ongezaDocument: (data: Omit<Document, 'id'>) => Document
  futa: (id: string) => void
  getDocument: (id: string) => Document | undefined
}

export function DocumentProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useDocuments(): DocumentCtx {
  const store = useStore()
  return {
    documents: store.documents,
    ongezaDocument: store.ongezaDocument,
    futa: store.futaDocument,
    getDocument: (id: string) => store.documents.find((d) => d.id === id),
  }
}