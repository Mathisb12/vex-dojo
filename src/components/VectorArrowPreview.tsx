import { useLang } from '../i18n/LanguageContext'

interface Props {
  // Raw text the player typed for each component — kept as strings so we
  // can show "?" for blanks that haven't been filled in yet.
  xRaw: string
  yRaw: string
  zRaw: string
}

const SIZE = 180
const ORIGIN = { x: SIZE / 2, y: SIZE / 2 + 14 }
const SCALE = 30
const AXIS_LEN = 1.7
const MAX_DISPLAY_MAG = 2.2

// Simple isometric basis (screen Y grows downward).
const BASIS = {
  x: { dx: Math.cos(Math.PI / 6), dy: Math.sin(Math.PI / 6) },
  y: { dx: 0, dy: -1 },
  z: { dx: -Math.cos(Math.PI / 6), dy: Math.sin(Math.PI / 6) },
}

function project(x: number, y: number, z: number) {
  return {
    x: ORIGIN.x + (x * BASIS.x.dx + y * BASIS.y.dx + z * BASIS.z.dx) * SCALE,
    y: ORIGIN.y + (x * BASIS.x.dy + y * BASIS.y.dy + z * BASIS.z.dy) * SCALE,
  }
}

function parseComponent(raw: string): number {
  const n = parseFloat(raw.trim())
  return Number.isNaN(n) ? 0 : n
}

export function VectorArrowPreview({ xRaw, yRaw, zRaw }: Props) {
  const { t } = useLang()
  const x = parseComponent(xRaw)
  const y = parseComponent(yRaw)
  const z = parseComponent(zRaw)

  const mag = Math.sqrt(x * x + y * y + z * z)
  const shrink = mag > MAX_DISPLAY_MAG && mag > 0 ? MAX_DISPLAY_MAG / mag : 1
  const tip = project(x * shrink, y * shrink, z * shrink)
  const origin = project(0, 0, 0)
  const xEnd = project(AXIS_LEN, 0, 0)
  const yEnd = project(0, AXIS_LEN, 0)
  const zEnd = project(0, 0, AXIS_LEN)

  const hasVector = mag > 1e-4
  const angle = Math.atan2(tip.y - origin.y, tip.x - origin.x)
  const headLen = 9
  const head1 = {
    x: tip.x - headLen * Math.cos(angle - Math.PI / 7),
    y: tip.y - headLen * Math.sin(angle - Math.PI / 7),
  }
  const head2 = {
    x: tip.x - headLen * Math.cos(angle + Math.PI / 7),
    y: tip.y - headLen * Math.sin(angle + Math.PI / 7),
  }

  const fmt = (raw: string) => (raw.trim() === '' ? '?' : raw.trim())

  return (
    <div className="bg-vex-bg border border-vex-border rounded-xl flex flex-col items-center justify-center gap-2 p-3">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[200px]">
        <line x1={origin.x} y1={origin.y} x2={xEnd.x} y2={xEnd.y} className="stroke-vex-red/50" strokeWidth={1.5} />
        <line x1={origin.x} y1={origin.y} x2={yEnd.x} y2={yEnd.y} className="stroke-vex-green/50" strokeWidth={1.5} />
        <line x1={origin.x} y1={origin.y} x2={zEnd.x} y2={zEnd.y} className="stroke-vex-blue/50" strokeWidth={1.5} />
        <text x={xEnd.x + 4} y={xEnd.y + 4} className="fill-vex-red text-[9px] font-mono">X</text>
        <text x={yEnd.x - 3} y={yEnd.y - 5} className="fill-vex-green text-[9px] font-mono">Y</text>
        <text x={zEnd.x - 11} y={zEnd.y + 4} className="fill-vex-blue text-[9px] font-mono">Z</text>

        <circle cx={origin.x} cy={origin.y} r={2.5} className="fill-vex-muted" />

        {hasVector && (
          <>
            <line
              x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y}
              className="stroke-vex-orange" strokeWidth={2.5} strokeLinecap="round"
            />
            <polygon
              points={`${tip.x},${tip.y} ${head1.x},${head1.y} ${head2.x},${head2.y}`}
              className="fill-vex-orange"
            />
          </>
        )}
      </svg>
      <div className="text-vex-muted text-xs font-mono">
        {t('fill.vectorLabel')} {`{${fmt(xRaw)}, ${fmt(yRaw)}, ${fmt(zRaw)}}`}
      </div>
    </div>
  )
}
