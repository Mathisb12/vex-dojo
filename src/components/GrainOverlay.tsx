// Full-screen subtle noise texture — a "premium" touch from the design handoff.
// Pure decoration: fixed, non-interactive, sits above everything via soft-light blend.
export function GrainOverlay() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      style={{ mixBlendMode: 'soft-light', opacity: 0.045 }}
      aria-hidden="true"
    >
      <filter id="vex-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#vex-grain)" />
    </svg>
  )
}
