// ─── VEX Built-in Functions ───────────────────────────────────────────────────

import { VexValue, mkFloat, mkInt, mkVec, mkStr, toFloat, toVec } from './types'

type BuiltinFn = (args: VexValue[]) => VexValue

function num(v: VexValue) { return toFloat(v) }

export const BUILTINS: Record<string, BuiltinFn> = {
  // ── Math ──────────────────────────────────────────────────────────────────
  abs:   ([a]) => mkFloat(Math.abs(num(a))),
  sqrt:  ([a]) => mkFloat(Math.sqrt(Math.max(0, num(a)))),
  sin:   ([a]) => mkFloat(Math.sin(num(a))),
  cos:   ([a]) => mkFloat(Math.cos(num(a))),
  tan:   ([a]) => mkFloat(Math.tan(num(a))),
  asin:  ([a]) => mkFloat(Math.asin(num(a))),
  acos:  ([a]) => mkFloat(Math.acos(num(a))),
  atan:  ([a]) => mkFloat(Math.atan(num(a))),
  atan2: ([a, b]) => mkFloat(Math.atan2(num(a), num(b))),
  exp:   ([a]) => mkFloat(Math.exp(num(a))),
  log:   ([a]) => mkFloat(Math.log(num(a))),
  pow:   ([a, b]) => mkFloat(Math.pow(num(a), num(b))),
  floor: ([a]) => mkInt(Math.floor(num(a))),
  ceil:  ([a]) => mkInt(Math.ceil(num(a))),
  round: ([a]) => mkInt(Math.round(num(a))),
  sign:  ([a]) => mkFloat(Math.sign(num(a))),

  // ── Comparison ────────────────────────────────────────────────────────────
  max: ([a, b]) => {
    if (a?.kind === 'vector' || b?.kind === 'vector') {
      const av = toVec(a), bv = toVec(b)
      return mkVec(Math.max(av.x, bv.x), Math.max(av.y, bv.y), Math.max(av.z, bv.z))
    }
    return mkFloat(Math.max(num(a), num(b)))
  },
  min: ([a, b]) => {
    if (a?.kind === 'vector' || b?.kind === 'vector') {
      const av = toVec(a), bv = toVec(b)
      return mkVec(Math.min(av.x, bv.x), Math.min(av.y, bv.y), Math.min(av.z, bv.z))
    }
    return mkFloat(Math.min(num(a), num(b)))
  },
  clamp: ([x, lo, hi]) => {
    if (x?.kind === 'vector') {
      const v = toVec(x), mn = num(lo), mx = num(hi)
      return mkVec(Math.min(Math.max(v.x, mn), mx), Math.min(Math.max(v.y, mn), mx), Math.min(Math.max(v.z, mn), mx))
    }
    return mkFloat(Math.min(Math.max(num(x), num(lo)), num(hi)))
  },

  // ── Remap ─────────────────────────────────────────────────────────────────
  fit: ([x, omin, omax, nmin, nmax]) => {
    const ox = num(x), olo = num(omin), ohi = num(omax), nlo = num(nmin), nhi = num(nmax)
    const t = ohi === olo ? 0 : (ox - olo) / (ohi - olo)
    return mkFloat(nlo + t * (nhi - nlo))
  },
  fit01: ([x, nmin, nmax]) => {
    const t = Math.min(Math.max(num(x), 0), 1)
    return mkFloat(num(nmin) + t * (num(nmax) - num(nmin)))
  },
  fit10: ([x, nmin, nmax]) => {
    const t = 1 - Math.min(Math.max(num(x), 0), 1)
    return mkFloat(num(nmin) + t * (num(nmax) - num(nmin)))
  },
  lerp: ([a, b, t]) => {
    const ta = num(t)
    if (a?.kind === 'vector' || b?.kind === 'vector') {
      const av = toVec(a), bv = toVec(b)
      return mkVec(av.x + (bv.x - av.x) * ta, av.y + (bv.y - av.y) * ta, av.z + (bv.z - av.z) * ta)
    }
    return mkFloat(num(a) + (num(b) - num(a)) * ta)
  },
  smooth: ([x, lo, hi]) => {
    const v = Math.min(Math.max((num(x) - num(lo)) / (num(hi) - num(lo)), 0), 1)
    return mkFloat(v * v * (3 - 2 * v))
  },
  smoothstep: ([lo, hi, x]) => {
    const v = Math.min(Math.max((num(x) - num(lo)) / (num(hi) - num(lo)), 0), 1)
    return mkFloat(v * v * (3 - 2 * v))
  },

  // ── Vector ────────────────────────────────────────────────────────────────
  length: ([v]) => {
    const a = toVec(v)
    return mkFloat(Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z))
  },
  normalize: ([v]) => {
    const a = toVec(v)
    const len = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
    if (len < 1e-10) return mkVec(0, 0, 0)
    return mkVec(a.x / len, a.y / len, a.z / len)
  },
  dot: ([a, b]) => {
    const av = toVec(a), bv = toVec(b)
    return mkFloat(av.x * bv.x + av.y * bv.y + av.z * bv.z)
  },
  cross: ([a, b]) => {
    const av = toVec(a), bv = toVec(b)
    return mkVec(
      av.y * bv.z - av.z * bv.y,
      av.z * bv.x - av.x * bv.z,
      av.x * bv.y - av.y * bv.x,
    )
  },
  distance: ([a, b]) => {
    const av = toVec(a), bv = toVec(b)
    const dx = av.x - bv.x, dy = av.y - bv.y, dz = av.z - bv.z
    return mkFloat(Math.sqrt(dx * dx + dy * dy + dz * dz))
  },
  set: (args) => {
    if (args.length === 1) { const v = num(args[0]); return mkVec(v, v, v) }
    if (args.length >= 3) return mkVec(num(args[0]), num(args[1]), num(args[2]))
    return mkVec(0, 0, 0)
  },
  getcomp: ([v, i]) => {
    const vec = toVec(v), idx = Math.trunc(num(i))
    return mkFloat(idx === 0 ? vec.x : idx === 1 ? vec.y : vec.z)
  },
  setcomp: ([v, i, val]) => {
    const vec = toVec(v), idx = Math.trunc(num(i)), nv = num(val)
    if (idx === 0) return mkVec(nv, vec.y, vec.z)
    if (idx === 1) return mkVec(vec.x, nv, vec.z)
    return mkVec(vec.x, vec.y, nv)
  },

  // ── Random / Noise ────────────────────────────────────────────────────────
  rand: ([seed]) => {
    const s = (num(seed ?? mkFloat(0)) * 9301 + 49297) % 233280
    return mkFloat(s / 233280)
  },
  noise: ([pos]) => {
    // Simple value noise approximation
    const v = toVec(pos ?? mkVec(0, 0, 0))
    const hash = (n: number) => {
      n = Math.sin(n) * 43758.5453
      return n - Math.floor(n)
    }
    const ix = Math.floor(v.x), iy = Math.floor(v.y), iz = Math.floor(v.z)
    const fx = v.x - ix, fy = v.y - iy, fz = v.z - iz
    const smooth = (t: number) => t * t * (3 - 2 * t)
    const ux = smooth(fx), uy = smooth(fy), uz = smooth(fz)
    const n000 = hash(ix + iy * 57 + iz * 113)
    const n100 = hash((ix + 1) + iy * 57 + iz * 113)
    const n010 = hash(ix + (iy + 1) * 57 + iz * 113)
    const n110 = hash((ix + 1) + (iy + 1) * 57 + iz * 113)
    const n001 = hash(ix + iy * 57 + (iz + 1) * 113)
    const n101 = hash((ix + 1) + iy * 57 + (iz + 1) * 113)
    const n011 = hash(ix + (iy + 1) * 57 + (iz + 1) * 113)
    const n111 = hash((ix + 1) + (iy + 1) * 57 + (iz + 1) * 113)
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    return mkFloat(lerp(lerp(lerp(n000, n100, ux), lerp(n010, n110, ux), uy),
                        lerp(lerp(n001, n101, ux), lerp(n011, n111, ux), uy), uz))
  },
  // ── Type casts ────────────────────────────────────────────────────────────
  int:    ([a]) => mkInt(num(a)),
  float:  ([a]) => mkFloat(num(a)),
  vector: ([a]) => toVec(a),

  // ── String ────────────────────────────────────────────────────────────────
  itoa: ([x]) => mkStr(String(Math.trunc(num(x)))),
  atoi: ([s]) => mkInt(parseInt(s?.kind === 'string' ? s.value : '0', 10) || 0),
  ftoa: ([x, d]) => mkStr(num(x).toFixed(d ? Math.trunc(num(d)) : 3)),

  // ── printf (collect into output) ──────────────────────────────────────────
  printf: (args) => {
    if (args.length === 0) return { kind: 'void' }
    const fmt = args[0]?.kind === 'string' ? args[0].value : ''
    let i = 1, result = ''
    for (let ci = 0; ci < fmt.length; ci++) {
      if (fmt[ci] === '%' && ci + 1 < fmt.length) {
        const spec = fmt[ci + 1]
        const arg = args[i++]
        ci++
        if (spec === 'd' || spec === 'i') result += arg ? Math.trunc(toFloat(arg)) : '0'
        else if (spec === 'f') result += arg ? toFloat(arg).toFixed(3) : '0.000'
        else if (spec === 'g') result += arg ? toFloat(arg) : '0'
        else if (spec === 's') result += arg?.kind === 'string' ? arg.value : String(arg)
        else if (spec === 'v') {
          const v = arg ? toVec(arg) : { x: 0, y: 0, z: 0 }
          result += `{${v.x.toFixed(3)}, ${v.y.toFixed(3)}, ${v.z.toFixed(3)}}`
        } else { result += '%' + spec }
      } else {
        result += fmt[ci]
      }
    }
    // stash output on globalThis for the evaluator to collect
    ;(globalThis as any).__vex_output__ = ((globalThis as any).__vex_output__ ?? '') + result + '\n'
    return { kind: 'void' }
  },
}
