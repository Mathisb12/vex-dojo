import { useState, useCallback, useEffect } from 'react'
import { gradeItem, type ItemRecords } from '../exercises/review'

interface ProgressState {
  completedExercises: Set<string>
  /** Spaced-repetition state per exercise — when each one is due again. */
  records: ItemRecords
  xp: number
  streak: number
  lastActiveDate: string
  /** Day the review prompt was last shown, so it asks once a day, not once a reload. */
  reviewPromptedOn: string
}

const STORAGE_KEY = 'vex-dojo-progress'

const EMPTY = (): ProgressState => ({
  completedExercises: new Set(), records: {}, xp: 0, streak: 0, lastActiveDate: '',
  reviewPromptedOn: '',
})

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY()
    const parsed = JSON.parse(raw)
    const completed: string[] = parsed.completedExercises ?? []
    // Progress used to be a plain list of finished ids with no dates. Anyone
    // mid-course keeps their work: every finished item enters box 0 and comes
    // up for review tomorrow rather than being lost or dumped on them at once.
    let records: ItemRecords = parsed.records ?? {}
    if (!parsed.records) {
      const now = Date.now()
      records = {}
      completed.forEach((id, i) => {
        records[id] = { strength: 0, due: now + (i % 5) * 86_400_000, lastDone: now, lapses: 0 }
      })
    }
    return {
      completedExercises: new Set(completed),
      records,
      xp: parsed.xp ?? 0,
      streak: parsed.streak ?? 0,
      lastActiveDate: parsed.lastActiveDate ?? '',
      reviewPromptedOn: parsed.reviewPromptedOn ?? '',
    }
  } catch {
    return EMPTY()
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedExercises: Array.from(state.completedExercises),
      records: state.records,
      xp: state.xp,
      streak: state.streak,
      lastActiveDate: state.lastActiveDate,
      reviewPromptedOn: state.reviewPromptedOn,
    }))
  } catch { /* ignore */ }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(loadProgress)

  // `clean` = answered correctly with no wrong attempt first. It decides
  // whether the item moves up a box or drops back to the bottom.
  const completeExercise = useCallback((exerciseId: string, xpGain: number, clean = true) => {
    setState(prev => {
      const firstTime = !prev.completedExercises.has(exerciseId)
      const next: ProgressState = {
        completedExercises: new Set([...prev.completedExercises, exerciseId]),
        records: { ...prev.records, [exerciseId]: gradeItem(prev.records[exerciseId], clean) },
        // Reviewing an item you already own is worth something, but not the
        // full first-time award — otherwise XP just measures time spent.
        xp: prev.xp + (firstTime ? xpGain : Math.ceil(xpGain / 3)),
        streak: prev.streak,
        lastActiveDate: new Date().toDateString(),
        reviewPromptedOn: prev.reviewPromptedOn,
      }
      // Streak logic
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      if (prev.lastActiveDate === today) {
        // already active today, no change
      } else if (prev.lastActiveDate === yesterday) {
        next.streak = prev.streak + 1
      } else {
        next.streak = 1
      }
      saveProgress(next)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    const empty = EMPTY()
    saveProgress(empty)
    setState(empty)
  }, [])

  // Answering the prompt — either way — stops it asking again today.
  const markReviewPrompted = useCallback(() => {
    setState(prev => {
      const today = new Date().toDateString()
      if (prev.reviewPromptedOn === today) return prev
      const next = { ...prev, reviewPromptedOn: today }
      saveProgress(next)
      return next
    })
  }, [])

  const isCompleted = useCallback((id: string) => state.completedExercises.has(id), [state])

  // Persist on mount if no data yet
  useEffect(() => { saveProgress(state) }, [])

  return { state, completeExercise, resetProgress, isCompleted, markReviewPrompted }
}
