import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DukaKamili, MtumiajiKamili, HaliDuka } from '../types'
import {
  madukaKamili as madukaDemo,
  wafanyakaziKamili as wafanyakaziDemo,
} from '../data/demo'

interface FunguaDukaInput {
  jina: string
  mahali: string
  simu: string
  msimamiziId?: string
}

interface DukaCtx {
  maduka: DukaKamili[]
  wafanyakazi: MtumiajiKamili[]
  funguaDuka: (data: FunguaDukaInput) => DukaKamili
  wekaMsimamizi: (dukaId: string, mtumiajiId: string) => void
  badilishaHali: (dukaId: string, hali: HaliDuka) => void
  ongezaMtumiaji: (data: Omit<MtumiajiKamili, 'id' | 'tareheSajili' | 'active'>) => MtumiajiKamili
  getDuka: (id: string) => DukaKamili | undefined
  wafanyakaziWasioNaDuka: () => MtumiajiKamili[]
  wafanyakaziWaDuka: (dukaId: string) => MtumiajiKamili[]
}

const DukaContext = createContext<DukaCtx | null>(null)

export function DukaProvider({ children }: { children: ReactNode }) {
  const [maduka, setMaduka] = useState<DukaKamili[]>(madukaDemo)
  const [wafanyakazi, setWafanyakazi] = useState<MtumiajiKamili[]>(wafanyakaziDemo)

  const funguaDuka: DukaCtx['funguaDuka'] = (data) => {
    const msimamizi = data.msimamiziId
      ? wafanyakazi.find((w) => w.id === data.msimamiziId)
      : undefined

    const duka: DukaKamili = {
      id: `d${Date.now()}`,
      jina: data.jina,
      mahali: data.mahali,
      simu: data.simu,
      msimamiziId: msimamizi?.id,
      msimamiziJina: msimamizi?.jina,
      tareheKufunguliwa: new Date().toISOString().split('T')[0],
      hali: 'hai',
      mauzoLeo: 0,
      faidaLeo: 0,
      wafanyakazi: 0,
      stokiJumla: 0,
    }
    setMaduka((prev) => [duka, ...prev])

    // Mpangie msimamizi kwenye duka
    if (msimamizi) {
      setWafanyakazi((prev) =>
        prev.map((w) =>
          w.id === msimamizi.id ? { ...w, dukaId: duka.id, dukaJina: duka.jina } : w
        )
      )
    }
    return duka
  }

  const wekaMsimamizi = (dukaId: string, mtumiajiId: string) => {
    const mtumiaji = wafanyakazi.find((w) => w.id === mtumiajiId)
    if (!mtumiaji) return

    // Sasisha duka
    setMaduka((prev) =>
      prev.map((d) =>
        d.id === dukaId
          ? { ...d, msimamiziId: mtumiaji.id, msimamiziJina: mtumiaji.jina }
          : d
      )
    )

    // Sasisha mtumiaji
    setWafanyakazi((prev) =>
      prev.map((w) =>
        w.id === mtumiajiId
          ? { ...w, dukaId, dukaJina: maduka.find((d) => d.id === dukaId)?.jina }
          : w
      )
    )
  }

  const badilishaHali = (dukaId: string, hali: HaliDuka) => {
    setMaduka((prev) => prev.map((d) => (d.id === dukaId ? { ...d, hali } : d)))
  }

  const ongezaMtumiaji: DukaCtx['ongezaMtumiaji'] = (data) => {
    const mtumiaji: MtumiajiKamili = {
      ...data,
      id: `u${Date.now()}`,
      tareheSajili: new Date().toISOString().split('T')[0],
      active: true,
    }
    setWafanyakazi((prev) => [mtumiaji, ...prev])
    return mtumiaji
  }

  const getDuka = (id: string) => maduka.find((d) => d.id === id)

  const wafanyakaziWasioNaDuka = () =>
    wafanyakazi.filter((w) => !w.dukaId && w.active)

  const wafanyakaziWaDuka = (dukaId: string) =>
    wafanyakazi.filter((w) => w.dukaId === dukaId)

  return (
    <DukaContext.Provider
      value={{
        maduka,
        wafanyakazi,
        funguaDuka,
        wekaMsimamizi,
        badilishaHali,
        ongezaMtumiaji,
        getDuka,
        wafanyakaziWasioNaDuka,
        wafanyakaziWaDuka,
      }}
    >
      {children}
    </DukaContext.Provider>
  )
}

export function useDuka() {
  const ctx = useContext(DukaContext)
  if (!ctx) throw new Error('useDuka must be used within DukaProvider')
  return ctx
}