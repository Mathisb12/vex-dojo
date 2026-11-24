import { useState, useRef, useEffect, useMemo } from 'react'
import type { FillBlankExercise, BlankAnswer } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'
import { PointCloudViewer } from '../visualization/PointCloudViewer'
import { VectorArrowViewer } from '../visualization/VectorArrowViewer'
import { runVex, makeDefaultPoints, type PointAttrs } from '../interpreter/evaluator'
import { detectChannelParams } from '../interpreter/channels'
import { ExerciseHeader } from './ExerciseHeader'
import { ChannelSliders } from './ChannelSliders'

interface Props {
  exercise: FillBlankExercise
  icon: string
  onComplete: (xp: number, clean: boolean) => void
}

// Matches numeric literals the way C-like languages parse them, so
// equivalent spellings (.5, 0.5, -.5, 1., 1.0) all count as the same value.
const NUMERIC_LITERAL = /^[+-]?(\d+\.?\d*|\.\d+)$/

function matchesSingle(input: string, expected: string): boolean {
  if (input === expected) return true
  if (NUMERIC_LITERAL.test(input) && NUMERIC_LITERAL.test(expected)) {
    return parseFloat(input) === parseFloat(expected)
  }
  return false
}

function matchesAnswer(userInput: string, expected: BlankAnswer): boolean {
  const input = userInput.trim().toLowerCase()
  if (typeof expected === 'string') return matchesSingle(input, expected.trim().toLowerCase())
  if (Array.isArray(expected)) return expected.some(e => matchesSingle(input, e.trim().toLowerCase()))
  // numeric range, or one of the named constants that lands inside it
  if (expected.also?.some(e => input === e.trim().toLowerCase())) return true
  const num = parseFloat(input)
  return !Number.isNaN(num) && num >= expected.min && num <= expected.max
}

// Longest spelling this blank accepts, so the box is wide enough to type the
// answer without it scrolling out of sight. Ranges get a sensible default.
function widestAnswer(expected: BlankAnswer): number {
  if (typeof expected === 'string') return expected.length
  if (Array.isArray(expected)) return Math.max(...expected.map(e => e.length))
  return Math.max(5, ...(expected.also ?? []).map(e => e.length))
}

// Substitutes user answers into the ___ blanks to build runnable VEX source.
// Returns null while any blank is still empty (nothing to preview yet).
function buildPreviewCode(codeLines: string[], answers: string[]): string | null {
  if (answers.some(a => !a || a.trim() === '')) return null
  let blankIdx = 0
  return codeLines.map(line => line.replace(/___/g, () => answers[blankIdx++].trim())).join('\n')
}

export function FillBlankQuestion({ exercise, icon, onComplete }: Props) {
  const { t } = useLang()
  const [answers, setAnswers] = useState<string[]>(exercise.answers.map(() => ''))
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [showHints, setShowHints] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const hasPreview = !!exercise.pointShape
  const basePoints = useRef<PointAttrs[]>(
    hasPreview ? makeDefaultPoints(exercise.pointCount ?? 200, exercise.pointShape) : []
  )
  const [previewPoints, setPreviewPoints] = useState<PointAttrs[]>(basePoints.current)
  const hasVectorPreview = !!exercise.vectorPreview && exercise.answers.length === 3

  const blankCount = exercise.answers.length

  // An alternative answer set that the learner matched instead of the taught
  // one — accepted, but worth a word on what it does differently.
  const [altNote, setAltNote] = useState<string | null>(null)
  // A failed Check before getting it right means this was not recalled
  // cleanly — the item drops back to the bottom review box.
  const [missed, setMissed] = useState(false)

  const handleCheck = () => {
    const res = exercise.answers.map((expected, i) => matchesAnswer(answers[i], expected))
    if (res.every(Boolean)) {
      setAltNote(null)
      setResults(res)
      setChecked(true)
      return
    }
    // The taught answer did not match. Before calling it wrong, see whether the
    // learner wrote a different but genuinely valid VEX answer.
    const alt = exercise.altAnswers?.find(set =>
      set.answers.length === exercise.answers.length &&
      set.answers.every((expected, i) => matchesAnswer(answers[i], expected))
    )
    setAltNote(alt?.note ?? null)
    if (!alt) setMissed(true)
    setResults(alt ? exercise.answers.map(() => true) : res)
    setChecked(true)
  }

  const allCorrect = results.length > 0 && results.every(Boolean)

  // Live preview: substitute blanks and run through the VEX interpreter (debounced)
  const previewCode = useMemo(() => buildPreviewCode(exercise.codeLines, answers), [exercise.codeLines, answers])

  // Any ch()/chf() in the snippet (fixed lines or filled blanks) spawns a live
  // slider, exactly like in the code exercises.
  const [chValues, setChValues] = useState<Record<string, number>>({})
  const autoParams = useMemo(
    () => detectChannelParams(previewCode ?? exercise.codeLines.join('\n')),
    [previewCode, exercise.codeLines]
  )

  useEffect(() => {
    if (!hasPreview) return
    if (previewCode === null) { setPreviewPoints(basePoints.current); return }
    const timer = setTimeout(() => {
      const pts = basePoints.current.map(p => ({ ...p, P: { ...p.P }, Cd: { ...p.Cd }, N: { ...p.N } }))
      const result = runVex(previewCode, pts, chValues)
      if (!result.error) setPreviewPoints(result.points)
    }, 400)
    return () => clearTimeout(timer)
  }, [previewCode, hasPreview, chValues])

  const codeBlock = (
    <div className="bg-vex-bg border border-vex-border rounded-xl p-4 font-mono text-sm overflow-x-auto">
      {exercise.codeLines.map((line, lineIdx) => {
        const blanksBeforeLine = exercise.codeLines
          .slice(0, lineIdx)
          .reduce((sum, l) => sum + (l.match(/___/g)?.length ?? 0), 0)
        const lineBlankIdx = { current: blanksBeforeLine }

        const parts = line.split('___')
        return (
          <div key={lineIdx} className="flex flex-wrap items-center min-h-[1.8em]">
            {parts.map((part, partIdx) => {
              const elements: React.ReactNode[] = [
                <span key={`p${partIdx}`} className={
                  part.startsWith('//') ? 'text-vex-muted' : 'text-vex-text'
                }>{part}</span>
              ]
              if (partIdx < parts.length - 1) {
                const idx = lineBlankIdx.current++
                const isCorrect = checked ? results[idx] : null
                elements.push(
                  <input
                    key={`b${idx}`}
                    ref={el => { inputRefs.current[idx] = el }}
                    type="text"
                    value={answers[idx] ?? ''}
                    onChange={e => {
                      const next = [...answers]
                      next[idx] = e.target.value
                      setAnswers(next)
                      if (checked) { setChecked(false); setResults([]); setAltNote(null) }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        if (idx < blankCount - 1) inputRefs.current[idx + 1]?.focus()
                        else handleCheck()
                      }
                    }}
                    style={{ width: `${Math.max(4, widestAnswer(exercise.answers[idx]) + 3)}ch` }}
                    className={[
                      'inline-block text-center font-mono text-sm px-1 py-0.5 mx-1 rounded-full border',
                      'bg-vex-surface focus:outline-none',
                      isCorrect === null ? 'border-vex-orange/50 focus:border-vex-orange text-vex-orange' :
                      isCorrect ? 'border-vex-green text-vex-green bg-vex-green/5' : 'border-vex-red text-vex-red bg-vex-red/5',
                    ].join(' ')}
                    placeholder="?"
                    spellCheck={false}
                    autoComplete="off"
                  />
                )
              }
              return elements
            })}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <ExerciseHeader kind="fill" icon={icon}>{exercise.title}</ExerciseHeader>

      {/* Code block — with live 3D preview or vector arrow side-by-side when available */}
      {hasPreview ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {codeBlock}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-vex-muted">{t('viewer.title3d')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-vex-orange animate-pulse-fast" />
              <span className="text-[10px] font-mono text-vex-muted uppercase">{t('viewer.live')}</span>
            </div>
            <PointCloudViewer points={previewPoints} height={260} />
          </div>
        </div>
      ) : hasVectorPreview ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {codeBlock}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-vex-muted">{t('viewer.title3d')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-vex-orange animate-pulse-fast" />
              <span className="text-[10px] font-mono text-vex-muted uppercase">{t('viewer.live')}</span>
            </div>
            <VectorArrowViewer xRaw={answers[0] ?? ''} yRaw={answers[1] ?? ''} zRaw={answers[2] ?? ''} height={260} />
          </div>
        </div>
      ) : (
        codeBlock
      )}

      {hasPreview && autoParams.length > 0 && (
        <ChannelSliders
          params={autoParams}
          values={chValues}
          onChange={(name, value) => setChValues(v => ({ ...v, [name]: value }))}
          hint={t('chparams.houdiniNote')}
        />
      )}

      {/* Hints — hidden by default, revealed on demand */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setShowHints(s => !s)}
          className="self-start text-xs text-vex-muted hover:text-vex-orange border border-vex-border hover:border-vex-orange/50 rounded-lg px-2.5 py-1 transition-colors"
        >
          {showHints ? t('fill.hideHints') : t('fill.showHints')}
        </button>
        {showHints && (
          <div className="flex flex-wrap gap-2 text-xs text-vex-muted animate-[slideIn_0.2s_ease-out]">
            {exercise.hints.map((hint, i) => (
              <span key={i} className="bg-vex-surface border border-vex-border px-2 py-1 rounded">
                <span className="text-vex-orange">{t('fill.blank')} {i + 1}:</span> {hint}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {!allCorrect && (
        <button
          onClick={handleCheck}
          className="self-start px-5 py-2 bg-vex-orange text-black font-semibold rounded-lg hover:bg-vex-orange/90 transition-colors text-sm"
        >
          {t('common.check')}
        </button>
      )}

      {/* Feedback */}
      {checked && !allCorrect && (
        <div className="bg-vex-red/10 border border-vex-red rounded-xl p-3 text-vex-red text-sm">
          {results.map((r, i) => !r && (
            <div key={i}>
              {t('fill.blank')} {i + 1} {showHints ? `${t('fill.notRightYet')} ${exercise.hints[i]}` : t('mcq.tryAgain')}
            </div>
          ))}
        </div>
      )}

      {/* Valid, but not the answer the lesson was teaching — say what differs
          instead of silently passing it, so the nuance actually lands. */}
      {allCorrect && altNote && (
        <div className="bg-vex-blue/5 border border-vex-blue/30 rounded-xl p-4 flex items-start gap-3 animate-[slideIn_0.3s_ease-out]">
          <span className="text-vex-blue text-base leading-none mt-0.5 flex-shrink-0">◆</span>
          <div className="min-w-0">
            <div className="text-xs text-vex-blue font-mono uppercase tracking-widest mb-1">{t('fill.altAccepted')}</div>
            <p
              className="text-vex-text/80 text-sm leading-relaxed text-pretty"
              dangerouslySetInnerHTML={{ __html: altNote.replace(/\*\*(.+?)\*\*/g, '<strong class="text-vex-text font-semibold">$1</strong>').replace(/`(.+?)`/g, '<code class="bg-black/30 text-vex-blue font-mono text-xs px-1 rounded">$1</code>') }}
            />
          </div>
        </div>
      )}

      {allCorrect && (
        <div className="bg-vex-green/10 border border-vex-green rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
          <div className="text-vex-green font-semibold mb-1">{t('fill.perfect')} +{exercise.xp} XP</div>
          <p className="text-vex-text/80 text-sm text-pretty"
            dangerouslySetInnerHTML={{ __html: exercise.explanation.replace(/`(.+?)`/g, '<code class="bg-black/30 px-1 rounded text-vex-orange font-mono text-xs">$1</code>') }}
          />
          <button
            onClick={() => onComplete(exercise.xp, !missed)}
            className="mt-3 px-5 py-2 bg-vex-green text-black font-semibold rounded-lg hover:bg-vex-green/90 transition-colors text-sm"
          >
            {t('common.continue')}
          </button>
        </div>
      )}
    </div>
  )
}
