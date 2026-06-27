interface CheckItem {
  description: string
  passed: boolean
}

// Horizontal row of check pills + a trailing fraction counter — replaces a
// vertical list when there are several short checks to scan at a glance.
export function CheckPillRow({ checks }: { checks: CheckItem[] }) {
  const passedCount = checks.filter(c => c.passed).length
  return (
    <div className="flex flex-wrap items-center gap-2">
      {checks.map((check, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
            check.passed
              ? 'border-vex-green/40 bg-vex-green/10 text-vex-green'
              : 'border-vex-border bg-vex-surface text-vex-muted'
          }`}
        >
          <span>{check.passed ? '✓' : '○'}</span>
          <span>{check.description}</span>
        </span>
      ))}
      <span className="ml-auto text-vex-muted text-xs font-mono">{passedCount}/{checks.length}</span>
    </div>
  )
}
