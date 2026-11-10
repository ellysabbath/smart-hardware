import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  Mshahara,
  MalipoMshahara,
  NjiaMalipoMshahara,
  AkauntiMfanyakazi,
  HaliMshahara,
  BulkPaymentResult,
} from '../types'
import {
  mishahara as mishaharaDemo,
  akauntiWafanyakazi as akauntiDemo,
} from '../data/demo'

// ============================================================
// Types za ndani
// ============================================================
interface OngezaMshaharaInput {
  mtumiajiId: string
  jinaMtumiaji: string
  nafasi: string
  dukaId: string
  dukaJina: string
  mwezi: string
  kipindi: string
  mshaharaMsingi: number
  posho: number
  overtime: number
  mafao: number
  makato: number
  maelezo?: string
}

interface OngezaAkauntiInput {
  mtumiajiId: string
  jinaMtumiaji: string
  aina: 'bank' | 'mobile'
  jina: string
  namba: string
  jinaMmiliki: string
  ndiyoMsingi: boolean
}

interface MshaharaCtx {
  mishahara: Mshahara[]
  malipo: MalipoMshahara[]
  akaunti: AkauntiMfanyakazi[]
  ongezaMshahara: (data: OngezaMshaharaInput) => Mshahara
  lipaMshaharaMmoja: (mshaharaId: string) => MalipoMshahara | null
  lipaBulk: (mishaharaIds: string[]) => BulkPaymentResult
  lipaZoteZinazosubiri: () => BulkPaymentResult
  ongezaAkaunti: (data: OngezaAkauntiInput) => AkauntiMfanyakazi
  futaAkaunti: (id: string) => void
  futaMshahara: (id: string) => void
  getMshahara: (id: string) => Mshahara | undefined
  getAkauntiMsingi: (mtumiajiId: string) => AkauntiMfanyakazi | undefined
  mishaharaYaMtumiaji: (mtumiajiId: string) => Mshahara[]
}

const MshaharaContext = createContext<MshaharaCtx | null>(null)

const ALIYEIDHINISHA = 'Moses Kimaro'

// ============================================================
// Ramani ya njia kutoka akaunti
// ============================================================
const AINA_TO_NJIA: Record<string, NjiaMalipoMshahara> = {
  'M-Pesa': 'mpesa',
  'Tigo Pesa': 'tigopesa',
  'Airtel Money': 'airtel',
  'HaloPesa': 'halopesa',
  'CRDB Bank': 'crdb',
  'NMB Bank': 'nmb',
  'NBC Bank': 'nbc',
  'Stanbic Bank': 'stanbic',
}

function njiaKutokaAkaunti(akaunti: AkauntiMfanyakazi): NjiaMalipoMshahara {
  return AINA_TO_NJIA[akaunti.jina] ?? 'other'
}

// ============================================================
// Tengeneza kumbukumbu (prefix + tarehe + namba)
// ============================================================
function tengenezaKumbukumbu(
  njia: NjiaMalipoMshahara,
  tarehe: string,
  idx: number
): string {
  const prefix =
    njia === 'mpesa'
      ? 'MPESA'
      : njia === 'tigopesa'
      ? 'TIGO'
      : njia === 'airtel'
      ? 'AIRTEL'
      : njia === 'halopesa'
      ? 'HALO'
      : 'BANK'
  const tareheFmt = tarehe.replace(/-/g, '')
  return `${prefix}-${tareheFmt}-${String(idx + 1).padStart(3, '0')}`
}

// ============================================================
// Tengeneza tarehe na muda wa sasa
// ============================================================
function tareheNaMudaSasa() {
  const sasa = new Date()
  return {
    tareheISO: sasa.toISOString().split('T')[0],
    tareheFmt: sasa.toLocaleDateString('sw-TZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    muda: sasa.toLocaleTimeString('sw-TZ', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

// ============================================================
// Provider
// ============================================================
export function MshaharaProvider({ children }: { children: ReactNode }) {
  const [mishahara, setMishahara] = useState<Mshahara[]>(mishaharaDemo)
  const [malipo, setMalipo] = useState<MalipoMshahara[]>([])
  const [akaunti, setAkaunti] = useState<AkauntiMfanyakazi[]>(akauntiDemo)

  // ============================================================
  // Ongeza mshahara mpya
  // ============================================================
  const ongezaMshahara: MshaharaCtx['ongezaMshahara'] = (data) => {
    const jumla =
      data.mshaharaMsingi +
      data.posho +
      data.overtime +
      data.mafao -
      data.makato
    const m: Mshahara = {
      ...data,
      id: `SAL-${new Date().getFullYear()}-${String(
        mishahara.length + 7
      ).padStart(3, '0')}`,
      jumla,
      hali: 'inasubiri',
    } as Mshahara
    setMishahara((prev) => [m, ...prev])
    return m
  }

  // ============================================================
  // Lipa mshahara mmoja
  // ============================================================
  const lipaMshaharaMmoja: MshaharaCtx['lipaMshaharaMmoja'] = (mshaharaId) => {
    const mshahara = mishahara.find((m) => m.id === mshaharaId)
    if (!mshahara) return null
    if (mshahara.hali !== 'inasubiri') return null

    // Tafuta akaunti msingi ya mfanyakazi
    const akauntiMfanyakazi = akaunti.find(
      (a) => a.mtumiajiId === mshahara.mtumiajiId && a.ndiyoMsingi
    )
    if (!akauntiMfanyakazi) return null

    const njia = njiaKutokaAkaunti(akauntiMfanyakazi)
    const { tareheISO, tareheFmt, muda } = tareheNaMudaSasa()
    const kumbukumbu = tengenezaKumbukumbu(njia, tareheISO, 0)

    const malipoMpya: MalipoMshahara = {
      id: `PAY-${Date.now()}`,
      mshaharaId,
      mtumiajiId: mshahara.mtumiajiId,
      jinaMtumiaji: mshahara.jinaMtumiaji,
      kiasi: mshahara.jumla,
      njia,
      akaunti: akauntiMfanyakazi.namba,
      kumbukumbu,
      tarehe: tareheFmt,
      muda,
      hali: 'imelipwa',
    }

    // Sasisha malipo
    setMalipo((prev) => [malipoMpya, ...prev])

    // Sasisha mshahara
    setMishahara((prev) =>
      prev.map((m) =>
        m.id === mshaharaId
          ? {
              ...m,
              hali: 'imelipwa' as HaliMshahara,
              tareheMalipo: tareheISO,
              njiaMalipo: njia,
              akauntiMalipo: akauntiMfanyakazi.namba,
              kumbukumbu,
              aliyeidhinisha: ALIYEIDHINISHA,
              tareheIdhini: tareheISO,
            }
          : m
      )
    )
    return malipoMpya
  }

  // ============================================================
  // Lipa bulk (wafanyakazi waliochaguliwa)
  // ============================================================
  const lipaBulk: MshaharaCtx['lipaBulk'] = (mishaharaIds) => {
    // Kwanza hesabu malipo yote
    const { tareheISO, tareheFmt, muda } = tareheNaMudaSasa()
    const malipoMapya: MalipoMshahara[] = []
    const zilizofanikiwa: string[] = []
    const zilizoshindwa: string[] = []
    const waliokosaAkaunti: string[] = []
    let jumla = 0

    // Ramani ya kumbukumbu kwa kila mshaharaId
    const kumbukumbuMap = new Map<string, string>()

    mishaharaIds.forEach((id, idx) => {
      const mshahara = mishahara.find((m) => m.id === id)
      if (!mshahara || mshahara.hali !== 'inasubiri') {
        zilizoshindwa.push(id)
        return
      }

      const akauntiMfanyakazi = akaunti.find(
        (a) => a.mtumiajiId === mshahara.mtumiajiId && a.ndiyoMsingi
      )
      if (!akauntiMfanyakazi) {
        waliokosaAkaunti.push(mshahara.jinaMtumiaji)
        zilizoshindwa.push(id)
        return
      }

      const njia = njiaKutokaAkaunti(akauntiMfanyakazi)
      const kumbukumbu = tengenezaKumbukumbu(njia, tareheISO, idx)

      const malipoMpya: MalipoMshahara = {
        id: `PAY-${Date.now()}-${idx}`,
        mshaharaId: id,
        mtumiajiId: mshahara.mtumiajiId,
        jinaMtumiaji: mshahara.jinaMtumiaji,
        kiasi: mshahara.jumla,
        njia,
        akaunti: akauntiMfanyakazi.namba,
        kumbukumbu,
        tarehe: tareheFmt,
        muda,
        hali: 'imelipwa',
      }

      malipoMapya.push(malipoMpya)
      zilizofanikiwa.push(id)
      kumbukumbuMap.set(id, kumbukumbu)
      jumla += mshahara.jumla
    })

    // Sasisha mishahara kwa kutumia kumbukumbuMap
    setMishahara((prev) =>
      prev.map((m) => {
        if (!zilizofanikiwa.includes(m.id)) return m

        const mshahara = mishahara.find((x) => x.id === m.id)
        if (!mshahara) return m

        const akauntiMfanyakazi = akaunti.find(
          (a) => a.mtumiajiId === mshahara.mtumiajiId && a.ndiyoMsingi
        )
        if (!akauntiMfanyakazi) return m

        const njia = njiaKutokaAkaunti(akauntiMfanyakazi)
        const kumbukumbu = kumbukumbuMap.get(m.id) ?? ''

        return {
          ...m,
          hali: 'imelipwa' as HaliMshahara,
          tareheMalipo: tareheISO,
          njiaMalipo: njia,
          akauntiMalipo: akauntiMfanyakazi.namba,
          kumbukumbu,
          aliyeidhinisha: ALIYEIDHINISHA,
          tareheIdhini: tareheISO,
        }
      })
    )

    // Sasisha malipo
    setMalipo((prev) => [...malipoMapya, ...prev])

    return {
      jumla,
      zilizofanikiwa: zilizofanikiwa.length,
      zilizoshindwa: zilizoshindwa.length,
      malipo: malipoMapya,
      waliokosaAkaunti,
    }
  }

  // ============================================================
  // Lipa zote zinazosubiri (button moja)
  // ============================================================
  const lipaZoteZinazosubiri: MshaharaCtx['lipaZoteZinazosubiri'] = () => {
    const zinazosubiri = mishahara.filter((m) => m.hali === 'inasubiri')
    return lipaBulk(zinazosubiri.map((m) => m.id))
  }

  // ============================================================
  // Akaunti za wafanyakazi
  // ============================================================
  const ongezaAkaunti: MshaharaCtx['ongezaAkaunti'] = (data) => {
    const a: AkauntiMfanyakazi = {
      ...data,
      id: `acc-${Date.now()}`,
    }
    setAkaunti((prev) => [...prev, a])
    return a
  }

  const futaAkaunti = (id: string) => {
    setAkaunti((prev) => prev.filter((a) => a.id !== id))
  }

  const futaMshahara = (id: string) => {
    setMishahara((prev) => prev.filter((m) => m.id !== id))
  }

  const getMshahara = (id: string) => mishahara.find((m) => m.id === id)

  const getAkauntiMsingi = (mtumiajiId: string) =>
    akaunti.find((a) => a.mtumiajiId === mtumiajiId && a.ndiyoMsingi)

  const mishaharaYaMtumiaji = (mtumiajiId: string) =>
    mishahara.filter((m) => m.mtumiajiId === mtumiajiId)

  return (
    <MshaharaContext.Provider
      value={{
        mishahara,
        malipo,
        akaunti,
        ongezaMshahara,
        lipaMshaharaMmoja,
        lipaBulk,
        lipaZoteZinazosubiri,
        ongezaAkaunti,
        futaAkaunti,
        futaMshahara,
        getMshahara,
        getAkauntiMsingi,
        mishaharaYaMtumiaji,
      }}
    >
      {children}
    </MshaharaContext.Provider>
  )
}

export function useMshahara() {
  const ctx = useContext(MshaharaContext)
  if (!ctx) throw new Error('useMshahara must be used within MshaharaProvider')
  return ctx
}