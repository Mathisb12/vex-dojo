import { useMemo } from 'react'
import { useLang } from '../i18n/LanguageContext'
import type { Lesson, Module } from '../exercises/types'
import { getAllExercises } from '../exercises/curriculum'
import { isLessonComplete, isModuleLocked, isLessonLocked } from '../exercises/locks'
import { LessonTimeline, type TimelineItem } from './LessonTimeline'
import type { StepKind } from './KindBadge'

// Badge reflects what the lesson is mostly testing, not whether it opens with
// a theory card — nearly every lesson has at least one, so that would make
// every badge read "Lecture" and hide the actual lesson type.
function dominantKind(lesson: Lesson): StepKind {
  return (lesson.exercises[0]?.kind ?? 'code') as StepKind
}

// Home-screen main panel — replaces the old WelcomeScreen/TierSection/LessonCard
// grid with a single connected vertical path (see LessonTimeline). Two divider
// levels (tier, then module) keep module boundaries visible in the timeline,
// matching the grouping the sidebar already shows.
export function LessonPath({
  modules,
  completedIds,
  onSelectLesson,
  onOpenPlayground,
}: {
  modules: Module[]
  completedIds: Set<string>
  onSelectLesson: (lesson: Lesson, moduleId: string) => void
  onOpenPlayground: () => void
}) {
  const { t } = useLang()

  const donePct = useMemo(() => {
    const all = getAllExercises()
    if (all.length === 0) return 0
    return Math.round((all.filter(e => completedIds.has(e.id)).length / all.length) * 100)
  }, [completedIds])

  const chapterCount = useMemo(() => new Set(modules.map(m => m.tier)).size, [modules])

  const items = useMemo(() => {
    const result: TimelineItem[] = []
    for (const tier of [1, 2] as const) {
      const tierModules = modules.filter(m => m.tier === tier)
      if (tierModules.length === 0) continue
      result.push({ type: 'tier-divider', key: `tier-${tier}`, tierKey: tier === 1 ? 'tier.1' : 'tier.2' })
      tierModules.forEach((mod, modIdxInTier) => {
        const moduleLocked = isModuleLocked(tierModules, modIdxInTier, completedIds)
        result.push({
          type: 'module-divider',
          key: `mod-${mod.id}`,
          icon: mod.icon,
          title: mod.title,
          accent: tier === 1 ? 'orange' : 'purple',
        })
        mod.lessons.forEach((lesson, lessonIdx) => {
          const lessonLocked = moduleLocked || isLessonLocked(mod, lessonIdx, completedIds)
          const done = lesson.exercises.filter(e => completedIds.has(e.id)).length
          const total = lesson.exercises.length
          const complete = isLessonComplete(lesson, completedIds)
          result.push({
            type: 'lesson',
            key: lesson.id,
            icon: lesson.icon,
            title: lesson.title,
            kind: dominantKind(lesson),
            xp: lesson.exercises.reduce((s, e) => s + e.xp, 0),
            done,
            total,
            state: lessonLocked ? 'locked' : complete ? 'done' : 'current',
            onStart: () => onSelectLesson(lesson, mod.id),
          })
        })
      })
    }
    return result
  }, [modules, completedIds, onSelectLesson])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-10 sm:py-[46px]">
      <div className="max-w-[780px] mx-auto">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="text-vex-orange text-xs font-mono font-semibold uppercase tracking-widest mb-2">
              {t('sidebar.programLabel')} · {chapterCount} {t('path.chapters')}
            </div>
            <h1 className="text-3xl font-extrabold text-vex-text mb-2 tracking-tight">{t('path.title')}</h1>
            <p className="text-vex-muted text-base max-w-md">{t('path.subtitle')}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-vex-text font-mono">{donePct}%</div>
            <div className="text-vex-muted text-xs">{t('path.completed')}</div>
          </div>
        </div>

        {/* The path is locked step by step on purpose — this is the one door
            that is always open, so "what can VEX actually do?" has an answer
            before you have finished lesson one. */}
        <button
          onClick={onOpenPlayground}
          className="w-full text-left mb-8 group rounded-2xl border border-vex-blue/30 bg-gradient-to-br from-vex-blue/10 to-vex-purple/5 p-4 sm:p-5 hover:border-vex-blue/60 transition-colors"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-vex-blue/15 border border-vex-blue/30 flex items-center justify-center flex-shrink-0 text-lg">
              🧪
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-vex-blue text-[11px] font-mono font-semibold uppercase tracking-widest mb-1">
                {t('playground.cta.eyebrow')}
              </div>
              <h2 className="text-vex-text font-bold text-base sm:text-lg leading-tight mb-1">
                {t('playground.cta.title')}
              </h2>
              <p className="text-vex-muted text-sm leading-relaxed text-pretty">{t('playground.cta.body')}</p>
            </div>
            <span className="text-vex-blue text-sm font-semibold flex-shrink-0 self-center hidden sm:block group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
        </button>

        <LessonTimeline items={items} />
      </div>
    </div>
  )
}
