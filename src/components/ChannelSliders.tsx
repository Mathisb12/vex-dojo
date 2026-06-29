import type { ChParamSpec } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'

interface Props {
  params: ChParamSpec[]
  values: Record<string, number>
  onChange: (name: string, value: number) => void
}

// Live sliders for ch()/chf() spare parameters — simulates dragging a real
// Houdini node parameter while the wrangle runs, instead of a hardcoded value.
export function ChannelSliders({ params, values, onChange }: Props) {
  const { t } = useLang()
  if (params.length === 0) return null

  return (
    <div className="flex flex-col gap-3 bg-vex-surface border border-vex-border rounded-xl p-3">
      <span className="text-xs font-mono uppercase tracking-widest text-vex-muted">{t('chparams.title')}</span>
      {params.map(p => {
        const value = values[p.name] ?? p.default
        return (
          <div key={p.name} className="flex items-center gap-3">
            <div className="w-28 flex-shrink-0">
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
            <span className="text-xs font-mono text-vex-orange w-12 text-right flex-shrink-0">{value.toFixed(2)}</span>
          </div>
        )
      })}
    </div>
  )
}
