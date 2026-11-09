import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  MauzoYaDuka,
  GharamaOpex,
  AinaGharamaOpex,
} from '../types'
import {
  mauzoYaDuka as mauzoDemo,
  gharamaOpex as opexDemo,
} from '../data/demo'

interface OngezaMauzoInput {
  dukaId: string
  dukaJina: string
  muuzaji: string
  bidhaa: MauzoYaDuka['bidhaa']
  cogs: number
}

interface OngezaOpexInput {
  dukaId: string
  dukaJina: string
  aina: AinaGharamaOpex
  maelezo: string
  kiasi: number
  aliyeingiza: string
}

interface MauzoCtx {
  mauzo: MauzoYaDuka[]
  opex: GharamaOpex[]
  ongezaMauzo: (data: OngezaMauzoInput) => MauzoYaDuka
  ongezaOpex: (data: OngezaOpexInput) => GharamaOpex
  futaOpex: (id: string) => void
  getMauzo: (id: string) => MauzoYaDuka | undefined
}

const MauzoContext = createContext<MauzoCtx | null>(null)

export function MauzoProvider({ children }: { children: ReactNode }) {
  const [mauzo, setMauzo] = useState<MauzoYaDuka[]>(mauzoDemo)
  const [opex, setOpex] = useState<GharamaOpex[]>(opexDemo)

  const ongezaMauzo: MauzoCtx['ongezaMauzo'] = (data) => {
    const jumlaMauzo = data.bidhaa.reduce((s, b) => s + b.jumla, 0)
    const faidaGhafi = jumlaMauzo - data.cogs

    const m: MauzoYaDuka = {
      id: `SALE-${new Date().getFullYear()}-${String(mauzo.length + 1).padStart(3, '0')}`,
      tarehe: new Date().toISOString().split('T')[0],
      dukaId: data.dukaId,
      dukaJina: data.dukaJina,
      muuzaji: data.muuzaji,
      bidhaa: data.bidhaa,
      jumlaMauzo,
      cogs: data.cogs,
      faidaGhafi,
    }
    setMauzo((prev) => [m, ...prev])
    return m
  }

  const ongezaOpex: MauzoCtx['ongezaOpex'] = (data) => {
    const g: GharamaOpex = {
      ...data,
      id: `OPEX-${Date.now()}`,
      tarehe: new Date().toISOString().split('T')[0],
    }
    setOpex((prev) => [g, ...prev])
    return g
  }

  const futaOpex = (id: string) => {
    setOpex((prev) => prev.filter((g) => g.id !== id))
  }

  const getMauzo = (id: string) => mauzo.find((m) => m.id === id)

  return (
    <MauzoContext.Provider
      value={{ mauzo, opex, ongezaMauzo, ongezaOpex, futaOpex, getMauzo }}
    >
      {children}
    </MauzoContext.Provider>
  )
}

export function useMauzo() {
  const ctx = useContext(MauzoContext)
  if (!ctx) throw new Error('useMauzo must be used within MauzoProvider')
  return ctx
}