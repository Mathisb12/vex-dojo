import { useEffect, useRef } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { Icon } from './Icon'

interface Props {
  dueCount: number
  /** Lesson names the due items came from, commonest first. */
  concepts: string[]
  onStart: () => void
  onSkip: () => void
}

/**
 * Shown on arrival when items are due. Spaced repetition only works if the
 * review actually happens, and a card further down the page is easy to walk
 * past — so this asks directly. It is still a question, not a wall: Skip is a
 * real button, and either answer silences it until tomorrow.
 */
export function ReviewPrompt({ dueCount, concepts, onStart, onSkip }: Props) {
  const { t } = useLang()
  const startRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    startRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onSkip() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSkip])

  const shown = concepts.slice(0, 3)
  const rest = concepts.length - shown.length

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-prompt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[slideIn_0.2s_ease-out]"
    >
      <div className="w-full max-w-md bg-vex-surface border border-vex-orange/40 rounded-2xl shadow-vex-panel p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-vex-orange/15 border border-vex-orange/30 flex items-center justify-center flex-shrink-0 text-xl">
            <Icon name="🔁" size={21} />
          </div>
          <div className="min-w-0">
            <div className="text-vex-orange text-[11px] font-mono font-semibold uppercase tracking-widest mb-1">
              {t('review.eyebrow')}
            </div>
            <h2 id="review-prompt-title" className="text-vex-text font-bold text-lg leading-tight">
              {dueCount} {dueCount === 1 ? t('review.dueOne') : t('review.due')}
            </h2>
          </div>
        </div>

        {shown.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {shown.map(c => (
              <span
                key={c}
                className="text-xs font-mono text-vex-text/70 bg-vex-bg border border-vex-border rounded-lg px-2 py-1"
              >
                {c}
              </span>
            ))}
            {rest > 0 && (
              <span className="text-xs font-mono text-vex-muted px-2 py-1">+{rest}</span>
            )}
          </div>
        )}

        <p className="text-vex-muted text-sm leading-relaxed text-pretty">{t('review.promptBody')}</p>

        <div className="flex items-center gap-2 pt-1">
          <button
            ref={startRef}
            onClick={onStart}
            className="flex-1 inline-flex items-center justify-center min-h-[44px] px-5 bg-vex-orange text-black font-bold rounded-xl hover:bg-vex-orange/90 transition-colors text-sm"
          >
            {t('review.start')}
          </button>
          <button
            onClick={onSkip}
            className="inline-flex items-center justify-center min-h-[44px] px-4 text-vex-muted hover:text-vex-text border border-vex-border hover:border-vex-muted rounded-xl transition-colors text-sm"
          >
            {t('review.skip')}
          </button>
        </div>

        <p className="text-vex-muted-2 text-[11px] text-center">{t('review.promptOncePerDay')}</p>
      </div>
    </div>
  )
}
