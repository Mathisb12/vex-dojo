// ─── Cascading lock helpers ───────────────────────────────────────────────────
// Lessons unlock one at a time within a module, and modules unlock one at a
// time within their tier — finish N to reach N+1. Shared by the sidebar and
// the lesson-path screen so the two views can never disagree on lock state.

import type { Lesson, Module } from './types'

export function isLessonComplete(lesson: Lesson, completedIds: Set<string>): boolean {
  return lesson.exercises.length > 0 && lesson.exercises.every(e => completedIds.has(e.id))
}

export function isModuleComplete(mod: Module, completedIds: Set<string>): boolean {
  return mod.lessons.every(l => isLessonComplete(l, completedIds))
}

export function isLessonLocked(mod: Module, lessonIdx: number, completedIds: Set<string>): boolean {
  if (lessonIdx === 0) return false
  return !isLessonComplete(mod.lessons[lessonIdx - 1], completedIds)
}

export function isModuleLocked(tierModules: Module[], modIdx: number, completedIds: Set<string>): boolean {
  if (modIdx === 0) return false
  return !isModuleComplete(tierModules[modIdx - 1], completedIds)
}
