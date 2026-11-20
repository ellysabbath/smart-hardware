
// ============================================================
// LANGUAGE CONTEXT
// Global language management for Smart Hardware System
// Supported languages: Kiswahili (sw) and English (en)
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'

import {
  translations,
  LANGUAGES,
  type Language,
} from './translations'

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = 'smart-hardware-lang'

const DEFAULT_LANGUAGE: Language = 'sw'

// ============================================================
// CONTEXT INTERFACE
// ============================================================

interface LanguageContextValue {
  /** Current application language */
  lang: Language

  /** Alias for components that use the name language */
  language: Language

  /** Change application language */
  setLang: (language: Language) => void

  /** Alias for setLang */
  setLanguage: (language: Language) => void

  /** Translate a key into the current language */
  t: (
    key: string,
    vars?: Record<string, string | number>
  ) => string

  /** Available languages */
  languages: typeof LANGUAGES
}

// ============================================================
// CREATE CONTEXT
// ============================================================

const LanguageContext = createContext<
  LanguageContextValue | undefined
>(undefined)

// ============================================================
// HELPER: GET SAVED LANGUAGE
// ============================================================

function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (
      saved &&
      Object.prototype.hasOwnProperty.call(translations, saved)
    ) {
      return saved as Language
    }
  } catch {
    // localStorage may not be available
  }

  return DEFAULT_LANGUAGE
}

// ============================================================
// LANGUAGE PROVIDER
// ============================================================

export function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  // ----------------------------------------------------------
  // 1. Current language state
  // ----------------------------------------------------------

  const [lang, setLangState] = useState<Language>(
    getSavedLanguage
  )

  // ----------------------------------------------------------
  // 2. Change language
  // ----------------------------------------------------------

  const setLang = useCallback((newLanguage: Language) => {
    setLangState(newLanguage)

    try {
      localStorage.setItem(STORAGE_KEY, newLanguage)
    } catch {
      // Continue even if localStorage is unavailable
    }

    document.documentElement.lang = newLanguage
  }, [])

  // ----------------------------------------------------------
  // 3. Keep HTML language synchronized
  // ----------------------------------------------------------

  useEffect(() => {
    document.documentElement.lang = lang

    document.documentElement.setAttribute(
      'data-language',
      lang
    )
  }, [lang])

  // ----------------------------------------------------------
  // 4. Translation function
  // ----------------------------------------------------------

  const t = useCallback(
    (
      key: string,
      vars?: Record<string, string | number>
    ): string => {
      let translatedText =
        translations[lang][key] ??
        translations[DEFAULT_LANGUAGE][key] ??
        key

      // Replace placeholders, e.g. {count}
      if (vars) {
        for (const [variable, value] of Object.entries(vars)) {
          const placeholder = new RegExp(
            `\\{${variable}\\}`,
            'g'
          )

          translatedText = translatedText.replace(
            placeholder,
            String(value)
          )
        }
      }

      return translatedText
    },
    [lang]
  )

  // ----------------------------------------------------------
  // 5. Context value
  // ----------------------------------------------------------

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      language: lang,

      setLang,
      setLanguage: setLang,

      t,

      languages: LANGUAGES,
    }),
    [lang, setLang, t]
  )

  // ----------------------------------------------------------
  // 6. Provide language to the entire application
  // ----------------------------------------------------------

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// ============================================================
// CUSTOM HOOK
// Use this hook in every application component
// ============================================================

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error(
      'useLanguage must be used within LanguageProvider. ' +
      'Wrap your application with LanguageProvider.'
    )
  }

  return context
}

// ============================================================
// END OF LANGUAGE CONTEXT
// ============================================================
