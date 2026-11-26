import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Editor from '@monaco-editor/react'
import { PointCloudViewer } from '../visualization/PointCloudViewer'
import { runVex, makeDefaultPoints, type PointAttrs } from '../interpreter/evaluator'
import { detectChannelParams, referencesTime } from '../interpreter/channels'
import { VEX_SIGNATURES } from '../interpreter/signatures'
import { registerVexEditorFeatures } from '../components/vexMonacoLanguage'
import { ChannelSliders } from '../components/ChannelSliders'
import type { PointShape } from '../exercises/types'
import { useLang } from '../i18n/LanguageContext'
import type { UIKey } from '../i18n/ui'
import { RECIPES } from './recipes'
import { Icon } from '../components/Icon'

const SHAPES: PointShape[] = ['sphere', 'grid', 'random']
const SHAPE_LABEL: Record<PointShape, UIKey> = {
  sphere: 'playground.shape.sphere',
  grid: 'playground.shape.grid',
  random: 'playground.shape.random',
}
const COUNTS = [150, 300, 600, 900]

// Free-form sandbox: no checks, no right answer. Write any VEX, watch the
// points react. The recipe gallery is the real teaching device — each one is a
// production technique you can load, run, and then take apart.
export function Playground() {
  const { t, lang } = useLang()

  const [code, setCode] = useState(RECIPES[0].code)
  const [shape, setShape] = useState<PointShape>(RECIPES[0].shape)
  const [count, setCount] = useState(RECIPES[0].count)
  const [surface, setSurface] = useState(!!RECIPES[0].surface)
  const [activeRecipe, setActiveRecipe] = useState<string | null>(RECIPES[0].id)

  const [points, setPoints] = useState<PointAttrs[]>(() => makeDefaultPoints(RECIPES[0].count, RECIPES[0].shape))
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState('')

  const [chValues, setChValues] = useState<Record<string, number>>({})
  const [timeVal, setTimeVal] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timeRef = useRef(0)

  const [search, setSearch] = useState('')

  // Sliders spawn from whatever ch()/chf() the code contains, exactly like the
  // exercises — so a recipe using chf("displace") just works.
  const autoParams = useMemo(() => detectChannelParams(code), [code])
  const usesTime = useMemo(() => referencesTime(code), [code])

  const basePoints = useRef(makeDefaultPoints(count, shape))
  useEffect(() => { basePoints.current = makeDefaultPoints(count, shape) }, [count, shape])

  const runCode = useCallback((src: string, chVals: Record<string, number>) => {
    const pts = basePoints.current.map(p => ({ ...p, P: { ...p.P }, Cd: { ...p.Cd }, N: { ...p.N } }))
    const result = runVex(src, pts, chVals, {}, { Time: timeRef.current })
    setError(result.error)
    setOutput(result.output)
    if (!result.error) setPoints(result.points)
  }, [])

  // Debounced re-run on every input that can change the result.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => runCode(code, chValues), 300)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [code, chValues, shape, count, runCode])

  useEffect(() => {
    if (!playing || !usesTime) return
    const id = setInterval(() => {
      setTimeVal(prev => {
        const next = prev + 0.08 >= 10 ? 0 : +(prev + 0.08).toFixed(2)
        timeRef.current = next
        return next
      })
    }, 80)
    return () => clearInterval(id)
  }, [playing, usesTime])

  useEffect(() => { runCode(code, chValues) }, [timeVal])

  const loadRecipe = (id: string) => {
    const r = RECIPES.find(x => x.id === id)
    if (!r) return
    setActiveRecipe(r.id)
    setShape(r.shape)
    setCount(r.count)
    setSurface(!!r.surface)
    setChValues({})
    setPlaying(false)
    timeRef.current = 0
    setTimeVal(0)
    basePoints.current = makeDefaultPoints(r.count, r.shape)
    setCode(r.code)
  }

  const fnEntries = useMemo(() => {
    const q = search.trim().toLowerCase()
    return Object.entries(VEX_SIGNATURES)
      .filter(([name, sig]) => !q || name.includes(q) || sig.label.toLowerCase().includes(q) || sig.doc.toLowerCase().includes(q))
      .sort((a, b) => a[0].localeCompare(b[0]))
  }, [search])

  const pill = (active: boolean) =>
    `px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
      active ? 'border-vex-orange bg-vex-orange/15 text-vex-orange' : 'border-vex-border text-vex-muted hover:text-vex-orange hover:border-vex-orange/50'
    }`

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
        {/* Header */}
        <div>
          <div className="text-vex-orange text-xs font-mono font-semibold uppercase tracking-widest mb-2">
            {t('playground.eyebrow')}
          </div>
          <h1 className="text-3xl font-extrabold text-vex-text mb-2 tracking-tight">{t('playground.title')}</h1>
          <p className="text-vex-muted text-base max-w-2xl text-pretty">{t('playground.subtitle')}</p>
        </div>

        {/* Recipe gallery — the "what can VEX do" answer */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-mono uppercase tracking-widest text-vex-muted">{t('playground.recipes')}</div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {RECIPES.map(r => (
              <button
                key={r.id}
                onClick={() => loadRecipe(r.id)}
                className={`text-left p-3 rounded-xl border transition-colors ${
                  activeRecipe === r.id
                    ? 'border-vex-orange/60 bg-vex-orange/10'
                    : 'border-vex-border bg-vex-surface hover:border-vex-orange/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={r.icon} size={16} className="text-vex-orange flex-shrink-0" />
                  <span className="text-vex-text font-semibold text-sm">{r.title[lang]}</span>
                </div>
                <div className="text-vex-muted text-xs leading-snug text-pretty">{r.blurb[lang]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor + viewer */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="rounded-xl overflow-hidden border border-vex-border" style={{ height: 340 }}>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-vex-surface border-b border-vex-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-vex-muted text-xs font-mono ml-2">playground.vex</span>
                <span className="ml-auto text-[10px] font-mono text-vex-muted border border-vex-border rounded-full px-2 py-0.5">VEX</span>
              </div>
              <Editor
                height="300px"
                defaultLanguage="cpp"
                value={code}
                onChange={v => { setCode(v ?? ''); setActiveRecipe(null) }}
                beforeMount={registerVexEditorFeatures}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: 'IBM Plex Mono, ui-monospace, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 8, bottom: 8 },
                  tabSize: 4,
                  quickSuggestions: { other: true, comments: false, strings: false },
                  fixedOverflowWidgets: true,
                }}
              />
            </div>

            {(autoParams.length > 0 || usesTime) && (
              <ChannelSliders
                params={autoParams}
                values={chValues}
                onChange={(name, value) => setChValues(v => ({ ...v, [name]: value }))}
                time={usesTime ? {
                  value: timeVal,
                  playing,
                  onScrub: v => { setPlaying(false); timeRef.current = v; setTimeVal(v) },
                  onTogglePlay: () => setPlaying(p => !p),
                } : null}
              />
            )}

            {error && (
              <div className="bg-vex-red/10 border border-vex-red/50 rounded-lg px-3 py-2 text-vex-red text-xs font-mono">
                {error}
              </div>
            )}
            {output && (
              <div className="bg-black/40 border border-vex-border rounded-lg px-3 py-2 text-vex-muted text-xs font-mono whitespace-pre max-h-24 overflow-y-auto">
                {output}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase tracking-widest text-vex-muted mr-1">{t('playground.shape')}</span>
              {SHAPES.map(s => (
                <button key={s} onClick={() => { setShape(s); setActiveRecipe(null) }} className={pill(shape === s)}>
                  {t(SHAPE_LABEL[s])}
                </button>
              ))}
              <button onClick={() => setSurface(v => !v)} className={`${pill(surface)} ml-auto`}>
                {t('playground.surface')}
              </button>
            </div>
            <PointCloudViewer points={points} height={300} showSurface={surface} />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase tracking-widest text-vex-muted mr-1">{t('playground.points')}</span>
              {COUNTS.map(c => (
                <button key={c} onClick={() => { setCount(c); setActiveRecipe(null) }} className={pill(count === c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Function reference */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono uppercase tracking-widest text-vex-muted">{t('playground.reference')}</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('playground.searchFn')}
              className="flex-1 min-w-[160px] max-w-xs bg-vex-surface border border-vex-border rounded-lg px-3 py-1.5 text-sm text-vex-text placeholder:text-vex-muted-3 focus:outline-none focus:border-vex-orange/60"
            />
            <span className="text-vex-muted-3 text-xs font-mono">{fnEntries.length}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 max-h-80 overflow-y-auto pr-1">
            {fnEntries.map(([name, sig]) => (
              <div key={name} className="bg-vex-surface border border-vex-border rounded-lg px-3 py-2">
                <div className="font-mono text-xs text-vex-orange break-words">{sig.label}</div>
                <div className="text-vex-muted text-xs mt-1 leading-snug text-pretty">{sig.doc}</div>
              </div>
            ))}
            {fnEntries.length === 0 && (
              <div className="text-vex-muted text-sm">{t('playground.noResults')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
