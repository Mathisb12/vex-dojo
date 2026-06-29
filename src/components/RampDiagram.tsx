// Breaks down chramp(name, pos)'s two arguments visually: "name" selects
// WHICH ramp curve, "pos" selects WHERE along that curve (0..1) to sample.
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

      {/* Curve (artist-drawn shape) */}
      <path d="M 80 150 C 200 150, 220 70, 340 70 C 420 70, 460 90, 520 65" stroke="#f97316" strokeWidth="2.5" fill="none" />

      {/* Sample point at pos = 0.65 */}
      <line x1="367" y1="60" x2="367" y2="150" stroke="#56606b" strokeWidth="1" strokeDasharray="4 3" />
      <circle cx="367" cy="74" r="5" fill="#fbbf24" stroke="#0d1117" strokeWidth="1.5" />
      <line x1="80" y1="74" x2="367" y2="74" stroke="#56606b" strokeWidth="1" strokeDasharray="4 3" />

      {/* Axis labels */}
      <text x="80" y="168" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e">pos = 0</text>
      <text x="520" y="168" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e" textAnchor="end">pos = 1</text>
      <text x="367" y="168" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#fbbf24" textAnchor="middle">pos = 0.65</text>

      <text x="60" y="64" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e" textAnchor="end">1</text>
      <text x="60" y="152" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#8b949e" textAnchor="end">0</text>

      <text x="395" y="78" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#fbbf24">
        chramp(&quot;falloff&quot;, 0.65) → 0.82
      </text>
    </svg>
  )
}
