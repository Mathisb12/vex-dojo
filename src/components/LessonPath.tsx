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
// grid with a single connected vertical path (see LessonTimeline).
export function LessonPath({
  modules,
  completedIds,
  onSelectLesson,
}: {
  modules: Module[]
  completedIds: Set<string>
  onSelectLesson: (lesson: Lesson, moduleId: string) => void
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
      result.push({ type: 'chapter-divider', key: `tier-${tier}`, tierKey: tier === 1 ? 'tier.1' : 'tier.2' })
      tierModules.forEach((mod, modIdxInTier) => {
        const moduleLocked = isModuleLocked(tierModules, modIdxInTier, completedIds)
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
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <div className="text-vex-orange text-xs font-mono font-semibold uppercase tracking-widest mb-2">
              {t('sidebar.programLabel')} · {chapterCount} {t('path.chapters')}
            </div>
            <h1 className="text-3xl font-bold text-vex-text mb-2">{t('path.title')}</h1>
            <p className="text-vex-muted text-base max-w-md">{t('path.subtitle')}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-vex-text">{donePct}%</div>
            <div className="text-vex-muted text-xs">{t('path.completed')}</div>
          </div>
        </div>

        <LessonTimeline items={items} />
      </div>
    </div>
  )
}
