// ─── Exercise type definitions ────────────────────────────────────────────────

export type PointShape = 'sphere' | 'grid' | 'random'

// A single ch()/chf() spare-parameter slider rendered next to the 3D preview —
// simulates dragging a real Houdini node parameter while the wrangle runs live.
export interface ChParamSpec {
  name: string   // channel name read via ch("name") / chf("name") in the code
  label: string
  min: number
  max: number
  default: number
  step?: number
}

// A fixed (non-editable) ramp sampled via chramp("name", pos) — Houdini's real
// ramp parameter is a draggable curve editor, which this sandbox doesn't
// reproduce; the sampling behavior itself is real and verified against docs.
export interface ChRampSpec {
  name: string
  stops: { pos: number; value: number }[]
}

export interface MCQChoice {
  text: string
  correct: boolean
  explanation?: string
}

export interface FillBlankLine {
  prefix: string   // code before the blank
  suffix: string   // code after the blank
  answer: string   // exact answer expected
  hint?: string
}

export interface CodeCheck {
  description: string
  // Runs against the output points to verify the exercise. `code` is the player's
  // raw source — use it to enforce that a specific construct (if, for...) was
  // actually used, instead of only checking the resulting points/colors.
  // `chValues` is the live slider state at the moment Run was clicked — needed
  // to verify a result actually reflects the current parameter value, not just
  // a coincidentally-similar hardcoded one (e.g. grayscale alone doesn't prove
  // the color came from chf("brightness") rather than a literal {1,1,1}).
  // The index signature exposes custom attributes the player created with
  // f@name/@name — a float lands as a plain number on the point object.
  test: (points: { P: {x:number;y:number;z:number}; Cd: {x:number;y:number;z:number}; N: {x:number;y:number;z:number}; ptnum: number; numpt: number; [attr: string]: unknown }[], output: string, code: string, chValues?: Record<string, number>) => boolean
}

export type Exercise =
  | MCQExercise
  | FillBlankExercise
  | CodeExercise

export interface LearnCard {
  kind: 'learn'
  id: string
  title: string
  body: string          // plain text with **bold** and `code` markers
  codeExample?: string  // syntax-highlighted code block
  visual?: 'vector' | 'attributes' | 'loop' | 'wrangle-params' | 'ramp'  // optional diagram type
  /** Where this actually gets used in a real VFX shot — the "so what" callout. */
  inProduction?: string
  keyPoints?: string[]
}

export interface MCQExercise {
  kind: 'mcq'
  id: string
  title: string
  explanation: string
  choices: MCQChoice[]
  xp: number
}

// A blank accepts either an exact string, one of several alternatives,
// or any number within a numeric range — whichever matches the hint given to the player.
export type BlankAnswer =
  | string
  | string[]
  // A numeric range, plus any named constants that evaluate into it —
  // PI is a better answer than typing 3.14159, so it has to be accepted.
  | { min: number; max: number; also?: string[] }

// A whole different way of answering that is also valid VEX, but means
// something subtly different — accepted, with a note saying what changed.
// Use this for a real alternative approach (`i@count` instead of `int count`);
// for equally-correct spellings of the SAME thing (`0.5` / `.5`), put the
// variants in the blank's own BlankAnswer array instead, which passes silently.
export interface AltAnswerSet {
  answers: BlankAnswer[]   // one entry per blank, same order as `answers`
  note: string             // what is different about answering this way
}

export interface FillBlankExercise {
  kind: 'fill'
  id: string
  title: string
  codeLines: string[]        // full code with ___ blanks
  answers: BlankAnswer[]      // accepted value(s) for each blank
  // Valid-but-different answers. Checked only after `answers` fails, so the
  // taught answer always wins; a match still completes the exercise.
  altAnswers?: AltAnswerSet[]
  hints: string[]
  explanation: string
  xp: number
  // Optional live 3D preview — when set, the blanks are substituted into
  // codeLines and run through the VEX interpreter as the player types.
  pointShape?: PointShape
  pointCount?: number
  // Optional live arrow preview for exercises where the first 3 blanks
  // are a vector's x/y/z components — shows the vector as it's typed.
  vectorPreview?: boolean
}

export interface CodeExercise {
  kind: 'code'
  id: string
  title: string
  prompt: string             // What to accomplish
  starterCode: string
  solutionCode: string
  checks: CodeCheck[]
  pointShape: PointShape
  pointCount: number
  explanation: string
  xp: number
  // When true (and pointShape is 'sphere'), the viewer draws a translucent
  // sphere surface under the points — for exercises about @N, since a bare
  // point cloud has no real surface to derive a normal from in real Houdini.
  showSurface?: boolean
  // When true, the editor opens with starterCode already loaded instead of
  // the empty placeholder — for "run this broken code, watch it fail, fix it"
  // exercises where starting from the given code IS the exercise.
  startWithStarter?: boolean
  // Renders a live slider per entry; dragging it re-runs the code with the
  // new value, simulating a wrangle's spare ch()/chf() parameters.
  chParams?: ChParamSpec[]
  // Fixed ramp data sampled by chramp() calls in the code — always available
  // to the interpreter, not user-editable (see ChRampSpec).
  chRamps?: ChRampSpec[]
}

export interface Lesson {
  id: string
  title: string
  icon: string
  description: string
  learnCards?: LearnCard[]
  exercises: Exercise[]
}

export interface Module {
  id: string
  title: string
  icon: string
  tier: 1 | 2
  lessons: Lesson[]
}
