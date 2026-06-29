import { useState, useEffect, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { PointCloudViewer } from '../visualization/PointCloudViewer'
import { runVex, makeDefaultPoints, type PointAttrs } from '../interpreter/evaluator'
import type { CodeExercise } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'
import { registerVexEditorFeatures } from './vexMonacoLanguage'
import { ExerciseHeader } from './ExerciseHeader'
import { CheckPillRow } from './CheckPillRow'
import { ChannelSliders } from './ChannelSliders'

interface Props {
  exercise: CodeExercise
  icon: string
  onComplete: (xp: number) => void
}

export function CodeQuestion({ exercise, icon, onComplete }: Props) {
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
  const [isPending, setIsPending] = useState(false)
  const [chValues, setChValues] = useState<Record<string, number>>(() =>
    Object.fromEntries((exercise.chParams ?? []).map(p => [p.name, p.default]))
  )
  const basePoints = useRef(makeDefaultPoints(exercise.pointCount, exercise.pointShape))

  // Auto-run on code change (debounced)
  const runTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (runTimer.current) clearTimeout(runTimer.current)
    setIsPending(true)
    runTimer.current = setTimeout(() => { runCode(code, chValues); setIsPending(false) }, 600)
    return () => { if (runTimer.current) clearTimeout(runTimer.current) }
  }, [code])

  // Auto-run on slider change — snappier debounce than code typing, since a
  // slider drag is already a "final" value the player wants to see live.
  const chTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!exercise.chParams?.length) return
    if (chTimer.current) clearTimeout(chTimer.current)
    chTimer.current = setTimeout(() => { runCode(code, chValues) }, 80)
    return () => { if (chTimer.current) clearTimeout(chTimer.current) }
  }, [chValues])

  // Reset base points when exercise changes
  useEffect(() => {
    basePoints.current = makeDefaultPoints(exercise.pointCount, exercise.pointShape)
    setCode(placeholder)
    setChValues(Object.fromEntries((exercise.chParams ?? []).map(p => [p.name, p.default])))
    setRan(false)
    setAllPass(false)
    setShowSolution(false)
    setHintUsed(false)
  }, [exercise.id])

  const runCode = useCallback((src: string, chVals: Record<string, number>) => {
    // Deep copy base points
    const pts = basePoints.current.map(p => ({
      ...p,
      P: { ...p.P },
      Cd: { ...p.Cd },
      N: { ...p.N },
    }))
    const ramps = Object.fromEntries((exercise.chRamps ?? []).map(r => [r.name, r.stops]))
    const result = runVex(src, pts, chVals, ramps)
    setPoints(result.points)
    setOutput(result.output)
    setError(result.error)
    setRan(true)

    if (!result.error) {
      const checkResults = exercise.checks.map(c => {
        try { return c.test(result.points, result.output, src, chVals) }
        catch { return false }
      })
      setChecks(checkResults)
      const pass = checkResults.every(Boolean)
      setAllPass(pass)
    }
  }, [exercise])

  const handleRun = () => runCode(code, chValues)

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
      <ExerciseHeader kind="code" icon={icon}>{exercise.prompt}</ExerciseHeader>

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
              <span className="ml-auto text-[10px] font-mono text-vex-muted border border-vex-border rounded-full px-2 py-0.5">VEX</span>
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

          {!ran && (
            <div className="px-3 py-1.5 text-vex-muted text-xs font-mono border border-vex-border rounded-lg bg-vex-surface/60">
              {t('code.idleHint')}
            </div>
          )}

          {/* Run + actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRun}
              className="px-4 py-1.5 bg-vex-orange text-black font-semibold rounded-lg hover:bg-vex-orange/90 text-sm transition-colors"
            >
              {t('common.run')}
            </button>
            <button
              onClick={() => {
                setCode(placeholder)
                setChValues(Object.fromEntries((exercise.chParams ?? []).map(p => [p.name, p.default])))
                setRan(false)
                setAllPass(false)
                setShowSolution(false)
                setHintUsed(false)
              }}
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

          {exercise.chParams && exercise.chParams.length > 0 && (
            <ChannelSliders
              params={exercise.chParams}
              values={chValues}
              onChange={(name, value) => setChValues(v => ({ ...v, [name]: value }))}
            />
          )}

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
            <CheckPillRow checks={exercise.checks.map((check, i) => ({ description: check.description, passed: checks[i] }))} />
          )}
        </div>

        {/* 3D Viewer */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-vex-muted">{t('viewer.title3d')}</span>
            {isPending && <span className="w-1.5 h-1.5 rounded-full bg-vex-orange animate-pulse-fast" />}
          </div>
          <PointCloudViewer points={points} height={300} showSurface={exercise.showSurface} />
        </div>
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
