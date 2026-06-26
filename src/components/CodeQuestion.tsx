import { useState, useEffect, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { PointCloudViewer } from '../visualization/PointCloudViewer'
import { runVex, makeDefaultPoints, type PointAttrs } from '../interpreter/evaluator'
import type { CodeExercise } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'
import { registerVexEditorFeatures } from './vexMonacoLanguage'

interface Props {
  exercise: CodeExercise
  onComplete: (xp: number) => void
}

export function CodeQuestion({ exercise, onComplete }: Props) {
  const { t } = useLang()
  const placeholder = t('code.placeholder')
  const [code, setCode] = useState(placeholder)
  const [points, setPoints] = useState<PointAttrs[]>(() => makeDefaultPoints(exercise.pointCount, exercise.pointShape))
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [checks, setChecks] = useState<boolean[]>([])
  const [ran, setRan] = useState(false)
  const [allPass, setAllPass] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const basePoints = useRef(makeDefaultPoints(exercise.pointCount, exercise.pointShape))

  // Auto-run on code change (debounced)
  const runTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (runTimer.current) clearTimeout(runTimer.current)
    runTimer.current = setTimeout(() => runCode(code), 600)
    return () => { if (runTimer.current) clearTimeout(runTimer.current) }
  }, [code])

  // Reset base points when exercise changes
  useEffect(() => {
    basePoints.current = makeDefaultPoints(exercise.pointCount, exercise.pointShape)
    setCode(placeholder)
    setRan(false)
    setAllPass(false)
    setShowSolution(false)
    setHintUsed(false)
  }, [exercise.id])

  const runCode = useCallback((src: string) => {
    // Deep copy base points
    const pts = basePoints.current.map(p => ({
      ...p,
      P: { ...p.P },
      Cd: { ...p.Cd },
      N: { ...p.N },
    }))
    const result = runVex(src, pts)
    setPoints(result.points)
    setOutput(result.output)
    setError(result.error)
    setRan(true)

    if (!result.error) {
      const checkResults = exercise.checks.map(c => {
        try { return c.test(result.points, result.output) }
        catch { return false }
      })
      setChecks(checkResults)
      const pass = checkResults.every(Boolean)
      setAllPass(pass)
    }
  }, [exercise])

  const handleRun = () => runCode(code)

  const handleHint = () => {
    setCode(exercise.starterCode)
    setHintUsed(true)
  }

  const handleSolution = () => {
    setCode(exercise.solutionCode)
    setShowSolution(true)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Prompt */}
      <div className="bg-vex-surface border border-vex-border rounded-2xl p-5">
        <div className="text-xs text-vex-orange font-mono uppercase tracking-widest mb-2">{t('code.title')}</div>
        <p className="text-vex-text text-base font-medium">{exercise.prompt}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="flex flex-col gap-2">
          <div className="rounded-xl overflow-hidden border border-vex-border" style={{ height: 260 }}>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-vex-surface border-b border-vex-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-vex-muted text-xs font-mono ml-2">wrangle.vex</span>
            </div>
            <Editor
              height="220px"
              defaultLanguage="cpp"
              value={code}
              onChange={v => setCode(v ?? '')}
              beforeMount={registerVexEditorFeatures}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                renderLineHighlight: 'line',
                padding: { top: 8, bottom: 8 },
                tabSize: 4,
                quickSuggestions: { other: true, comments: false, strings: false },
                fixedOverflowWidgets: true,
              }}
            />
          </div>

          {/* Run + actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRun}
              className="px-4 py-1.5 bg-vex-orange text-black font-semibold rounded-lg hover:bg-vex-orange/90 text-sm transition-colors"
            >
              {t('common.run')}
            </button>
            <button
              onClick={() => { setCode(placeholder); setRan(false); setAllPass(false); setShowSolution(false); setHintUsed(false) }}
              className="px-3 py-1.5 border border-vex-border text-vex-muted rounded-lg hover:border-vex-text hover:text-vex-text text-sm transition-colors"
            >
              {t('common.reset')}
            </button>
            {!allPass && (
              <div className="flex items-center gap-2 ml-auto">
                {!hintUsed && !showSolution && (
                  <button
                    onClick={handleHint}
                    className="px-3 py-1.5 border border-vex-border text-vex-muted rounded-lg hover:border-vex-blue hover:text-vex-blue text-sm transition-colors"
                  >
                    {t('code.showHint')}
                  </button>
                )}
                {!showSolution && (
                  <button
                    onClick={handleSolution}
                    className="px-3 py-1.5 border border-vex-border text-vex-muted rounded-lg hover:border-vex-purple hover:text-vex-purple text-sm transition-colors"
                  >
                    {t('common.showSolution')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-vex-red/10 border border-vex-red/50 rounded-lg px-3 py-2 text-vex-red text-xs font-mono">
              {error}
            </div>
          )}

          {/* Console output */}
          {output && (
            <div className="bg-black/40 border border-vex-border rounded-lg px-3 py-2 text-vex-muted text-xs font-mono whitespace-pre max-h-20 overflow-y-auto">
              {output}
            </div>
          )}

          {/* Check results */}
          {ran && !error && (
            <div className="flex flex-col gap-1">
              {exercise.checks.map((check, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${
                  checks[i] ? 'border-vex-green/40 bg-vex-green/5 text-vex-green' : 'border-vex-border bg-vex-surface text-vex-muted'
                }`}>
                  <span>{checks[i] ? '✓' : '○'}</span>
                  <span>{check.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3D Viewer */}
        <PointCloudViewer points={points} height={300} />
      </div>

      {/* Success */}
      {allPass && (
        <div className="bg-vex-green/10 border border-vex-green rounded-xl p-4 animate-[slideIn_0.3s_ease-out]">
          <div className="text-vex-green font-semibold mb-1">
            {showSolution ? `${t('code.solutionApplied')} +${Math.floor(exercise.xp / 2)} XP` : `${t('code.allPass')} +${exercise.xp} XP`}
          </div>
          <p className="text-vex-text/80 text-sm"
            dangerouslySetInnerHTML={{ __html: exercise.explanation.replace(/`(.+?)`/g, '<code class="bg-black/30 px-1 rounded text-vex-orange font-mono text-xs">$1</code>') }}
          />
          <button
            onClick={() => onComplete(showSolution ? Math.floor(exercise.xp / 2) : exercise.xp)}
            className="mt-3 px-5 py-2 bg-vex-green text-black font-semibold rounded-lg hover:bg-vex-green/90 transition-colors text-sm"
          >
            {t('common.continue')}
          </button>
        </div>
      )}
    </div>
  )
}
