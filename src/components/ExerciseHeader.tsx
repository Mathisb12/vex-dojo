import type { ReactNode } from 'react'
import { useLang } from '../i18n/LanguageContext'
import type { UIKey } from '../i18n/ui'
import { KIND_BADGE_STYLE, type StepKind } from './KindBadge'

type ExerciseHeaderKind = Exclude<StepKind, 'learn'>

const EYEBROW_KEY: Record<ExerciseHeaderKind, UIKey> = {
  mcq: 'mcq.question',
  fill: 'exercise.instruction',
  code: 'exercise.instruction',
}

const ACCENT_CLASSES = {
  green: { swatch: 'border-vex-green/30 bg-vex-green/10 text-vex-green', text: 'text-vex-green' },
  blue: { swatch: 'border-vex-blue/30 bg-vex-blue/10 text-vex-blue', text: 'text-vex-blue' },
  purple: { swatch: 'border-vex-purple/30 bg-vex-purple/10 text-vex-purple', text: 'text-vex-purple' },
  orange: { swatch: 'border-vex-orange/30 bg-vex-orange/10 text-vex-orange', text: 'text-vex-orange' },
} satisfies Record<string, { swatch: string; text: string }>

interface Props {
  kind: ExerciseHeaderKind
  icon: string
  children: ReactNode
}

// Shared instruction card used by MCQ/fill/code exercises — replaces the
// near-identical "eyebrow + prompt" block that used to be copy-pasted three times.
export function ExerciseHeader({ kind, icon, children }: Props) {
  const { t } = useLang()
  const { accent } = KIND_BADGE_STYLE[kind]
  const { swatch, text } = ACCENT_CLASSES[accent]
  return (
    <div className="bg-vex-surface border border-vex-border rounded-2xl p-5 flex items-start gap-3">
      <span className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base flex-shrink-0 ${swatch}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${text}`}>{t(EYEBROW_KEY[kind])}</div>
        <p className="text-vex-text text-base font-medium">{children}</p>
      </div>
    </div>
  )
}
