import { useState, useMemo } from 'react'
import { MCQQuestion } from './components/MCQQuestion'
import { FillBlankQuestion } from './components/FillBlankQuestion'
import { CodeQuestion } from './components/CodeQuestion'
import { LearnCardView } from './components/LearnCardView'
import { LessonPath } from './components/LessonPath'
import { KIND_BADGE_STYLE } from './components/KindBadge'
import { GrainOverlay } from './components/GrainOverlay'
import { useProgress } from './hooks/useProgress'
import { getLocalizedCurriculum, getTotalXP } from './exercises/curriculum'
import type { Exercise, Lesson, LearnCard, Module } from './exercises/types'
import { isModuleComplete, isModuleLocked, isLessonLocked } from './exercises/locks'
import { LanguageProvider, useLang } from './i18n/LanguageContext'

// ─── XP Display ──────────────────────────────────────────────────────────────

function XPBar({ xp, total }: { xp: number; total: number }) {
  const { t } = useLang()
  const pct = Math.min((xp / total) * 100, 100)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-vex-orange font-bold">⚡ {xp} XP</span>
        <span className="text-vex-muted">{total} {t('app.totalXp')}</span>
      </div>
      <div className="bg-vex-surface border border-vex-border rounded-full h-2">
        <div
          className="h-full bg-vex-orange rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Lesson Player ────────────────────────────────────────────────────────────

type LessonStep =
  | { kind: 'learn'; card: LearnCard; learnIdx: number }
  | { kind: 'exercise'; exercise: Exercise; exIdx: number }

function buildSteps(lesson: Lesson): LessonStep[] {
  const steps: LessonStep[] = []
  // All learn cards first (always shown, they're quick to skip)
  ;(lesson.learnCards ?? []).forEach((card, i) => {
    steps.push({ kind: 'learn', card, learnIdx: i })
  })
  // Then exercises — start at first uncompleted
  lesson.exercises.forEach((ex, i) => {
    steps.push({ kind: 'exercise', exercise: ex, exIdx: i })
  })
  return steps
}

function LessonPlayer({
  lesson,
  moduleTitle,
  completedIds,
  streak,
  onComplete,
  onBack,
}: {
  lesson: Lesson
  moduleTitle: string
  completedIds: Set<string>
  streak: number
  onComplete: (exerciseId: string, xp: number) => void
  onBack: () => void
}) {
  const { t } = useLang()
  const allSteps = useMemo(() => buildSteps(lesson), [lesson.id])

  // Start at first uncompleted exercise (skip already-done learn cards)
  const firstExerciseStep = allSteps.findIndex(
    s => s.kind === 'exercise' && !completedIds.has(s.exercise.id)
  )

  const [stepIdx, setStepIdx] = useState(
    completedIds.has(lesson.exercises[0]?.id ?? '') ? Math.max(firstExerciseStep, 0) : 0
  )
  const [celebrating, setCelebrating] = useState(false)

  const step = allSteps[stepIdx]
  const totalLearn = lesson.learnCards?.length ?? 0
  const totalEx = lesson.exercises.length

  const progress = stepIdx / Math.max(allSteps.length - 1, 1) * 100

  const advance = () => {
    if (stepIdx < allSteps.length - 1) {
      setStepIdx(i => i + 1)
    } else {
      setCelebrating(true)
      setTimeout(() => { setCelebrating(false); onBack() }, 1500)
    }
  }

  const handleLearnContinue = () => advance()

  const handleExerciseComplete = (xp: number) => {
    if (step?.kind !== 'exercise') return
    onComplete(step.exercise.id, xp)
    setCelebrating(true)
    setTimeout(() => {
      setCelebrating(false)
      advance()
    }, 800)
  }

  const stepLabel = step?.kind === 'learn'
    ? `${t('code.theory')} ${step.learnIdx + 1}/${totalLearn}`
    : step?.kind === 'exercise'
      ? `${t('code.exercise')} ${step.exIdx + 1}/${totalEx}`
      : ''

  const breadcrumbKind = step?.kind === 'learn'
    ? t(KIND_BADGE_STYLE.learn.labelKey)
    : step?.kind === 'exercise'
      ? t(KIND_BADGE_STYLE[step.exercise.kind].labelKey)
      : ''

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-vex-border">
        <button onClick={onBack} className="text-vex-muted hover:text-vex-text transition-colors text-sm flex-shrink-0">
          {t('app.back')}
        </button>
        <span className="w-8 h-8 rounded-lg border border-vex-orange/30 bg-vex-orange/10 text-vex-orange flex items-center justify-center text-sm flex-shrink-0">
          {lesson.icon}
        </span>
        <div className="min-w-0">
          <div className="text-vex-text font-semibold text-sm truncate">{lesson.title}</div>
          <div className="text-vex-muted text-xs truncate">{moduleTitle} · {breadcrumbKind}</div>
        </div>
        {streak > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full border border-vex-orange/30 bg-vex-orange/10 text-vex-orange text-xs font-semibold flex-shrink-0">
            🔥 {streak}
          </span>
        )}
        <div className="flex items-center gap-2 ml-auto w-44 flex-shrink-0">
          <span className="text-vex-muted text-xs font-mono whitespace-nowrap hidden md:inline">{t('lesson.progressLabel')}</span>
          <div className="flex-1 bg-vex-surface rounded-full h-2 border border-vex-border">
            <div
              className="h-full bg-vex-orange rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-vex-muted text-xs whitespace-nowrap font-mono">{stepLabel}</span>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {celebrating && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-6xl animate-pop">
              {stepIdx < allSteps.length - 1 ? '🔥' : '🎉'}
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          {step?.kind === 'learn' && (
            <LearnCardView
              key={step.card.id}
              card={step.card}
              onContinue={handleLearnContinue}
              current={step.learnIdx + 1}
              total={totalLearn}
            />
          )}
          {step?.kind === 'exercise' && (
            step.exercise.kind === 'mcq' ? (
              <MCQQuestion key={step.exercise.id} exercise={step.exercise} icon={lesson.icon} onComplete={handleExerciseComplete} />
            ) : step.exercise.kind === 'fill' ? (
              <FillBlankQuestion key={step.exercise.id} exercise={step.exercise} icon={lesson.icon} onComplete={handleExerciseComplete} />
            ) : (
              <CodeQuestion key={step.exercise.id} exercise={step.exercise} icon={lesson.icon} onComplete={handleExerciseComplete} />
            )
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  modules,
  completedIds,
  onSelectLesson,
  xp,
  totalXP,
  streak,
  level,
  onReset,
}: {
  modules: Module[]
  completedIds: Set<string>
  onSelectLesson: (lesson: Lesson, moduleId: string) => void
  xp: number
  totalXP: number
  streak: number
  level: number
  onReset: () => void
}) {
  const { t, lang, toggleLang } = useLang()
  const tier1Modules = modules.filter(m => m.tier === 1)
  const tier2Modules = modules.filter(m => m.tier === 2)
  const tier1Complete = tier1Modules.every(mod => isModuleComplete(mod, completedIds))
  const tier2Locked = !tier1Complete

  const renderModule = (mod: Module, tierModules: Module[], modIdxInTier: number) => {
    const moduleLocked = isModuleLocked(tierModules, modIdxInTier, completedIds)
    const modDone = mod.lessons.flatMap(l => l.exercises).filter(e => completedIds.has(e.id)).length
    const modTotal = mod.lessons.flatMap(l => l.exercises).length

    return (
      <div key={mod.id} className={`mb-4 ${moduleLocked ? 'opacity-50 pointer-events-none select-none' : ''}`}>
        <div className="flex items-center gap-2 px-4 py-1.5">
          <span>{moduleLocked ? '🔒' : mod.icon}</span>
          <span className="text-vex-text font-semibold text-sm">{mod.title}</span>
          <span className="ml-auto text-vex-muted text-xs">{modDone}/{modTotal}</span>
        </div>
        <div className="flex flex-col gap-1.5 px-3">
          {mod.lessons.map((lesson, lessonIdx) => {
            const done = lesson.exercises.filter(e => completedIds.has(e.id)).length
            const total = lesson.exercises.length
            const complete = done === total
            const lessonLocked = moduleLocked || isLessonLocked(mod, lessonIdx, completedIds)
            return (
              <button
                key={lesson.id}
                disabled={lessonLocked}
                onClick={() => !lessonLocked && onSelectLesson(lesson, mod.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-150 text-sm ${
                  lessonLocked
                    ? 'border-vex-border bg-vex-surface/40 text-vex-muted cursor-not-allowed'
                    : complete
                      ? 'border-vex-green/30 bg-vex-green/5 text-vex-green'
                      : mod.tier === 2
                        ? 'border-vex-purple/30 bg-vex-surface hover:border-vex-purple/60 hover:bg-vex-surface/80 text-vex-text'
                        : 'border-vex-border bg-vex-surface hover:border-vex-orange/40 hover:bg-vex-surface/80 text-vex-text'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lessonLocked ? '🔒' : lesson.icon}</span>
                  <span className="flex-1 truncate">{lesson.title}</span>
                  <span className={`text-xs ${complete ? 'text-vex-green' : 'text-vex-muted'}`}>
                    {lessonLocked ? '' : complete ? '✓' : `${done}/${total}`}
                  </span>
                </div>
                {!lessonLocked && (
                  <div className="mt-1.5 h-1 bg-vex-bg rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${complete ? 'bg-vex-green' : 'bg-vex-orange'}`}
                      style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <aside className="w-72 border-r border-vex-border flex flex-col bg-vex-bg overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-vex-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-9 h-9 rounded-xl bg-vex-orange flex items-center justify-center text-black font-bold text-lg flex-shrink-0">@</span>
          <div className="flex-1 min-w-0">
            <div className="text-vex-text font-bold text-lg leading-tight">VEX Dojo</div>
            <div className="text-vex-muted text-xs">{t('app.tagline')}</div>
          </div>
          <div className="flex items-center rounded-lg border border-vex-border bg-vex-bg p-0.5 text-xs font-mono flex-shrink-0">
            <button
              onClick={() => lang !== 'fr' && toggleLang()}
              title="Passer en français"
              className={`px-2 py-0.5 rounded-md transition-colors ${lang === 'fr' ? 'bg-vex-orange text-black' : 'text-vex-muted hover:text-vex-orange'}`}
            >
              FR
            </button>
            <button
              onClick={() => lang !== 'en' && toggleLang()}
              title="Switch to English"
              className={`px-2 py-0.5 rounded-md transition-colors ${lang === 'en' ? 'bg-vex-orange text-black' : 'text-vex-muted hover:text-vex-orange'}`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-vex-orange/30 bg-vex-orange/10 text-vex-orange text-xs font-semibold">
              🔥 {streak}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-vex-purple/30 bg-vex-purple/10 text-vex-purple text-xs font-semibold">
            <span className="text-vex-muted font-normal">{t('app.level')}</span> {level}
          </span>
        </div>

        <XPBar xp={xp} total={totalXP} />
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto py-3">
        {/* ── Tier 1 ── */}
        <div className="flex items-center gap-2 px-4 py-1.5 mb-1">
          <div className="h-px flex-1 bg-vex-orange/30" />
          <span className="text-vex-orange text-xs font-mono font-semibold uppercase tracking-widest">{t('tier.1')}</span>
          <div className="h-px flex-1 bg-vex-orange/30" />
        </div>
        {tier1Modules.map((mod, i) => renderModule(mod, tier1Modules, i))}

        {/* ── Tier 2 divider ── */}
        <div className="flex items-center gap-2 px-4 py-1.5 mt-3 mb-1">
          <div className="h-px flex-1 bg-vex-purple/30" />
          <span className={`text-xs font-mono font-semibold uppercase tracking-widest ${tier2Locked ? 'text-vex-muted' : 'text-vex-purple'}`}>
            {t('tier.2')}
          </span>
          <div className="h-px flex-1 bg-vex-purple/30" />
        </div>

        {tier2Locked ? (
          <div className="mx-3 p-3 rounded-xl border border-vex-purple/20 bg-vex-purple/5 text-center">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-vex-muted text-xs">
              {t('tier.2.unlockAt')} <span className="text-vex-purple font-semibold">{t('tier.1.full')}</span> {t('tier.2.toUnlock')}
              {' '}({tier1Modules.filter(m => isModuleComplete(m, completedIds)).length}/{tier1Modules.length})
            </div>
            <div className="mt-2 bg-vex-surface rounded-full h-1.5">
              <div
                className="h-full bg-vex-purple rounded-full transition-all duration-500"
                style={{ width: `${Math.min((tier1Modules.filter(m => isModuleComplete(m, completedIds)).length / Math.max(tier1Modules.length, 1)) * 100, 100)}%` }}
              />
            </div>
            <div className="text-vex-muted text-xs mt-1">
              {tier1Modules.filter(m => isModuleComplete(m, completedIds)).length} / {tier1Modules.length}
            </div>
          </div>
        ) : (
          tier2Modules.map((mod, i) => renderModule(mod, tier2Modules, i))
        )}
      </div>

      {/* Reset progress */}
      <div className="px-3 py-3 border-t border-vex-border">
        <button
          onClick={onReset}
          className="w-full px-3 py-2 rounded-lg border border-vex-border text-vex-muted hover:border-vex-red/50 hover:text-vex-red text-xs transition-colors"
        >
          {t('app.resetProgress')}
        </button>
      </div>
    </aside>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

function AppInner() {
  const { state, completeExercise, resetProgress } = useProgress()
  const { lang, t } = useLang()
  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson; moduleId: string } | null>(null)
  const totalXP = useMemo(() => getTotalXP(), [])
  const curriculum = useMemo(() => getLocalizedCurriculum(lang), [lang])
  // Cosmetic only — derived from XP, never persisted, purely for the sidebar's level pill.
  const level = useMemo(() => 1 + Math.floor(state.xp / 200), [state.xp])

  // Keep the active lesson in sync with the current language
  const activeLessonLocalized = useMemo(() => {
    if (!activeLesson) return null
    for (const mod of curriculum) {
      if (mod.id !== activeLesson.moduleId) continue
      const lesson = mod.lessons.find(l => l.id === activeLesson.lesson.id)
      if (lesson) return { lesson, moduleId: mod.id }
    }
    return activeLesson
  }, [activeLesson, curriculum])

  const activeModuleTitle = useMemo(() => {
    if (!activeLessonLocalized) return ''
    return curriculum.find(m => m.id === activeLessonLocalized.moduleId)?.title ?? ''
  }, [activeLessonLocalized, curriculum])

  const handleSelectLesson = (lesson: Lesson, moduleId: string) => {
    setActiveLesson({ lesson, moduleId })
  }

  const handleCompleteExercise = (exerciseId: string, xp: number) => {
    completeExercise(exerciseId, xp)
  }

  const handleReset = () => {
    if (window.confirm(t('app.resetConfirm'))) {
      resetProgress()
      setActiveLesson(null)
    }
  }

  return (
    <div
      className="flex h-screen overflow-hidden text-vex-text"
      style={{ background: 'radial-gradient(130% 100% at 82% -15%, #141b27 0%, #0d1117 52%)' }}
    >
      <GrainOverlay />
      <Sidebar
        modules={curriculum}
        completedIds={state.completedExercises}
        onSelectLesson={handleSelectLesson}
        xp={state.xp}
        totalXP={totalXP}
        streak={state.streak}
        level={level}
        onReset={handleReset}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        {activeLessonLocalized ? (
          <LessonPlayer
            lesson={activeLessonLocalized.lesson}
            moduleTitle={activeModuleTitle}
            completedIds={state.completedExercises}
            streak={state.streak}
            onComplete={handleCompleteExercise}
            onBack={() => setActiveLesson(null)}
          />
        ) : (
          <LessonPath
            modules={curriculum}
            completedIds={state.completedExercises}
            onSelectLesson={handleSelectLesson}
          />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  )
}
