import { useState, useMemo } from 'react'
import { MCQQuestion } from './components/MCQQuestion'
import { FillBlankQuestion } from './components/FillBlankQuestion'
import { CodeQuestion } from './components/CodeQuestion'
import { LearnCardView } from './components/LearnCardView'
import { useProgress } from './hooks/useProgress'
import { getLocalizedCurriculum, getTotalXP } from './exercises/curriculum'
import type { Exercise, Lesson, LearnCard, Module } from './exercises/types'
import { LanguageProvider, useLang } from './i18n/LanguageContext'

// ─── XP Display ──────────────────────────────────────────────────────────────

function XPBar({ xp, total }: { xp: number; total: number }) {
  const { t } = useLang()
  const pct = Math.min((xp / total) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-vex-orange font-bold text-sm">⚡ {xp} XP</span>
      <div className="flex-1 bg-vex-surface border border-vex-border rounded-full h-2 min-w-[80px]">
        <div
          className="h-full bg-vex-orange rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-vex-muted text-xs">{total} {t('app.totalXp')}</span>
    </div>
  )
}

// ─── Lesson Card ─────────────────────────────────────────────────────────────

function LessonCard({
  lesson, moduleId, completedIds, onStart, locked,
}: {
  lesson: Lesson & { moduleId: string }
  moduleId: string
  completedIds: Set<string>
  onStart: () => void
  locked: boolean
}) {
  const done = lesson.exercises.filter(e => completedIds.has(e.id)).length
  const total = lesson.exercises.length
  const pct = total > 0 ? (done / total) * 100 : 0
  const complete = done === total

  return (
    <button
      disabled={locked}
      onClick={() => !locked && onStart()}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 group ${
        locked
          ? 'border-vex-border bg-vex-surface/40 opacity-50 cursor-not-allowed'
          : complete
            ? 'border-vex-green/40 bg-vex-green/5 hover:bg-vex-green/10'
            : 'border-vex-border bg-vex-surface hover:border-vex-orange/50 hover:bg-vex-surface/60'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{locked ? '🔒' : lesson.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-vex-text font-semibold text-sm truncate">{lesson.title}</div>
          <div className="text-vex-muted text-xs">{lesson.description}</div>
        </div>
        {complete && !locked && <span className="text-vex-green text-lg">✓</span>}
      </div>
      {!locked && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-vex-bg rounded-full h-1.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${complete ? 'bg-vex-green' : 'bg-vex-orange'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-vex-muted text-xs">{done}/{total}</span>
        </div>
      )}
    </button>
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
  completedIds,
  onComplete,
  onBack,
}: {
  lesson: Lesson
  completedIds: Set<string>
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

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-vex-border">
        <button onClick={onBack} className="text-vex-muted hover:text-vex-text transition-colors text-sm">
          {t('app.back')}
        </button>
        <div className="flex-1 bg-vex-surface rounded-full h-2 border border-vex-border">
          <div
            className="h-full bg-vex-orange rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-vex-muted text-xs whitespace-nowrap font-mono">{stepLabel}</span>
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
              <MCQQuestion key={step.exercise.id} exercise={step.exercise} onComplete={handleExerciseComplete} />
            ) : step.exercise.kind === 'fill' ? (
              <FillBlankQuestion key={step.exercise.id} exercise={step.exercise} onComplete={handleExerciseComplete} />
            ) : (
              <CodeQuestion key={step.exercise.id} exercise={step.exercise} onComplete={handleExerciseComplete} />
            )
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Cascading lock helpers ───────────────────────────────────────────────────

function isLessonComplete(lesson: Lesson, completedIds: Set<string>): boolean {
  return lesson.exercises.length > 0 && lesson.exercises.every(e => completedIds.has(e.id))
}

function isModuleComplete(mod: Module, completedIds: Set<string>): boolean {
  return mod.lessons.every(l => isLessonComplete(l, completedIds))
}

// Lessons unlock one at a time within a module — must finish lesson N to reach N+1.
function isLessonLocked(mod: Module, lessonIdx: number, completedIds: Set<string>): boolean {
  if (lessonIdx === 0) return false
  return !isLessonComplete(mod.lessons[lessonIdx - 1], completedIds)
}

// Modules unlock one at a time within their tier list — must finish module N to reach N+1.
function isModuleLocked(tierModules: Module[], modIdx: number, completedIds: Set<string>): boolean {
  if (modIdx === 0) return false
  return !isModuleComplete(tierModules[modIdx - 1], completedIds)
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  modules,
  completedIds,
  onSelectLesson,
  xp,
  totalXP,
  streak,
  onReset,
}: {
  modules: Module[]
  completedIds: Set<string>
  onSelectLesson: (lesson: Lesson, moduleId: string) => void
  xp: number
  totalXP: number
  streak: number
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
          <span className="text-2xl">⚡</span>
          <div className="flex-1">
            <div className="text-vex-text font-bold text-lg leading-tight">VEX Dojo</div>
            <div className="text-vex-muted text-xs">{t('app.tagline')}</div>
          </div>
          <button
            onClick={toggleLang}
            title={lang === 'en' ? 'Passer en français' : 'Switch to English'}
            className="px-2 py-1 rounded-lg border border-vex-border text-vex-muted hover:border-vex-orange/50 hover:text-vex-orange text-xs font-mono transition-colors"
          >
            {t('lang.switch')}
          </button>
        </div>
        <XPBar xp={xp} total={totalXP} />
        {streak > 0 && (
          <div className="mt-2 text-xs text-vex-muted flex items-center gap-1">
            🔥 <span className="text-vex-orange font-semibold">{streak} {t('app.streak')}</span>
          </div>
        )}
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

// ─── Welcome Screen ───────────────────────────────────────────────────────────

function TierSection({
  tier,
  modules,
  completedIds,
  onSelectLesson,
}: {
  tier: 1 | 2
  modules: Module[]
  completedIds: Set<string>
  onSelectLesson: (lesson: Lesson, moduleId: string) => void
}) {
  const { t } = useLang()
  const tier1Modules = modules.filter(m => m.tier === 1)
  const tierModules = modules.filter(m => m.tier === tier)
  const tier1Done = tier1Modules.filter(m => isModuleComplete(m, completedIds)).length
  const locked = tier === 2 && tier1Done < tier1Modules.length

  return (
    <section className="mb-10">
      {/* Tier header */}
      <div className={`flex items-center gap-4 mb-5 px-1`}>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${
          tier === 1
            ? 'border-vex-orange/40 bg-vex-orange/10 text-vex-orange'
            : locked
              ? 'border-vex-border bg-vex-surface text-vex-muted'
              : 'border-vex-purple/40 bg-vex-purple/10 text-vex-purple'
        }`}>
          {tier === 1 ? t('tier.1.full') : locked ? t('tier.2.locked') : t('tier.2.full')}
        </div>
        {tier === 2 && locked && (
          <span className="text-vex-muted text-xs">
            {t('tier.2.unlockNote')} <span className="text-vex-purple">{t('tier.1.full')}</span> {t('tier.2.youHave')} {tier1Done}/{tier1Modules.length}
          </span>
        )}
      </div>

      {locked ? (
        <div className={`rounded-2xl border border-vex-purple/20 bg-vex-purple/5 p-8 text-center`}>
          <div className="text-4xl mb-3">🔒</div>
          <div className="text-vex-text font-semibold mb-1">{t('tier.2.full')}</div>
          <div className="text-vex-muted text-sm mb-4">
            {t('tier.2.complete')} {tier1Modules.length - tier1Done} {t('tier.2.remaining')}
          </div>
          <div className="max-w-xs mx-auto bg-vex-surface rounded-full h-2 border border-vex-border">
            <div
              className="h-full bg-vex-purple rounded-full transition-all"
              style={{ width: `${Math.min((tier1Done / Math.max(tier1Modules.length, 1)) * 100, 100)}%` }}
            />
          </div>
          <div className="text-vex-muted text-xs mt-2">{tier1Done} / {tier1Modules.length}</div>
          <div className="mt-5 text-vex-muted text-xs">
            {t('tier.2.preview')}
          </div>
        </div>
      ) : (
        tierModules.map((mod, modIdxInTier) => {
          const moduleLocked = isModuleLocked(tierModules, modIdxInTier, completedIds)
          return (
            <div key={mod.id} className={`mb-7 ${moduleLocked ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-xl">{moduleLocked ? '🔒' : mod.icon}</span>
                <h2 className="text-vex-text font-bold text-lg">{mod.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mod.lessons.map((lesson, lessonIdx) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={{ ...lesson, moduleId: mod.id }}
                    moduleId={mod.id}
                    completedIds={completedIds}
                    onStart={() => onSelectLesson(lesson, mod.id)}
                    locked={moduleLocked || isLessonLocked(mod, lessonIdx, completedIds)}
                  />
                ))}
              </div>
            </div>
          )
        })
      )}
    </section>
  )
}

function WelcomeScreen({
  modules,
  completedIds,
  onSelectLesson,
}: {
  modules: Module[]
  completedIds: Set<string>
  onSelectLesson: (lesson: Lesson, moduleId: string) => void
}) {
  const { t } = useLang()
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-bold text-vex-text mb-2">{t('app.welcomeTitle')}</h1>
          <p className="text-vex-muted text-base">
            {t('app.welcomeSubtitle')}
          </p>
        </div>

        <TierSection tier={1} modules={modules} completedIds={completedIds} onSelectLesson={onSelectLesson} />
        <TierSection tier={2} modules={modules} completedIds={completedIds} onSelectLesson={onSelectLesson} />
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

function AppInner() {
  const { state, completeExercise, resetProgress } = useProgress()
  const { lang, t } = useLang()
  const [activeLesson, setActiveLesson] = useState<{ lesson: Lesson; moduleId: string } | null>(null)
  const totalXP = useMemo(() => getTotalXP(), [])
  const curriculum = useMemo(() => getLocalizedCurriculum(lang), [lang])

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
    <div className="flex h-screen overflow-hidden bg-vex-bg text-vex-text">
      <Sidebar
        modules={curriculum}
        completedIds={state.completedExercises}
        onSelectLesson={handleSelectLesson}
        xp={state.xp}
        totalXP={totalXP}
        streak={state.streak}
        onReset={handleReset}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        {activeLessonLocalized ? (
          <LessonPlayer
            lesson={activeLessonLocalized.lesson}
            completedIds={state.completedExercises}
            onComplete={handleCompleteExercise}
            onBack={() => setActiveLesson(null)}
          />
        ) : (
          <WelcomeScreen
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
