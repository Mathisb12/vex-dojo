import { useMemo, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { CODEX, CODEX_CATEGORIES, codexHaystack, type CodexCat, type CodexFn } from './entries'
import { Icon } from '../components/Icon'

/** Highlights the matched run of characters so a search result explains itself. */
function Mark({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-vex-orange/25 text-vex-orange rounded px-0.5">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

function FnCard({ fn, q, onJump }: { fn: CodexFn; q: string; onJump: (name: string) => void }) {
  const { t } = useLang()
  return (
    <div id={`codex-${fn.name}`} className="bg-vex-surface border border-vex-border rounded-xl p-4 flex flex-col gap-2.5 scroll-mt-4">
      <div className="flex items-baseline gap-2 flex-wrap">
        <code className="text-vex-orange font-mono font-bold text-sm">
          <Mark text={fn.name} q={q} />
        </code>
        {!fn.run && (
          <span
            title={t('codex.refOnlyHint')}
            className="text-[10px] font-mono uppercase tracking-wider text-vex-muted-2 border border-vex-border-soft rounded px-1.5 py-0.5"
          >
            {t('codex.refOnly')}
          </span>
        )}
      </div>

      <code className="text-vex-muted font-mono text-xs break-all">{fn.sig}</code>

      <p className="text-vex-text/85 text-sm leading-relaxed text-pretty">{fn.fr}</p>

      <div className="flex items-start gap-2">
        <span className="text-vex-blue text-[10px] font-mono uppercase tracking-wider flex-shrink-0 mt-0.5">
          {t('codex.when')}
        </span>
        <p className="text-vex-muted text-sm leading-relaxed text-pretty min-w-0">{fn.when}</p>
      </div>

      {fn.ex && (
        <pre className="bg-vex-editor border border-vex-border-soft rounded-lg px-3 py-2 text-xs font-mono text-vex-text/80 overflow-x-auto leading-relaxed">
          {fn.ex}
        </pre>
      )}

      {fn.see && fn.see.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-vex-muted-2 text-[10px] font-mono uppercase tracking-wider">{t('codex.seeAlso')}</span>
          {fn.see.map(s => (
            <button
              key={s}
              onClick={() => onJump(s)}
              className="text-xs font-mono text-vex-blue/80 hover:text-vex-blue hover:underline"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * The Codex — a VEX reference in French, which does not exist anywhere else.
 * Signatures come from Houdini's own compiler dump rather than being retyped,
 * and each entry says plainly whether this site's sandbox can run it.
 */
export function Codex() {
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<CodexCat | 'all'>('all')

  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    let list = CODEX
    if (cat !== 'all') list = list.filter(f => f.cat === cat)
    if (query) list = list.filter(f => codexHaystack(f).includes(query))
    return list
  }, [query, cat])

  // Searching across everything is more useful than staying inside a category,
  // so typing a query that the current category cannot satisfy widens it.
  const grouped = useMemo(() => {
    const by = new Map<CodexCat, CodexFn[]>()
    for (const f of results) {
      const arr = by.get(f.cat) ?? []
      arr.push(f)
      by.set(f.cat, arr)
    }
    return CODEX_CATEGORIES.filter(c => by.has(c.id)).map(c => ({ cat: c, fns: by.get(c.id)! }))
  }, [results])

  const jump = (name: string) => {
    setCat('all')
    setQ('')
    // Let the full list render before scrolling to the target.
    requestAnimationFrame(() => {
      document.getElementById(`codex-${name}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  const runnable = CODEX.filter(f => f.run).length

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-10 sm:py-[46px]">
      <div className="max-w-[860px] mx-auto flex flex-col gap-6">
        <div>
          <div className="text-vex-purple text-xs font-mono font-semibold uppercase tracking-widest mb-2">
            {t('codex.eyebrow')}
          </div>
          <h1 className="text-3xl font-extrabold text-vex-text mb-2 tracking-tight">{t('codex.title')}</h1>
          <p className="text-vex-muted text-base max-w-xl text-pretty">{t('codex.subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3 sticky top-0 bg-vex-bg/95 backdrop-blur-sm py-3 -my-1 z-10">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={t('codex.search')}
            spellCheck={false}
            className="w-full bg-vex-surface border border-vex-border focus:border-vex-orange/60 rounded-xl px-4 py-2.5 text-sm text-vex-text placeholder:text-vex-muted-2 focus:outline-none font-mono"
          />
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setCat('all')}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                cat === 'all'
                  ? 'bg-vex-orange/15 border-vex-orange/50 text-vex-orange'
                  : 'border-vex-border text-vex-muted hover:text-vex-text hover:border-vex-muted-4'
              }`}
            >
              {t('codex.all')} · {CODEX.length}
            </button>
            {CODEX_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                  cat === c.id
                    ? 'bg-vex-orange/15 border-vex-orange/50 text-vex-orange'
                    : 'border-vex-border text-vex-muted hover:text-vex-text hover:border-vex-muted-4'
                }`}
              >
                <Icon name={c.icon} size={13} className="mr-1.5 inline-block align-[-2px] opacity-80" />{c.label}
              </button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <p className="text-vex-muted text-sm py-8 text-center">{t('codex.noResults')}</p>
        ) : (
          grouped.map(({ cat: c, fns }) => (
            <section key={c.id} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 border-b border-vex-border-soft pb-2">
                <Icon name={c.icon} size={15} className="text-vex-orange flex-shrink-0" />
                <h2 className="text-vex-text font-bold text-base">{c.label}</h2>
                <span className="text-vex-muted-2 text-xs">{c.blurb}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {fns.map(f => <FnCard key={f.name} fn={f} q={query} onJump={jump} />)}
              </div>
            </section>
          ))
        )}

        <p className="text-vex-muted-2 text-xs leading-relaxed text-pretty border-t border-vex-border-soft pt-4">
          {t('codex.footnote')} — {runnable}/{CODEX.length} {t('codex.runnableCount')}
        </p>
      </div>
    </div>
  )
}
