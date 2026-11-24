import type { PointShape } from '../exercises/types'

// Ready-to-run showcases for the playground. Each one is a real production
// technique in miniature — the point isn't the syntax, it's "oh, THAT's what
// you use VEX for". Every recipe runs as-is in the sandbox interpreter.
export interface Recipe {
  id: string
  icon: string
  shape: PointShape
  count: number
  /** Drives the viewer's translucent shell — on for surface/normal recipes. */
  surface?: boolean
  title: { en: string; fr: string }
  /** One line: the production technique this stands for. */
  blurb: { en: string; fr: string }
  code: string
}

export const RECIPES: Recipe[] = [
  {
    id: 'gradient',
    icon: '🌅',
    shape: 'sphere',
    count: 300,
    title: { en: 'Height gradient', fr: 'Dégradé de hauteur' },
    blurb: {
      en: 'Turn a position into a colour. The basis of every mask and ramp you will ever write.',
      fr: 'Transformer une position en couleur. La base de tous les masques et rampes que tu écriras.',
    },
    code: `// Map height into 0..1, then blend two colours through it
float t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);
@Cd = lerp({0.1, 0.2, 0.7}, {1.0, 0.6, 0.1}, t);
`,
  },
  {
    id: 'noise-displace',
    icon: '🪨',
    shape: 'sphere',
    count: 400,
    title: { en: 'Organic displacement', fr: 'Déplacement organique' },
    blurb: {
      en: 'Push points along their normal by noise — how rocks, asteroids and skin detail are made.',
      fr: 'Pousser les points le long de leur normale avec du bruit — comment on fabrique rochers, astéroïdes et détails de peau.',
    },
    code: `// noise() is smooth, so neighbours move together: organic, not spiky
float n = noise(@P * 2.5);
@P += @N * (n - 0.5) * 0.5;
@Cd = set(n, n * 0.5, 1.0 - n);
`,
  },
  {
    id: 'wave',
    icon: '🌊',
    shape: 'grid',
    count: 900,
    title: { en: 'Animated wave', fr: 'Vague animée' },
    blurb: {
      en: 'Mix space and time in one phase — press ▶ and it moves. All wave/ripple FX start here.',
      fr: "Mélanger espace et temps dans une phase — appuie sur ▶ et ça bouge. Tous les effets de vague partent de là.",
    },
    code: `// Phase = space (@P.x) + time (@Time) -> a wave that travels
@P.z += sin(@P.x * 3.0 + @Time * 2.0) * 0.25;

float t = fit(@P.z, -0.25, 0.25, 0.0, 1.0);
@Cd = lerp({0.1, 0.3, 0.8}, {1.0, 0.9, 0.3}, t);
`,
  },
  {
    id: 'checker',
    icon: '🏁',
    shape: 'grid',
    count: 900,
    title: { en: 'Checkerboard', fr: 'Damier' },
    blurb: {
      en: 'int() + modulo slices space into tiles — the root of every procedural texture pattern.',
      fr: "int() + modulo découpent l'espace en tuiles — la racine de tout motif procédural.",
    },
    code: `// Quantise X and Y into bands, then XOR them
int sx = int(@P.x * 4.0 + 10.0) % 2;
int sy = int(@P.y * 4.0 + 10.0) % 2;

if ((sx + sy) % 2 == 0) {
    @Cd = {0.95, 0.9, 0.8};
} else {
    @Cd = {0.1, 0.08, 0.15};
}
`,
  },
  {
    id: 'rings',
    icon: '🎯',
    shape: 'grid',
    count: 900,
    title: { en: 'Concentric rings', fr: 'Anneaux concentriques' },
    blurb: {
      en: 'Use distance as the coordinate instead of an axis — radial falloffs, shockwaves, ripples.',
      fr: "Utiliser la distance comme coordonnée plutôt qu'un axe — dégradés radiaux, ondes de choc.",
    },
    code: `// length(@P) is the distance from the centre: a radial coordinate
float d = length(@P);

if (int(d * 6.0) % 2 == 0) {
    @Cd = {0.9, 0.7, 0.1};
} else {
    @Cd = {0.1, 0.15, 0.4};
}
`,
  },
  {
    id: 'helix',
    icon: '🧬',
    shape: 'random',
    count: 250,
    title: { en: 'Build a helix', fr: 'Construire une hélice' },
    blurb: {
      en: 'VEX can place points, not just colour them — cos/sin rebuild the shape from scratch.',
      fr: 'VEX peut placer les points, pas seulement les colorer — cos/sin reconstruisent la forme de zéro.',
    },
    code: `// Rebuild every position from its index: pure procedural modelling
float t = @ptnum / float(@numpt);
float a = t * 8.0 * 3.14159;

@P.x = cos(a) * 1.2;
@P.z = sin(a) * 1.2;
@P.y = t * 2.5 - 1.25;

@Cd = lerp({1.0, 0.3, 0.1}, {0.2, 0.6, 1.0}, t);
`,
  },
  {
    id: 'lighting',
    icon: '💡',
    shape: 'sphere',
    count: 400,
    surface: true,
    title: { en: 'Fake lighting with dot()', fr: 'Éclairage fake avec dot()' },
    blurb: {
      en: 'dot(normal, light) IS diffuse shading — the same maths every renderer runs, in 3 lines.',
      fr: "dot(normale, lumière) EST l'ombrage diffus — les maths de tout moteur de rendu, en 3 lignes.",
    },
    code: `// How aligned is each normal with the light direction?
vector light = normalize({0.5, 1.0, 0.3});
float d = dot(@N, light);

float shade = fit(d, -1.0, 1.0, 0.05, 1.0);
@Cd = set(shade, shade * 0.95, shade * 0.85);
`,
  },
  {
    id: 'slider',
    icon: '🎚️',
    shape: 'sphere',
    count: 400,
    title: { en: 'Artist-driven slider', fr: 'Slider piloté par l\'artiste' },
    blurb: {
      en: 'chf() turns a hardcoded number into a knob — this is how a wrangle becomes a reusable tool.',
      fr: "chf() transforme un nombre en dur en bouton — c'est ainsi qu'un wrangle devient un outil réutilisable.",
    },
    code: `// A slider named "displace" appears below — drag it
float amount = chf("displace");

float n = noise(@P * 3.0);
@P += @N * (n - 0.5) * amount * 2.0;
@Cd = set(n, 0.5, 1.0 - n);
`,
  },
  {
    id: 'fbm',
    icon: '🏔️',
    shape: 'sphere',
    count: 600,
    title: { en: 'FBM planet', fr: 'Planète FBM' },
    blurb: {
      en: 'Stack noise octaves in a loop and you get terrain. This is the real thing, not a toy.',
      fr: 'Empile des octaves de bruit dans une boucle et tu obtiens du terrain. Le vrai truc, pas un jouet.',
    },
    code: `// Fractal Brownian Motion: each octave is finer and weaker
float fbm = 0.0;
float amp = 0.5;
vector p = @P;

for (int i = 0; i < 5; i++) {
    fbm += noise(p) * amp;
    p   *= 2.1;
    amp *= 0.5;
}

// Displace outward, then colour by altitude + latitude
@P += normalize(@P) * (fbm - 0.5) * 0.55;
float lat = abs(@P.y / length(@P));

if (lat > 0.78) {
    @Cd = {0.92, 0.95, 1.0};            // ice caps
} else if (fbm > 0.52) {
    @Cd = lerp({0.35, 0.3, 0.25}, {0.7, 0.62, 0.5}, fbm);  // rock
} else {
    @Cd = lerp({0.05, 0.25, 0.55}, {0.15, 0.5, 0.3}, fbm); // sea / land
}
`,
  },
]
