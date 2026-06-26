import { useState, useRef, useEffect, useMemo } from 'react'
import type { FillBlankExercise, BlankAnswer } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'
import { PointCloudViewer } from '../visualization/PointCloudViewer'
import { runVex, makeDefaultPoints, type PointAttrs } from '../interpreter/evaluator'

interface Props {
  exercise: FillBlankExercise
  onComplete: (xp: number) => void
}

function matchesAnswer(userInput: string, expected: BlankAnswer): boolean {
  const input = userInput.trim().toLowerCase()
  if (typeof expected === 'string') return input === expected.trim().toLowerCase()
  if (Array.isArray(expected)) return expected.some(e => input === e.trim().toLowerCase())
  // numeric range
  const num = parseFloat(input)
  return !Number.isNaN(num) && num >= expected.min && num <= expected.max
}

// Substitutes user answers into the ___ blanks to build runnable VEX source.
// Returns null while any blank is still empty (nothing to preview yet).
function buildPreviewCode(codeLines: string[], answers: string[]): string | null {
  if (answers.some(a => !a || a.trim() === '')) return null
  let blankIdx = 0
  return codeLines.map(line => line.replace(/___/g, () => answers[blankIdx++].trim())).join('\n')
}

export function FillBlankQuestion({ exercise, onComplete }: Props) {
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

  const blankCount = exercise.answers.length

  const handleCheck = () => {
    const res = exercise.answers.map((expected, i) => matchesAnswer(answers[i], expected))
    setResults(res)
    setChecked(true)
  }

  const allCorrect = results.length > 0 && results.every(Boolean)

  // Live preview: substitute blanks and run through the VEX interpreter (debounced)
  const previewCode = useMemo(() => buildPreviewCode(exercise.codeLines, answers), [exercise.codeLines, answers])
  useEffect(() => {
    if (!hasPreview) return
    if (previewCode === null) { setPreviewPoints(basePoints.current); return }
    const timer = setTimeout(() => {
      const pts = basePoints.current.map(p => ({ ...p, P: { ...p.P }, Cd: { ...p.Cd }, N: { ...p.N } }))
      const result = runVex(previewCode, pts)
      if (!result.error) setPreviewPoints(result.points)
    }, 400)
    return () => clearTimeout(timer)
  }, [previewCode, hasPreview])

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
                      if (checked) { setChecked(false); setResults([]) }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        if (idx < blankCount - 1) inputRefs.current[idx + 1]?.focus()
                        else handleCheck()
                      }
                    }}
                    className={[
                      'inline-block w-20 text-center font-mono text-sm px-1 py-0 mx-1 rounded border',
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
      {/* Instructions */}
      <div className="bg-vex-surface border border-vex-border rounded-2xl p-5">
        <div className="text-xs text-vex-orange font-mono uppercase tracking-widest mb-2">{t('fill.title')}</div>
        <p className="text-vex-text text-sm">{exercise.title}</p>
      </div>

      {/* Code block — with live 3D preview side-by-side when available */}
      {hasPreview ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {codeBlock}
          <PointCloudViewer points={previewPoints} height={260} />
        </div>
      ) : (
        codeBlock
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

      {allCorrect && (
        <div className="bg-vex-green/10 border border-vex-green rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
          <div className="text-vex-green font-semibold mb-1">{t('fill.perfect')} +{exercise.xp} XP</div>
          <p className="text-vex-text/80 text-sm"
            dangerouslySetInnerHTML={{ __html: exercise.explanation.replace(/`(.+?)`/g, '<code class="bg-black/30 px-1 rounded text-vex-orange font-mono text-xs">$1</code>') }}
          />
          <button
            onClick={() => onComplete(exercise.xp)}
            className="mt-3 px-5 py-2 bg-vex-green text-black font-semibold rounded-lg hover:bg-vex-green/90 transition-colors text-sm"
          >
            {t('common.continue')}
          </button>
        </div>
      )}
    </div>
  )
}
