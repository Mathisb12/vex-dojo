import type { ChParamSpec } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'

export interface TimeControl {
  value: number
  playing: boolean
  onScrub: (v: number) => void
  onTogglePlay: () => void
}

interface Props {
  params: ChParamSpec[]
  values: Record<string, number>
  onChange: (name: string, value: number) => void
  // Shown when some sliders were auto-created from ch()/chf() calls the player
  // typed — bridges to how real Houdini does it (a button, not magic).
  hint?: string
  // Scrub + play control, shown when the code reads @Time/@Frame.
  time?: TimeControl | null
}

// Live "spare parameters" for the wrangle: declared per-exercise sliders,
// sliders auto-spawned from ch()/chf() calls in the player's code, and the
// playback clock — dragging any of them re-runs the VEX immediately.
export function ChannelSliders({ params, values, onChange, hint, time }: Props) {
  const { t } = useLang()
  if (params.length === 0 && !time) return null

  const rowLabel = 'w-28 flex-shrink-0'
  const valueCls = 'text-xs font-mono text-vex-orange w-12 text-right flex-shrink-0'

  return (
    <div className="flex flex-col gap-3 bg-vex-surface border border-vex-border rounded-xl p-3">
      <span className="text-xs font-mono uppercase tracking-widest text-vex-muted">{t('chparams.title')}</span>

      {time && (
        <div className="flex items-center gap-3">
          <div className={`${rowLabel} flex items-center gap-2`}>
            <button
              onClick={time.onTogglePlay}
              title={time.playing ? 'Pause' : 'Play'}
              className={`tap-target w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                time.playing
                  ? 'border-vex-orange bg-vex-orange/15 text-vex-orange'
                  : 'border-vex-border text-vex-muted hover:border-vex-orange/50 hover:text-vex-orange'
              }`}
            >
              {time.playing ? '❚❚' : '▶'}
            </button>
            <div>
              <div className="text-xs text-vex-text font-medium leading-tight">@Time</div>
              <div className="text-[10px] font-mono text-vex-muted">{t('chparams.seconds')}</div>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.05}
            value={time.value}
            onChange={e => time.onScrub(parseFloat(e.target.value))}
            className="flex-1 accent-vex-orange"
          />
          <span className={valueCls}>{time.value.toFixed(2)}</span>
        </div>
      )}

      {params.map(p => {
        const value = values[p.name] ?? p.default
        return (
          <div key={p.name} className="flex items-center gap-3">
            <div className={rowLabel}>
              <div className="text-xs text-vex-text font-medium leading-tight">{p.label}</div>
              <div className="text-[10px] font-mono text-vex-muted">&quot;{p.name}&quot;</div>
            </div>
            <input
              type="range"
              min={p.min}
              max={p.max}
              step={p.step ?? (p.max - p.min) / 100}
              value={value}
              onChange={e => onChange(p.name, parseFloat(e.target.value))}
              className="flex-1 accent-vex-orange"
            />
            <span className={valueCls}>{value.toFixed(2)}</span>
          </div>
        )
      })}

      {hint && <div className="text-[10px] text-vex-muted-3 leading-snug">{hint}</div>}
    </div>
  )
}
