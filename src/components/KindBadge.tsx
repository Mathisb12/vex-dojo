import { useLang } from '../i18n/LanguageContext'
import type { UIKey } from '../i18n/ui'

export type StepKind = 'learn' | 'mcq' | 'fill' | 'code'

interface KindStyle {
  accent: 'green' | 'blue' | 'purple' | 'orange'
  labelKey: UIKey
}

// Single source of truth for kind -> color/label, shared by the lesson-path
// cards and ExerciseHeader so the two can never drift out of sync.
export const KIND_BADGE_STYLE: Record<StepKind, KindStyle> = {
  learn: { accent: 'green', labelKey: 'badge.learn' },
  mcq: { accent: 'blue', labelKey: 'badge.mcq' },
  fill: { accent: 'purple', labelKey: 'badge.fill' },
  code: { accent: 'orange', labelKey: 'badge.code' },
}

const ACCENT_CLASSES: Record<KindStyle['accent'], string> = {
  green: 'border-vex-green/30 bg-vex-green/10 text-vex-green',
  blue: 'border-vex-blue/30 bg-vex-blue/10 text-vex-blue',
  purple: 'border-vex-purple/30 bg-vex-purple/10 text-vex-purple',
  orange: 'border-vex-orange/30 bg-vex-orange/10 text-vex-orange',
}

export function KindBadge({ kind }: { kind: StepKind }) {
  const { t } = useLang()
  const style = KIND_BADGE_STYLE[kind]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${ACCENT_CLASSES[style.accent]}`}>
      {t(style.labelKey)}
    </span>
  )
}
