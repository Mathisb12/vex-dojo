import type { LearnCard } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'
import { WrangleParamDiagram } from './WrangleParamDiagram'
import { RampDiagram } from './RampDiagram'

const VISUAL_COMPONENTS: Partial<Record<NonNullable<LearnCard['visual']>, () => JSX.Element>> = {
  'wrangle-params': WrangleParamDiagram,
  ramp: RampDiagram,
}

interface Props {
  card: LearnCard
  onContinue: () => void
  current: number
  total: number
}

function renderBody(text: string) {
  // Convert **bold** and `code` to HTML
  return text.split('\n').map((line, i) => {
    const html = line
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-vex-text font-semibold">$1</strong>')
      .replace(/`(.+?)`/g, '<code class="bg-black/40 text-vex-orange font-mono text-xs px-1.5 py-0.5 rounded border border-vex-border/50">$1</code>')
      .replace(/^- /, '')

    const isBullet = line.startsWith('- ')
    return (
      <div key={i} className={`${isBullet ? 'flex items-start gap-2' : ''} ${line === '' ? 'h-3' : ''}`}>
        {isBullet && <span className="text-vex-orange mt-1 text-xs flex-shrink-0">▸</span>}
        <span dangerouslySetInnerHTML={{ __html: html }} className="text-vex-text/90 text-sm leading-relaxed" />
      </div>
    )
  })
}

export function LearnCardView({ card, onContinue, current, total }: Props) {
  const { t } = useLang()
  return (
    <div className="flex flex-col gap-5 animate-[slideIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-vex-orange/10 border border-vex-orange/30 flex items-center justify-center flex-shrink-0">
          <span className="text-vex-orange text-lg">📘</span>
        </div>
        <div>
          <div className="text-xs text-vex-orange font-mono uppercase tracking-widest mb-0.5">
            {t('code.theory')} {current}/{total}
          </div>
          <h2 className="text-vex-text font-bold text-lg leading-tight">{card.title}</h2>
        </div>
      </div>

      {/* Body */}
      <div className="bg-vex-surface border border-vex-border rounded-2xl p-5 flex flex-col gap-1">
        {renderBody(card.body)}
      </div>

      {/* Illustrative diagram, when this card has one */}
      {card.visual && VISUAL_COMPONENTS[card.visual] && (() => {
        const Diagram = VISUAL_COMPONENTS[card.visual]!
        return (
          <div className="bg-vex-bg border border-vex-border rounded-xl p-3">
            <Diagram />
          </div>
        )
      })()}

      {/* Code example */}
      {card.codeExample && (
        <div className="rounded-xl overflow-hidden border border-vex-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-vex-surface border-b border-vex-border">
            <div className="w-2 h-2 rounded-full bg-vex-orange/60" />
            <span className="text-vex-muted text-xs font-mono">example.vex</span>
          </div>
          <pre className="bg-vex-bg px-4 py-3 text-sm font-mono overflow-x-auto leading-relaxed">
            {card.codeExample.split('\n').map((line, i) => {
              // Simple syntax colouring
              const isComment = line.trim().startsWith('//')
              if (isComment) {
                return <div key={i} className="text-vex-muted">{line}</div>
              }
              // Highlight @attr, keywords, strings
              const parts = line.split(/(@\w+|"[^"]*"|\b(?:int|float|vector|string|if|else|for|while|return)\b)/g)
              return (
                <div key={i}>
                  {parts.map((part, j) => {
                    if (part?.startsWith('@')) return <span key={j} className="text-vex-blue">{part}</span>
                    if (part?.startsWith('"')) return <span key={j} className="text-vex-green">{part}</span>
                    if (['int','float','vector','string','if','else','for','while','return'].includes(part ?? ''))
                      return <span key={j} className="text-vex-purple">{part}</span>
                    return <span key={j} className="text-vex-text/80">{part}</span>
                  })}
                </div>
              )
            })}
          </pre>
        </div>
      )}

      {/* Key points */}
      {card.keyPoints && card.keyPoints.length > 0 && (
        <div className="bg-vex-orange/5 border border-vex-orange/20 rounded-xl p-4">
          <div className="text-xs text-vex-orange font-mono uppercase tracking-widest mb-2">{t('common.keyPoints')}</div>
          <ul className="flex flex-col gap-1.5">
            {card.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-vex-orange flex-shrink-0 mt-0.5">✦</span>
                <span
                  className="text-vex-text/80"
                  dangerouslySetInnerHTML={{ __html: pt.replace(/`(.+?)`/g, '<code class="bg-black/30 text-vex-orange font-mono text-xs px-1 rounded">$1</code>') }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Continue */}
      <button
        onClick={onContinue}
        className="self-start px-6 py-2.5 bg-vex-orange text-black font-bold rounded-xl hover:bg-vex-orange/90 transition-colors text-sm"
      >
        {t('common.gotIt')}
      </button>
    </div>
  )
}
