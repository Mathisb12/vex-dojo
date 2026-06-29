// Breaks down chramp(name, pos)'s two arguments visually: "name" selects
// WHICH ramp curve, "pos" selects WHERE along that curve (0..1) to sample.
// Kept deliberately simple (a straight line) — the point is the two
// arguments, not curve-drawing; a fancy S-curve just adds noise here.
export function RampDiagram() {
  return (
    <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <rect x="20" y="20" width="560" height="160" rx="12" fill="#161b22" stroke="#30363d" strokeWidth="1.5" />
      <text x="40" y="44" fontFamily="ui-sans-serif, system-ui" fontSize="12" fill="#e6edf3" fontWeight="600">
        Ramp parameter: &quot;falloff&quot;
      </text>

      {/* Axes */}
      <line x1="80" y1="150" x2="520" y2="150" stroke="#30363d" strokeWidth="1.5" />
      <line x1="80" y1="60" x2="80" y2="150" stroke="#30363d" strokeWidth="1.5" />

      {/* A simple straight ramp: value rises steadily from 0 to 1 */}
      <line x1="80" y1="150" x2="520" y2="65" stroke="#f97316" strokeWidth="2.5" />

      {/* Sample point at pos = 0.65 -> value = 0.65 */}
      <line x1="366" y1="65" x2="366" y2="150" stroke="#56606b" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx="366" cy="95" r="5" fill="#fbbf24" stroke="#0d1117" strokeWidth="1.5" />
      <line x1="80" y1="95" x2="366" y2="95" stroke="#56606b" strokeWidth="1" strokeDasharray="4 3" />

      {/* Axis labels */}
      <text x="80" y="168" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e">pos = 0</text>
      <text x="520" y="168" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e" textAnchor="end">pos = 1</text>
      <text x="366" y="168" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#fbbf24" textAnchor="middle">pos = 0.65</text>

      <text x="60" y="64" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e" textAnchor="end">1</text>
      <text x="60" y="152" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e" textAnchor="end">0</text>

      <text x="390" y="92" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#fbbf24">
        chramp(&quot;falloff&quot;, 0.65) → 0.65
      </text>
    </svg>
  )
}
