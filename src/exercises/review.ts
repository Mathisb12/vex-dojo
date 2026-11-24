// ─── Spaced repetition ────────────────────────────────────────────────────────
//
// Finishing an exercise once teaches you almost nothing a week later, so every
// item you complete goes into a Leitner box and comes back for review. Answer it
// cleanly and it moves up a box (longer gap); miss it and it drops back to the
// bottom, which is the whole point — the items you keep forgetting are the ones
// you keep seeing.

import type { Exercise, Lesson, Module } from './types'

export const DAY = 86_400_000

/** Gap before an item is due again, per box. Index = strength. */
export const BOX_DAYS = [1, 3, 7, 16, 35, 90]
export const MAX_BOX = BOX_DAYS.length - 1

export interface ItemRecord {
  strength: number   // index into BOX_DAYS
  due: number        // epoch ms
  lastDone: number   // epoch ms
  lapses: number     // times it dropped back a box
}

export type ItemRecords = Record<string, ItemRecord>

/**
 * Move an item through the boxes. `clean` means the learner got it right
 * without a wrong attempt first — a correct answer after three misses is not
 * the same evidence as a correct answer straight away.
 */
export function gradeItem(prev: ItemRecord | undefined, clean: boolean, now = Date.now()): ItemRecord {
  const current = prev?.strength ?? -1
  const strength = clean
    ? Math.min(current + 1, MAX_BOX)
    : 0
  return {
    strength,
    due: now + BOX_DAYS[strength] * DAY,
    lastDone: now,
    lapses: (prev?.lapses ?? 0) + (!clean && prev ? 1 : 0),
  }
}

/** Ids whose review date has arrived, weakest (and longest overdue) first. */
export function dueIds(records: ItemRecords, now = Date.now()): string[] {
  return Object.entries(records)
    .filter(([, r]) => r.due <= now)
    .sort((a, b) => (a[1].strength - b[1].strength) || (a[1].due - b[1].due))
    .map(([id]) => id)
}

/** How many items in this lesson are currently due — drives the path badges. */
export function dueCountForLesson(lesson: Lesson, records: ItemRecords, now = Date.now()): number {
  return lesson.exercises.filter(e => { const r = records[e.id]; return r && r.due <= now }).length
}

/** Average box strength across a lesson's completed items, 0..1. */
export function lessonStrength(lesson: Lesson, records: ItemRecords): number {
  const seen = lesson.exercises.map(e => records[e.id]).filter(Boolean) as ItemRecord[]
  if (seen.length === 0) return 0
  return seen.reduce((s, r) => s + r.strength, 0) / (seen.length * MAX_BOX)
}

export const REVIEW_SESSION_SIZE = 12

/**
 * Builds the review session as an ordinary Lesson, so it plays through exactly
 * the same component as a normal one. Interleaves concepts rather than grouping
 * them: switching between ideas is harder, and that is what makes it stick.
 */
export function buildReviewLesson(
  modules: Module[],
  records: ItemRecords,
  title: string,
  description: string,
  now = Date.now(),
): Lesson | null {
  const due = new Set(dueIds(records, now))
  if (due.size === 0) return null

  // Group the due exercises by the lesson they came from — a lesson IS the
  // concept here, so this gives us concept buckets for free.
  const byConcept = new Map<string, Exercise[]>()
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const hits = lesson.exercises.filter(e => due.has(e.id))
      if (hits.length) byConcept.set(lesson.id, hits)
    }
  }

  // Round-robin across concepts so two questions on the same idea rarely land
  // back to back.
  const buckets = [...byConcept.values()]
  const picked: Exercise[] = []
  for (let i = 0; picked.length < REVIEW_SESSION_SIZE; i++) {
    const before = picked.length
    for (const b of buckets) {
      if (i < b.length && picked.length < REVIEW_SESSION_SIZE) picked.push(b[i])
    }
    if (picked.length === before) break   // every bucket exhausted
  }
  if (picked.length === 0) return null

  return {
    id: '__review__',
    title,
    icon: '🔁',
    description,
    learnCards: [],     // review is recall practice, not re-reading
    exercises: picked,
  }
}
