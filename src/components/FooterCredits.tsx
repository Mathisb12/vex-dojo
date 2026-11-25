import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'

const INSTAGRAM_URL = 'https://www.instagram.com/mathis.hex/'
const LINKEDIN_URL = 'https://www.linkedin.com/in/mathis-balmayer/'
const DISCORD_HANDLE = 'thegreedycat'

// Sidebar-bottom credits. Discord has no public profile URL for a bare
// handle, so that one copies the username to the clipboard instead of linking.
export function FooterCredits() {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)

  const copyDiscord = () => {
    navigator.clipboard?.writeText(DISCORD_HANDLE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => { /* clipboard unavailable — no feedback to give */ })
  }

  const linkCls = 'hover:text-vex-orange transition-colors'

  return (
    <div className="px-3 pb-3 text-center">
      <div className="text-vex-muted-3 text-[11px]">
        {t('credits.madeBy')}{' '}
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={`font-medium text-vex-muted ${linkCls}`}>
          Mathis Balmayer
        </a>
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-vex-muted">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
          Instagram
        </a>
        <span className="text-vex-muted-3">·</span>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
          LinkedIn
        </a>
        <span className="text-vex-muted-3">·</span>
        <button
          onClick={copyDiscord}
          title={`Discord: ${DISCORD_HANDLE}`}
          className={`${linkCls} ${copied ? 'text-vex-green' : ''}`}
        >
          {copied ? t('credits.copied') : 'Discord'}
        </button>
      </div>
    </div>
  )
}
