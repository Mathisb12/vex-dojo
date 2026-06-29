import type { Module, Lesson, Exercise, LearnCard } from './types'
import { FR_MODULES, FR_LESSONS, FR_LEARN_CARDS, FR_EXERCISES } from './curriculum.fr'

export const CURRICULUM: Module[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 1 — VEX Basics
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'basics',
    title: 'VEX Basics',
    icon: '⚡',
    tier: 1,
    lessons: [
      // ── Lesson 1: What is VEX ──────────────────────────────────────────────
      {
        id: 'intro',
        title: 'What is VEX?',
        icon: '📖',
        description: 'Understand where VEX fits in Houdini',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-intro-1',
            title: 'What is VEX?',
            body: 'VEX is the **expression language at the heart of Houdini**. It lets you write custom logic that runs directly on geometry — changing positions, colors, normals, and any other attribute you can imagine.\n\nVEX is **C-like** in syntax: curly braces, semicolons, typed variables. If you\'ve written C, C++, or GLSL, you\'ll feel at home.',
            codeExample: '// This VEX code runs once per point\n// and paints every point orange\n@Cd = {1.0, 0.4, 0.0};',
            keyPoints: [
              'VEX = Houdini\'s built-in expression language',
              'C-like syntax (braces, semicolons, types)',
              'Runs once per point by default in a wrangle',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-intro-2',
            title: 'The Geometry Wrangle',
            body: 'In Houdini, you write VEX inside a **Geometry Wrangle** (Attribute Wrangle) node. Its **Run Over** setting decides which type of component your code loops over: Points (the default), Primitives, Vertices, or Detail.\n\nThat changes what each iteration represents — but most built-ins stay available no matter which mode you pick, they just adapt their meaning:\n- `@ptnum` always works: looping points it\'s the current point; looping vertices it\'s "the point that vertex is wired to"; looping primitives it\'s "the point of that primitive\'s first vertex"\n- The **totals** (`@numpt`, `@numprim`, `@numvtx`) stay readable too — you can check `@numpt` from inside a Primitive wrangle just fine\n\n**Detail** mode runs your code only **once for the whole geometry** — ideal for a value that describes the whole setup rather than any single point (a global counter, a bounding-box size). Storing that on every point instead would waste memory for no benefit.\n\nOne thing that *does* change with Run Over: where a brand-new attribute gets created. Write `f@mask = 1;` in Points mode and `mask` becomes a point attribute; the exact same line in Primitives mode creates a primitive attribute instead.',
            codeExample: '// Run Over = Points (this lesson)\n// Point 0 → @ptnum is 0\n// Point 1 → @ptnum is 1\n// ...\n// Last point → @ptnum is @numpt - 1',
            keyPoints: [
              'Run Over picks which component type you loop over: Points, Primitives, Vertices, Detail',
              '@ptnum/@primnum/@vtxnum stay available in every mode — they just describe a different relationship',
              '@numpt/@numprim/@numvtx (the totals) are always readable, regardless of mode',
              'Detail mode runs once for the whole geometry — for global, not-per-point values',
              'A new attribute (f@name = ...) is created on whichever component type you\'re currently looping over',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'intro-1',
            title: 'What is VEX, fundamentally?',
            explanation: 'VEX is Houdini\'s built-in **expression language** for processing geometry — it isn\'t a separate plugin, a file format, or a shading-only tool. It runs your code directly on points, primitives, vertices, or the whole detail.',
            choices: [
              { text: 'A built-in expression language for processing geometry', correct: true },
              { text: 'A third-party plugin you install into Houdini', correct: false },
              { text: 'A 3D file format for exporting geometry', correct: false },
              { text: 'A renderer used only for shading, not geometry', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'intro-2',
            title: 'With Run Over set to its default, your wrangle code runs...',
            explanation: 'The default **Run Over** mode is **Points** — the code runs **once per point**. `@ptnum` is the index of the current point, `@numpt` is the total. (Other Run Over modes loop over primitives, vertices, or just once for the whole detail — more on that next.)',
            choices: [
              { text: 'Once per point', correct: true },
              { text: 'Once for the whole geometry', correct: false },
              { text: 'Once per frame', correct: false },
              { text: 'Once per polygon face', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'intro-3',
            title: 'Which built-in gives you the current point\'s index?',
            explanation: '`@ptnum` is the index of the point currently being processed. It starts at 0 and goes up to `@numpt - 1`.',
            choices: [
              { text: '@ptnum', correct: true },
              { text: '@index', correct: false },
              { text: '@id', correct: false },
              { text: 'pointnum()', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'intro-4',
            title: 'A wrangle runs on a grid of 50 points. What is `@numpt` for every single point?',
            explanation: '`@numpt` is the same for every point — the total count never changes during the loop. Only `@ptnum` changes, from 0 to 49.',
            choices: [
              { text: '50', correct: true },
              { text: '49', correct: false },
              { text: '0', correct: false },
              { text: 'It varies per point', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'intro-5',
            title: 'You set a wrangle\'s Run Over to Primitives. What happens to `@ptnum` and `@numpt`?',
            explanation: '`@ptnum` and `@numpt` stay fully available — they don\'t disappear just because you switched modes. `@ptnum` now means "the point of this primitive\'s first vertex" instead of "the current point," and `@numpt` still tells you the geometry\'s total point count, exactly as before.',
            choices: [
              { text: 'They\'re still readable — @ptnum adapts its meaning, @numpt stays the same total', correct: true },
              { text: 'Both become completely unavailable until you switch back to Points', correct: false },
              { text: 'The code now runs once per frame instead of once per cook', correct: false },
              { text: 'VEX syntax itself changes to a primitive-only dialect', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'intro-6',
            title: 'You write `f@mask = 1;` while Run Over is set to Primitives. What happens?',
            explanation: 'Run Over doesn\'t just change which loop runs — it changes WHERE new data gets stored. The new attribute is created on whatever component type the wrangle is currently looping over: primitives here. The exact same line of code in Points mode would create a point attribute instead.',
            choices: [
              { text: '"mask" is created as a primitive attribute, since Run Over is Primitives', correct: true },
              { text: '"mask" is always created as a point attribute, no matter the Run Over mode', correct: false },
              { text: '"mask" is created on every point AND every primitive at once', correct: false },
              { text: 'This is an error — you can\'t create new attributes in Primitive mode', correct: false },
            ],
            xp: 10,
          },
        ],
      },

      // ── Lesson 2: Variables & Types ────────────────────────────────────────
      {
        id: 'variables',
        title: 'Numbers & Text',
        icon: '🔢',
        description: 'Declare int, float and string variables',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-var-1',
            title: 'The basic types',
            body: 'VEX requires you to declare the **type** of every variable. Here are the three you\'ll use for plain values:\n\n- `int` — whole numbers: `0`, `-3`, `42`\n- `float` — decimal numbers: `0.5`, `3.14`, `-1.0`\n- `string` — text: `"hello"`\n\nThe type keyword always comes **before** the variable name. (There\'s a fourth type, `vector`, for 3D values like positions and colors — it gets its own lesson right after this one.)',
            codeExample: 'int    count = 10;\nfloat  scale = 2.5;\nstring name  = "my_point";',
            keyPoints: [
              'Always declare the type: int, float, string (vector is next lesson)',
              'The type keyword comes before the variable name',
              'Every statement ends with a semicolon ;',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'var-1',
            title: 'Which declaration is valid VEX?',
            explanation: 'VEX requires an explicit type keyword before the variable name: `float myVar = 3.14;`',
            choices: [
              { text: 'float myVar = 3.14;', correct: true },
              { text: 'var myVar = 3.14;', correct: false },
              { text: 'myVar: float = 3.14;', correct: false },
              { text: 'let myVar = 3.14;', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'var-2',
            title: 'Declare an integer',
            codeLines: [
              '// Declare an integer named "count" with value 42',
              '___ count = ___;',
            ],
            answers: ['int', '42'],
            hints: ['Type keyword for whole numbers', 'The value'],
            explanation: '`int count = 42;` — the type keyword `int` comes first, then the name, then the value.',
            xp: 15,
          },
          {
            kind: 'fill',
            id: 'var-8',
            title: 'Declare a string',
            codeLines: [
              '// Declare a string named "label" with the text "tip"',
              '___ label = ___;',
            ],
            answers: ['string', '"tip"'],
            hints: ['Type keyword for text', 'The text value — don\'t forget the double quotes'],
            explanation: '`string label = "tip";` — strings hold text and must be wrapped in double quotes `"..."`.',
            xp: 15,
          },
          {
            kind: 'fill',
            id: 'var-5',
            title: 'Declare a float',
            codeLines: [
              '// Declare a float named "speed" with value 2.5',
              '___ speed = ___;',
            ],
            answers: ['float', '2.5'],
            hints: ['Type keyword for decimal numbers', 'The value'],
            explanation: '`float speed = 2.5;` — `float` is the type for decimal numbers, just like `int` is for whole numbers.',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'var-11',
            title: 'What does `int x = 3.9;` actually store in `x`?',
            explanation: 'Assigning a float to an `int` truncates (cuts off) the decimal part — it does not round. `int x = 3.9;` gives `x = 3`, and `int x = -3.9;` gives `x = -3`.',
            choices: [
              { text: '3 — the decimal part is truncated', correct: true },
              { text: '4 — it rounds to the nearest int', correct: false },
              { text: '3.9 — int can hold decimals too', correct: false },
              { text: 'A compile error', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'var-7',
            title: 'Save built-in values into your own variables',
            codeLines: [
              '// Copy the built-in point index and total into local variables',
              'int idx   = ___;',
              'int total = ___;',
            ],
            answers: ['@ptnum', '@numpt'],
            hints: ['Current point index', 'Total point count'],
            explanation: '`int idx = @ptnum;` copies the value of `@ptnum` into a plain local variable you named yourself. Local variables (no `@`) only exist while the wrangle runs on that point — unlike attributes, they\'re never saved to the geometry.',
            xp: 15,
          },
        ],
      },

      // ── Lesson 3: Vectors ───────────────────────────────────────────────────
      {
        id: 'vector-intro',
        title: 'Vectors',
        icon: '📐',
        description: 'Declare and manipulate vector values',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-var-2',
            title: 'Vectors are everywhere',
            body: 'In 3D, almost everything is a vector: positions, colors, directions, normals.\n\nA `vector` packs **three floats** together: `{x, y, z}`. You can access each component with a **dot**: `v.x`, `v.y`, `v.z`.\n\nColors use the same type — red is `.x`, green is `.y`, blue is `.z`.\n\nThere\'s a second way to build a vector: the `set(x, y, z)` function. It does exactly the same thing as `{x, y, z}` — pick whichever reads better in context.',
            codeExample: 'vector pos = {1.0, 2.0, 3.0};\nfloat  h   = pos.y;   // h = 2.0\n\nvector red = {1.0, 0.0, 0.0};\nvector up  = {0.0, 1.0, 0.0};\n\n// set() is equivalent to the {} syntax\nvector same_as_red = set(1.0, 0.0, 0.0);',
            keyPoints: [
              'vector packs 3 floats: {x, y, z}',
              'Vectors have .x .y .z components',
              'Colors are vectors too: .x=R, .y=G, .z=B',
              'set(x, y, z) builds a vector — identical to {x, y, z}',
            ],
          },
        ],
        exercises: [
          {
            kind: 'fill',
            id: 'var-3',
            title: 'Declare a vector pointing up',
            codeLines: [
              '// The Y axis points up in 3D space.',
              '// Declare a vector named "up" that points in the +Y direction.',
              'vector up = {___, ___, ___};',
            ],
            answers: ['0', '1', '0'],
            hints: ['X axis value', 'Y axis value — this is the "up" direction', 'Z axis value'],
            explanation: 'In 3D, the Y axis is "up". A unit vector pointing up is `{0, 1, 0}` — zero on X and Z, one on Y.',
            vectorPreview: true,
            xp: 20,
          },
          {
            kind: 'fill',
            id: 'var-9',
            title: 'Declare a vector with custom values',
            codeLines: [
              '// Declare a vector named "velocity": moving right (x=1.5),',
              '// slightly down (y=-0.5), and not at all on z.',
              'vector velocity = {___, ___, ___};',
            ],
            answers: ['1.5', '-0.5', '0'],
            hints: ['X component', 'Y component — negative means downward', 'Z component'],
            explanation: '`vector velocity = {1.5, -0.5, 0};` — vectors can hold any float values, including negatives and zero, not just 0s and 1s.',
            vectorPreview: true,
            xp: 20,
          },
          {
            kind: 'mcq',
            id: 'var-4',
            title: 'How do you access the Y component of a vector `v`?',
            explanation: 'Dot notation accesses vector components: `v.x`, `v.y`, `v.z`. This works on any vector, including attributes like `@P.y`.',
            choices: [
              { text: 'v.y', correct: true },
              { text: 'v[1]', correct: false, explanation: 'This also works in VEX, but .y is more readable.' },
              { text: 'v->y', correct: false },
              { text: 'getcomp(v, 1)', correct: false, explanation: 'Works but verbose — .y is the standard way.' },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'var-10',
            title: 'Set this vector\'s first component to 1',
            codeLines: [
              '// You already declared this vector — now set only its first component to 1',
              'vector col = {0.2, 0.4, 0.6};',
              'col.___ = ___;',
            ],
            answers: ['x', '1'],
            hints: ['The first component', 'The new value'],
            explanation: '`col.x = 1;` overwrites just the X component via dot notation — the same trick works on any vector, not just `@Cd`.',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'var-6',
            title: 'What is wrong with `vector pos = 1.0;`?',
            explanation: 'A `vector` always packs three floats: `{x, y, z}`. Assigning a single float directly is a type mismatch — you need `vector pos = {1.0, 1.0, 1.0};` or similar.',
            choices: [
              { text: 'A vector needs 3 values in braces, e.g. {1.0, 0.0, 0.0}', correct: true },
              { text: 'Nothing — this is valid VEX', correct: false },
              { text: '"vector" should be capitalized', correct: false },
              { text: '1.0 should be written as an int', correct: false },
            ],
            xp: 10,
          },
        ],
      },

      // ── Lesson 4: Attributes ───────────────────────────────────────────────
      {
        id: 'attributes',
        title: 'Attributes',
        icon: '@',
        description: 'Read and write point attributes with @',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-attr-1',
            title: 'Attributes: the @ prefix',
            body: 'An **attribute** is a named value stored on geometry — every point can have its own position, color, normal, etc.\n\nIn VEX, you read and write attributes with the `@` prefix. Reading `@P` gives you the current point\'s position. Writing `@Cd = ...` sets its color.\n\nAttributes (anything with `@`) persist after the wrangle — they\'re part of the geometry data. This is different from the local variables from the previous lesson: `float myVar = 2;` (no `@`) is just scratch space for this wrangle — it\'s gone as soon as the next node runs. Only `@`-prefixed names actually get saved onto the geometry.\n\nWhen creating a brand-new attribute, you can optionally spell out its type right before the `@`: `f@name` (float), `i@name` (int), `v@name` (vector), `s@name` (string). A bare `@name = ...` works too — VEX infers the type from whatever you assign — but the explicit prefix makes your intent unambiguous.',
            codeExample: '// Reading an attribute\nvector myPos = @P;\nfloat  height = @P.y;\n\n// Writing an attribute — persists on the geometry\n@Cd = {1.0, 0.0, 0.0};  // paint red\n@P.y += 0.5;             // lift up\n\n// Explicit type prefix — same effect as the bare @ form\nf@speed    = 2.5;\nv@velocity = {1.0, 0.0, 0.0};\n\n// This does NOT persist — it\'s a local variable, not an attribute\nfloat scratch = 2.0;',
            keyPoints: [
              '@ reads or writes a geometry attribute',
              'Attributes (with @) persist on the geometry after the wrangle',
              'Local variables (no @, e.g. float x = 2;) do NOT persist',
              'f@/i@/v@/s@ explicitly type a new attribute (float/int/vector/string)',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-attr-2',
            title: 'The built-in attributes',
            body: 'Houdini has several attributes that already exist on geometry:\n\n- `@P` *(vector)* — position in 3D space\n- `@Cd` *(vector)* — diffuse color, where X=R, Y=G, Z=B (0–1)\n- `@N` *(vector)* — surface normal (unit vector pointing "outward")\n- `@ptnum` *(int, read-only)* — index of the current point\n- `@numpt` *(int, read-only)* — total number of points\n\nYou\'ll use `@P` and `@Cd` in almost every wrangle.\n\nOne catch with `@N`: it only really means something **relative to a surface**. A polygon mesh (like a sphere SOP) computes it for you from how the faces connect. A bare, disconnected point cloud has no faces to compute it from — it won\'t have a meaningful `@N` unless something upstream (like a Point Cloud Normal node) explicitly creates one.',
            codeExample: '// Use @ptnum to make every other point red/blue\nif (@ptnum % 2 == 0) {\n    @Cd = {1.0, 0.0, 0.0}; // even: red\n} else {\n    @Cd = {0.0, 0.3, 1.0}; // odd: blue\n}',
            keyPoints: [
              '@P = position (vector)',
              '@Cd = color, X=red Y=green Z=blue',
              '@N = normal (unit direction vector)',
              '@N comes from a surface (e.g. a mesh) — a bare point cloud has none by default',
              '@ptnum / @numpt = index / count (read-only)',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'attr-1',
            title: 'What does @Cd represent?',
            explanation: '`@Cd` is the **diffuse color** attribute. It\'s a `vector` where X=red, Y=green, Z=blue. Values from 0 to 1.',
            choices: [
              { text: 'Diffuse color (RGB)', correct: true },
              { text: 'Camera direction', correct: false },
              { text: 'Current density', correct: false },
              { text: 'Curve data', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'code',
            id: 'attr-2',
            title: 'Paint it red',
            prompt: 'Set every point\'s color to pure red.\n\nRemember: `@Cd` is a vector where X=red, Y=green, Z=blue. Use values between 0 and 1.',
            starterCode: '// Set @Cd to red\n// Hint: pure red = full red, no green, no blue\n@Cd = {___, ___, ___};\n',
            solutionCode: '@Cd = {1, 0, 0};\n',
            checks: [
              {
                description: 'All points are red (Cd.x ≈ 1, Cd.y ≈ 0, Cd.z ≈ 0)',
                test: (pts) => pts.every(p =>
                  Math.abs(p.Cd.x - 1) < 0.05 &&
                  p.Cd.y < 0.05 &&
                  p.Cd.z < 0.05
                ),
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            explanation: '`@Cd = {1, 0, 0};` sets red=1, green=0, blue=0 — pure red. The vector literal `{r, g, b}` syntax creates an inline vector.',
            xp: 20,
          },
          {
            kind: 'fill',
            id: 'attr-3',
            title: 'Read a component',
            codeLines: [
              '// Store only the height (Y) of the current point',
              'float h = @___.y;',
            ],
            answers: ['P'],
            hints: ['The position attribute'],
            explanation: '`@P.y` reads the Y component of the position. You can do the same for `.x` and `.z`.',
            xp: 15,
          },
          {
            kind: 'code',
            id: 'attr-4',
            title: 'Shift every point upward',
            prompt: 'Add exactly **1.0** to the Y position of every point. The sphere should visibly move up.',
            starterCode: '// Add to the Y position\n@P.___ += ___;\n',
            solutionCode: '@P.y += 1.0;\n',
            checks: [
              {
                description: 'Every point Y > 0 (shifted up)',
                test: (pts) => pts.every(p => p.P.y > -0.1),
              },
              {
                description: 'Shift is close to 1.0 (not more than 2.0)',
                test: (pts) => {
                  const avgY = pts.reduce((s, p) => s + p.P.y, 0) / pts.length
                  return avgY > 0.8 && avgY < 2.2
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            explanation: '`@P.y += 1.0;` adds 1 to each point\'s Y component. `+=` is shorthand for `@P.y = @P.y + 1.0`.',
            xp: 20,
          },
          {
            kind: 'mcq',
            id: 'attr-5',
            title: 'Which of these attributes is read-only?',
            explanation: '`@ptnum` and `@numpt` are read-only — they just describe the loop itself. `@P`, `@Cd` and `@N` can all be written to.',
            choices: [
              { text: '@ptnum', correct: true },
              { text: '@P', correct: false },
              { text: '@Cd', correct: false },
              { text: '@N', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'attr-6',
            title: 'Write a single channel',
            codeLines: [
              '// Set only the red channel to full, leave green & blue untouched',
              '@Cd.___ = ___;',
            ],
            answers: ['x', '1'],
            hints: ['Which component is red?', 'Full red value'],
            explanation: '`@Cd.x = 1;` writes only the red channel via dot notation — no need to rewrite the whole vector with `{}`.',
            xp: 15,
          },
          {
            kind: 'fill',
            id: 'attr-7',
            title: 'Make a value actually persist',
            codeLines: [
              '// "scratch" is a local variable — it disappears once this wrangle ends.',
              'float scratch = 2.0;',
              '// Make "result" an explicit float ATTRIBUTE instead, so it persists.',
              '___result = 2.0;',
            ],
            answers: ['f@'],
            hints: ['Type-prefix + @ — same letter as the float keyword'],
            explanation: '`f@result = 2.0;` explicitly declares `result` as a **float attribute**. Unlike `float scratch = 2.0;` (a local variable, gone after this wrangle), an attribute is written onto the geometry and still exists downstream. The bare `@result = 2.0;` form would do the same thing here — `f@` is just the explicit version, useful when you want to be clear about the type you\'re creating.',
            xp: 20,
          },
        ],
      },

      // ── Lesson 5: Parameters & Sliders ─────────────────────────────────────
      {
        id: 'params',
        title: 'Parameters & Sliders',
        icon: '🎚️',
        description: 'Drive a wrangle live with ch(), chf() and chramp()',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-params-1',
            title: 'ch() and chf() — reading parameters',
            visual: 'wrangle-params',
            body: 'In real Houdini, a wrangle node has its own parameter interface — sliders an artist can drag without touching the code. `chf("name")` **reads** the current value of a parameter called "name" (it returns 0 if that parameter doesn\'t exist yet).\n\nCreating the actual slider is a separate step: a button next to the code editor ("Create spare parameter for each ch()") scans your code and adds a real, draggable parameter for every `chf()`/`ch()` call it finds. So `chf()` itself only reads — the button is what creates.\n\n`ch()` is ambiguous about the value\'s type, so real VEX docs recommend the explicit typed forms instead: `chf("name")` for a float, `chi("name")` for an int.',
            codeExample: '// Hardcoded — works, but an artist has to edit code to tweak it\nfloat amp = 0.4;\n\n// Same idea, but driven by a node parameter\nfloat amp = chf("amplitude");\n// -> click "Create spare parameter" and a slider named\n//    "amplitude" appears on the node, ready to drag',
            keyPoints: [
              'chf("name") reads a node parameter by name (0 if it doesn\'t exist yet)',
              'chf("name") is the explicit float form — recommended over the ambiguous ch()',
              'A separate button creates the actual slider for any chf()/ch() in your code',
              'Dragging that slider re-runs the wrangle with the new value — no code edits needed',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-params-2',
            title: 'chramp() — sampling a ramp',
            visual: 'ramp',
            body: 'A **ramp parameter** lets an artist draw a curve instead of setting one number — useful when a value should change smoothly across a range, like a gradient or an easing curve.\n\n`chramp("name", pos)` takes two separate arguments:\n- `"name"` — WHICH ramp to sample (just like the string in `chf("name")`)\n- `pos` — WHERE along that ramp\'s curve to sample, from 0 (the very start) to 1 (the very end)\n\nSo `chramp("falloff", 0.0)` reads the start of the "falloff" curve, and `chramp("falloff", 1.0)` reads its end — anything in between blends smoothly along whatever shape the artist drew.',
            codeExample: '// Sample the "falloff" ramp at this point\'s height\n// (0 = bottom of the shape, 1 = top)\nfloat t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);\nfloat brightness = chramp("falloff", t);',
            keyPoints: [
              'chramp("name", pos) — "name" picks the ramp, pos picks where on it (0..1)',
              'A ramp is a curve an artist draws in the UI — more expressive than one slider',
              'pos is automatically clamped to 0..1',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'params-1',
            title: 'What does dragging a spare slider created from `chf("amplitude")` actually do?',
            explanation: 'Houdini re-cooks the wrangle with the new value plugged into every `chf("amplitude")` call in the code — exactly as if you\'d edited the number yourself, but live and without touching the VEX.',
            choices: [
              { text: 'Changes the "amplitude" value everywhere it\'s used in the code', correct: true },
              { text: 'Only changes the value shown in the viewport, not the actual code', correct: false },
              { text: 'Renames the channel everywhere it\'s used', correct: false },
              { text: 'Has no effect until you manually re-type the code', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'params-2',
            title: 'Read a float parameter',
            codeLines: [
              '// Read a "frequency" parameter instead of hardcoding a number',
              'float freq = ___("frequency");',
            ],
            answers: ['chf'],
            hints: ['The explicit, recommended float-reading function'],
            explanation: '`chf("frequency")` reads the current value of the "frequency" parameter — it returns 0 if no such parameter exists yet. The plain `ch()` would also read it, but real VEX docs recommend the typed form since `ch()` doesn\'t make clear whether you want a float, int, vector, or string. (Actually creating the slider itself is a separate step — see the previous theory card.)',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'params-3',
            title: 'Why do SideFX\'s own docs recommend chf()/chi()/chv() over the plain ch()?',
            explanation: '`ch()` has several overloads and Houdini has to guess which one you mean from context. `chf()`, `chi()` and `chv()` each commit to one specific type (float, int, vector) instead, so there\'s no guessing involved.',
            choices: [
              { text: 'ch() doesn\'t say what type it returns; chf()/chi()/chv() each commit to one specific type', correct: true },
              { text: 'ch() is deprecated and will be removed in a future Houdini version', correct: false },
              { text: 'ch() only works inside SOPs, not wrangles', correct: false },
              { text: 'ch() can only read int values, never floats', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'params-4',
            title: 'Sample a ramp parameter',
            codeLines: [
              '// "gradient" = which ramp, t = where along it (0 to 1)',
              'float t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);',
              'float val = ___("gradient", t);',
            ],
            answers: ['chramp'],
            hints: ['Samples a ramp parameter at a 0..1 position'],
            explanation: '`chramp("gradient", t)` samples the "gradient" ramp parameter at position `t` — a smoothly varying value across the range, driven by a curve instead of a single number.',
            xp: 15,
          },
          {
            kind: 'code',
            id: 'params-5',
            title: 'Live brightness slider',
            prompt: 'Color every point with a flat grayscale brightness, driven by a **live parameter** instead of a hardcoded number.\n\nThe `chf("brightness")` call is already there for you — just use `b` to set `@Cd`. Drag the slider on the right and watch the color change live.',
            starterCode: '// "brightness" is a live slider — drag it on the right!\nfloat b = chf("brightness");\n@Cd = ___;\n',
            solutionCode: 'float b = chf("brightness");\n@Cd = {b, b, b};\n',
            checks: [
              {
                description: 'Reads the brightness parameter with chf("brightness")',
                test: (_pts, _out, code) => /chf\s*\(\s*["']brightness["']\s*\)/.test(code),
              },
              {
                description: 'Color is grayscale and matches the slider value',
                test: (pts, _out, code, chValues) => {
                  if (!/chf\s*\(\s*["']brightness["']\s*\)/.test(code)) return false
                  const expected = chValues?.brightness ?? 0
                  return pts.every(p =>
                    Math.abs(p.Cd.x - p.Cd.y) < 0.05 &&
                    Math.abs(p.Cd.y - p.Cd.z) < 0.05 &&
                    Math.abs(p.Cd.x - expected) < 0.05
                  )
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            chParams: [{ name: 'brightness', label: 'Brightness', min: 0, max: 1, default: 0.6 }],
            explanation: 'Dragging the slider changes what `chf("brightness")` returns, which changes `b`, which changes the color every point gets — live, without editing the code. That\'s the whole point of exposing a value as a parameter instead of hardcoding it.',
            xp: 25,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 2 — Math & Vectors
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'math',
    title: 'Math & Vectors',
    icon: '📐',
    tier: 1,
    lessons: [
      // ── Lesson 1: Arithmetic ───────────────────────────────────────────────
      {
        id: 'arithmetic',
        title: 'Arithmetic',
        icon: '➕',
        description: 'Basic math with floats and vectors',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-arith-1',
            title: 'Math operators in VEX',
            body: 'VEX supports the standard arithmetic operators: `+`, `-`, `*`, `/`, `%`.\n\n**Vectors and scalars mix naturally.** Any of these operators between a vector and a float applies to **all three components** — multiplying, adding, whatever. Adding two vectors adds component-by-component.',
            codeExample: 'float a = 3.0;\nfloat b = a * 2.0;    // b = 6.0\nfloat c = a % 2.0;    // c = 1.0 (modulo: the remainder)\n\nvector v = {1, 2, 3};\nvector w = v * 2.0;   // {2, 4, 6}\nvector u = v + 1.0;   // {2, 3, 4} — scalar broadcasts to all 3\nvector s = v + {0, 1, 0}; // {1, 3, 3}',
            keyPoints: [
              'Operators: + - * / %',
              '% is modulo — the remainder of a division (7 % 3 = 1)',
              'vector op float applies to all 3 components',
              'vector + vector adds component-by-component',
              '+= -= *= /= are shorthand assignment operators',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'arith-1',
            title: 'What is the result of `{1, 0, 0} * 3.0`?',
            explanation: 'Multiplying a vector by a scalar multiplies **every component**: `{1*3, 0*3, 0*3}` = `{3, 0, 0}`.',
            choices: [
              { text: '{3, 0, 0}', correct: true },
              { text: '3.0', correct: false },
              { text: '{1, 0, 0}', correct: false },
              { text: 'Error — can\'t mix vector and float', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'arith-5',
            title: 'What is the result of `{1, 2, 3} + 1.0`?',
            explanation: 'A float added to a vector **broadcasts** to all three components: `{1+1, 2+1, 3+1}` = `{2, 3, 4}`. Same rule as `*` — it\'s not just multiplication that broadcasts.',
            choices: [
              { text: '{2, 3, 4}', correct: true },
              { text: '{1, 2, 4}', correct: false, explanation: 'This would only add to the last component — the scalar applies to all three.' },
              { text: '{2, 2, 2}', correct: false },
              { text: 'Error — can\'t add vector and float', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'arith-6',
            title: 'Use the modulo operator, and compute its result',
            codeLines: [
              '// Fill in the operator that computes a remainder,',
              '// then the value it produces for 7 and 3.',
              'float r = 7.0 ___ 3.0;  // r = ___',
            ],
            answers: ['%', '1'],
            hints: ['The remainder operator (not the result)', 'The remainder of 7 divided by 3'],
            explanation: '`7 % 3 = 1` — 3 goes into 7 twice (6), leaving a remainder of 1. Modulo is very useful for repeating patterns, which you\'ll use a lot later.',
            xp: 15,
          },
          {
            kind: 'fill',
            id: 'arith-2',
            title: 'Double every position — use the `*=` shorthand operator (not `= @P *`)',
            codeLines: [
              '// Multiply @P by 2 — scale the geometry up',
              '@P ___ 2.0;',
            ],
            answers: ['*='],
            hints: ['Multiply-and-assign operator: write *= , not = @P *'],
            explanation: '`@P *= 2.0;` multiplies each component of position by 2, doubling the scale of the geometry.',
            pointShape: 'sphere',
            pointCount: 150,
            xp: 15,
          },
          {
            kind: 'fill',
            id: 'arith-7',
            title: 'Shift every point sideways — use the `+=` shorthand operator',
            codeLines: [
              '// Shift every point 0.5 units to the right (X)',
              '@P.x ___ 0.5;',
            ],
            answers: ['+='],
            hints: ['Add-and-assign operator'],
            explanation: '`@P.x += 0.5;` is shorthand for `@P.x = @P.x + 0.5;` — same shorthand pattern as `*=`, just with `+`.',
            pointShape: 'sphere',
            pointCount: 150,
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'arith-8',
            title: 'What does `5 % 2` evaluate to?',
            explanation: '5 divided by 2 is 2 with a remainder of 1 (2×2=4, 5-4=1). Modulo always gives you that leftover remainder.',
            choices: [
              { text: '1', correct: true },
              { text: '2.5', correct: false },
              { text: '0', correct: false },
              { text: '10', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'code',
            id: 'arith-9',
            title: 'Scale and lift',
            prompt: 'Combine two operators on this sphere: double its size, then shift every point up by 0.5.\n\nUse the shorthand assignment operators you just practiced.',
            starterCode: '// Double the size (scale @P), then shift up\n',
            solutionCode: '@P *= 2.0;\n@P.y += 0.5;\n',
            checks: [
              {
                description: 'Points are scaled up (average distance from center increased)',
                test: (pts) => {
                  const avgDist = pts.reduce((s, p) => s + Math.sqrt(p.P.x ** 2 + (p.P.y - 0.5) ** 2 + p.P.z ** 2), 0) / pts.length
                  return avgDist > 1.5
                },
              },
              {
                description: 'Points are shifted up by about 0.5',
                test: (pts) => {
                  const avgY = pts.reduce((s, p) => s + p.P.y, 0) / pts.length
                  return avgY > 0.3 && avgY < 0.7
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            explanation: '`@P *= 2.0;` scales every point away from the origin (doubling the sphere\'s radius), then `@P.y += 0.5;` shifts the whole result upward.',
            xp: 25,
          },
        ],
      },

      // ── Lesson 2: fit() — remapping ranges ──────────────────────────────────
      {
        id: 'fit-remap',
        title: 'fit() — remapping ranges',
        icon: '🎯',
        description: 'Turn any range of values into another range',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-fit-1',
            title: 'Remapping values with fit()',
            body: '`fit(x, omin, omax, nmin, nmax)` is one of the most useful VEX functions.\n\nIt **remaps** a value from one range into another. If `x` is in `[omin, omax]`, the result is in `[nmin, nmax]`.\n\nExample: Y position goes from -1 to 1. You want to use it as a color (0 to 1). `fit(@P.y, -1, 1, 0, 1)` does exactly that.\n\nTwo shortcuts exist for the common case where the input is already 0–1: `fit01(x, nmin, nmax)` is exactly `fit(x, 0, 1, nmin, nmax)`, `fit10(x, nmin, nmax)` is the same but with the input direction reversed. **None of these clamp** — if `x` falls outside the range they assume, the result just extrapolates past `[nmin, nmax]`. If you need the input forced into range first, combine with `clamp()`.',
            codeExample: '// Map Y height (-1..1) to a 0..1 range\nfloat t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);\n\n// t = 0 at the bottom, 1 at the top\n@Cd = {t, 0.0, 0.0}; // dark red → bright red\n\n// fit01: input already 0..1, remap to a custom range\nfloat brightness = fit01(t, 0.2, 0.9);',
            keyPoints: [
              'fit(x, omin, omax, nmin, nmax) remaps a range',
              'Useful for turning positions into color values',
              'fit01(x, nmin, nmax) is exactly fit(x, 0, 1, nmin, nmax)',
              'fit/fit01/fit10 never clamp — combine with clamp() if you need that',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'fit-1',
            title: 'What does `fit(5, 0, 10, 0, 100)` return?',
            explanation: '5 is exactly halfway between 0 and 10. Halfway in the new range `[0, 100]` is **50**.',
            choices: [
              { text: '50', correct: true },
              { text: '5', correct: false },
              { text: '100', correct: false },
              { text: '10', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'code',
            id: 'fit-2',
            title: 'Height gradient',
            prompt: 'Color the points based on their height (Y position).\n\nYou need a gradient from black to red: the bottom should be dark, the top bright red.\n\nWatch out: the sphere is centered, so its Y values range from about -1 to +1 — not 0 to 1.',
            starterCode: '// Use fit() to remap @P.y from (-1..1) to (0..1)\n// Then assign the result to @Cd.x\n// Set @Cd.y and @Cd.z to 0\n',
            solutionCode: 'float t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);\n@Cd = {t, 0.0, 0.0};\n',
            checks: [
              {
                description: 'Green and blue channels are near zero — a pure red gradient',
                test: (pts) => pts.every(p => p.Cd.y < 0.1 && p.Cd.z < 0.1),
              },
              {
                description: 'Red channel stays within 0–1 (fit() correctly remaps -1..1)',
                test: (pts) => pts.every(p => p.Cd.x >= -0.05 && p.Cd.x <= 1.05),
              },
              {
                description: 'Top points have a brighter red than bottom points',
                test: (pts) => {
                  const top = pts.filter(p => p.P.y > 0.6)
                  const bot = pts.filter(p => p.P.y < -0.6)
                  if (top.length < 3 || bot.length < 3) return false
                  const avgTopR = top.reduce((s, p) => s + p.Cd.x, 0) / top.length
                  const avgBotR = bot.reduce((s, p) => s + p.Cd.x, 0) / bot.length
                  return avgTopR > avgBotR + 0.3
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            explanation: '`fit(@P.y, -1, 1, 0, 1)` maps -1→0 and +1→1. Assigning to `@Cd.x` alone (with @Cd.y and @Cd.z at 0) makes it a red gradient from black (bottom) to red (top).',
            xp: 25,
          },
          {
            kind: 'mcq',
            id: 'fit-6',
            title: 'Which function is shorthand for `fit(x, 0, 1, nmin, nmax)`?',
            explanation: '`fit01(x, nmin, nmax)` exists specifically for the very common case where your input is already known to be 0–1 (most noise and mask values are) — it saves you typing the `0, 1` every time.',
            choices: [
              { text: 'fit01(x, nmin, nmax)', correct: true },
              { text: 'fit10(x, nmin, nmax)', correct: false, explanation: 'That one is the reversed version — 1→nmin, 0→nmax.' },
              { text: 'clamp(x, nmin, nmax)', correct: false },
              { text: 'lerp(x, nmin, nmax)', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'fit-3',
            title: 'Remap a value that\'s already 0–1',
            codeLines: [
              '// x is already 0-1 (e.g. a noise value). Map it to a 0.2-0.9 range.',
              'float c = ___(x, 0.2, 0.9);',
            ],
            answers: ['fit01'],
            hints: ['The fit variant for inputs that are already 0–1'],
            explanation: '`fit01(x, nmin, nmax)` is shorthand for `fit(x, 0, 1, nmin, nmax)` — use it whenever the input is already known to be 0–1.',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'fit-4',
            title: 'What does `fit01(1.5, 0, 10)` return?',
            explanation: '`fit01()` does **not** clamp its input — it just assumes you\'ll pass 0–1 and remaps linearly regardless. With `x=1.5` (already past the assumed range), the result extrapolates past the target range too: `0 + 1.5 × (10-0) = 15`. If you want the input forced into 0–1 first, combine it with `clamp()`.',
            choices: [
              { text: '15 — fit01 extrapolates past the target range, it doesn\'t clamp', correct: true },
              { text: '10 — fit01 clamps x to 1 first', correct: false },
              { text: '0 — fit01 clamps x to 0 first', correct: false },
              { text: 'A runtime error, since x is outside 0–1', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'code',
            id: 'fit-5',
            title: 'Side-to-side gradient',
            prompt: 'Color the points based on their X position this time, not Y.\n\nThe sphere\'s X values range from about -1 to +1. Blend from blue (left, X=-1) to yellow (right, X=+1).',
            starterCode: '// Remap @P.x from (-1..1) to (0..1), then lerp between two colors\n',
            solutionCode: 'float t = fit(@P.x, -1.0, 1.0, 0.0, 1.0);\n@Cd = lerp({0.1, 0.3, 0.9}, {0.95, 0.85, 0.1}, t);\n',
            checks: [
              {
                description: 'Left points (X < -0.6) and right points (X > 0.6) have different colors',
                test: (pts) => {
                  const left = pts.filter(p => p.P.x < -0.6)
                  const right = pts.filter(p => p.P.x > 0.6)
                  if (left.length < 3 || right.length < 3) return false
                  const avg = (arr: typeof pts, c: 'x' | 'y' | 'z') => arr.reduce((s, p) => s + p.Cd[c], 0) / arr.length
                  const dx = avg(left, 'x') - avg(right, 'x')
                  const dy = avg(left, 'y') - avg(right, 'y')
                  const dz = avg(left, 'z') - avg(right, 'z')
                  return Math.sqrt(dx * dx + dy * dy + dz * dz) > 0.3
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            explanation: 'Same recipe as the height gradient, just driven by `@P.x` instead of `@P.y` — `fit()` works identically regardless of which axis you feed it.',
            xp: 25,
          },
        ],
      },

      // ── Lesson 3: length() & normalize() ─────────────────────────────────────
      {
        id: 'vectors',
        title: 'length() & normalize()',
        icon: '↗️',
        description: 'Measure and reshape vector magnitude',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-vec-1',
            title: 'length() and normalize()',
            body: '`length(v)` returns the **magnitude** of a vector — the distance from the origin to the tip.\n\nFormula: `sqrt(x² + y² + z²)`\n\n`normalize(v)` returns a vector with the **same direction** but length exactly 1. A vector with length 1 is called a **unit vector** and is essential for directions, normals, and dot products.\n\nThere\'s also `distance(a, b)` — shorthand for `length(a - b)`, the distance between two points instead of from the origin.',
            codeExample: 'vector v = {3, 4, 0};\nfloat  l = length(v);      // 5.0\nvector n = normalize(v);   // {0.6, 0.8, 0.0}\n\n// Distance from origin to current point\nfloat dist = length(@P);\n\n// Distance between two arbitrary points\nfloat d2 = distance({0,0,0}, {3,4,0}); // 5.0, same as length() of the difference',
            keyPoints: [
              'length(v) = magnitude = sqrt(x²+y²+z²)',
              'normalize(v) = unit vector (length = 1)',
              'length(@P) = distance from the origin',
              'distance(a, b) = length(a - b)',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'vec-1',
            title: 'What does `length({0, 3, 4})` return?',
            explanation: 'length = √(0² + 3² + 4²) = √(0 + 9 + 16) = √25 = **5**.',
            choices: [
              { text: '5.0', correct: true },
              { text: '7.0', correct: false },
              { text: '3.5', correct: false },
              { text: '25.0', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'vec-2',
            title: 'What does `normalize({0, 0, 9})` return?',
            explanation: '`normalize` keeps the direction but forces length = 1. `{0, 0, 9}` points in +Z, so normalized → `{0, 0, 1}`.',
            choices: [
              { text: '{0, 0, 1}', correct: true },
              { text: '{0, 0, 9}', correct: false },
              { text: '{0, 0, 0.5}', correct: false },
              { text: '9.0', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'vec-5',
            title: 'What does `length({1, 1, 1})` return (rounded to 2 decimals)?',
            explanation: '√(1² + 1² + 1²) = √3 ≈ **1.73**. Not every length() comes out as a clean whole number!',
            choices: [
              { text: '1.73', correct: true },
              { text: '3.0', correct: false },
              { text: '1.0', correct: false },
              { text: '1.5', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'vec-8',
            title: 'Which function is shorthand for `length(a - b)`?',
            explanation: '`distance(a, b)` exists purely for readability — it computes exactly `length(a - b)`, the distance between two arbitrary points instead of from the origin.',
            choices: [
              { text: 'distance(a, b)', correct: true },
              { text: 'normalize(a, b)', correct: false, explanation: 'normalize() only takes one vector — it doesn\'t compare two points.' },
              { text: 'dot(a, b)', correct: false },
              { text: 'length(a, b)', correct: false, explanation: 'length() only takes one vector.' },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'vec-6',
            title: 'Distance between two points',
            codeLines: [
              '// Compute the distance between point a and point b',
              'vector a = {0, 0, 0};',
              'vector b = {3, 4, 0};',
              'float d = ___(a, b);',
            ],
            answers: ['distance'],
            hints: ['Shorthand for length(a - b)'],
            explanation: '`distance(a, b)` gives 5 here — it\'s the classic 3-4-5 right triangle, just like `length(b - a)` would.',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'vec-7',
            title: 'Why does `normalize({0, 0, 0})` return `{0, 0, 0}` instead of crashing?',
            explanation: 'The zero vector has no direction to preserve, so dividing by its (zero) length would be undefined. VEX plays it safe and just returns the zero vector instead of erroring.',
            choices: [
              { text: 'The zero vector has no direction, so VEX safely returns zero instead of dividing by zero', correct: true },
              { text: 'It throws a runtime error', correct: false },
              { text: 'It returns {1, 1, 1}', correct: false },
              { text: 'It returns a random direction', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'vec-3',
            title: 'Distance from origin',
            codeLines: [
              '// Compute distance from origin to current point',
              'float dist = ___(@P);',
              '// Use dist to fade color: close=bright, far=dark',
              '@Cd = {___, dist, dist};',
            ],
            answers: ['length', 'dist'],
            hints: ['Built-in that returns the magnitude', 'The variable we just computed'],
            explanation: '`length(@P)` gives the distance from origin. Using it for the red channel too gives a neutral grayscale-ish gradient.',
            xp: 20,
            pointShape: 'random',
            pointCount: 150,
          },
        ],
      },

      // ── Lesson 4: clamp() & lerp() ────────────────────────────────────────────
      {
        id: 'clamp-lerp',
        title: 'clamp() & lerp()',
        icon: '🔀',
        description: 'Constrain a range, then blend across it',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-clamp-lerp-1',
            title: 'clamp() and lerp()',
            body: '`clamp(x, min, max)` forces a value to stay inside a range — anything below `min` becomes `min`, anything above `max` becomes `max`. It\'s the easiest way to squeeze a distance (or anything unbounded) into a clean 0–1 range before using it as a color.\n\n`lerp(a, b, t)` **interpolates** between two values. At `t=0` you get `a`, at `t=1` you get `b`, in between you get a smooth mix. Works on floats and vectors alike. Like `fit()`/`fit01()`, `lerp()` does **not** clamp `t` — if you pass `t=1.5`, it overshoots past `b`. `clamp()` is the only one of these that actually forces a value into range.',
            codeExample: 'float dist = length(@P);\nfloat t = clamp(dist, 0.0, 1.0); // force into 0..1\n\nfloat  midway = lerp(10.0, 20.0, 0.5);          // 15.0\nvector mix    = lerp({0,0,0}, {10,10,10}, 0.25); // {2.5, 2.5, 2.5}\n\n// lerp does NOT clamp t — this overshoots past b\nfloat over = lerp(0.0, 10.0, 1.5); // 15.0, past b!',
            keyPoints: [
              'clamp(x, min, max) keeps a value inside [min, max]',
              'lerp(a, b, t) → interpolates between a and b',
              'lerp works on both floats and vectors',
              'lerp does not clamp t — combine with clamp() if needed',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'cl-1',
            title: 'What does `clamp(15, 0, 10)` return?',
            explanation: '15 is above the max of 10, so it gets clamped down to **10**.',
            choices: [
              { text: '10', correct: true },
              { text: '15', correct: false },
              { text: '0', correct: false },
              { text: '5', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'cl-2',
            title: 'Keep a value inside a range',
            codeLines: [
              '// Force speed to never exceed 1.0, and never go below 0',
              'float speed = ___(rawSpeed, 0.0, 1.0);',
            ],
            answers: ['clamp'],
            hints: ['Forces a value to stay inside [min, max]'],
            explanation: '`clamp(rawSpeed, 0.0, 1.0)` is the standard way to keep any computed value inside a safe range.',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'cl-3',
            title: 'What does `lerp(10, 20, 0.5)` return?',
            explanation: '`t=0.5` is exactly halfway between 10 and 20 — that\'s **15**.',
            choices: [
              { text: '15', correct: true },
              { text: '10', correct: false },
              { text: '20', correct: false },
              { text: '30', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'cl-4',
            title: 'What does `lerp({0,0,0}, {10,10,10}, 0.25)` return?',
            explanation: '`lerp` interpolates each component the same way: `0 + (10-0)*0.25 = 2.5` for every axis.',
            choices: [
              { text: '{2.5, 2.5, 2.5}', correct: true },
              { text: '{0, 0, 0}', correct: false },
              { text: '{10, 10, 10}', correct: false },
              { text: '{0.25, 0.25, 0.25}', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'cl-5',
            title: 'Does `lerp(a, b, 1.5)` automatically clamp t to stay between a and b?',
            explanation: 'No — `lerp()` always applies the math as-is. `t=1.5` overshoots past `b`. If you need the result to stay within `[a, b]`, `clamp()` the value yourself — none of VEX\'s remap functions (`fit`/`fit01`/`fit10`/`lerp`) clamp on their own.',
            choices: [
              { text: 'No — it overshoots past b. Combine with clamp() if you need to stay in range', correct: true },
              { text: 'Yes — t is always clamped to 0–1 automatically', correct: false },
              { text: 'It throws a runtime error', correct: false },
              { text: 'It silently returns a unchanged', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'cl-6',
            title: 'Blend two colors',
            codeLines: [
              '// Blend from blue to yellow based on t',
              '@Cd = ___({0, 0, 1}, {1, 1, 0}, t);',
            ],
            answers: ['lerp'],
            hints: ['Interpolates between two colors based on t'],
            explanation: '`lerp(a, b, t)` is the standard way to blend between two colors — works exactly the same on vectors as it does on floats.',
            xp: 15,
          },
        ],
      },

      // ── Lesson 5: dot() & cross() ─────────────────────────────────────────────
      {
        id: 'dot-cross',
        title: 'dot() & cross()',
        icon: '✳️',
        description: 'Measure alignment and find perpendicular directions',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-dot-cross-1',
            title: 'dot() and cross()',
            body: '`dot(a, b)` returns a single float: the **dot product**. It measures how aligned two vectors are. If both are unit vectors, `dot(a, b)` ranges from **-1** (opposite directions) to **+1** (same direction), with **0** meaning perpendicular.\n\n`cross(a, b)` returns a **vector** that is perpendicular to both `a` and `b` — useful for finding "the direction sideways" relative to two other directions (like building a local coordinate frame).',
            codeExample: 'vector a = {1, 0, 0};\nvector b = {0, 1, 0};\nfloat  d = dot(a, b);    // 0.0 (perpendicular)\nfloat  d2 = dot(a, a);   // 1.0 (same direction as itself)\n\nvector c = cross(a, b);  // {0, 0, 1} — perpendicular to both a and b',
            keyPoints: [
              'dot(a, b) → float: measures alignment (-1 to 1)',
              'dot(a, b) = 0 means a and b are perpendicular',
              'cross(a, b) → vector: perpendicular to both a and b',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'dc-1',
            title: 'What does `dot({1, 0, 0}, {0, 1, 0})` return?',
            explanation: 'These two vectors are perpendicular (one points along X, the other along Y), so their dot product is **0**.',
            choices: [
              { text: '0.0', correct: true },
              { text: '1.0', correct: false },
              { text: '-1.0', correct: false },
              { text: '{0, 0, 0}', correct: false, explanation: 'dot() always returns a float, never a vector — that\'s cross()\'s job.' },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'dc-2',
            title: 'What does `dot({1, 0, 0}, {-1, 0, 0})` return?',
            explanation: 'These two unit vectors point in exactly **opposite** directions, so their dot product is **-1**.',
            choices: [
              { text: '-1.0', correct: true },
              { text: '0.0', correct: false },
              { text: '1.0', correct: false },
              { text: '2.0', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'dc-3',
            title: 'Measure alignment with "up"',
            codeLines: [
              '// Check how aligned the normal is with the world "up" direction',
              'vector up = {0, 1, 0};',
              'float alignment = ___(@N, up);',
            ],
            answers: ['dot'],
            hints: ['Returns -1 to 1 based on how aligned two vectors are'],
            explanation: '`dot(@N, up)` is exactly how you\'d measure "is this surface facing up, down, or sideways" — a very common VEX pattern.',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'dc-4',
            title: 'What does `cross({1, 0, 0}, {0, 1, 0})` return?',
            explanation: '`cross()` returns a vector perpendicular to both inputs. X crossed with Y gives Z: `{0, 0, 1}`.',
            choices: [
              { text: '{0, 0, 1}', correct: true },
              { text: '0.0', correct: false, explanation: 'That\'s dot()\'s return type — cross() always returns a vector.' },
              { text: '{1, 1, 0}', correct: false },
              { text: '{1, 0, 0}', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'code',
            id: 'dc-5',
            title: 'Shade by upward-facing normal',
            prompt: 'Color each point based on how much its surface normal points "up" (the +Y direction).\n\nUse `dot()` to measure the alignment between `@N` and `{0,1,0}` — that gives you a value from -1 to 1. Remap it to 0–1 with `fit()`, then use it as a grayscale color (same value on all 3 channels).',
            starterCode: '// 1. dot(@N, up) → alignment from -1 to 1\n// 2. fit() that into 0..1\n// 3. @Cd = {t, t, t}\n',
            solutionCode: 'float align = dot(@N, {0.0, 1.0, 0.0});\nfloat t = fit(align, -1.0, 1.0, 0.0, 1.0);\n@Cd = {t, t, t};\n',
            checks: [
              {
                description: 'Top points (facing up) are brighter than bottom points (facing down)',
                test: (pts) => {
                  const top = pts.filter(p => p.N.y > 0.6)
                  const bot = pts.filter(p => p.N.y < -0.6)
                  if (top.length < 3 || bot.length < 3) return false
                  const avgTop = top.reduce((s, p) => s + p.Cd.x, 0) / top.length
                  const avgBot = bot.reduce((s, p) => s + p.Cd.x, 0) / bot.length
                  return avgTop > avgBot + 0.3
                },
              },
              {
                description: 'Color stays grayscale (R, G and B channels match)',
                test: (pts) => pts.every(p => Math.abs(p.Cd.x - p.Cd.y) < 0.05 && Math.abs(p.Cd.y - p.Cd.z) < 0.05),
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            showSurface: true,
            explanation: 'On this sphere, the normal `@N` points straight outward, so `dot(@N, up)` is highest at the top pole and lowest at the bottom — `fit()` turns that into a clean 0–1 brightness value. The translucent shell is there to show WHY: a normal only means something relative to a surface — a bare, disconnected point cloud in real Houdini wouldn\'t have one unless it actually came from a surface like this.',
            xp: 30,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 3 — Control Flow
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'control',
    title: 'Control Flow',
    icon: '🔀',
    tier: 1,
    lessons: [
      {
        id: 'conditionals',
        title: 'If / Else',
        icon: '❓',
        description: 'Branch logic based on conditions',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-if-1',
            title: 'Conditional logic in VEX',
            body: 'VEX uses the same `if/else` syntax as C. The condition goes in parentheses; the body in curly braces.\n\nYou can compare:\n- Numbers: `<`, `>`, `<=`, `>=`, `==`, `!=`\n- The `%` (modulo) operator is useful for patterns: `@ptnum % 2 == 0` is true for every other point.\n\nConditions can be combined with `&&` (and) and `||` (or).\n\nFor more than two outcomes, chain with `else if`: it checks the first condition, then only checks the next one if the first was false, and so on — only one branch ever runs.',
            codeExample: '// Branch based on position\nif (@P.y > 0.0) {\n    @Cd = {1, 1, 0}; // top: yellow\n} else {\n    @Cd = {0, 0, 1}; // bottom: blue\n}\n\n// Checkerboard pattern\nif (@ptnum % 2 == 0) {\n    @Cd = {1, 1, 1};\n}\n\n// Three-way split with else if\nif (@P.y > 0.3) {\n    @Cd = {1, 1, 0};   // top\n} else if (@P.y < -0.3) {\n    @Cd = {0, 0, 1};   // bottom\n} else {\n    @Cd = {1, 1, 1};   // middle\n}',
            keyPoints: [
              'if (condition) { ... } else { ... }',
              'Comparison: == != < > <= >=',
              'Combine: && (and), || (or)',
              'else if chains more than two outcomes',
              '% modulo: useful for alternating patterns',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'if-1',
            title: 'Which is valid VEX syntax for an if statement?',
            explanation: 'VEX uses C-style if: condition in parentheses, body in curly braces, semicolon on the inner statement.',
            choices: [
              { text: 'if (@P.y > 0) { @Cd = {1,1,0}; }', correct: true },
              { text: 'if @P.y > 0: @Cd = {1,1,0}', correct: false },
              { text: 'when (@P.y > 0) { @Cd = {1,1,0}; }', correct: false },
              { text: '@P.y > 0 then @Cd = {1,1,0}', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'if-fill',
            title: 'Write a condition',
            codeLines: [
              '// Color even-indexed points orange, odd points purple',
              'if (@ptnum ___ 2 ___ 0) {',
              '    @Cd = {1.0, 0.4, 0.0};',
              '} else {',
              '    @Cd = {0.5, 0.0, 1.0};',
              '}',
            ],
            answers: ['%', '=='],
            hints: ['Modulo operator', 'Equality comparison'],
            explanation: '`@ptnum % 2 == 0` is true for even indices (0, 2, 4…). This creates an alternating pattern across all points.',
            xp: 15,
            pointShape: 'sphere',
            pointCount: 150,
          },
          {
            kind: 'mcq',
            id: 'if-3',
            title: 'What does `@P.y > 0 && @ptnum % 2 == 0` check for?',
            explanation: '`&&` requires **both** sides to be true. This is true only for points that are in the upper half AND have an even index — not either one alone.',
            choices: [
              { text: 'The point is in the upper half AND has an even index', correct: true },
              { text: 'The point is in the upper half OR has an even index', correct: false },
              { text: 'Only the upper-half condition matters', correct: false },
              { text: 'Only the even-index condition matters', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'if-4',
            title: 'Combine two conditions with AND',
            codeLines: [
              '// Paint white only if the point is in the top half AND has an even index',
              'if (@P.y > 0 ___ @ptnum % 2 == 0) {',
              '    @Cd = {1.0, 1.0, 1.0};',
              '}',
            ],
            answers: ['&&'],
            hints: ['Both conditions must be true'],
            explanation: '`&&` (AND) only lets the branch run when every condition on either side is true.',
            xp: 15,
            pointShape: 'sphere',
            pointCount: 150,
          },
          {
            kind: 'mcq',
            id: 'if-5',
            title: 'What does `@P.y > 0.3 || @P.y < -0.3` check for?',
            explanation: '`||` only needs **one** side to be true. This matches points that are either well above the middle OR well below it — the middle band is excluded.',
            choices: [
              { text: 'The point is far from the middle (above 0.3 OR below -0.3)', correct: true },
              { text: 'The point is exactly in the middle band', correct: false },
              { text: 'Both conditions must be true at once', correct: false },
              { text: 'Neither condition can ever be true', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'if-6',
            title: 'Chain a third branch with else if',
            codeLines: [
              '// Three-way split: top = yellow, bottom = blue, middle = white',
              'if (@P.y > 0.3) {',
              '    @Cd = {1.0, 1.0, 0.0};',
              '} ___ (@P.y < -0.3) {',
              '    @Cd = {0.0, 0.0, 1.0};',
              '} else {',
              '    @Cd = {1.0, 1.0, 1.0};',
              '}',
            ],
            answers: ['else if'],
            hints: ['Keyword pair for "otherwise, if this other condition is true"'],
            explanation: '`else if` is checked only when the first `if` was false — chaining several lets you split into more than two outcomes, and only one branch ever runs.',
            xp: 20,
            pointShape: 'sphere',
            pointCount: 200,
          },
          {
            kind: 'mcq',
            id: 'if-7',
            title: 'Why doesn\'t `0 < @P.y < 1` correctly check whether @P.y is between 0 and 1?',
            explanation: 'VEX (like C) evaluates this left to right in two separate steps: first `0 < @P.y` produces `0` or `1` (a boolean-as-int), then **that result** gets compared to `1`. So `5 < @P.y < 1` doesn\'t mean "@P.y is between 0 and 1" at all — it silently does something else. Use `@P.y > 0 && @P.y < 1` instead.',
            choices: [
              { text: 'It\'s evaluated as `(0 < @P.y) < 1`, not "between 0 and 1" — use && instead', correct: true },
              { text: 'It\'s a syntax error in VEX', correct: false },
              { text: 'It works correctly — this is a valid way to check a range', correct: false },
              { text: 'It only checks the first comparison and ignores the second', correct: false },
            ],
            xp: 15,
          },
          {
            kind: 'code',
            id: 'if-2',
            title: 'Top / Bottom split',
            prompt: 'Color the **top half** of the sphere yellow (`{1, 1, 0}`) and the **bottom half** cyan (`{0, 1, 1}`).\n\nYou decide the threshold — but make sure no points are left with the default grey.',
            starterCode: '// Use @P.y to distinguish top from bottom\nif (___) {\n    @Cd = ___; // top color\n} else {\n    @Cd = ___; // bottom color\n}\n',
            solutionCode: 'if (@P.y > 0) {\n    @Cd = {1, 1, 0};\n} else {\n    @Cd = {0, 1, 1};\n}\n',
            checks: [
              {
                description: 'No point has the default color {0.4, 0.8, 1.0}',
                test: (pts) => !pts.some(p =>
                  Math.abs(p.Cd.x - 0.4) < 0.05 &&
                  Math.abs(p.Cd.y - 0.8) < 0.05 &&
                  Math.abs(p.Cd.z - 1.0) < 0.05
                ),
              },
              {
                description: 'At least two distinct colors are used',
                test: (pts) => {
                  const first = pts[0]
                  return pts.slice(1).some(p =>
                    Math.abs(p.Cd.x - first.Cd.x) > 0.1 ||
                    Math.abs(p.Cd.y - first.Cd.y) > 0.1 ||
                    Math.abs(p.Cd.z - first.Cd.z) > 0.1
                  )
                },
              },
              {
                description: 'Top and bottom halves have different colors',
                test: (pts) => {
                  const top = pts.filter(p => p.P.y > 0.3)
                  const bot = pts.filter(p => p.P.y < -0.3)
                  if (!top.length || !bot.length) return false
                  // Compare colors as vectors, not summed channels — yellow {1,1,0}
                  // and cyan {0,1,1} both sum to 2 despite being clearly different.
                  const avg = (arr: typeof pts, c: 'x' | 'y' | 'z') => arr.reduce((s, p) => s + p.Cd[c], 0) / arr.length
                  const dx = avg(top, 'x') - avg(bot, 'x')
                  const dy = avg(top, 'y') - avg(bot, 'y')
                  const dz = avg(top, 'z') - avg(bot, 'z')
                  return Math.sqrt(dx * dx + dy * dy + dz * dz) > 0.3
                },
              },
              {
                description: 'Uses an if/else statement',
                test: (_pts, _out, code) => /\bif\s*\(/.test(code),
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            explanation: 'Conditional logic lets you apply different effects to different parts of geometry. `@P.y > 0` selects the upper hemisphere.',
            xp: 25,
          },
        ],
      },

      {
        id: 'loops',
        title: 'Loops',
        icon: '🔁',
        description: 'for, while, break & continue',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-loop-1',
            title: 'The for loop',
            body: 'A `for` loop repeats code a fixed number of times. It has three parts in the parentheses:\n1. **Init** — runs once before the loop (`int i = 0`)\n2. **Condition** — checked before each iteration; stop when false (`i < 10`)\n3. **Increment** — runs after each body (`i++`)\n\n`i++` is shorthand for `i += 1`.',
            codeExample: '// Accumulate a sum: 0+1+2+3+4 = 10\nfloat total = 0;\nfor (int i = 0; i < 5; i++) {\n    total += i;\n}\n// total is now 10\n\n// Count down\nfor (int i = 10; i > 0; i--) {\n    printf("%d\\n", i);\n}',
            keyPoints: [
              'for (init; condition; increment) { body }',
              'i++ is shorthand for i += 1',
              'Loop variable is local to the for block',
              'Avoid infinite loops — always have a termination condition',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-loop-2',
            title: 'sin() for wave patterns',
            body: '`sin(x)` oscillates between -1 and +1 as `x` increases. This is perfect for creating wave patterns.\n\nBy using `@ptnum` as the input to `sin()`, each point gets a different phase of the wave. Multiplying by a small number (like 0.3) controls the **frequency** of the wave. Multiplying the result (like `* 0.3`) controls the **amplitude**.',
            codeExample: '// Wave displacement — run on a grid\n@P.y += sin(@ptnum * 0.4) * 0.5;\n\n// Ripple from center\nfloat dist = length(@P);\n@P.y += sin(dist * 8.0) * 0.2;',
            keyPoints: [
              'sin(x) oscillates between -1 and +1',
              'Multiply the input to change wave frequency',
              'Multiply the result to change wave amplitude',
              '@ptnum as input creates per-point variation',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-loop-3',
            title: 'The while loop',
            body: 'A `while` loop repeats its body as long as a condition stays true. Unlike `for`, it has no built-in init or increment — you manage the loop variable yourself, inside the body.\n\nUse `while` when you don\'t know in advance how many iterations you\'ll need.',
            codeExample: '// Halve a value until it drops below 0.01\nfloat v = 100;\nint steps = 0;\nwhile (v > 0.01) {\n    v *= 0.5;\n    steps++;\n}\n// steps now holds how many halvings it took',
            keyPoints: [
              'while (condition) { body } — runs as long as condition is true',
              'You must update the loop variable yourself, inside the body',
              'Forgetting to update it causes an infinite loop',
              'Use while when the iteration count isn\'t known ahead of time',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-loop-4',
            title: 'break and continue',
            body: '`break` immediately exits the loop entirely — no further iterations run, even if the condition is still true.\n\n`continue` skips straight to the next iteration — the rest of the current iteration\'s body is skipped, but the loop keeps going.\n\nBoth work the same way in `for` and `while` loops.',
            codeExample: '// break: stop as soon as we find an odd index\nint firstOdd = -1;\nfor (int i = 0; i < 10; i++) {\n    if (i % 2 != 0) {\n        firstOdd = i;\n        break;\n    }\n}\n// firstOdd is 1 — the loop stopped immediately\n\n// continue: skip the rest of the body for even i\nfloat total = 0;\nfor (int i = 0; i < 6; i++) {\n    if (i % 2 == 0) continue;\n    total += i;\n}\n// total is 1 + 3 + 5 = 9',
            keyPoints: [
              'break exits the loop immediately, skipping remaining iterations',
              'continue skips the rest of the current iteration; the loop keeps going',
              'Both work in for and while loops',
              'break is useful for "stop as soon as found" searches',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'loop-1',
            title: 'How many times does this loop run?  `for (int i = 0; i < 4; i++)`',
            explanation: 'i = 0, 1, 2, 3 — the condition `i < 4` becomes false when i reaches 4, so the loop runs **4 times**.',
            choices: [
              { text: '4 times', correct: true },
              { text: '3 times', correct: false },
              { text: '5 times', correct: false },
              { text: '0 times', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'loop-2',
            title: 'Complete the for loop',
            codeLines: [
              'float sum = 0;',
              '___ (int i = 1; i <= 5; ___) {',
              '    sum += i;',
              '}',
              '// sum should be 1+2+3+4+5 = 15',
            ],
            answers: ['for', 'i++'],
            hints: ['Loop keyword', 'Increment the counter by 1'],
            explanation: '`for (int i = 1; i <= 5; i++)` iterates i = 1, 2, 3, 4, 5. Each iteration adds i to sum.',
            xp: 15,
          },
          {
            kind: 'code',
            id: 'loop-3',
            title: 'Wave surface',
            prompt: 'Create a wave effect on the grid by displacing each point\'s Y position using `sin()`.\n\n- The displacement should vary per point (use `@ptnum` or `@P.x`)\n- The wave should have visible peaks and troughs\n- Give the points a nice color too',
            starterCode: '// Displace Y with a sine wave\n// Tip: sin(@ptnum * frequency) * amplitude\n@P.y += ___;\n@Cd = {0.3, 0.8, 1.0};\n',
            solutionCode: '@P.y += sin(@ptnum * 0.3) * 0.4;\n@Cd = {0.3, 0.8, 1.0};\n',
            checks: [
              {
                // The grid's rows already span Y from -1 to 1 before any code runs, so checking
                // the WHOLE grid's Y range passes trivially even with an empty wrangle. Instead,
                // compare points within a single row — they all start at the SAME Y, so only a
                // real per-point displacement (not a no-op or uniform shift) can split them apart.
                description: 'Y displacement varies per point (a real wave, not a no-op or uniform shift)',
                test: (pts) => {
                  const side = Math.ceil(Math.sqrt(pts.length))
                  const row = pts.slice(0, side)
                  const range = Math.max(...row.map(p => p.P.y)) - Math.min(...row.map(p => p.P.y))
                  return range > 0.15
                },
              },
              {
                description: 'Color was changed from the default grey',
                test: (pts) => pts.every(p =>
                  Math.abs(p.Cd.x - 0.4) > 0.05 || Math.abs(p.Cd.y - 0.8) > 0.05 || Math.abs(p.Cd.z - 1.0) > 0.05
                ),
              },
            ],
            pointShape: 'grid',
            pointCount: 400,
            explanation: '`sin(@ptnum * 0.3) * 0.4` — frequency 0.3 controls how tight the wave is, amplitude 0.4 controls height. A grid shows waves best.',
            xp: 25,
          },
          {
            kind: 'code',
            id: 'loop-4',
            title: 'Layer waves with a for loop',
            prompt: 'Use an actual `for` loop this time: add together 3 sine waves of increasing frequency (multiply the frequency by the loop counter `i`), then use the total to displace `@P.y`.',
            starterCode: '// Sum 3 sine waves of increasing frequency with a for loop\nfloat wave = 0;\nfor (int i = 1; i <= 3; i++) {\n    wave += sin(@ptnum * 0.15 * ___);\n}\n@P.y += wave * ___;\n@Cd = {0.3, 0.6, 1.0};\n',
            solutionCode: 'float wave = 0;\nfor (int i = 1; i <= 3; i++) {\n    wave += sin(@ptnum * 0.15 * i);\n}\n@P.y += wave * 0.15;\n@Cd = {0.3, 0.6, 1.0};\n',
            checks: [
              {
                description: 'Uses a for loop',
                test: (_pts, _out, code) => /\bfor\s*\(/.test(code),
              },
              {
                // Same trap as loop-3: the grid's rows already span Y from -1 to 1 before any
                // code runs, so a whole-grid range check passes even on an empty loop body.
                // Points within a single row all start at the same Y, so only a real per-point
                // displacement can split them apart.
                description: 'Y displacement varies per point within the grid (a real layered wave, not a no-op)',
                test: (pts) => {
                  const side = Math.ceil(Math.sqrt(pts.length))
                  const row = pts.slice(0, side)
                  const range = Math.max(...row.map(p => p.P.y)) - Math.min(...row.map(p => p.P.y))
                  return range > 0.15
                },
              },
            ],
            pointShape: 'grid',
            pointCount: 400,
            explanation: 'The `for` loop runs 3 times, each time adding a sine wave with a higher frequency (`0.15 * i`). Summing waves like this is the basis of more complex effects like FBM noise, which you\'ll see later.',
            xp: 25,
          },
          {
            kind: 'mcq',
            id: 'loop-5',
            title: 'How many times does this loop run?  `int i = 0; while (i < 3) { i += 1; }`',
            explanation: 'i starts at 0 and gains 1 each iteration: i = 0, 1, 2 — three iterations. Once i becomes 3, `i < 3` is false and the loop stops.',
            choices: [
              { text: '3 times', correct: true },
              { text: '2 times', correct: false },
              { text: '4 times', correct: false },
              { text: 'Forever — this is an infinite loop', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'loop-6',
            title: 'Write a while loop',
            codeLines: [
              '// Sum 1 through 5, using a while loop instead of a for loop',
              'float sum = 0;',
              'int i = 1;',
              '___ (i <= 5) {',
              '    sum += i;',
              '    ___;',
              '}',
              '// sum should be 1+2+3+4+5 = 15',
            ],
            answers: ['while', 'i++'],
            hints: ['Loop keyword for condition-only loops', 'Update the counter, or this never ends'],
            explanation: '`while (i <= 5)` keeps looping as long as `i` is at most 5. Without `i++`, the condition would never become false — a while loop\'s counter must be updated inside its own body.',
            xp: 15,
          },
          {
            kind: 'mcq',
            id: 'loop-7',
            title: 'What\'s wrong with this loop?  `int i = 0; while (i < 5) { @Cd = {1, 0, 0}; }`',
            explanation: '`i` is declared but never updated inside the loop body, so `i < 5` is always true — this is an infinite loop. Every `while` loop needs something inside its body that eventually makes the condition false.',
            choices: [
              { text: 'i is never updated inside the loop, so it runs forever', correct: true },
              { text: 'Nothing is wrong — it colors 5 points red', correct: false },
              { text: 'while loops cannot set @Cd', correct: false },
              { text: 'The condition should be i <= 5', correct: false },
            ],
            xp: 15,
          },
          {
            kind: 'fill',
            id: 'loop-8',
            title: 'Stop early with break',
            codeLines: [
              '// Find the FIRST multiple of 7 between 1 and 50',
              'int found = -1;',
              'for (int i = 1; i <= 50; i++) {',
              '    if (i % 7 == 0) {',
              '        found = i;',
              '        ___;',
              '    }',
              '}',
              '// found should be 7 — the smallest multiple, not the largest',
            ],
            answers: ['break'],
            hints: ['Exit the loop immediately'],
            explanation: '`break` stops the loop the instant the first multiple of 7 (which is 7 itself) is found. Without it, the loop keeps overwriting `found` with every later multiple, ending at 49 — the LAST one under 50, not the first.',
            xp: 20,
          },
          {
            kind: 'mcq',
            id: 'loop-9',
            title: 'What does `total` equal after this loop?  `float total = 0; for (int i = 0; i < 6; i++) { if (i % 2 == 0) continue; total += i; }`',
            explanation: '`continue` skips `total += i;` whenever `i` is even (0, 2, 4) — but the loop keeps running. Only the odd values 1, 3, 5 reach the `total += i;` line, so total = 1 + 3 + 5 = 9.',
            choices: [
              { text: '9', correct: true },
              { text: '15', correct: false },
              { text: '0 — the loop stops at the first even i', correct: false },
              { text: '6', correct: false },
            ],
            xp: 15,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MODULE 4 — Noise & Patterns
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'noise',
    title: 'Noise & Patterns',
    icon: '🌊',
    tier: 1,
    lessons: [
      {
        id: 'noise-basics',
        title: 'Noise & Randomness',
        icon: '🎲',
        description: 'rand, noise, and organic patterns',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-noise-1',
            title: 'rand() — controlled randomness',
            body: '`rand(seed)` returns a **pseudo-random float between 0 and 1**. It\'s deterministic: the same seed always gives the same result, so your geometry is stable across renders.\n\nUsing `@ptnum` as the seed gives each point a unique but stable random value. Perfect for per-point variation.',
            codeExample: '// Each point gets a unique random value\nfloat r = rand(@ptnum);\n@Cd = {r, r, r}; // random greyscale\n\n// Random height offset\n@P.y += rand(@ptnum) * 0.5 - 0.25;',
            keyPoints: [
              'rand(seed) → float 0..1',
              'Same seed → always same result (deterministic)',
              'Use @ptnum as seed for per-point variation',
              'rand(@ptnum * 3 + 0/1/2) for independent channels',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-noise-2',
            title: 'noise() — organic variation',
            body: '`noise(position)` is **smooth random**. Unlike `rand()`, neighboring inputs give neighboring outputs — the noise is continuous. This creates organic, flowing variation instead of spiky random.\n\nPassing `@P` (the point\'s 3D position) as input means nearby points in space get similar noise values, which looks natural.',
            codeExample: '// Organic displacement\nfloat n = noise(@P);        // 0..1\n@P.y  += (n - 0.5) * 0.6;  // offset from center\n@Cd    = {n, n * 0.3, 1 - n};',
            keyPoints: [
              'noise(pos) → float 0..1, smooth between neighbors',
              'Pass @P for spatially coherent variation',
              'Multiply input to control frequency',
              'Use noise() for organic, natural-looking effects',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'noise-1',
            title: 'What is the key difference between rand() and noise()?',
            explanation: '`rand()` gives **independent** random values — neighboring seeds give unrelated results. `noise()` is **smooth** — nearby positions give similar values, creating continuous organic variation.',
            choices: [
              { text: 'noise() is smooth/continuous; rand() is fully random', correct: true },
              { text: 'rand() is faster', correct: false },
              { text: 'noise() returns integers', correct: false },
              { text: 'They are the same function', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'noise-fill',
            title: 'Per-point random color',
            codeLines: [
              '// Give each point a random value using its index',
              'float r = ___(@ptnum);',
              '// Use it as a green multiplier to get a warm red→orange tone',
              '@Cd = {r, r * ___, 0.0};',
            ],
            answers: ['rand', { min: 0, max: 1 }],
            hints: ['Random function name', 'A float multiplier between 0 and 1 — watch the 3D preview, you want orange, not yellow or pure red'],
            explanation: '`rand(@ptnum)` gives each point a stable unique value. Multiplying the green channel by something between 0 and 1 (try 0.5) keeps it warm — red and a bit of green makes orange.',
            xp: 15,
            pointShape: 'sphere',
            pointCount: 150,
          },
          {
            kind: 'code',
            id: 'noise-2',
            title: 'Random scatter',
            prompt: 'Give each point a **random grayscale color** and a **random Y displacement** (±0.3 units).\n\nEach channel and each axis should vary independently per point — use different seeds for each.',
            starterCode: '// Unique random value per point\nfloat r = rand(@ptnum);\n// Random Y displacement: range -0.3 to +0.3\n// Hint: rand() returns 0..1, so (rand() - 0.5) * 0.6 gives -0.3..0.3\n',
            solutionCode: 'float r = rand(@ptnum);\n@Cd = {r, r, r};\n@P.y += (rand(@ptnum * 7 + 13) - 0.5) * 0.6;\n',
            checks: [
              {
                description: 'Colors vary between points',
                test: (pts) => {
                  const first = pts[0]?.Cd.x ?? 0
                  return pts.slice(1, 20).some(p => Math.abs(p.Cd.x - first) > 0.1)
                },
              },
              {
                description: 'Y positions are displaced (not all on the sphere surface)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  return Math.max(...ys) - Math.min(...ys) > 0.5
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 200,
            explanation: 'To get independent values for color and displacement, use different seeds: `rand(@ptnum)` and `rand(@ptnum * 7 + 13)`. Same base seed but different salt.',
            xp: 20,
          },
          {
            kind: 'code',
            id: 'noise-3',
            title: 'Organic surface',
            prompt: 'Use `noise(@P)` to create an organic displacement on the sphere.\n\n- Displace `@P` in some direction using noise\n- Color the points based on the noise value\n- The result should look bumpy and organic, not flat',
            starterCode: '// Get smooth noise at this point\'s position\nfloat n = noise(@P);\n// Displace and color...\n',
            solutionCode: 'float n = noise(@P);\n@P += @N * (n - 0.5) * 0.5;\n@Cd = {n, n * 0.4, 1.0 - n};\n',
            checks: [
              {
                description: 'Points are displaced (Y range > 0.3)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  return Math.max(...ys) - Math.min(...ys) > 0.3
                },
              },
              {
                description: 'Colors vary between points',
                test: (pts) => {
                  const first = pts[0]
                  return pts.slice(1, 20).some(p =>
                    Math.abs(p.Cd.x - first.Cd.x) > 0.05 ||
                    Math.abs(p.Cd.y - first.Cd.y) > 0.05 ||
                    Math.abs(p.Cd.z - first.Cd.z) > 0.05
                  )
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 300,
            explanation: '`noise(@P)` gives spatially coherent values — nearby points get similar noise. Displacing along `@N` (normal) pushes points outward/inward for a bumpy look.',
            xp: 30,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 2 — MODULE 5: Procedural Patterns
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'patterns',
    title: 'Procedural Patterns',
    icon: '🔵',
    tier: 2,
    lessons: [
      {
        id: 'circles',
        title: 'Circles & Spirals',
        icon: '⭕',
        description: 'Arrange points with cos/sin',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-circ-1',
            title: 'Circular motion with cos() and sin()',
            body: '`cos(angle)` and `sin(angle)` are the key to placing things on a circle. Given an **angle in radians**, they return the X and Z coordinates of a point on a unit circle.\n\nTo place `@numpt` points evenly around a circle:\n1. Compute each point\'s angle: `t * 2 * 3.14159` where `t` is 0 to 1\n2. Set `@P.x = cos(angle) * radius`\n3. Set `@P.z = sin(angle) * radius`',
            codeExample: 'float t     = @ptnum / float(@numpt); // 0..1\nfloat angle = t * 2.0 * 3.14159;     // 0..2PI\nfloat radius = 1.5;\n\n@P.x = cos(angle) * radius;\n@P.y = 0.0;\n@P.z = sin(angle) * radius;',
            keyPoints: [
              'cos(angle) → X, sin(angle) → Z places on a circle',
              'Divide @ptnum by float(@numpt) to get 0..1',
              'Multiply by 2*PI (6.28318) for a full revolution',
              'Vary the radius or add @P.y to get spirals',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-circ-2',
            title: 'Spirals and helices',
            body: 'A **spiral** is a circle where the radius grows with the angle. A **helix** is a circle that moves along the Y axis as it turns.\n\nBoth are variations on the same circle formula — just change what you multiply the radius by, or add a Y offset.',
            codeExample: '// Helix: circle + vertical lift\nfloat t     = @ptnum / float(@numpt);\nfloat angle = t * 4.0 * 3.14159;  // 2 full turns\nfloat radius = 1.2;\n\n@P.x = cos(angle) * radius;\n@P.z = sin(angle) * radius;\n@P.y = t * 2.0;   // climb from 0 to 2\n\n// Spiral: growing radius\n// @P.x = cos(angle) * t * 2.0;\n// @P.z = sin(angle) * t * 2.0;',
            keyPoints: [
              'Helix: add @P.y = t * height for vertical rise',
              'Spiral: use t as the radius (grows from 0 to max)',
              'Control turns by multiplying t by number_of_turns * 2 * PI',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'circ-1',
            title: 'What is `cos(0)` and `sin(0)`?',
            explanation: 'At angle 0: `cos(0) = 1` and `sin(0) = 0`. So the starting point of a circle is always at `(radius, 0)` — the rightmost point.',
            choices: [
              { text: 'cos(0)=1,  sin(0)=0', correct: true },
              { text: 'cos(0)=0,  sin(0)=1', correct: false },
              { text: 'cos(0)=1,  sin(0)=1', correct: false },
              { text: 'cos(0)=0,  sin(0)=0', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'circ-fill-1',
            title: 'Complete the circle formula',
            codeLines: [
              'float t     = @ptnum / float(@numpt);',
              'float angle = t * 2.0 * ___;    // full circle in radians',
              'float r     = 1.5;',
              '',
              '@P.x = ___(angle) * r;',
              '@P.y = 0.0;',
              '@P.z = ___(angle) * r;',
            ],
            answers: [{ min: 3.13, max: 3.15 }, 'cos', 'sin'],
            hints: ['Pi — the half-circle constant (~3.14159)', 'Returns X component of a unit circle', 'Returns Z component of a unit circle'],
            explanation: 'Full circle = 2π radians. `cos(angle)` → X, `sin(angle)` → Z. Together they trace a perfect circle.',
            pointShape: 'random',
            pointCount: 150,
            xp: 20,
          },
          {
            kind: 'code',
            id: 'circ-code-1',
            title: 'Arrange points in a circle',
            prompt: 'Rearrange all points into a perfect circle of radius **1.5** in the XZ plane (Y=0).\n\nAll points should be equally spaced. Color them based on their angle (use `t` to drive `@Cd.x`).',
            starterCode: '// t = 0..1 across all points\nfloat t     = @ptnum / float(@numpt);\nfloat angle = ___;\n\n@P.x = ___;\n@P.y = 0.0;\n@P.z = ___;\n\n@Cd = {t, 0.3, 1.0 - t};\n',
            solutionCode: 'float t     = @ptnum / float(@numpt);\nfloat angle = t * 2.0 * 3.14159;\n\n@P.x = cos(angle) * 1.5;\n@P.y = 0.0;\n@P.z = sin(angle) * 1.5;\n\n@Cd = {t, 0.3, 1.0 - t};\n',
            checks: [
              {
                description: 'All points roughly the same distance from origin (~1.5)',
                test: (pts) => {
                  const dists = pts.map(p => Math.sqrt(p.P.x*p.P.x + p.P.z*p.P.z))
                  const avg = dists.reduce((a, b) => a + b, 0) / dists.length
                  const variance = dists.reduce((s, d) => s + Math.abs(d - avg), 0) / dists.length
                  return Math.abs(avg - 1.5) < 0.3 && variance < 0.15
                },
              },
              {
                description: 'Points are in the XZ plane (Y near 0)',
                test: (pts) => pts.every(p => Math.abs(p.P.y) < 0.1),
              },
            ],
            pointShape: 'random',
            pointCount: 120,
            explanation: '`float(@numpt)` casts to float to avoid integer division. Multiplying by 2π gives a full revolution. cos/sin place points on the circle.',
            xp: 30,
          },
          {
            kind: 'code',
            id: 'circ-code-2',
            title: 'Build a helix',
            prompt: 'Transform the points into a **3D helix** — a circle that rises along Y.\n\n- 3 full rotations (`t * 6 * 3.14159`)\n- Radius: 1.0\n- Y rises from 0 to 2.0\n- Color based on height',
            starterCode: 'float t     = @ptnum / float(@numpt);\nfloat angle = ___;\n\n@P.x = cos(angle) * 1.0;\n@P.z = sin(angle) * 1.0;\n@P.y = ___;\n\n@Cd = {t, 1.0 - t, 0.5};\n',
            solutionCode: 'float t     = @ptnum / float(@numpt);\nfloat angle = t * 6.0 * 3.14159;\n\n@P.x = cos(angle) * 1.0;\n@P.z = sin(angle) * 1.0;\n@P.y = t * 2.0;\n\n@Cd = {t, 1.0 - t, 0.5};\n',
            checks: [
              {
                description: 'Points form a circle in XZ (radius ~1.0)',
                test: (pts) => {
                  const dists = pts.map(p => Math.sqrt(p.P.x*p.P.x + p.P.z*p.P.z))
                  const avg = dists.reduce((a,b)=>a+b,0)/dists.length
                  return Math.abs(avg - 1.0) < 0.2
                },
              },
              {
                description: 'Y varies from near 0 to near 2 (helix rises)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  return Math.min(...ys) < 0.2 && Math.max(...ys) > 1.5
                },
              },
            ],
            pointShape: 'random',
            pointCount: 200,
            explanation: 'Multiply angle by 6π for 3 full turns. Set Y = t * height for the vertical rise. The result is a DNA-like double-helix shape.',
            xp: 35,
          },
        ],
      },

      {
        id: 'modulo-patterns',
        title: 'Repeating Patterns',
        icon: '♟️',
        description: 'Stripes, rings, and checkerboards',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-mod-1',
            title: 'Modulo and int() for patterns',
            body: 'Two functions unlock almost all repeating patterns:\n\n- `%` (modulo) gives the **remainder** after division: `7 % 3 = 1`. Use it to create periodicity.\n- `int(x)` truncates a float to an integer. Combining `int(@P.x * scale) % n` creates **quantized stripes**.\n\nThe trick: multiply by a scale to control stripe frequency, then modulo by 2 for alternation.',
            codeExample: '// Alternating stripes along X (scale=3)\nint stripe = int(@P.x * 3.0 + 10.0) % 2;\n// stripe = 0 or 1, alternates every 1/3 unit\n\nif (stripe == 0) {\n    @Cd = {1.0, 0.5, 0.0}; // orange\n} else {\n    @Cd = {0.1, 0.1, 0.2}; // dark\n}',
            keyPoints: [
              'x % n → remainder, cycles 0, 1, 2 … n-1',
              'int(@P.x * scale) quantizes space into bands',
              'Adding a large number (+10) avoids negative modulo issues',
              '% 2 → alternating: 0, 1, 0, 1…',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-mod-2',
            title: 'Distance-based rings',
            body: 'For **rings** (concentric circles), use `length(@P)` as input to a modulo pattern.\n\n`length(@P)` is the distance from the origin — it\'s already a radial coordinate. Quantize it with `int(dist * scale) % 2` to get alternating rings.',
            codeExample: '// Concentric rings\nfloat dist  = length(@P);\nint   ring  = int(dist * 4.0) % 2;\n\nif (ring == 0) {\n    @Cd = {0.9, 0.6, 0.1}; // gold\n} else {\n    @Cd = {0.1, 0.1, 0.3}; // dark blue\n}\n\n// The 4.0 controls ring spacing (higher = tighter rings)',
            keyPoints: [
              'length(@P) = radial distance from origin',
              'int(length(@P) * freq) % 2 creates rings',
              'Combine X and Z stripes for checkerboard',
              'Offset with + 10.0 to keep int() positive',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'mod-1',
            title: 'What does `int(2.9)` return?',
            explanation: '`int()` **truncates** toward zero — it drops the decimal part. So `int(2.9) = 2`, `int(-1.7) = -1`.',
            choices: [
              { text: '2', correct: true },
              { text: '3', correct: false },
              { text: '2.9', correct: false },
              { text: '0', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'mod-2',
            title: 'Which expression gives 0 for even indices, 1 for odd?',
            explanation: '`@ptnum % 2` cycles 0, 1, 0, 1… — exactly 0 for even, 1 for odd indices.',
            choices: [
              { text: '@ptnum % 2', correct: true },
              { text: '@ptnum / 2', correct: false },
              { text: '@ptnum * 2', correct: false },
              { text: 'int(@ptnum * 0.5)', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'mod-fill-1',
            title: 'Stripes along X axis',
            codeLines: [
              '// Create alternating stripes along X',
              '// Scale = 2.0 means stripes every 0.5 units',
              'int stripe = int(@P.x * 2.0 + 10.0) ___ ___;',
              '',
              'if (stripe == 0) {',
              '    @Cd = {1.0, 0.3, 0.0};',
              '} else {',
              '    @Cd = {0.1, 0.1, 0.3};',
              '}',
            ],
            answers: ['%', '2'],
            hints: ['Modulo operator', 'Two alternating values (0 and 1)'],
            explanation: '`% 2` creates a cycle of 0 and 1. Combined with `int(@P.x * scale)`, this quantizes space into stripes.',
            xp: 20,
            pointShape: 'grid',
            pointCount: 200,
          },
          {
            kind: 'code',
            id: 'mod-code-1',
            title: 'Checkerboard',
            prompt: 'Create a **checkerboard pattern** — alternating dark and bright squares across the XZ plane.\n\nHint: combine X stripes and Z stripes. If both are 0 or both are 1 → bright. Otherwise → dark.\n`int(@P.x * 3 + 10) % 2` gives the stripe index for X.',
            starterCode: 'int sx = int(@P.x * 3.0 + 10.0) % 2;\nint sz = int(@P.z * 3.0 + 10.0) % 2;\n\n// XOR: bright when (sx + sz) is even\nint check = ___;\n\nif (check == 0) {\n    @Cd = {0.95, 0.9, 0.8};\n} else {\n    @Cd = {0.1, 0.08, 0.12};\n}\n',
            solutionCode: 'int sx = int(@P.x * 3.0 + 10.0) % 2;\nint sz = int(@P.z * 3.0 + 10.0) % 2;\n\nint check = (sx + sz) % 2;\n\nif (check == 0) {\n    @Cd = {0.95, 0.9, 0.8};\n} else {\n    @Cd = {0.1, 0.08, 0.12};\n}\n',
            checks: [
              {
                description: 'At least two distinct colors used',
                test: (pts) => {
                  const first = pts[0]
                  return pts.some(p => Math.abs(p.Cd.x - first.Cd.x) > 0.3)
                },
              },
              {
                description: 'Roughly equal number of light and dark points',
                test: (pts) => {
                  const bright = pts.filter(p => p.Cd.x > 0.5).length
                  const dark   = pts.filter(p => p.Cd.x < 0.3).length
                  const ratio  = bright / (dark + 1)
                  return ratio > 0.5 && ratio < 2.0
                },
              },
            ],
            pointShape: 'grid',
            pointCount: 400,
            explanation: '`(sx + sz) % 2` is XOR: 0+0=0 (even→bright), 0+1=1 (odd→dark), 1+1=2%2=0 (even→bright). Classic checkerboard.',
            xp: 30,
          },
          {
            kind: 'code',
            id: 'mod-code-2',
            title: 'Concentric rings',
            prompt: 'Create **concentric colored rings** on the sphere. Use `length(@P)` as the radial coordinate and divide it into bands.\n\n- 5 visible rings (control with the scale factor)\n- Alternate between two contrasting colors\n- Give the rings some width variation using noise (optional bonus)',
            starterCode: 'float dist = length(@P);\nint   ring = int(dist * ___) % 2;\n\nif (ring == 0) {\n    @Cd = ___;\n} else {\n    @Cd = ___;\n}\n',
            solutionCode: 'float dist = length(@P);\nint   ring = int(dist * 5.0) % 2;\n\nif (ring == 0) {\n    @Cd = {0.9, 0.7, 0.1};\n} else {\n    @Cd = {0.1, 0.15, 0.4};\n}\n',
            checks: [
              {
                description: 'At least 2 distinct color bands visible',
                test: (pts) => {
                  const bright = pts.filter(p => p.Cd.x + p.Cd.y + p.Cd.z > 1.5).length
                  const dark   = pts.filter(p => p.Cd.x + p.Cd.y + p.Cd.z < 0.8).length
                  return bright > 20 && dark > 20
                },
              },
              {
                description: 'Colors not all the same (rings visible)',
                test: (pts) => {
                  const first = pts[0]
                  return pts.slice(1, 40).some(p =>
                    Math.abs(p.Cd.x - first.Cd.x) > 0.2 ||
                    Math.abs(p.Cd.y - first.Cd.y) > 0.2
                  )
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 300,
            explanation: '`length(@P)` on a sphere is always ~1, so multiply by a larger scale (like 5) to create multiple rings. The rings appear where `dist` crosses integer boundaries.',
            xp: 30,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 2 — MODULE 6: Custom Attributes
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'custom-attrs',
    title: 'Custom Attributes',
    icon: '🏷️',
    tier: 2,
    lessons: [
      {
        id: 'attr-creation',
        title: 'Creating Attributes',
        icon: '✏️',
        description: 'Export your own data with @myAttr',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-ca-1',
            title: 'Custom attributes — storing your own data',
            body: 'You\'re not limited to `@P`, `@Cd` and `@N`. You can **create any attribute** by writing to `@yourname`. Houdini will create it automatically on the first write.\n\nCustom attributes are useful for:\n- **Masking** downstream operations (e.g. a `@mask` float 0–1)\n- **Passing data** between nodes (compute in one wrangle, use in another)\n- **Controlling effects** non-destructively\n\nBy convention, prefix the name with the type: `f@mask` for float, `v@customColor` for vector — but in VEX wrangles, `@mask` works the same.',
            codeExample: '// Create a float attribute "mask" (0 to 1)\nfloat n = noise(@P * 2.0);\n@mask = n;            // auto-creates f@mask\n\n// Create a custom color attribute\n@mycolor = {rand(@ptnum), 0.5, 1.0 - rand(@ptnum)};\n\n// Use @mask to control displacement\n@P.y += @mask * 0.8;  // read it back',
            keyPoints: [
              'Write @myattr = value to create a custom attribute',
              'Houdini auto-detects the type from the value',
              'Custom attributes persist after the wrangle — use them downstream',
              'Common pattern: compute a mask, use it later',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-ca-2',
            title: 'Attribute masking',
            body: 'A **mask** is a float attribute with values 0 to 1 that controls the **intensity** of an effect. Instead of a hard if/else, multiply by the mask for smooth, blended results.\n\n`@P.y += @mask * strength` — points with `@mask = 1` get full displacement, `@mask = 0` get none.\n\nMasks are the professional way to blend effects.',
            codeExample: '// Noise-based mask — smooth 0..1 per point\n@mask = noise(@P * 3.0);\n\n// Soft displacement using the mask\n@P.y    += @mask * 0.6;\n\n// Color: white where displaced, dark where not\n@Cd = {@mask, @mask * 0.8, 1.0 - @mask};\n\n// Hard mask (threshold)\nif (@mask > 0.5) {\n    @Cd = {1.0, 0.4, 0.0};\n}',
            keyPoints: [
              'Mask = float 0..1 controlling effect intensity',
              '@P.y += @mask * strength → smooth displacement',
              'Threshold with if (@mask > 0.5) for hard edges',
              'noise() is perfect for organic masks',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'ca-1',
            title: 'You write `@speed = 3.5;` in a wrangle. What type is created?',
            explanation: '`3.5` is a float literal, so Houdini creates a `float` attribute named `speed`. If you wrote `@speed = {1,0,0}` it would be a vector.',
            choices: [
              { text: 'float', correct: true },
              { text: 'int', correct: false },
              { text: 'vector', correct: false },
              { text: 'string', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'fill',
            id: 'ca-fill-1',
            title: 'Store noise as a mask attribute',
            codeLines: [
              '// Create a float attribute "mask" from noise',
              '@___ = noise(@P * 2.0);',
              '',
              '// Use the mask: only displace where mask > 0.4',
              'if (@mask ___ 0.4) {',
              '    @P.y += 0.5;',
              '}',
            ],
            answers: ['mask', '>'],
            hints: ['Attribute name', 'Greater than comparison'],
            explanation: '`@mask = noise(@P * 2.0)` creates a per-point float attribute with noise values. The condition then uses it to selectively displace points.',
            xp: 20,
            pointShape: 'sphere',
            pointCount: 200,
          },
          {
            kind: 'code',
            id: 'ca-code-1',
            title: 'Noise mask attribute',
            prompt: 'Create a **noise-based mask** attribute and use it to control both displacement and color.\n\n1. Compute `@mask = noise(@P * 2.5)` — smooth 0..1 per point\n2. Displace `@P.y` by `(@mask - 0.5) * 0.8`\n3. Color: blend between two colors based on `@mask`\n\nThe result should look organic — bumpy and colorful.',
            starterCode: '// Step 1: compute the mask\n@mask = ___;\n\n// Step 2: displace Y\n@P.y += ___;\n\n// Step 3: color based on mask\n@Cd = lerp({0.0, 0.2, 0.8}, {1.0, 0.5, 0.0}, @mask);\n',
            solutionCode: '@mask = noise(@P * 2.5);\n@P.y += (@mask - 0.5) * 0.8;\n@Cd = lerp({0.0, 0.2, 0.8}, {1.0, 0.5, 0.0}, @mask);\n',
            checks: [
              {
                description: 'Y positions vary (displacement applied)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  return Math.max(...ys) - Math.min(...ys) > 0.4
                },
              },
              {
                description: 'Colors vary between points',
                test: (pts) => {
                  const first = pts[0]
                  return pts.slice(1, 30).some(p =>
                    Math.abs(p.Cd.x - first.Cd.x) > 0.1 || Math.abs(p.Cd.z - first.Cd.z) > 0.1
                  )
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 300,
            explanation: '`(@mask - 0.5) * 0.8` centers the noise around 0 so points go up AND down. `lerp()` with `@mask` as t blends smoothly between the two colors.',
            xp: 35,
          },
          {
            kind: 'code',
            id: 'ca-code-2',
            title: 'Two-attribute layering',
            prompt: 'Use **two separate attributes** to create a layered effect:\n\n1. `@largeMask = noise(@P * 1.0)` — large-scale variation\n2. `@detailMask = noise(@P * 5.0)` — fine detail\n3. Combine them: `@P.y += (@largeMask * 0.6) + (@detailMask * 0.15)`\n4. Color: use `@largeMask` for hue, `@detailMask` for brightness',
            starterCode: '// Large-scale noise\n@largeMask = noise(@P * 1.0);\n\n// Fine detail noise\n@detailMask = noise(@P * ___);\n\n// Layered displacement\n@P.y += (@largeMask * 0.6) + (____ * 0.15);\n\n// Color\n@Cd = {____, @largeMask * @detailMask, 1.0 - @largeMask};\n',
            solutionCode: '@largeMask = noise(@P * 1.0);\n@detailMask = noise(@P * 5.0);\n\n@P.y += (@largeMask * 0.6) + (@detailMask * 0.15);\n\n@Cd = {@largeMask, @largeMask * @detailMask, 1.0 - @largeMask};\n',
            checks: [
              {
                description: 'Large Y displacement range (> 0.5)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  return Math.max(...ys) - Math.min(...ys) > 0.4
                },
              },
              {
                description: 'Rich color variation',
                test: (pts) => {
                  const first = pts[0]
                  const varying = pts.slice(1, 40).filter(p =>
                    Math.abs(p.Cd.x - first.Cd.x) > 0.05 || Math.abs(p.Cd.z - first.Cd.z) > 0.05
                  )
                  return varying.length > 10
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 300,
            explanation: 'Layering noise at different frequencies creates "fractal detail" — a common technique in VFX. The large noise handles overall shape, the fine noise adds texture.',
            xp: 40,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 2 — MODULE 7: Combined Techniques
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'combined',
    title: 'Combined Techniques',
    icon: '🎯',
    tier: 2,
    lessons: [
      {
        id: 'multi-step',
        title: 'Multi-step Effects',
        icon: '🧩',
        description: 'Combine loops, noise, conditions and math',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-comb-1',
            title: 'Building complex effects step by step',
            body: 'Real VEX effects are built by **layering simple operations**. There\'s no single magic function — just a sequence of small, readable steps.\n\nA good workflow:\n1. **Compute coordinates** — normalize positions, compute distances\n2. **Generate masks** — noise, distance, angle-based\n3. **Apply displacement** — modulate with masks\n4. **Set color** — make it readable/beautiful\n\nEach step uses things you already know. The power comes from combining them.',
            codeExample: '// Full "planet surface" effect in ~10 lines\nfloat dist   = length(@P);          // 1. distance\nfloat lat    = @P.y / dist;         // 2. latitude (-1 to 1)\nfloat n      = noise(@P * 3.0);     // 3. noise mask\n\n// 4. displace\n@P += normalize(@P) * (n - 0.5) * 0.3;\n\n// 5. color zones\nif (lat > 0.6) {\n    @Cd = {0.9, 0.9, 1.0}; // poles: ice\n} else {\n    @Cd = lerp({0.1, 0.4, 0.9}, {0.2, 0.7, 0.3}, n);\n}',
            keyPoints: [
              'Break complex effects into readable steps',
              'normalize(@P) gives the outward direction for sphere displacement',
              'Latitude = @P.y / length(@P) — ranges -1 to 1',
              'Combine noise masks with conditional zones',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-comb-2',
            title: 'For loops for accumulated effects',
            body: 'Loops unlock **fbm (fractal brownian motion)** — layering noise at increasing frequencies and decreasing amplitudes. This creates highly detailed, natural-looking surfaces.\n\nEach "octave" adds a finer layer of detail. The classic formula:\n```\nnoise(pos) + 0.5 * noise(pos*2) + 0.25 * noise(pos*4) + ...\n```\n\nThis is how terrain, clouds, and organic surfaces are made in production VFX.',
            codeExample: '// FBM: 4 octaves of noise\nfloat fbm    = 0;\nfloat amp    = 0.5;\nvector freq  = @P;\n\nfor (int i = 0; i < 4; i++) {\n    fbm  += noise(freq) * amp;\n    freq *= 2.0;   // double frequency\n    amp  *= 0.5;   // halve amplitude\n}\n\n@P += normalize(@P) * (fbm - 0.5) * 0.5;\n@Cd = {fbm, fbm * 0.6, 1.0 - fbm};',
            keyPoints: [
              'FBM = sum of noise at increasing frequencies',
              'Each octave: freq *= 2, amp *= 0.5',
              '4-6 octaves is typical for production work',
              'normalize(@P) displaces outward — perfect for spheres',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'comb-1',
            title: 'What does `normalize(@P)` give you on a sphere?',
            explanation: 'On a sphere, `@P` already points away from the origin. `normalize(@P)` gives a **unit vector pointing radially outward**. Displacing along it pushes points away from the center.',
            choices: [
              { text: 'A unit vector pointing radially outward from the center', correct: true },
              { text: 'The position normalized to 0..1', correct: false },
              { text: 'A vector pointing toward the center', correct: false },
              { text: 'The surface normal (same as @N on a sphere)', correct: false, explanation: 'Close! On a perfect sphere @N = normalize(@P), but this isn\'t always the case.' },
            ],
            xp: 15,
          },
          {
            kind: 'fill',
            id: 'comb-fill-1',
            title: 'FBM loop structure',
            codeLines: [
              'float fbm   = 0;',
              'float amp   = 0.5;',
              'vector freq = @P;',
              '',
              'for (int i = 0; i < ___; i++) {',
              '    fbm  += noise(freq) * ___;',
              '    freq *= 2.0;',
              '    amp  *= 0.5;',
              '}',
            ],
            answers: [{ min: 4, max: 6 }, 'amp'],
            hints: ['Number of octaves (4-6 is typical)', 'Current amplitude variable'],
            explanation: '4-6 octaves is a good balance. Each octave doubles the frequency and halves the amplitude, creating self-similar detail at multiple scales.',
            xp: 20,
          },
          {
            kind: 'code',
            id: 'comb-code-1',
            title: 'FBM displacement',
            prompt: 'Implement **FBM (Fractal Brownian Motion)** to create a detailed organic surface.\n\nUse 4 octaves of noise. After the loop, displace `@P` outward (`+= normalize(@P) * (fbm - 0.5) * 0.6`) and color based on the fbm value.',
            starterCode: 'float fbm  = 0;\nfloat amp  = 0.5;\nvector pos = @P;\n\nfor (int i = 0; i < 4; i++) {\n    fbm += noise(pos) * ___;\n    pos *= ___;\n    amp *= 0.5;\n}\n\n@P += normalize(@P) * (fbm - 0.5) * 0.6;\n@Cd = lerp({0.05, 0.3, 0.8}, {0.9, 0.6, 0.1}, fbm);\n',
            solutionCode: 'float fbm  = 0;\nfloat amp  = 0.5;\nvector pos = @P;\n\nfor (int i = 0; i < 4; i++) {\n    fbm += noise(pos) * amp;\n    pos *= 2.0;\n    amp *= 0.5;\n}\n\n@P += normalize(@P) * (fbm - 0.5) * 0.6;\n@Cd = lerp({0.05, 0.3, 0.8}, {0.9, 0.6, 0.1}, fbm);\n',
            checks: [
              {
                description: 'Significant displacement (Y range > 0.5)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  return Math.max(...ys) - Math.min(...ys) > 0.4
                },
              },
              {
                description: 'Rich color variation',
                test: (pts) => {
                  const xs = pts.map(p => p.Cd.x)
                  return Math.max(...xs) - Math.min(...xs) > 0.3
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 400,
            explanation: 'FBM accumulates noise at multiple scales. Multiplying pos by 2 each iteration zooms into finer detail. The result has large shapes AND fine texture, like real terrain.',
            xp: 45,
          },
          {
            kind: 'code',
            id: 'comb-code-2',
            title: '🏔️ Planet surface',
            prompt: 'No hints. Build a **planet surface** from scratch.\n\nRequirements:\n- FBM displacement outward\n- At least 3 distinct color zones based on latitude or noise value (e.g. poles = white, mountains = grey, lowlands = colored)\n- Smooth, organic look\n\nThis is an open challenge — express yourself.',
            starterCode: '// Your planet, your rules.\n// Latitude hint: float lat = @P.y / length(@P); // -1 (south) to 1 (north)\n',
            solutionCode: '// FBM\nfloat fbm = 0;\nfloat amp = 0.5;\nvector pos = @P;\nfor (int i = 0; i < 5; i++) {\n    fbm += noise(pos) * amp;\n    pos *= 2.2;\n    amp *= 0.5;\n}\n\n// Displacement\n@P += normalize(@P) * (fbm - 0.5) * 0.5;\n\n// Latitude\nfloat lat = @P.y / length(@P);\n\n// Color zones\nif (abs(lat) > 0.75) {\n    @Cd = {0.92, 0.94, 1.0}; // poles: ice\n} else if (fbm > 0.55) {\n    @Cd = lerp({0.4, 0.35, 0.3}, {0.7, 0.6, 0.5}, fbm); // mountains\n} else {\n    @Cd = lerp({0.1, 0.35, 0.6}, {0.15, 0.55, 0.3}, fbm); // ocean/land\n}\n',
            checks: [
              {
                description: 'Displacement applied (Y range > 0.3)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  return Math.max(...ys) - Math.min(...ys) > 0.3
                },
              },
              {
                description: 'At least 3 distinct color regions',
                test: (pts) => {
                  const buckets: number[] = [0, 0, 0, 0]
                  pts.forEach(p => {
                    const b = p.Cd.x + p.Cd.y + p.Cd.z
                    if (b < 0.6) buckets[0]++
                    else if (b < 1.0) buckets[1]++
                    else if (b < 1.6) buckets[2]++
                    else buckets[3]++
                  })
                  return buckets.filter(b => b > 5).length >= 2
                },
              },
            ],
            pointShape: 'sphere',
            pointCount: 500,
            explanation: 'A real planet shader combines FBM displacement, latitude-based zones, and noise-driven color transitions. This is the kind of effect you\'d build in a Houdini production pipeline.',
            xp: 60,
          },
        ],
      },
    ],
  },
]

function localizeLearnCard(card: LearnCard): LearnCard {
  const t = FR_LEARN_CARDS[card.id]
  if (!t) return card
  return { ...card, title: t.title ?? card.title, body: t.body ?? card.body, keyPoints: t.keyPoints ?? card.keyPoints }
}

function localizeExercise(ex: Exercise): Exercise {
  const t = FR_EXERCISES[ex.id]
  if (!t) return ex

  if (ex.kind === 'mcq') {
    return {
      ...ex,
      title: t.title ?? ex.title,
      explanation: t.explanation ?? ex.explanation,
      choices: ex.choices.map((c, i) => ({
        ...c,
        text: t.choices?.[i] ?? c.text,
        explanation: t.choiceExplanations?.[i] ?? c.explanation,
      })),
    }
  }
  if (ex.kind === 'fill') {
    return {
      ...ex,
      title: t.title ?? ex.title,
      codeLines: t.codeLines ?? ex.codeLines,
      hints: t.hints ?? ex.hints,
      explanation: t.explanation ?? ex.explanation,
    }
  }
  // code exercise
  return {
    ...ex,
    title: t.title ?? ex.title,
    prompt: t.prompt ?? ex.prompt,
    explanation: t.explanation ?? ex.explanation,
    checks: ex.checks.map((c, i) => ({ ...c, description: t.checks?.[i] ?? c.description })),
  }
}

function localizeLesson(lesson: Lesson): Lesson {
  const t = FR_LESSONS[lesson.id]
  return {
    ...lesson,
    title: t?.title ?? lesson.title,
    description: t?.description ?? lesson.description,
    learnCards: lesson.learnCards?.map(localizeLearnCard),
    exercises: lesson.exercises.map(localizeExercise),
  }
}

export function getLocalizedCurriculum(lang: 'en' | 'fr'): Module[] {
  if (lang === 'en') return CURRICULUM
  return CURRICULUM.map(mod => ({
    ...mod,
    title: FR_MODULES[mod.id]?.title ?? mod.title,
    lessons: mod.lessons.map(localizeLesson),
  }))
}

export function getAllLessons() {
  return CURRICULUM.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id, moduleTitle: m.title })))
}

export function getAllExercises() {
  return getAllLessons().flatMap(l => l.exercises)
}

export function getAllItems() {
  return getAllLessons().flatMap(l => [
    ...(l.learnCards ?? []),
    ...l.exercises,
  ])
}

export function getTotalXP() {
  return getAllExercises().reduce((sum, ex) => sum + ex.xp, 0)
}
