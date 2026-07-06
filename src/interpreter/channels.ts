// ─── Spare-parameter detection ────────────────────────────────────────────────
// Scans VEX source for ch("name") / chf("name") / chi("name") calls and returns
// slider specs for every channel the exercise didn't already declare — the
// sandbox equivalent of Houdini's "Create spare parameters for each ch()"
// button, except automatic: type chf("level") and a "level" slider appears.

import type { ChParamSpec } from '../exercises/types'

// ch( / chf( / chi( with a string-literal name. chramp() is intentionally NOT
// matched (its 'r' fails the [fi]? group) — a ramp needs a curve editor, not a
// slider. Dynamic names (variables) can't be detected statically and are rare
// in wrangles anyway.
const CH_CALL = /\bch([fi]?)\s*\(\s*["']([A-Za-z_][A-Za-z0-9_]*)["']\s*\)/g

export function detectChannelParams(code: string, declared: readonly ChParamSpec[] = []): ChParamSpec[] {
  const seen = new Set(declared.map(p => p.name))
  const out: ChParamSpec[] = []
  let m: RegExpExecArray | null
  CH_CALL.lastIndex = 0
  while ((m = CH_CALL.exec(code)) !== null) {
    const [, typeChar, name] = m
    if (seen.has(name)) continue
    seen.add(name)
    // Same defaults as a fresh Houdini spare param: starts at 0, so the player
    // drags it up and watches the effect appear — that IS the lesson.
    out.push(typeChar === 'i'
      ? { name, label: name, min: 0, max: 10, default: 0, step: 1 }
      : { name, label: name, min: 0, max: 1, default: 0, step: 0.01 })
  }
  return out
}

// Does the code read the playback clock? (Drives the Time scrub/play control.)
export function referencesTime(code: string): boolean {
  return /@(Time|Frame)\b/.test(code)
}
