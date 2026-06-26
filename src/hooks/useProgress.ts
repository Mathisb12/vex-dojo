import { useState, useCallback, useEffect } from 'react'

interface ProgressState {
  completedExercises: Set<string>
  xp: number
  streak: number
  lastActiveDate: string
}

const STORAGE_KEY = 'vex-dojo-progress'

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completedExercises: new Set(), xp: 0, streak: 0, lastActiveDate: '' }
    const parsed = JSON.parse(raw)
    return {
      completedExercises: new Set(parsed.completedExercises ?? []),
      xp: parsed.xp ?? 0,
      streak: parsed.streak ?? 0,
      lastActiveDate: parsed.lastActiveDate ?? '',
    }
  } catch {
    return { completedExercises: new Set(), xp: 0, streak: 0, lastActiveDate: '' }
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedExercises: Array.from(state.completedExercises),
      xp: state.xp,
      streak: state.streak,
      lastActiveDate: state.lastActiveDate,
    }))
  } catch { /* ignore */ }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(loadProgress)

  const completeExercise = useCallback((exerciseId: string, xpGain: number) => {
    setState(prev => {
      if (prev.completedExercises.has(exerciseId)) return prev
      const next: ProgressState = {
        completedExercises: new Set([...prev.completedExercises, exerciseId]),
        xp: prev.xp + xpGain,
        streak: prev.streak,
        lastActiveDate: new Date().toDateString(),
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
    const empty: ProgressState = { completedExercises: new Set(), xp: 0, streak: 0, lastActiveDate: '' }
    saveProgress(empty)
    setState(empty)
  }, [])

  const isCompleted = useCallback((id: string) => state.completedExercises.has(id), [state])

  // Persist on mount if no data yet
  useEffect(() => { saveProgress(state) }, [])

  return { state, completeExercise, resetProgress, isCompleted }
}
