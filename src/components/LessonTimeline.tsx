import { useLang } from '../i18n/LanguageContext'
import { KindBadge, type StepKind } from './KindBadge'

export type TimelineItem =
  | { type: 'chapter-divider'; key: string; tierKey: 'tier.1' | 'tier.2' }
  | {
      type: 'lesson'
      key: string
      icon: string
      title: string
      kind: StepKind
      xp: number
      done: number
      total: number
      state: 'done' | 'current' | 'locked'
      onStart: () => void
    }

function TimelineMarker({ state, index }: { state: 'done' | 'current' | 'locked'; index: number }) {
  if (state === 'done') {
    return (
      <div className="w-8 h-8 rounded-full bg-vex-green flex items-center justify-center text-black text-sm font-bold">
        ✓
      </div>
    )
  }
  if (state === 'current') {
    return (
      <div className="w-8 h-8 rounded-full border-2 border-vex-orange bg-vex-surface flex items-center justify-center text-vex-orange text-sm font-bold">
        {index}
      </div>
    )
  }
  return <div className="w-8 h-8 rounded-full border border-vex-border bg-vex-surface" />
}

// Connected vertical path used on the home screen — a continuous line behind
// circular state markers (done/current/locked), each aligned to a lesson card.
// Carries no lock logic of its own; callers precompute each item's `state`.
export function LessonTimeline({ items }: { items: TimelineItem[] }) {
  const { t } = useLang()
  let lessonCounter = 0

  return (
    <div className="relative pl-6">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-vex-border" />
      <div className="flex flex-col gap-5">
        {items.map(item => {
          if (item.type === 'chapter-divider') {
            return (
              <div key={item.key} className="relative pt-2 pb-1">
                <div className="text-vex-orange text-xs font-mono font-semibold uppercase tracking-widest">
                  {t(item.tierKey)}
                </div>
              </div>
            )
          }

          lessonCounter++
          const pct = item.total > 0 ? (item.done / item.total) * 100 : 0
          const locked = item.state === 'locked'

          return (
            <button
              key={item.key}
              disabled={locked}
              onClick={() => !locked && item.onStart()}
              className={`relative flex gap-4 items-start text-left p-4 rounded-2xl border transition-all duration-150 ${
                locked
                  ? 'border-vex-border bg-vex-surface/40 opacity-50 cursor-not-allowed'
                  : 'border-vex-border bg-vex-surface hover:border-vex-orange/40'
              }`}
            >
              <div className="absolute -left-6 top-4">
                <TimelineMarker state={item.state} index={lessonCounter} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base flex-shrink-0 ${
                    locked ? 'border-vex-border text-vex-muted' : 'border-vex-orange/30 bg-vex-orange/10 text-vex-orange'
                  }`}>
                    {locked ? '🔒' : item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    {!locked && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <KindBadge kind={item.kind} />
                        <span className="text-vex-muted text-xs font-mono">+{item.xp} XP</span>
                      </div>
                    )}
                    <div className="text-vex-text font-semibold text-sm truncate">{item.title}</div>
                  </div>
                  {!locked && (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap ${
                      item.state === 'done'
                        ? 'border border-vex-border text-vex-muted'
                        : 'bg-vex-orange text-black'
                    }`}>
                      {item.state === 'done' ? t('path.review') : item.done > 0 ? t('path.continue') : t('path.start')}
                    </span>
                  )}
                </div>
                {!locked && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-vex-bg rounded-full h-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${item.state === 'done' ? 'bg-vex-green' : 'bg-vex-orange'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-vex-muted text-xs">{item.done}/{item.total}</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
