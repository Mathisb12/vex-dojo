import { useLang } from '../i18n/LanguageContext'
import { KindBadge, type StepKind } from './KindBadge'
import type { UIKey } from '../i18n/ui'

type Accent = 'orange' | 'purple'

export type TimelineItem =
  | { type: 'tier-divider'; key: string; tierKey: UIKey }
  | { type: 'module-divider'; key: string; icon: string; title: string; accent: Accent }
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

const RAIL_W = 'w-11' // 44px, matches the design handoff's rail column

function ModuleMarker({ accent }: { accent: Accent }) {
  return (
    <div
      className={`w-4 h-4 rotate-45 rounded-[3px] flex-shrink-0 ${
        accent === 'orange' ? 'bg-vex-orange shadow-vex-glow-node' : 'bg-vex-purple shadow-vex-glow-purple'
      }`}
    />
  )
}

function LessonMarker({ state, index }: { state: 'done' | 'current' | 'locked'; index: number }) {
  if (state === 'done') {
    return (
      <div className="w-[30px] h-[30px] rounded-full bg-vex-green flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
        ✓
      </div>
    )
  }
  if (state === 'current') {
    return (
      <div className="w-[30px] h-[30px] rounded-full border-2 border-vex-orange bg-vex-panel-2 flex items-center justify-center text-vex-orange text-sm font-bold shadow-vex-glow-node flex-shrink-0">
        {index}
      </div>
    )
  }
  return <div className="w-[30px] h-[30px] rounded-full border border-vex-border-soft bg-vex-panel-2 flex-shrink-0" />
}

// Connected vertical path used on the home screen. Two divider levels (tier,
// then module) keep module boundaries visible — without them, lessons from
// different modules within the same tier blur into one undifferentiated list.
// Carries no lock logic of its own; callers precompute each lesson's `state`.
export function LessonTimeline({ items }: { items: TimelineItem[] }) {
  const { t } = useLang()
  let lessonCounter = 0

  return (
    <div className="relative">
      <div
        className={`absolute ${RAIL_W} top-0 bottom-0 left-0 flex justify-center`}
        aria-hidden="true"
      >
        <div className="w-px" style={{ background: 'linear-gradient(#21262d, #1a2029)' }} />
      </div>
      <div className="flex flex-col gap-6">
        {items.map(item => {
          if (item.type === 'tier-divider') {
            return (
              <div key={item.key} className="relative flex items-center gap-[22px] pt-2">
                <div className={`${RAIL_W} flex-shrink-0`} />
                <div className="text-vex-orange text-[11px] font-mono font-bold uppercase tracking-[1.5px]">
                  {t(item.tierKey)}
                </div>
              </div>
            )
          }

          if (item.type === 'module-divider') {
            return (
              <div key={item.key} className="relative flex items-center gap-[22px]">
                <div className={`${RAIL_W} flex-shrink-0 flex items-center justify-center`}>
                  <ModuleMarker accent={item.accent} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <h2 className="text-vex-text font-bold text-[18px]">{item.title}</h2>
                </div>
              </div>
            )
          }

          lessonCounter++
          const pct = item.total > 0 ? (item.done / item.total) * 100 : 0
          const locked = item.state === 'locked'
          const current = item.state === 'current'
          const done = item.state === 'done'

          return (
            <div key={item.key} className="relative flex gap-[22px] items-center">
              <div className={`${RAIL_W} flex-shrink-0 self-stretch flex items-center justify-center`}>
                <LessonMarker state={item.state} index={lessonCounter} />
              </div>
              <button
                disabled={locked}
                onClick={() => !locked && item.onStart()}
                className={`flex-1 text-left p-5 rounded-2xl border transition-all duration-150 ${
                  locked
                    ? 'border-vex-border-soft bg-vex-panel-2/60 opacity-[0.62] cursor-not-allowed'
                    : current
                      ? 'border-vex-orange/40 shadow-vex-card-active hover:-translate-y-0.5'
                      : 'border-vex-border-soft bg-vex-panel shadow-vex-card hover:border-vex-muted-4 hover:-translate-y-0.5'
                }`}
                style={current ? { background: 'linear-gradient(135deg, #171b22, #13171e)' } : undefined}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-[50px] h-[50px] rounded-[14px] border flex items-center justify-center text-xl flex-shrink-0 ${
                      done
                        ? 'border-vex-green/30 bg-vex-green/10 text-vex-green'
                        : current
                          ? 'border-vex-orange/30 bg-vex-orange/10 text-vex-orange'
                          : 'border-vex-border-soft bg-vex-panel-2 text-vex-muted-3'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <KindBadge kind={item.kind} />
                      <span className="text-vex-muted text-xs font-mono">+{item.xp} XP</span>
                    </div>
                    <div className="text-vex-text font-bold text-base truncate">{item.title}</div>
                  </div>
                  {locked ? (
                    <span className="text-vex-muted-3 text-lg flex-shrink-0">🔒</span>
                  ) : (
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0 ${
                        done ? 'border border-vex-border text-vex-muted' : 'bg-vex-orange text-black'
                      }`}
                    >
                      {done ? t('path.review') : item.done > 0 ? t('path.continue') : t('path.start')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 bg-vex-bg rounded-full h-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-vex-green' : 'bg-vex-orange'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-vex-muted text-xs font-mono">{item.done}/{item.total}</span>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
