import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { UI_STRINGS, type Lang, type UIKey } from './ui'

const STORAGE_KEY = 'vex-dojo-lang'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: (key: UIKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function loadLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'fr') return stored
  } catch { /* ignore */ }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'fr' : 'en')
  }, [lang, setLang])

  const t = useCallback((key: UIKey) => UI_STRINGS[lang][key] ?? UI_STRINGS.en[key] ?? key, [lang])

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
