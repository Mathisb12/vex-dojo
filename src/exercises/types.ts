// ─── Exercise type definitions ────────────────────────────────────────────────

export type PointShape = 'sphere' | 'grid' | 'random'

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
  // Runs against the output points to verify the exercise
  test: (points: { P: {x:number;y:number;z:number}; Cd: {x:number;y:number;z:number}; N: {x:number;y:number;z:number}; ptnum: number; numpt: number }[], output: string) => boolean
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
  visual?: 'vector' | 'attributes' | 'loop'  // optional diagram type
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
export type BlankAnswer = string | string[] | { min: number; max: number }

export interface FillBlankExercise {
  kind: 'fill'
  id: string
  title: string
  codeLines: string[]        // full code with ___ blanks
  answers: BlankAnswer[]      // accepted value(s) for each blank
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
