// ─── VEX function signatures — used to power editor signature help & autocomplete ──

export interface ParamInfo {
  label: string
  doc: string
}

export interface FnSignature {
  label: string       // full signature, e.g. "rand(seed: float) → float"
  doc: string          // short description shown above the parameter list
  params: ParamInfo[]
}

export const VEX_SIGNATURES: Record<string, FnSignature> = {
  abs:    { label: 'abs(x: float) → float', doc: 'Absolute value.', params: [{ label: 'x: float', doc: 'Input value.' }] },
  sqrt:   { label: 'sqrt(x: float) → float', doc: 'Square root.', params: [{ label: 'x: float', doc: 'Must be ≥ 0.' }] },
  sin:    { label: 'sin(x: float) → float', doc: 'Sine, x in radians. Oscillates -1..1.', params: [{ label: 'x: float', doc: 'Angle in radians.' }] },
  cos:    { label: 'cos(x: float) → float', doc: 'Cosine, x in radians. Oscillates -1..1.', params: [{ label: 'x: float', doc: 'Angle in radians.' }] },
  tan:    { label: 'tan(x: float) → float', doc: 'Tangent, x in radians.', params: [{ label: 'x: float', doc: 'Angle in radians.' }] },
  asin:   { label: 'asin(x: float) → float', doc: 'Arc sine, returns radians.', params: [{ label: 'x: float', doc: 'Range -1..1.' }] },
  acos:   { label: 'acos(x: float) → float', doc: 'Arc cosine, returns radians.', params: [{ label: 'x: float', doc: 'Range -1..1.' }] },
  atan:   { label: 'atan(x: float) → float', doc: 'Arc tangent, returns radians.', params: [{ label: 'x: float', doc: 'Input ratio.' }] },
  atan2:  { label: 'atan2(y: float, x: float) → float', doc: 'Angle of vector (x,y) from +X axis.', params: [{ label: 'y: float', doc: 'Y component.' }, { label: 'x: float', doc: 'X component.' }] },
  exp:    { label: 'exp(x: float) → float', doc: 'e raised to the power x.', params: [{ label: 'x: float', doc: 'Exponent.' }] },
  log:    { label: 'log(x: float) → float', doc: 'Natural logarithm.', params: [{ label: 'x: float', doc: 'Must be > 0.' }] },
  pow:    { label: 'pow(x: float, y: float) → float', doc: 'x raised to the power y.', params: [{ label: 'x: float', doc: 'Base.' }, { label: 'y: float', doc: 'Exponent.' }] },
  floor:  { label: 'floor(x: float) → int', doc: 'Round down to nearest integer.', params: [{ label: 'x: float', doc: 'Input value.' }] },
  ceil:   { label: 'ceil(x: float) → int', doc: 'Round up to nearest integer.', params: [{ label: 'x: float', doc: 'Input value.' }] },
  round:  { label: 'round(x: float) → int', doc: 'Round to nearest integer.', params: [{ label: 'x: float', doc: 'Input value.' }] },
  sign:   { label: 'sign(x: float) → float', doc: 'Returns -1, 0, or 1.', params: [{ label: 'x: float', doc: 'Input value.' }] },

  max: {
    label: 'max(a: float|vector, b: float|vector) → float|vector',
    doc: 'Component-wise maximum.',
    params: [{ label: 'a: float|vector', doc: 'First value.' }, { label: 'b: float|vector', doc: 'Second value.' }],
  },
  min: {
    label: 'min(a: float|vector, b: float|vector) → float|vector',
    doc: 'Component-wise minimum.',
    params: [{ label: 'a: float|vector', doc: 'First value.' }, { label: 'b: float|vector', doc: 'Second value.' }],
  },
  clamp: {
    label: 'clamp(x: float|vector, min: float, max: float) → float|vector',
    doc: 'Restricts x to the [min, max] range.',
    params: [
      { label: 'x: float|vector', doc: 'Value to clamp.' },
      { label: 'min: float', doc: 'Lower bound.' },
      { label: 'max: float', doc: 'Upper bound.' },
    ],
  },
  fit: {
    label: 'fit(x: float, omin: float, omax: float, nmin: float, nmax: float) → float',
    doc: 'Remaps x from [omin, omax] to [nmin, nmax].',
    params: [
      { label: 'x: float', doc: 'Value to remap.' },
      { label: 'omin: float', doc: 'Old range minimum.' },
      { label: 'omax: float', doc: 'Old range maximum.' },
      { label: 'nmin: float', doc: 'New range minimum.' },
      { label: 'nmax: float', doc: 'New range maximum.' },
    ],
  },
  fit01: {
    label: 'fit01(x: float, nmin: float, nmax: float) → float',
    doc: 'Remaps x from [0, 1] to [nmin, nmax].',
    params: [
      { label: 'x: float', doc: 'Value in 0..1.' },
      { label: 'nmin: float', doc: 'New range minimum.' },
      { label: 'nmax: float', doc: 'New range maximum.' },
    ],
  },
  fit10: {
    label: 'fit10(x: float, nmin: float, nmax: float) → float',
    doc: 'Remaps x from [1, 0] (inverted) to [nmin, nmax].',
    params: [
      { label: 'x: float', doc: 'Value in 0..1.' },
      { label: 'nmin: float', doc: 'New range minimum.' },
      { label: 'nmax: float', doc: 'New range maximum.' },
    ],
  },
  lerp: {
    label: 'lerp(a: float|vector, b: float|vector, t: float) → float|vector',
    doc: 'Interpolates between a (t=0) and b (t=1).',
    params: [
      { label: 'a: float|vector', doc: 'Start value.' },
      { label: 'b: float|vector', doc: 'End value.' },
      { label: 't: float', doc: 'Blend factor, usually 0..1.' },
    ],
  },
  smooth: {
    label: 'smooth(x: float, lo: float, hi: float) → float',
    doc: 'Smoothstep interpolation between lo and hi.',
    params: [
      { label: 'x: float', doc: 'Input value.' },
      { label: 'lo: float', doc: 'Lower edge.' },
      { label: 'hi: float', doc: 'Upper edge.' },
    ],
  },

  length: { label: 'length(v: vector) → float', doc: 'Magnitude of v: sqrt(x²+y²+z²).', params: [{ label: 'v: vector', doc: 'Input vector.' }] },
  normalize: { label: 'normalize(v: vector) → vector', doc: 'Returns v scaled to length 1.', params: [{ label: 'v: vector', doc: 'Input vector.' }] },
  dot: {
    label: 'dot(a: vector, b: vector) → float',
    doc: 'Dot product — measures alignment (-1..1 for unit vectors).',
    params: [{ label: 'a: vector', doc: 'First vector.' }, { label: 'b: vector', doc: 'Second vector.' }],
  },
  cross: {
    label: 'cross(a: vector, b: vector) → vector',
    doc: 'Cross product — vector perpendicular to both a and b.',
    params: [{ label: 'a: vector', doc: 'First vector.' }, { label: 'b: vector', doc: 'Second vector.' }],
  },
  distance: {
    label: 'distance(a: vector, b: vector) → float',
    doc: 'Distance between two points.',
    params: [{ label: 'a: vector', doc: 'First point.' }, { label: 'b: vector', doc: 'Second point.' }],
  },
  set: {
    label: 'set(x: float, y: float, z: float) → vector',
    doc: 'Builds a vector from 3 floats — equivalent to {x, y, z}.',
    params: [
      { label: 'x: float', doc: 'X component.' },
      { label: 'y: float', doc: 'Y component.' },
      { label: 'z: float', doc: 'Z component.' },
    ],
  },
  getcomp: {
    label: 'getcomp(v: vector, i: int) → float',
    doc: 'Reads component i (0=x, 1=y, 2=z) of v.',
    params: [{ label: 'v: vector', doc: 'Input vector.' }, { label: 'i: int', doc: 'Component index 0, 1, or 2.' }],
  },
  setcomp: {
    label: 'setcomp(v: vector, i: int, val: float) → vector',
    doc: 'Returns v with component i set to val.',
    params: [
      { label: 'v: vector', doc: 'Input vector.' },
      { label: 'i: int', doc: 'Component index 0, 1, or 2.' },
      { label: 'val: float', doc: 'New value for that component.' },
    ],
  },

  rand: {
    label: 'rand(seed: float) → float',
    doc: 'Deterministic pseudo-random float 0..1. Same seed always gives the same result.',
    params: [{ label: 'seed: float', doc: 'Usually @ptnum, or @ptnum * salt for independent channels.' }],
  },
  noise: {
    label: 'noise(pos: vector) → float',
    doc: 'Smooth pseudo-random float 0..1 — nearby positions give similar values.',
    params: [{ label: 'pos: vector', doc: 'Usually @P, optionally scaled to control frequency.' }],
  },

  itoa: { label: 'itoa(x: int) → string', doc: 'Converts an int to a string.', params: [{ label: 'x: int', doc: 'Integer to convert.' }] },
  atoi: { label: 'atoi(s: string) → int', doc: 'Parses a string as an int.', params: [{ label: 's: string', doc: 'String to parse.' }] },
  ftoa: {
    label: 'ftoa(x: float, decimals: int) → string',
    doc: 'Converts a float to a string with fixed decimals.',
    params: [{ label: 'x: float', doc: 'Float to convert.' }, { label: 'decimals: int', doc: 'Number of decimal places.' }],
  },
  printf: {
    label: 'printf(fmt: string, ...args) → void',
    doc: 'Prints formatted text to the console. %d=int, %f=float, %v=vector, %s=string.',
    params: [{ label: 'fmt: string', doc: 'Format string, e.g. "%d points".' }, { label: '...args', doc: 'Values matching the format specifiers.' }],
  },
}

export const VEX_FUNCTION_NAMES = Object.keys(VEX_SIGNATURES)
