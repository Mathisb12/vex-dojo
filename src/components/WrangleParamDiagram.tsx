// Illustrates the real Houdini workflow ch()/chf() content describes: a
// wrangle node's code references a channel by name, and Houdini can expose
// that channel as a slider parameter right on the node. Not a real Houdini
// screenshot (none available here) — a simplified, labeled stand-in for
// visual learners who want a picture rather than just prose.
export function WrangleParamDiagram() {
  return (
    <svg viewBox="0 0 600 190" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Wrangle node */}
      <rect x="20" y="30" width="230" height="130" rx="12" fill="#161b22" stroke="#30363d" strokeWidth="1.5" />
      <rect x="20" y="30" width="230" height="28" rx="12" fill="#21262d" />
      <circle cx="36" cy="44" r="4" fill="#f97316" />
      <text x="50" y="48" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#8b949e">geo1 / wrangle1</text>
      <text x="36" y="80" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#e6edf3">
        float amp =
      </text>
      <text x="36" y="98" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#f97316">
        chf(&quot;amplitude&quot;);
      </text>
      <text x="36" y="124" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#e6edf3">
        @P.y += amp;
      </text>
      <text x="36" y="148" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#56606b">VEX code in the node</text>

      {/* Dashed connector */}
      <path d="M 250 90 H 330" stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
      <path d="M 322 84 L 332 90 L 322 96" stroke="#f97316" strokeWidth="1.5" fill="none" />

      {/* Parameter panel */}
      <rect x="340" y="30" width="240" height="130" rx="12" fill="#161b22" stroke="#30363d" strokeWidth="1.5" />
      <rect x="340" y="30" width="240" height="28" rx="12" fill="#21262d" />
      <text x="354" y="48" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#8b949e">parameters</text>

      <text x="354" y="84" fontFamily="ui-sans-serif, system-ui" fontSize="12" fill="#e6edf3" fontWeight="600">Amplitude</text>
      <text x="354" y="100" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#56606b">&quot;amplitude&quot;</text>

      {/* Slider track */}
      <rect x="354" y="116" width="190" height="6" rx="3" fill="#30363d" />
      <rect x="354" y="116" width="76" height="6" rx="3" fill="#f97316" />
      <circle cx="430" cy="119" r="8" fill="#f97316" stroke="#0d1117" strokeWidth="2" />
      <text x="354" y="146" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#f97316">0.40</text>
      <text x="500" y="146" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#56606b" textAnchor="end">drag me</text>
    </svg>
  )
}
