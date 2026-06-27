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
            title: 'VEX — Vector Expression Language',
            body: 'VEX is the **scripting language at the heart of Houdini**. It lets you write custom logic that runs directly on geometry — changing positions, colors, normals, and any other attribute you can imagine.\n\nVEX is **C-like** in syntax: curly braces, semicolons, typed variables. If you\'ve written C, C++, or GLSL, you\'ll feel at home.',
            codeExample: '// This VEX code runs once per point\n// and paints every point orange\n@Cd = {1.0, 0.4, 0.0};',
            keyPoints: [
              'VEX = Vector Expression Language',
              'C-like syntax (braces, semicolons, types)',
              'Runs once per point by default in a wrangle',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-intro-2',
            title: 'The Geometry Wrangle',
            body: 'In Houdini, you write VEX inside a **Geometry Wrangle** node. When the node cooks, your code executes **once for every point** in the input geometry.\n\nTwo built-in variables tell you where you are:\n- `@ptnum` — the index of the **current** point (0, 1, 2 …)\n- `@numpt` — the **total** number of points\n\nThink of it like a `for` loop that Houdini runs for you.',
            codeExample: '// Point 0 → @ptnum is 0\n// Point 1 → @ptnum is 1\n// Point 2 → @ptnum is 2\n// ...\n// Last point → @ptnum is @numpt - 1',
            keyPoints: [
              '@ptnum = current point index (read-only)',
              '@numpt = total point count (read-only)',
              'Code runs once per point — no explicit loop needed',
            ],
          },
        ],
        exercises: [
          {
            kind: 'mcq',
            id: 'intro-1',
            title: 'VEX stands for...',
            explanation: 'VEX stands for **Vector Expression** language. It is a C-like language built into Houdini that runs on every point, primitive or vertex.',
            choices: [
              { text: 'Vector Expression', correct: true },
              { text: 'Visual Effects Extension', correct: false },
              { text: 'Volume Export XML', correct: false },
              { text: 'Voxel Expression', correct: false },
            ],
            xp: 10,
          },
          {
            kind: 'mcq',
            id: 'intro-2',
            title: 'In a Geometry Wrangle, your code runs...',
            explanation: 'By default, the code runs **once per point**. `@ptnum` is the index of the current point, `@numpt` is the total.',
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
            body: 'An **attribute** is a named value stored on geometry — every point can have its own position, color, normal, etc.\n\nIn VEX, you read and write attributes with the `@` prefix. Reading `@P` gives you the current point\'s position. Writing `@Cd = ...` sets its color.\n\nAttributes persist after the wrangle — they\'re part of the geometry data.',
            codeExample: '// Reading an attribute\nvector myPos = @P;\nfloat  height = @P.y;\n\n// Writing an attribute\n@Cd = {1.0, 0.0, 0.0};  // paint red\n@P.y += 0.5;             // lift up',
            keyPoints: [
              '@ reads or writes a geometry attribute',
              'Attributes persist on the geometry after the wrangle',
              'You can create new attributes by writing to @myname',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-attr-2',
            title: 'The built-in attributes',
            body: 'Houdini has several attributes that already exist on geometry:\n\n- `@P` *(vector)* — position in 3D space\n- `@Cd` *(vector)* — diffuse color, where X=R, Y=G, Z=B (0–1)\n- `@N` *(vector)* — surface normal (unit vector pointing "outward")\n- `@ptnum` *(int, read-only)* — index of the current point\n- `@numpt` *(int, read-only)* — total number of points\n\nYou\'ll use `@P` and `@Cd` in almost every wrangle.',
            codeExample: '// Use @ptnum to make every other point red/blue\nif (@ptnum % 2 == 0) {\n    @Cd = {1.0, 0.0, 0.0}; // even: red\n} else {\n    @Cd = {0.0, 0.3, 1.0}; // odd: blue\n}',
            keyPoints: [
              '@P = position (vector)',
              '@Cd = color, X=red Y=green Z=blue',
              '@N = normal (unit direction vector)',
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
            body: 'VEX supports the standard arithmetic operators: `+`, `-`, `*`, `/`, `%`.\n\n**Vectors and scalars mix naturally.** Multiplying a vector by a float scales all three components. Adding two vectors adds component-by-component.',
            codeExample: 'float a = 3.0;\nfloat b = a * 2.0;    // b = 6.0\nfloat c = a % 2.0;    // c = 1.0 (modulo)\n\nvector v = {1, 2, 3};\nvector w = v * 2.0;   // {2, 4, 6}\nvector s = v + {0, 1, 0}; // {1, 3, 3}',
            keyPoints: [
              'Operators: + - * / %',
              'Vector * scalar scales all components',
              'Vector + vector adds component-by-component',
              '+= -= *= /= are shorthand assignment operators',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-arith-2',
            title: 'Remapping values with fit()',
            body: '`fit(x, omin, omax, nmin, nmax)` is one of the most useful VEX functions.\n\nIt **remaps** a value from one range into another. If `x` is in `[omin, omax]`, the result is in `[nmin, nmax]`.\n\nExample: Y position goes from -1 to 1. You want to use it as a color (0 to 1). `fit(@P.y, -1, 1, 0, 1)` does exactly that.',
            codeExample: '// Map Y height (-1..1) to a 0..1 range\nfloat t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);\n\n// t = 0 at the bottom, 1 at the top\n@Cd = {t, 0.0, 0.0}; // dark red → bright red',
            keyPoints: [
              'fit(x, omin, omax, nmin, nmax) remaps a range',
              'Useful for turning positions into color values',
              'clamp() limits a value to [min, max]',
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
            kind: 'code',
            id: 'arith-3',
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
        ],
      },

      // ── Lesson 2: Vector Math ──────────────────────────────────────────────
      {
        id: 'vectors',
        title: 'Vector Math',
        icon: '↗️',
        description: 'length, normalize, dot, cross',
        learnCards: [
          {
            kind: 'learn',
            id: 'learn-vec-1',
            title: 'length() and normalize()',
            body: '`length(v)` returns the **magnitude** of a vector — the distance from the origin to the tip.\n\nFormula: `sqrt(x² + y² + z²)`\n\n`normalize(v)` returns a vector with the **same direction** but length exactly 1. A vector with length 1 is called a **unit vector** and is essential for directions, normals, and dot products.\n\nOne more handy function: `clamp(x, min, max)` forces a value to stay inside a range — anything below `min` becomes `min`, anything above `max` becomes `max`. It\'s the easiest way to squeeze a distance into a clean 0–1 range before using it as a color.',
            codeExample: 'vector v = {3, 4, 0};\nfloat  l = length(v);      // 5.0\nvector n = normalize(v);   // {0.6, 0.8, 0.0}\n\n// Distance from origin to current point\nfloat dist = length(@P);\nfloat t    = clamp(dist, 0.0, 1.0); // force into 0..1',
            keyPoints: [
              'length(v) = magnitude = sqrt(x²+y²+z²)',
              'normalize(v) = unit vector (length = 1)',
              'length(@P) = distance from the origin',
              'clamp(x, min, max) keeps a value inside [min, max]',
            ],
          },
          {
            kind: 'learn',
            id: 'learn-vec-2',
            title: 'dot() and lerp()',
            body: '`dot(a, b)` returns a single float: the **dot product**. It measures how aligned two vectors are. If both are unit vectors, `dot(a, b)` ranges from -1 (opposite) to +1 (same direction), 0 meaning perpendicular.\n\n`lerp(a, b, t)` **interpolates** between two values. At `t=0` you get `a`, at `t=1` you get `b`, in between you get a mix. Works on floats and vectors.',
            codeExample: 'vector a = {1, 0, 0};\nvector b = {0, 1, 0};\nfloat  d = dot(a, b);          // 0.0 (perpendicular)\n\nvector red  = {1, 0, 0};\nvector blue = {0, 0, 1};\nvector mix  = lerp(red, blue, 0.5); // {0.5, 0, 0.5}',
            keyPoints: [
              'dot(a, b) → float: measures alignment (-1 to 1)',
              'lerp(a, b, t) → interpolates between a and b',
              'lerp works on both floats and vectors',
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
          {
            kind: 'code',
            id: 'vec-4',
            title: 'Color by distance',
            prompt: 'These points are scattered around the world origin `{0,0,0}`, at varying distances.\n\nColor each point based on how far it is from the origin — pick two colors and blend smoothly between them: one for points close to the origin, another for points far away.',
            starterCode: 'float dist = length(@P);\nfloat t = clamp(dist, 0.0, 1.0);\n// lerp(colorA, colorB, t)\n@Cd = lerp(___, ___, t);\n',
            solutionCode: 'float dist = length(@P);\nfloat t = clamp(dist, 0.0, 1.0);\n@Cd = lerp({0, 0.3, 1}, {1, 0.4, 0}, t);\n',
            checks: [
              {
                description: 'Near points (dist < 0.3) have different color than far points (dist > 0.7)',
                test: (pts) => {
                  const near = pts.filter(p => {
                    const d = Math.sqrt(p.P.x*p.P.x + p.P.y*p.P.y + p.P.z*p.P.z)
                    return d < 0.3
                  })
                  const far = pts.filter(p => {
                    const d = Math.sqrt(p.P.x*p.P.x + p.P.y*p.P.y + p.P.z*p.P.z)
                    return d > 0.7
                  })
                  if (near.length < 2 || far.length < 2) return false
                  // Compare colors as vectors (not summed channels) — a hue swap like
                  // blue→red keeps R+G+B roughly constant even though it's clearly different.
                  const avg = (arr: typeof pts, c: 'x' | 'y' | 'z') => arr.reduce((s, p) => s + p.Cd[c], 0) / arr.length
                  const dx = avg(near, 'x') - avg(far, 'x')
                  const dy = avg(near, 'y') - avg(far, 'y')
                  const dz = avg(near, 'z') - avg(far, 'z')
                  return Math.sqrt(dx * dx + dy * dy + dz * dz) > 0.3
                },
              },
              {
                description: 'Points at a similar distance share a similar color (color follows distance, not direction)',
                test: (pts) => {
                  const dist = (p: typeof pts[number]) => Math.sqrt(p.P.x * p.P.x + p.P.y * p.P.y + p.P.z * p.P.z)
                  const band = pts.filter(p => { const d = dist(p); return d > 0.8 && d < 1.2 })
                  if (band.length < 5) return false
                  const avg = (c: 'x' | 'y' | 'z') => band.reduce((s, p) => s + p.Cd[c], 0) / band.length
                  const ax = avg('x'), ay = avg('y'), az = avg('z')
                  const variance = band.reduce((s, p) =>
                    s + (p.Cd.x - ax) ** 2 + (p.Cd.y - ay) ** 2 + (p.Cd.z - az) ** 2, 0) / band.length
                  return variance < 0.05
                },
              },
            ],
            pointShape: 'random',
            pointCount: 500,
            explanation: '`lerp(a, b, t)` blends smoothly between two colors. Combined with `clamp(length(@P), 0, 1)` you get a radial gradient.',
            xp: 25,
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
            body: 'VEX uses the same `if/else` syntax as C. The condition goes in parentheses; the body in curly braces.\n\nYou can compare:\n- Numbers: `<`, `>`, `<=`, `>=`, `==`, `!=`\n- The `%` (modulo) operator is useful for patterns: `@ptnum % 2 == 0` is true for every other point.\n\nConditions can be combined with `&&` (and) and `||` (or).',
            codeExample: '// Branch based on position\nif (@P.y > 0.0) {\n    @Cd = {1, 1, 0}; // top: yellow\n} else {\n    @Cd = {0, 0, 1}; // bottom: blue\n}\n\n// Checkerboard pattern\nif (@ptnum % 2 == 0) {\n    @Cd = {1, 1, 1};\n}',
            keyPoints: [
              'if (condition) { ... } else { ... }',
              'Comparison: == != < > <= >=',
              'Combine: && (and), || (or)',
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
            kind: 'code',
            id: 'if-2',
            title: 'Top / Bottom split',
            prompt: 'Color the **top half** of the sphere yellow and the **bottom half** cyan.\n\nYou decide the threshold — but make sure no points are left with the default grey.',
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
                  const tAvg = (top.reduce((s,p)=>s+p.Cd.x+p.Cd.y+p.Cd.z,0)/top.length)
                  const bAvg = (bot.reduce((s,p)=>s+p.Cd.x+p.Cd.y+p.Cd.z,0)/bot.length)
                  return Math.abs(tAvg - bAvg) > 0.05
                },
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
        title: 'For Loops',
        icon: '🔁',
        description: 'Iterate with for and while',
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
                description: 'Y positions vary (wave has peaks and troughs)',
                test: (pts) => {
                  const ys = pts.map(p => p.P.y)
                  const range = Math.max(...ys) - Math.min(...ys)
                  return range > 0.2
                },
              },
              {
                description: 'Displacement is not uniform (not all same Y)',
                test: (pts) => {
                  const first = pts[0]?.P.y ?? 0
                  return pts.slice(1, 20).some(p => Math.abs(p.P.y - first) > 0.05)
                },
              },
            ],
            pointShape: 'grid',
            pointCount: 400,
            explanation: '`sin(@ptnum * 0.3) * 0.4` — frequency 0.3 controls how tight the wave is, amplitude 0.4 controls height. A grid shows waves best.',
            xp: 25,
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
