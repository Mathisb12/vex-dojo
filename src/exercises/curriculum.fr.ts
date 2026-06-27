// ─── French translation overlay ───────────────────────────────────────────────
// Keyed by id so it can be merged onto the canonical (English) CURRICULUM
// without duplicating check logic, code samples, or ids.

export const FR_MODULES: Record<string, { title: string }> = {
  basics: { title: 'Les bases de VEX' },
  math: { title: 'Maths et vecteurs' },
  control: { title: 'Structures de contrôle' },
  noise: { title: 'Bruit et motifs' },
  patterns: { title: 'Motifs procéduraux' },
  'custom-attrs': { title: 'Attributs personnalisés' },
  combined: { title: 'Techniques combinées' },
}

export const FR_LESSONS: Record<string, { title: string; description: string }> = {
  intro: { title: "Qu'est-ce que VEX ?", description: 'Comprendre la place de VEX dans Houdini' },
  variables: { title: 'Nombres et texte', description: 'Déclarer des variables int, float et string' },
  'vector-intro': { title: 'Vecteurs', description: 'Déclarer et manipuler des valeurs vector' },
  attributes: { title: 'Attributs', description: 'Lire et écrire les attributs de points avec @' },
  arithmetic: { title: 'Arithmétique', description: 'Maths de base avec floats et vecteurs' },
  'fit-remap': { title: 'fit() — remapper des plages', description: 'Transformer une plage de valeurs en une autre' },
  vectors: { title: 'length() & normalize()', description: 'Mesurer et transformer la magnitude des vecteurs' },
  'clamp-lerp': { title: 'clamp() & lerp()', description: 'Contraindre une plage, puis interpoler dedans' },
  'dot-cross': { title: 'dot() & cross()', description: 'Mesurer un alignement et trouver des directions perpendiculaires' },
  conditionals: { title: 'Si / Sinon', description: 'Brancher la logique selon des conditions' },
  loops: { title: 'Boucles for', description: 'Itérer avec for et while' },
  'noise-basics': { title: 'Bruit et aléatoire', description: 'rand, noise, et motifs organiques' },
  circles: { title: 'Cercles et spirales', description: 'Placer des points avec cos/sin' },
  'modulo-patterns': { title: 'Motifs répétitifs', description: 'Rayures, anneaux et damiers' },
  'attr-creation': { title: 'Créer des attributs', description: 'Exporter tes propres données avec @monAttr' },
  'multi-step': { title: 'Effets multi-étapes', description: 'Combiner boucles, bruit, conditions et maths' },
}

export const FR_LEARN_CARDS: Record<string, { title: string; body: string; keyPoints?: string[] }> = {
  'learn-intro-1': {
    title: 'VEX — Vector Expression Language',
    body: "VEX est le **langage de script au cœur de Houdini**. Il te permet d'écrire une logique personnalisée qui s'exécute directement sur la géométrie — modifier positions, couleurs, normales, et tout autre attribut imaginable.\n\nVEX a une syntaxe **proche du C** : accolades, points-virgules, variables typées. Si tu as déjà écrit du C, C++ ou GLSL, tu seras en terrain familier.",
    keyPoints: [
      'VEX = Vector Expression Language',
      'Syntaxe proche du C (accolades, points-virgules, types)',
      "S'exécute une fois par point par défaut dans un wrangle",
    ],
  },
  'learn-intro-2': {
    title: 'Le Geometry Wrangle',
    body: "Dans Houdini, on écrit du VEX dans un nœud **Geometry Wrangle**. Quand le nœud se calcule, ton code s'exécute **une fois pour chaque point** de la géométrie en entrée.\n\nDeux variables intégrées indiquent où tu te situes :\n- `@ptnum` — l'index du point **courant** (0, 1, 2 …)\n- `@numpt` — le nombre **total** de points\n\nC'est comme une boucle `for` que Houdini exécute pour toi.",
    keyPoints: [
      '@ptnum = index du point courant (lecture seule)',
      '@numpt = nombre total de points (lecture seule)',
      'Le code tourne une fois par point — pas besoin de boucle explicite',
    ],
  },
  'learn-var-1': {
    title: 'Les types de base',
    body: "VEX t'oblige à déclarer le **type** de chaque variable. Voici les trois que tu utiliseras pour des valeurs simples :\n\n- `int` — nombres entiers : `0`, `-3`, `42`\n- `float` — nombres décimaux : `0.5`, `3.14`, `-1.0`\n- `string` — texte : `\"hello\"`\n\nLe mot-clé de type vient toujours **avant** le nom de la variable. (Il existe un quatrième type, `vector`, pour les valeurs 3D comme les positions et les couleurs — il a sa propre leçon juste après celle-ci.)",
    keyPoints: [
      'Toujours déclarer le type : int, float, string (vector dans la leçon suivante)',
      'Le mot-clé de type vient avant le nom de la variable',
      'Chaque instruction se termine par un point-virgule ;',
    ],
  },
  'learn-var-2': {
    title: 'Les vecteurs sont partout',
    body: "En 3D, presque tout est un vecteur : positions, couleurs, directions, normales.\n\nUn vecteur `{x, y, z}` regroupe trois floats. Tu peux accéder à chaque composante avec un **point** : `v.x`, `v.y`, `v.z`.\n\nLes couleurs utilisent le même type — le rouge c'est `.x`, le vert `.y`, le bleu `.z`.\n\nIl existe une seconde façon de construire un vecteur : la fonction `set(x, y, z)`. Elle fait exactement la même chose que `{x, y, z}` — utilise celle qui te semble la plus lisible selon le contexte.",
    keyPoints: [
      'vector regroupe 3 floats : {x, y, z}',
      'Les vecteurs ont des composantes .x .y .z',
      'Les couleurs sont aussi des vecteurs : .x=R, .y=G, .z=B',
      'set(x, y, z) construit un vecteur — identique à {x, y, z}',
    ],
  },
  'learn-attr-1': {
    title: 'Les attributs : le préfixe @',
    body: "Un **attribut** est une valeur nommée stockée sur la géométrie — chaque point peut avoir sa propre position, couleur, normale, etc.\n\nEn VEX, on lit et écrit les attributs avec le préfixe `@`. Lire `@P` donne la position du point courant. Écrire `@Cd = ...` change sa couleur.\n\nLes attributs (tout ce qui a un `@`) persistent après le wrangle — ils font partie des données de la géométrie. C'est différent des variables locales de la leçon précédente : `float maVar = 2;` (sans `@`) n'est qu'un espace de calcul temporaire pour ce wrangle — ça disparaît dès que le nœud suivant tourne. Seuls les noms préfixés par `@` sont vraiment sauvegardés sur la géométrie.\n\nLors de la création d'un nouvel attribut, tu peux préciser son type juste avant le `@` : `f@nom` (float), `i@nom` (int), `v@nom` (vector), `s@nom` (string). Un `@nom = ...` nu fonctionne aussi — VEX déduit le type depuis ce que tu assignes — mais le préfixe explicite rend ton intention sans ambiguïté.",
    keyPoints: [
      '@ lit ou écrit un attribut de géométrie',
      'Les attributs (avec @) persistent sur la géométrie après le wrangle',
      'Les variables locales (sans @, ex. float x = 2;) ne persistent PAS',
      'f@/i@/v@/s@ typent explicitement un nouvel attribut (float/int/vector/string)',
    ],
  },
  'learn-attr-2': {
    title: 'Les attributs intégrés',
    body: "Houdini possède déjà plusieurs attributs sur la géométrie :\n\n- `@P` *(vector)* — position dans l'espace 3D\n- `@Cd` *(vector)* — couleur diffuse, où X=R, Y=G, Z=B (0–1)\n- `@N` *(vector)* — normale de surface (vecteur unitaire pointant \"vers l'extérieur\")\n- `@ptnum` *(int, lecture seule)* — index du point courant\n- `@numpt` *(int, lecture seule)* — nombre total de points\n\nTu utiliseras `@P` et `@Cd` dans presque tous tes wrangles.",
    keyPoints: [
      '@P = position (vector)',
      '@Cd = couleur, X=rouge Y=vert Z=bleu',
      '@N = normale (vecteur directionnel unitaire)',
      '@ptnum / @numpt = index / total (lecture seule)',
    ],
  },
  'learn-arith-1': {
    title: 'Les opérateurs mathématiques en VEX',
    body: "VEX supporte les opérateurs arithmétiques standards : `+`, `-`, `*`, `/`, `%`.\n\n**Vecteurs et scalaires se mélangent naturellement.** N'importe lequel de ces opérateurs entre un vecteur et un float s'applique aux **trois composantes** — multiplication, addition, peu importe. Additionner deux vecteurs additionne composante par composante.",
    keyPoints: [
      'Opérateurs : + - * / %',
      'Le modulo % donne le reste d\'une division (7 % 3 = 1)',
      'vecteur opérateur float s\'applique aux 3 composantes',
      'vecteur + vecteur additionne composante par composante',
      '+= -= *= /= sont des raccourcis d\'affectation',
    ],
  },
  'learn-fit-1': {
    title: 'Remapper des valeurs avec fit()',
    body: "`fit(x, omin, omax, nmin, nmax)` est l'une des fonctions VEX les plus utiles.\n\nElle **remappe** une valeur d'une plage vers une autre. Si `x` est dans `[omin, omax]`, le résultat est dans `[nmin, nmax]`.\n\nExemple : la position Y va de -1 à 1. Tu veux l'utiliser comme couleur (0 à 1). `fit(@P.y, -1, 1, 0, 1)` fait exactement ça.\n\nDeux raccourcis existent pour les cas courants : `fit01(x, nmin, nmax)` suppose que ton entrée est déjà entre 0 et 1 (et la limite à cette plage d'abord), `fit10(x, nmin, nmax)` fait la même chose mais inversée — pratique pour inverser un dégradé sans retourner tes calculs.",
    keyPoints: [
      'fit(x, omin, omax, nmin, nmax) remappe une plage',
      'Utile pour transformer des positions en valeurs de couleur',
      'fit01(x, nmin, nmax) suppose une entrée déjà entre 0 et 1',
      'fit10(x, nmin, nmax) est fit01 mais inversée',
    ],
  },
  'learn-vec-1': {
    title: 'length() et normalize()',
    body: "`length(v)` retourne la **magnitude** d'un vecteur — la distance entre l'origine et la pointe.\n\nFormule : `sqrt(x² + y² + z²)`\n\n`normalize(v)` retourne un vecteur de **même direction** mais de longueur exactement 1. Un vecteur de longueur 1 s'appelle un **vecteur unitaire**, essentiel pour les directions, normales et produits scalaires.\n\nIl existe aussi `distance(a, b)` — un raccourci pour `length(a - b)`, la distance entre deux points plutôt que depuis l'origine.",
    keyPoints: [
      'length(v) = magnitude = sqrt(x²+y²+z²)',
      'normalize(v) = vecteur unitaire (longueur = 1)',
      "length(@P) = distance depuis l'origine",
      'distance(a, b) = length(a - b)',
    ],
  },
  'learn-clamp-lerp-1': {
    title: 'clamp() et lerp()',
    body: "`clamp(x, min, max)` force une valeur à rester dans une plage donnée — tout ce qui est sous `min` devient `min`, tout ce qui est au-dessus de `max` devient `max`. C'est le moyen le plus simple de ramener une distance (ou n'importe quelle valeur non bornée) dans une plage propre de 0 à 1 avant de l'utiliser comme couleur.\n\n`lerp(a, b, t)` **interpole** entre deux valeurs. À `t=0` on obtient `a`, à `t=1` on obtient `b`, entre les deux un mélange. Fonctionne sur les floats et les vecteurs. Contrairement à `fit01`, `lerp()` ne limite **pas** `t` — si tu passes `t=1.5`, ça dépasse `b`.",
    keyPoints: [
      'clamp(x, min, max) garde une valeur dans [min, max]',
      'lerp(a, b, t) → interpole entre a et b',
      'lerp fonctionne sur les floats et les vecteurs',
      'lerp ne limite pas t — combine avec clamp() si besoin',
    ],
  },
  'learn-dot-cross-1': {
    title: 'dot() et cross()',
    body: "`dot(a, b)` retourne un seul float : le **produit scalaire**. Il mesure à quel point deux vecteurs sont alignés. Si les deux sont des vecteurs unitaires, `dot(a, b)` va de **-1** (directions opposées) à **+1** (même direction), avec **0** signifiant perpendiculaire.\n\n`cross(a, b)` retourne un **vecteur** perpendiculaire à `a` et `b` à la fois — utile pour trouver \"la direction de côté\" par rapport à deux autres directions (comme construire un repère local).",
    keyPoints: [
      'dot(a, b) → float : mesure l\'alignement (-1 à 1)',
      'dot(a, b) = 0 signifie que a et b sont perpendiculaires',
      'cross(a, b) → vecteur : perpendiculaire à a et b',
    ],
  },
  'learn-if-1': {
    title: 'La logique conditionnelle en VEX',
    body: "VEX utilise la même syntaxe `if/else` que le C. La condition va entre parenthèses ; le corps entre accolades.\n\nTu peux comparer :\n- Des nombres : `<`, `>`, `<=`, `>=`, `==`, `!=`\n- L'opérateur `%` (modulo) est utile pour les motifs : `@ptnum % 2 == 0` est vrai pour un point sur deux.\n\nLes conditions peuvent se combiner avec `&&` (et) et `||` (ou).",
    keyPoints: [
      'if (condition) { ... } else { ... }',
      'Comparaison : == != < > <= >=',
      'Combiner : && (et), || (ou)',
      '% modulo : utile pour les motifs alternés',
    ],
  },
  'learn-loop-1': {
    title: 'La boucle for',
    body: "Une boucle `for` répète du code un nombre fixe de fois. Elle a trois parties entre les parenthèses :\n1. **Init** — s'exécute une fois avant la boucle (`int i = 0`)\n2. **Condition** — vérifiée avant chaque itération ; arrêt quand fausse (`i < 10`)\n3. **Incrément** — s'exécute après chaque corps (`i++`)\n\n`i++` est un raccourci pour `i += 1`.",
    keyPoints: [
      'for (init; condition; incrément) { corps }',
      'i++ est un raccourci pour i += 1',
      'La variable de boucle est locale au bloc for',
      'Évite les boucles infinies — toujours avoir une condition de fin',
    ],
  },
  'learn-loop-2': {
    title: 'sin() pour des motifs de vague',
    body: "`sin(x)` oscille entre -1 et +1 quand `x` augmente. Parfait pour créer des effets de vague.\n\nEn utilisant `@ptnum` comme entrée de `sin()`, chaque point reçoit une phase différente de la vague. Multiplier par un petit nombre (comme 0.3) contrôle la **fréquence** de la vague. Multiplier le résultat (comme `* 0.3`) contrôle l'**amplitude**.",
    keyPoints: [
      'sin(x) oscille entre -1 et +1',
      'Multiplier l\'entrée change la fréquence de la vague',
      'Multiplier le résultat change l\'amplitude de la vague',
      '@ptnum en entrée crée une variation par point',
    ],
  },
  'learn-noise-1': {
    title: 'rand() — un aléatoire contrôlé',
    body: "`rand(seed)` retourne un **float pseudo-aléatoire entre 0 et 1**. Il est déterministe : la même graine (seed) donne toujours le même résultat, donc ta géométrie reste stable entre les rendus.\n\nUtiliser `@ptnum` comme graine donne à chaque point une valeur aléatoire unique mais stable. Parfait pour une variation par point.",
    keyPoints: [
      'rand(seed) → float entre 0 et 1',
      'Même graine → toujours le même résultat (déterministe)',
      'Utiliser @ptnum comme graine pour une variation par point',
      'rand(@ptnum * 3 + 0/1/2) pour des canaux indépendants',
    ],
  },
  'learn-noise-2': {
    title: 'noise() — une variation organique',
    body: "`noise(position)` est un **aléatoire lisse**. Contrairement à `rand()`, des entrées voisines donnent des sorties voisines — le bruit est continu. Cela crée une variation organique et fluide plutôt qu'un aléatoire en pics.\n\nPasser `@P` (la position 3D du point) en entrée signifie que des points voisins dans l'espace obtiennent des valeurs de bruit similaires, ce qui semble naturel.",
    keyPoints: [
      'noise(pos) → float 0..1, lisse entre voisins',
      'Passer @P pour une variation spatialement cohérente',
      "Multiplier l'entrée pour contrôler la fréquence",
      'Utiliser noise() pour des effets organiques et naturels',
    ],
  },
  'learn-circ-1': {
    title: 'Mouvement circulaire avec cos() et sin()',
    body: "`cos(angle)` et `sin(angle)` sont la clé pour placer des points sur un cercle. Pour un **angle en radians**, ils retournent les coordonnées X et Z d'un point sur un cercle unitaire.\n\nPour placer `@numpt` points uniformément sur un cercle :\n1. Calculer l'angle de chaque point : `t * 2 * 3.14159` où `t` va de 0 à 1\n2. Définir `@P.x = cos(angle) * radius`\n3. Définir `@P.z = sin(angle) * radius`",
    keyPoints: [
      'cos(angle) → X, sin(angle) → Z place sur un cercle',
      'Diviser @ptnum par float(@numpt) pour obtenir 0..1',
      'Multiplier par 2*PI (6.28318) pour un tour complet',
      'Varier le rayon ou ajouter @P.y pour obtenir des spirales',
    ],
  },
  'learn-circ-2': {
    title: 'Spirales et hélices',
    body: "Une **spirale** est un cercle dont le rayon augmente avec l'angle. Une **hélice** est un cercle qui se déplace le long de l'axe Y en tournant.\n\nLes deux sont des variations de la même formule de cercle — change juste ce par quoi tu multiplies le rayon, ou ajoute un décalage Y.",
    keyPoints: [
      'Hélice : ajouter @P.y = t * height pour monter verticalement',
      'Spirale : utiliser t comme rayon (croît de 0 au max)',
      'Contrôler les tours en multipliant t par nombre_de_tours * 2 * PI',
    ],
  },
  'learn-mod-1': {
    title: 'Modulo et int() pour les motifs',
    body: "Deux fonctions débloquent presque tous les motifs répétitifs :\n\n- `%` (modulo) donne le **reste** d'une division : `7 % 3 = 1`. Utile pour créer de la périodicité.\n- `int(x)` tronque un float en entier. Combiner `int(@P.x * scale) % n` crée des **rayures quantifiées**.\n\nL'astuce : multiplier par une échelle pour contrôler la fréquence des rayures, puis modulo 2 pour l'alternance.",
    keyPoints: [
      'x % n → reste, cycle 0, 1, 2 … n-1',
      'int(@P.x * scale) quantifie l\'espace en bandes',
      "Ajouter un grand nombre (+10) évite les soucis de modulo négatif",
      '% 2 → alterné : 0, 1, 0, 1…',
    ],
  },
  'learn-mod-2': {
    title: 'Anneaux basés sur la distance',
    body: "Pour des **anneaux** (cercles concentriques), utilise `length(@P)` comme entrée d'un motif modulo.\n\n`length(@P)` est la distance depuis l'origine — c'est déjà une coordonnée radiale. Quantifie-la avec `int(dist * scale) % 2` pour obtenir des anneaux alternés.",
    keyPoints: [
      "length(@P) = distance radiale depuis l'origine",
      'int(length(@P) * freq) % 2 crée des anneaux',
      'Combiner rayures X et Z pour un damier',
      'Décaler avec + 10.0 pour garder int() positif',
    ],
  },
  'learn-ca-1': {
    title: 'Attributs personnalisés — stocker ses propres données',
    body: "Tu n'es pas limité à `@P`, `@Cd` et `@N`. Tu peux **créer n'importe quel attribut** en écrivant dans `@tonnom`. Houdini le crée automatiquement à la première écriture.\n\nLes attributs personnalisés sont utiles pour :\n- **Masquer** des opérations en aval (ex. un float `@mask` 0–1)\n- **Transmettre des données** entre nœuds (calculer dans un wrangle, utiliser dans un autre)\n- **Contrôler des effets** de façon non destructive\n\nPar convention, on préfixe le nom par le type : `f@mask` pour un float, `v@customColor` pour un vecteur — mais dans les wrangles VEX, `@mask` fonctionne pareil.",
    keyPoints: [
      'Écrire @monattr = valeur crée un attribut personnalisé',
      "Houdini détecte automatiquement le type depuis la valeur",
      'Les attributs personnalisés persistent après le wrangle — utilisables en aval',
      'Pattern courant : calculer un mask, l\'utiliser plus tard',
    ],
  },
  'learn-ca-2': {
    title: 'Le masquage par attribut',
    body: "Un **mask** est un attribut float avec des valeurs de 0 à 1 qui contrôle l'**intensité** d'un effet. Plutôt qu'un if/else strict, on multiplie par le mask pour des résultats lisses et mélangés.\n\n`@P.y += @mask * strength` — les points avec `@mask = 1` reçoivent le déplacement complet, ceux avec `@mask = 0` n'en reçoivent aucun.\n\nLes masks sont la méthode professionnelle pour mélanger des effets.",
    keyPoints: [
      "Mask = float 0..1 contrôlant l'intensité d'un effet",
      '@P.y += @mask * strength → déplacement lisse',
      'Seuil avec if (@mask > 0.5) pour des bords nets',
      'noise() est parfait pour des masks organiques',
    ],
  },
  'learn-comb-1': {
    title: 'Construire des effets complexes étape par étape',
    body: "Les vrais effets VEX se construisent en **superposant des opérations simples**. Pas de fonction magique unique — juste une séquence de petites étapes lisibles.\n\nUn bon workflow :\n1. **Calculer les coordonnées** — normaliser les positions, calculer les distances\n2. **Générer des masks** — bruit, distance, basé sur l'angle\n3. **Appliquer le déplacement** — moduler avec les masks\n4. **Définir la couleur** — la rendre lisible/belle\n\nChaque étape utilise des choses que tu connais déjà. La puissance vient de leur combinaison.",
    keyPoints: [
      'Décomposer les effets complexes en étapes lisibles',
      "normalize(@P) donne la direction vers l'extérieur pour déplacer une sphère",
      'Latitude = @P.y / length(@P) — va de -1 à 1',
      'Combiner des masks de bruit avec des zones conditionnelles',
    ],
  },
  'learn-comb-2': {
    title: 'Boucles for pour des effets cumulés',
    body: "Les boucles débloquent le **fbm (fractal brownian motion)** — superposer du bruit à fréquences croissantes et amplitudes décroissantes. Cela crée des surfaces très détaillées et naturelles.\n\nChaque \"octave\" ajoute une couche de détail plus fine. La formule classique :\n```\nnoise(pos) + 0.5 * noise(pos*2) + 0.25 * noise(pos*4) + ...\n```\n\nC'est ainsi que terrains, nuages et surfaces organiques sont fabriqués en VFX de production.",
    keyPoints: [
      'FBM = somme de bruit à fréquences croissantes',
      'Chaque octave : freq *= 2, amp *= 0.5',
      '4 à 6 octaves est typique en production',
      'normalize(@P) déplace vers l\'extérieur — parfait pour les sphères',
    ],
  },
}

interface ExTranslation {
  title?: string
  explanation?: string
  prompt?: string
  choices?: string[]
  choiceExplanations?: Record<number, string>
  hints?: string[]
  codeLines?: string[]
  checks?: string[]
}

export const FR_EXERCISES: Record<string, ExTranslation> = {
  // ── intro ──
  'intro-1': {
    title: 'VEX signifie...',
    explanation: 'VEX signifie **Vector Expression** language. C\'est un langage proche du C intégré à Houdini qui tourne sur chaque point, primitive ou vertex.',
    choices: ['Vector Expression', 'Visual Effects Extension', 'Volume Export XML', 'Voxel Expression'],
  },
  'intro-2': {
    title: 'Dans un Geometry Wrangle, ton code tourne...',
    explanation: 'Par défaut, le code tourne **une fois par point**. `@ptnum` est l\'index du point courant, `@numpt` le total.',
    choices: ['Une fois par point', 'Une fois pour toute la géométrie', 'Une fois par frame', 'Une fois par face de polygone'],
  },
  'intro-3': {
    title: 'Quel attribut intégré donne l\'index du point courant ?',
    explanation: '`@ptnum` est l\'index du point en cours de traitement. Il commence à 0 et va jusqu\'à `@numpt - 1`.',
    choices: ['@ptnum', '@index', '@id', 'pointnum()'],
  },
  'intro-4': {
    title: 'Un wrangle tourne sur une grille de 50 points. Que vaut `@numpt` pour chaque point ?',
    explanation: '`@numpt` est identique pour chaque point — le total ne change jamais pendant la boucle. Seul `@ptnum` change, de 0 à 49.',
    choices: ['50', '49', '0', 'Ça varie selon le point'],
  },
  // ── variables ──
  'var-1': {
    title: 'Quelle déclaration est du VEX valide ?',
    explanation: 'VEX exige un mot-clé de type explicite avant le nom de la variable : `float myVar = 3.14;`',
    choices: ['float myVar = 3.14;', 'var myVar = 3.14;', 'myVar: float = 3.14;', 'let myVar = 3.14;'],
  },
  'var-7': {
    title: 'Sauvegarde des valeurs intégrées dans tes propres variables',
    codeLines: [
      "// Copie l'index du point et le total dans des variables locales",
      'int idx   = ___;',
      'int total = ___;',
    ],
    hints: ['Index du point courant', 'Nombre total de points'],
    explanation: '`int idx = @ptnum;` copie la valeur de `@ptnum` dans une variable locale que tu as nommée toi-même. Les variables locales (sans `@`) n\'existent que pendant que le wrangle tourne sur ce point — contrairement aux attributs, elles ne sont jamais sauvegardées sur la géométrie.',
  },
  'var-2': {
    title: 'Déclare un entier',
    codeLines: ['// Déclare un entier nommé "count" avec la valeur 42', '___ count = ___;'],
    hints: ['Mot-clé de type pour les nombres entiers', 'La valeur'],
    explanation: '`int count = 42;` — le mot-clé de type `int` vient d\'abord, puis le nom, puis la valeur.',
  },
  'var-8': {
    title: 'Déclare une string',
    codeLines: ['// Déclare une string nommée "label" avec le texte "tip"', '___ label = ___;'],
    hints: ['Mot-clé de type pour le texte', 'La valeur texte — n\'oublie pas les guillemets'],
    explanation: '`string label = "tip";` — les strings contiennent du texte et doivent être entourées de guillemets `"..."`.',
  },
  'var-5': {
    title: 'Déclare un float',
    codeLines: ['// Déclare un float nommé "speed" avec la valeur 2.5', '___ speed = ___;'],
    hints: ['Mot-clé de type pour les nombres décimaux', 'La valeur'],
    explanation: '`float speed = 2.5;` — `float` est le type pour les nombres décimaux, comme `int` pour les entiers.',
  },
  'var-3': {
    title: 'Déclare un vecteur pointant vers le haut',
    codeLines: [
      "// L'axe Y pointe vers le haut dans l'espace 3D.",
      '// Déclare un vecteur nommé "up" qui pointe dans la direction +Y.',
      'vector up = {___, ___, ___};',
    ],
    hints: ['Valeur sur l\'axe X', 'Valeur sur l\'axe Y — c\'est la direction "haut"', 'Valeur sur l\'axe Z'],
    explanation: 'En 3D, l\'axe Y est "le haut". Un vecteur unitaire pointant vers le haut est `{0, 1, 0}` — zéro sur X et Z, un sur Y.',
  },
  'var-9': {
    title: 'Déclare un vecteur avec des valeurs personnalisées',
    codeLines: [
      '// Déclare un vecteur nommé "velocity" : vers la droite (x=1.5),',
      '// légèrement vers le bas (y=-0.5), et rien sur z.',
      'vector velocity = {___, ___, ___};',
    ],
    hints: ['Composante X', 'Composante Y — négatif veut dire vers le bas', 'Composante Z'],
    explanation: '`vector velocity = {1.5, -0.5, 0};` — un vecteur peut contenir n\'importe quelle valeur float, y compris des négatifs et des zéros, pas seulement des 0 et des 1.',
  },
  'var-4': {
    title: 'Comment accéder à la composante Y d\'un vecteur `v` ?',
    explanation: 'La notation par point accède aux composantes d\'un vecteur : `v.x`, `v.y`, `v.z`. Cela fonctionne sur n\'importe quel vecteur, y compris les attributs comme `@P.y`.',
    choices: ['v.y', 'v[1]', 'v->y', 'getcomp(v, 1)'],
    choiceExplanations: { 1: 'Ça fonctionne aussi en VEX, mais .y est plus lisible.', 3: 'Ça fonctionne mais c\'est verbeux — .y est la méthode standard.' },
  },
  'var-10': {
    title: 'Mets la première composante de ce vecteur à 1',
    codeLines: [
      '// Tu as déjà déclaré ce vecteur — mets juste sa première composante à 1',
      'vector col = {0.2, 0.4, 0.6};',
      'col.___ = ___;',
    ],
    hints: ['La première composante', 'La nouvelle valeur'],
    explanation: '`col.x = 1;` réécrit uniquement la composante X via la notation par point — la même astuce fonctionne sur n\'importe quel vecteur, pas seulement `@Cd`.',
  },
  'var-6': {
    title: 'Qu\'est-ce qui ne va pas avec `vector pos = 1.0;` ?',
    explanation: 'Un `vector` regroupe toujours trois floats : `{x, y, z}`. Assigner un seul float directement est une erreur de type — il faut `vector pos = {1.0, 1.0, 1.0};` ou similaire.',
    choices: ['Un vecteur a besoin de 3 valeurs entre accolades, ex. {1.0, 0.0, 0.0}', 'Rien — c\'est du VEX valide', '"vector" devrait être en majuscule', '1.0 devrait être écrit comme un int'],
  },
  'var-11': {
    title: 'Que stocke réellement `int x = 3.9;` dans `x` ?',
    explanation: 'Assigner un float à un `int` tronque (coupe) la partie décimale — ça ne fait pas d\'arrondi. `int x = 3.9;` donne `x = 3`, et `int x = -3.9;` donne `x = -3`.',
    choices: ['3 — la partie décimale est tronquée', '4 — ça arrondit au plus proche', '3.9 — int peut aussi contenir des décimales', 'Une erreur de compilation'],
  },
  // ── attributes ──
  'attr-1': {
    title: 'Que représente @Cd ?',
    explanation: '`@Cd` est l\'attribut de **couleur diffuse**. C\'est un `vector` où X=rouge, Y=vert, Z=bleu. Valeurs de 0 à 1.',
    choices: ['Couleur diffuse (RVB)', 'Direction de la caméra', 'Densité actuelle', 'Données de courbe'],
  },
  'attr-2': {
    title: 'Peins-le en rouge',
    prompt: 'Mets la couleur de chaque point en rouge pur.\n\nRappel : `@Cd` est un vecteur où X=rouge, Y=vert, Z=bleu. Utilise des valeurs entre 0 et 1.',
    checks: ['Tous les points sont rouges (Cd.x ≈ 1, Cd.y ≈ 0, Cd.z ≈ 0)'],
    explanation: '`@Cd = {1, 0, 0};` met rouge=1, vert=0, bleu=0 — rouge pur. La syntaxe de vecteur littéral `{r, g, b}` crée un vecteur en ligne.',
  },
  'attr-3': {
    title: 'Lire une composante',
    codeLines: ['// Stocke uniquement la hauteur (Y) du point courant', 'float h = @___.y;'],
    hints: ["L'attribut de position"],
    explanation: '`@P.y` lit la composante Y de la position. Tu peux faire pareil pour `.x` et `.z`.',
  },
  'attr-4': {
    title: 'Décale chaque point vers le haut',
    prompt: 'Ajoute exactement **1.0** à la position Y de chaque point. La sphère devrait visiblement monter.',
    checks: ['Chaque point Y > 0 (décalé vers le haut)', 'Le décalage est proche de 1.0 (pas plus de 2.0)'],
    explanation: '`@P.y += 1.0;` ajoute 1 à la composante Y de chaque point. `+=` est un raccourci pour `@P.y = @P.y + 1.0`.',
  },
  'attr-5': {
    title: 'Lequel de ces attributs est en lecture seule ?',
    explanation: '`@ptnum` et `@numpt` sont en lecture seule — ils décrivent juste la boucle elle-même. `@P`, `@Cd` et `@N` peuvent tous être modifiés.',
    choices: ['@ptnum', '@P', '@Cd', '@N'],
  },
  'attr-6': {
    title: 'Écris un seul canal',
    codeLines: ['// Mets uniquement le canal rouge au max, laisse vert et bleu intacts', '@Cd.___ = ___;'],
    hints: ['Quelle composante est le rouge ?', 'Valeur de rouge plein'],
    explanation: '`@Cd.x = 1;` écrit uniquement le canal rouge via la notation par point — pas besoin de réécrire tout le vecteur avec `{}`.',
  },
  'attr-7': {
    title: 'Fais persister une valeur pour de vrai',
    codeLines: [
      '// "scratch" est une variable locale — elle disparaît dès que ce wrangle se termine.',
      'float scratch = 2.0;',
      '// Fais de "result" un véritable ATTRIBUT float, pour qu\'il persiste.',
      '___result = 2.0;',
    ],
    hints: ['Préfixe de type + @ — même lettre que le mot-clé float'],
    explanation: '`f@result = 2.0;` déclare explicitement `result` comme un **attribut float**. Contrairement à `float scratch = 2.0;` (une variable locale, perdue après ce wrangle), un attribut est écrit sur la géométrie et existe encore en aval. La forme nue `@result = 2.0;` ferait la même chose ici — `f@` est juste la version explicite, utile quand tu veux préciser le type que tu crées.',
  },
  // ── arithmetic ──
  'arith-1': {
    title: 'Quel est le résultat de `{1, 0, 0} * 3.0` ?',
    explanation: 'Multiplier un vecteur par un scalaire multiplie **chaque composante** : `{1*3, 0*3, 0*3}` = `{3, 0, 0}`.',
    choices: ['{3, 0, 0}', '3.0', '{1, 0, 0}', 'Erreur — impossible de mélanger vecteur et float'],
  },
  'arith-5': {
    title: 'Quel est le résultat de `{1, 2, 3} + 1.0` ?',
    explanation: 'Un float ajouté à un vecteur se **propage** aux trois composantes : `{1+1, 2+1, 3+1}` = `{2, 3, 4}`. Même règle que `*` — ce n\'est pas que la multiplication qui se propage.',
    choices: ['{2, 3, 4}', '{1, 2, 4}', '{2, 2, 2}', 'Erreur — impossible d\'additionner vecteur et float'],
    choiceExplanations: { 1: 'Ça n\'ajouterait qu\'à la dernière composante — le scalaire s\'applique aux trois.' },
  },
  'arith-6': {
    title: "Utilise l'opérateur modulo, et calcule son résultat",
    codeLines: [
      "// Complète l'opérateur qui calcule un reste,",
      '// puis la valeur qu\'il produit pour 7 et 3.',
      'float r = 7.0 ___ 3.0;  // r = ___',
    ],
    hints: ["L'opérateur de reste (pas le résultat)", 'Le reste de 7 divisé par 3'],
    explanation: '`7 % 3 = 1` — 3 entre deux fois dans 7 (6), il reste 1. Le modulo est très utile pour les motifs répétitifs, que tu utiliseras beaucoup plus tard.',
  },
  'arith-2': {
    title: 'Double chaque position — utilise l\'opérateur raccourci `*=` (pas `= @P *`)',
    codeLines: ['// Multiplie @P par 2 — agrandit la géométrie', '@P ___ 2.0;'],
    hints: ['Opérateur multiplier-et-affecter : écris *= , pas = @P *'],
    explanation: '`@P *= 2.0;` multiplie chaque composante de la position par 2, doublant l\'échelle de la géométrie.',
  },
  'arith-7': {
    title: "Décale chaque point sur le côté — utilise l'opérateur raccourci `+=`",
    codeLines: ['// Décale chaque point de 0.5 unité vers la droite (X)', '@P.x ___ 0.5;'],
    hints: ['Opérateur additionner-et-affecter'],
    explanation: '`@P.x += 0.5;` est un raccourci pour `@P.x = @P.x + 0.5;` — même principe que `*=`, juste avec `+`.',
  },
  'arith-8': {
    title: 'Que vaut `5 % 2` ?',
    explanation: '5 divisé par 2 vaut 2 avec un reste de 1 (2×2=4, 5-4=1). Le modulo donne toujours ce reste.',
    choices: ['1', '2.5', '0', '10'],
  },
  'arith-9': {
    title: 'Agrandis et soulève',
    prompt: 'Combine deux opérateurs sur cette sphère : double sa taille, puis décale chaque point vers le haut de 0.5.\n\nUtilise les opérateurs raccourcis que tu viens de pratiquer.',
    checks: [
      'Les points sont agrandis (distance moyenne au centre augmentée)',
      'Les points sont décalés vers le haut d\'environ 0.5',
    ],
    explanation: '`@P *= 2.0;` met à l\'échelle chaque point en s\'éloignant de l\'origine (doublant le rayon de la sphère), puis `@P.y += 0.5;` décale le tout vers le haut.',
  },
  // ── fit-remap ──
  'fit-1': {
    title: 'Que retourne `fit(5, 0, 10, 0, 100)` ?',
    explanation: '5 est exactement à mi-chemin entre 0 et 10. À mi-chemin dans la nouvelle plage `[0, 100]`, ça donne **50**.',
    choices: ['50', '5', '100', '10'],
  },
  'fit-2': {
    title: 'Dégradé de hauteur',
    prompt: 'Colore les points selon leur hauteur (position Y).\n\nIl te faut un dégradé de noir vers rouge : le bas doit être sombre, le haut rouge vif.\n\nAttention : la sphère est centrée, donc ses valeurs Y vont d\'environ -1 à +1 — pas de 0 à 1.',
    checks: [
      'Les canaux vert et bleu sont proches de zéro — un vrai dégradé rouge',
      'Le canal rouge reste entre 0 et 1 (fit() remappe correctement -1..1)',
      'Les points du haut ont un rouge plus vif que ceux du bas',
    ],
    explanation: '`fit(@P.y, -1, 1, 0, 1)` mappe -1→0 et +1→1. Assigner uniquement à `@Cd.x` (avec @Cd.y et @Cd.z à 0) crée un dégradé rouge du noir (bas) au rouge (haut).',
  },
  'fit-6': {
    title: 'Quelle fonction est un raccourci pour `fit(x, 0, 1, nmin, nmax)` ?',
    explanation: '`fit01(x, nmin, nmax)` existe spécifiquement pour le cas très courant où ton entrée est déjà connue pour être entre 0 et 1 (la plupart des valeurs de bruit et de masque le sont) — ça t\'évite de retaper `0, 1` chaque fois.',
    choices: ['fit01(x, nmin, nmax)', 'fit10(x, nmin, nmax)', 'clamp(x, nmin, nmax)', 'lerp(x, nmin, nmax)'],
    choiceExplanations: { 1: 'Celle-ci est la version inversée — 1→nmin, 0→nmax.' },
  },
  'fit-3': {
    title: 'Remappe une valeur déjà entre 0 et 1',
    codeLines: ['// x est déjà entre 0 et 1 (ex: une valeur de bruit). Remappe-le vers 0.2-0.9.', 'float c = ___(x, 0.2, 0.9);'],
    hints: ['La variante de fit pour les entrées déjà entre 0 et 1'],
    explanation: '`fit01(x, nmin, nmax)` est un raccourci pour `fit(x, 0, 1, nmin, nmax)` — utilise-la quand l\'entrée est déjà connue pour être entre 0 et 1.',
  },
  'fit-4': {
    title: 'Quelle est la vraie différence entre `fit01(x, 0.2, 0.9)` et `fit(x, 0, 1, 0.2, 0.9)` ?',
    explanation: 'Elles calculent le même remappage, mais `fit01` **limite** en plus `x` à 0–1 d\'abord. `fit()` seule ne limite pas — si `x` sort de `[omin, omax]`, le résultat extrapole hors de `[nmin, nmax]`.',
    choices: [
      'fit01 limite x à 0–1 d\'abord ; fit() peut extrapoler hors de la plage',
      'Elles sont exactement identiques dans tous les cas',
      'fit01 ne fonctionne que sur des vecteurs',
      'fit01 est juste une version plus rapide du même calcul',
    ],
  },
  'fit-5': {
    title: 'Dégradé de côté à côté',
    prompt: 'Colore les points selon leur position X cette fois, pas Y.\n\nLes valeurs X de la sphère vont d\'environ -1 à +1. Mélange du bleu (gauche, X=-1) au jaune (droite, X=+1).',
    checks: ['Les points à gauche (X < -0.6) et à droite (X > 0.6) ont des couleurs différentes'],
    explanation: 'Même recette que le dégradé de hauteur, juste piloté par `@P.x` au lieu de `@P.y` — `fit()` fonctionne pareil quel que soit l\'axe que tu lui donnes.',
  },
  // ── vectors (length/normalize) ──
  'vec-1': {
    title: 'Que retourne `length({0, 3, 4})` ?',
    explanation: 'length = √(0² + 3² + 4²) = √(0 + 9 + 16) = √25 = **5**.',
    choices: ['5.0', '7.0', '3.5', '25.0'],
  },
  'vec-2': {
    title: 'Que retourne `normalize({0, 0, 9})` ?',
    explanation: '`normalize` conserve la direction mais force la longueur à 1. `{0, 0, 9}` pointe en +Z, donc normalisé → `{0, 0, 1}`.',
    choices: ['{0, 0, 1}', '{0, 0, 9}', '{0, 0, 0.5}', '9.0'],
  },
  'vec-5': {
    title: 'Que retourne `length({1, 1, 1})` (arrondi à 2 décimales) ?',
    explanation: '√(1² + 1² + 1²) = √3 ≈ **1.73**. Tout ne donne pas un nombre rond avec length() !',
    choices: ['1.73', '3.0', '1.0', '1.5'],
  },
  'vec-8': {
    title: 'Quelle fonction est un raccourci pour `length(a - b)` ?',
    explanation: '`distance(a, b)` existe purement pour la lisibilité — elle calcule exactement `length(a - b)`, la distance entre deux points arbitraires plutôt que depuis l\'origine.',
    choices: ['distance(a, b)', 'normalize(a, b)', 'dot(a, b)', 'length(a, b)'],
    choiceExplanations: { 1: 'normalize() ne prend qu\'un seul vecteur — elle ne compare pas deux points.', 3: 'length() ne prend qu\'un seul vecteur.' },
  },
  'vec-6': {
    title: 'Distance entre deux points',
    codeLines: [
      '// Calcule la distance entre le point a et le point b',
      'vector a = {0, 0, 0};',
      'vector b = {3, 4, 0};',
      'float d = ___(a, b);',
    ],
    hints: ['Raccourci pour length(a - b)'],
    explanation: '`distance(a, b)` donne 5 ici — c\'est le classique triangle 3-4-5, comme `length(b - a)` l\'aurait donné aussi.',
  },
  'vec-7': {
    title: 'Pourquoi `normalize({0, 0, 0})` retourne `{0, 0, 0}` au lieu de planter ?',
    explanation: 'Le vecteur nul n\'a pas de direction à préserver, donc diviser par sa longueur (nulle) serait indéfini. VEX joue la sécurité et retourne simplement le vecteur nul plutôt qu\'une erreur.',
    choices: [
      'Le vecteur nul n\'a pas de direction, donc VEX retourne zéro plutôt que de diviser par zéro',
      'Ça déclenche une erreur d\'exécution',
      'Ça retourne {1, 1, 1}',
      'Ça retourne une direction aléatoire',
    ],
  },
  'vec-3': {
    title: "Calcule la distance depuis l'origine",
    codeLines: [
      "// Longueur du vecteur position = distance depuis l'origine",
      'float dist = ___(@P);',
      '// Utilise dist pour estomper la couleur : proche=lumineux, loin=sombre',
      '@Cd = {___, dist, dist};',
    ],
    hints: ['Fonction intégrée qui retourne la magnitude', 'La variable qu\'on vient de calculer'],
    explanation: '`length(@P)` donne la distance depuis l\'origine. L\'utiliser aussi pour le canal rouge donne un dégradé neutre, en niveaux de gris.',
  },
  // ── clamp-lerp ──
  'cl-1': {
    title: 'Que retourne `clamp(15, 0, 10)` ?',
    explanation: '15 dépasse le max de 10, donc c\'est limité à **10**.',
    choices: ['10', '15', '0', '5'],
  },
  'cl-2': {
    title: 'Garde une valeur dans une plage',
    codeLines: ['// Empêche speed de dépasser 1.0, et de descendre sous 0', 'float speed = ___(rawSpeed, 0.0, 1.0);'],
    hints: ['Force une valeur à rester dans [min, max]'],
    explanation: '`clamp(rawSpeed, 0.0, 1.0)` est la méthode standard pour garder une valeur calculée dans une plage sûre.',
  },
  'cl-3': {
    title: 'Que retourne `lerp(10, 20, 0.5)` ?',
    explanation: '`t=0.5` est exactement à mi-chemin entre 10 et 20 — ça donne **15**.',
    choices: ['15', '10', '20', '30'],
  },
  'cl-4': {
    title: 'Que retourne `lerp({0,0,0}, {10,10,10}, 0.25)` ?',
    explanation: '`lerp` interpole chaque composante pareil : `0 + (10-0)*0.25 = 2.5` sur chaque axe.',
    choices: ['{2.5, 2.5, 2.5}', '{0, 0, 0}', '{10, 10, 10}', '{0.25, 0.25, 0.25}'],
  },
  'cl-5': {
    title: 'Est-ce que `lerp(a, b, 1.5)` limite automatiquement t entre a et b ?',
    explanation: 'Non — `lerp()` applique toujours le calcul tel quel. `t=1.5` dépasse `b`. Si tu veux que le résultat reste dans `[a, b]`, applique `clamp()` toi-même (ou utilise `fit01`, qui limite).',
    choices: [
      'Non — ça dépasse b. Combine avec clamp() si tu veux rester dans la plage',
      'Oui — t est toujours limité à 0–1 automatiquement',
      'Ça déclenche une erreur d\'exécution',
      'Ça retourne a sans changement',
    ],
  },
  'cl-6': {
    title: 'Mélange deux couleurs',
    codeLines: ['// Mélange du bleu vers le jaune selon t', '@Cd = ___({0, 0, 1}, {1, 1, 0}, t);'],
    hints: ['Interpole entre deux couleurs selon t'],
    explanation: '`lerp(a, b, t)` est la méthode standard pour mélanger deux couleurs — fonctionne exactement pareil sur des vecteurs que sur des floats.',
  },
  // ── dot-cross ──
  'dc-1': {
    title: 'Que retourne `dot({1, 0, 0}, {0, 1, 0})` ?',
    explanation: 'Ces deux vecteurs sont perpendiculaires (l\'un pointe le long de X, l\'autre de Y), donc leur produit scalaire est **0**.',
    choices: ['0.0', '1.0', '-1.0', '{0, 0, 0}'],
    choiceExplanations: { 3: 'dot() retourne toujours un float, jamais un vecteur — c\'est le rôle de cross().' },
  },
  'dc-2': {
    title: 'Que retourne `dot({1, 0, 0}, {-1, 0, 0})` ?',
    explanation: 'Ces deux vecteurs unitaires pointent dans des directions exactement **opposées**, donc leur produit scalaire est **-1**.',
    choices: ['-1.0', '0.0', '1.0', '2.0'],
  },
  'dc-3': {
    title: "Mesure l'alignement avec le \"haut\"",
    codeLines: [
      '// Vérifie à quel point la normale est alignée avec le "haut" du monde',
      'vector up = {0, 1, 0};',
      'float alignment = ___(@N, up);',
    ],
    hints: ['Retourne -1 à 1 selon l\'alignement de deux vecteurs'],
    explanation: '`dot(@N, up)` est exactement la façon de mesurer "cette surface fait-elle face au-dessus, en dessous, ou de côté" — un motif VEX très courant.',
  },
  'dc-4': {
    title: 'Que retourne `cross({1, 0, 0}, {0, 1, 0})` ?',
    explanation: '`cross()` retourne un vecteur perpendiculaire aux deux entrées. X croisé avec Y donne Z : `{0, 0, 1}`.',
    choices: ['{0, 0, 1}', '0.0', '{1, 1, 0}', '{1, 0, 0}'],
    choiceExplanations: { 1: 'C\'est le type de retour de dot() — cross() retourne toujours un vecteur.' },
  },
  'dc-5': {
    title: 'Ombrage selon la normale orientée vers le haut',
    prompt: 'Colore chaque point selon à quel point sa normale de surface pointe "vers le haut" (direction +Y).\n\nUtilise `dot()` pour mesurer l\'alignement entre `@N` et `{0,1,0}` — ça donne une valeur de -1 à 1. Remappe-la en 0–1 avec `fit()`, puis utilise-la comme couleur en niveaux de gris (même valeur sur les 3 canaux).',
    checks: [
      'Les points du haut (orientés vers le haut) sont plus lumineux que ceux du bas',
      'La couleur reste en niveaux de gris (les canaux R, G et B correspondent)',
    ],
    explanation: 'Sur cette sphère, la normale `@N` pointe directement vers l\'extérieur, donc `dot(@N, up)` est maximal au pôle du haut et minimal en bas — `fit()` transforme ça en une luminosité 0–1 propre.',
  },
  // ── conditionals ──
  'if-1': {
    title: 'Quelle syntaxe est un if VEX valide ?',
    explanation: 'VEX utilise un if de style C : condition entre parenthèses, corps entre accolades, point-virgule sur l\'instruction interne.',
    choices: ['if (@P.y > 0) { @Cd = {1,1,0}; }', 'if @P.y > 0: @Cd = {1,1,0}', 'when (@P.y > 0) { @Cd = {1,1,0}; }', '@P.y > 0 then @Cd = {1,1,0}'],
  },
  'if-fill': {
    title: 'Écris une condition',
    codeLines: [
      '// Colore les points d\'index pair en orange, impair en violet',
      'if (@ptnum ___ 2 ___ 0) {',
      '    @Cd = {1.0, 0.4, 0.0};',
      '} else {',
      '    @Cd = {0.5, 0.0, 1.0};',
      '}',
    ],
    hints: ['Opérateur modulo', "Comparaison d'égalité"],
    explanation: '`@ptnum % 2 == 0` est vrai pour les index pairs (0, 2, 4…). Cela crée un motif alterné sur tous les points.',
  },
  'if-2': {
    title: 'Séparation haut / bas',
    prompt: 'Colore la **moitié haute** de la sphère en jaune (`{1, 1, 0}`) et la **moitié basse** en cyan (`{0, 1, 1}`).\n\nÀ toi de choisir le seuil — mais assure-toi qu\'aucun point ne reste avec le gris par défaut.',
    checks: ['Aucun point n\'a la couleur par défaut {0.4, 0.8, 1.0}', 'Au moins deux couleurs distinctes sont utilisées', 'Les moitiés haute et basse ont des couleurs différentes', 'Utilise une structure if/else'],
    explanation: 'La logique conditionnelle permet d\'appliquer des effets différents à différentes parties de la géométrie. `@P.y > 0` sélectionne l\'hémisphère supérieur.',
  },
  // ── loops ──
  'loop-1': {
    title: 'Combien de fois cette boucle tourne-t-elle ?  `for (int i = 0; i < 4; i++)`',
    explanation: 'i = 0, 1, 2, 3 — la condition `i < 4` devient fausse quand i atteint 4, donc la boucle tourne **4 fois**.',
    choices: ['4 fois', '3 fois', '5 fois', '0 fois'],
  },
  'loop-2': {
    title: 'Complète la boucle for',
    codeLines: [
      'float sum = 0;',
      '___ (int i = 1; i <= 5; ___) {',
      '    sum += i;',
      '}',
      '// sum devrait valoir 1+2+3+4+5 = 15',
    ],
    hints: ['Mot-clé de boucle', "Incrémente le compteur de 1"],
    explanation: '`for (int i = 1; i <= 5; i++)` itère i = 1, 2, 3, 4, 5. Chaque itération ajoute i à sum.',
  },
  'loop-3': {
    title: 'Surface ondulée',
    prompt: 'Crée un effet de vague sur la grille en déplaçant la position Y de chaque point avec `sin()`.\n\n- Le déplacement doit varier par point (utilise `@ptnum` ou `@P.x`)\n- La vague doit avoir des crêtes et des creux visibles\n- Donne aussi une jolie couleur aux points',
    checks: ['Les positions Y varient (la vague a des crêtes et des creux)', 'Le déplacement n\'est pas uniforme (pas tous le même Y)'],
    explanation: '`sin(@ptnum * 0.3) * 0.4` — la fréquence 0.3 contrôle la "tension" de la vague, l\'amplitude 0.4 contrôle la hauteur. Une grille montre mieux les vagues.',
  },
  'loop-4': {
    title: 'Superpose des vagues avec une boucle for',
    prompt: 'Cette fois, utilise une vraie boucle `for` : additionne 3 ondes sinusoïdales de fréquence croissante (multiplie la fréquence par le compteur de boucle `i`), puis utilise le total pour déplacer `@P.y`.',
    checks: ['Utilise une boucle for', 'Les positions Y varient (la vague superposée a des crêtes et des creux)'],
    explanation: 'La boucle `for` tourne 3 fois, ajoutant chaque fois une onde sinusoïdale de fréquence plus élevée (`0.15 * i`). Additionner des ondes comme ça, c\'est la base d\'effets plus complexes comme le bruit FBM, que tu verras plus tard.',
  },
  // ── noise-basics ──
  'noise-1': {
    title: 'Quelle est la différence clé entre rand() et noise() ?',
    explanation: '`rand()` donne des valeurs aléatoires **indépendantes** — des graines voisines donnent des résultats sans rapport. `noise()` est **lisse** — des positions voisines donnent des valeurs similaires, créant une variation organique continue.',
    choices: ['noise() est lisse/continu ; rand() est totalement aléatoire', 'rand() est plus rapide', 'noise() retourne des entiers', 'Ce sont la même fonction'],
  },
  'noise-fill': {
    title: 'Couleur aléatoire par point',
    codeLines: [
      '// Donne à chaque point une valeur aléatoire basée sur son index',
      'float r = ___(@ptnum);',
      '// Utilise-la comme multiplicateur de vert pour obtenir une teinte rouge→orange',
      '@Cd = {r, r * ___, 0.0};',
    ],
    hints: ['Nom de la fonction aléatoire', "Un multiplicateur entre 0 et 1 — regarde l'aperçu 3D, tu veux de l'orange, pas du jaune ni du rouge pur"],
    explanation: '`rand(@ptnum)` donne à chaque point une valeur stable et unique. Multiplier le canal vert par une valeur entre 0 et 1 (essaie 0.5) garde une teinte chaude — rouge avec un peu de vert donne de l\'orange.',
  },
  'noise-2': {
    title: 'Dispersion aléatoire',
    prompt: 'Donne à chaque point une **couleur grise aléatoire** et un **déplacement Y aléatoire** (±0.3 unités).\n\nChaque canal et chaque axe doit varier indépendamment par point — utilise des graines différentes pour chacun.',
    checks: ['Les couleurs varient entre les points', "Les positions Y sont déplacées (pas tous sur la surface de la sphère)"],
    explanation: 'Pour obtenir des valeurs indépendantes pour la couleur et le déplacement, utilise des graines différentes : `rand(@ptnum)` et `rand(@ptnum * 7 + 13)`. Même graine de base mais "sel" différent.',
  },
  'noise-3': {
    title: 'Surface organique',
    prompt: 'Utilise `noise(@P)` pour créer un déplacement organique sur la sphère.\n\n- Déplace `@P` dans une direction en utilisant le bruit\n- Colore les points selon la valeur du bruit\n- Le résultat doit sembler bosselé et organique, pas plat',
    checks: ['Les points sont déplacés (plage Y > 0.3)', 'Les couleurs varient entre les points'],
    explanation: '`noise(@P)` donne des valeurs spatialement cohérentes — les points voisins ont un bruit similaire. Déplacer le long de `@N` (normale) pousse les points vers l\'extérieur/intérieur pour un aspect bosselé.',
  },
  // ── circles ──
  'circ-1': {
    title: 'Que valent `cos(0)` et `sin(0)` ?',
    explanation: 'À l\'angle 0 : `cos(0) = 1` et `sin(0) = 0`. Le point de départ d\'un cercle est donc toujours à `(radius, 0)` — le point le plus à droite.',
    choices: ['cos(0)=1,  sin(0)=0', 'cos(0)=0,  sin(0)=1', 'cos(0)=1,  sin(0)=1', 'cos(0)=0,  sin(0)=0'],
  },
  'circ-fill-1': {
    title: 'Complète la formule du cercle',
    codeLines: [
      'float t     = @ptnum / float(@numpt);',
      'float angle = t * 2.0 * ___;    // cercle complet en radians',
      'float r     = 1.5;',
      '',
      '@P.x = ___(angle) * r;',
      '@P.y = 0.0;',
      '@P.z = ___(angle) * r;',
    ],
    hints: ['Pi — la constante du demi-cercle (~3.14159)', 'Retourne la composante X d\'un cercle unitaire', 'Retourne la composante Z d\'un cercle unitaire'],
    explanation: 'Cercle complet = 2π radians. `cos(angle)` → X, `sin(angle)` → Z. Ensemble, ils tracent un cercle parfait.',
  },
  'circ-code-1': {
    title: 'Place les points en cercle',
    prompt: 'Réarrange tous les points en un cercle parfait de rayon **1.5** dans le plan XZ (Y=0).\n\nTous les points doivent être équidistants. Colore-les selon leur angle (utilise `t` pour piloter `@Cd.x`).',
    checks: ['Tous les points sont à peu près à la même distance de l\'origine (~1.5)', 'Les points sont dans le plan XZ (Y proche de 0)'],
    explanation: '`float(@numpt)` convertit en float pour éviter la division entière. Multiplier par 2π donne une révolution complète. cos/sin placent les points sur le cercle.',
  },
  'circ-code-2': {
    title: 'Construis une hélice',
    prompt: 'Transforme les points en une **hélice 3D** — un cercle qui monte le long de Y.\n\n- 3 rotations complètes (`t * 6 * 3.14159`)\n- Rayon : 1.0\n- Y monte de 0 à 2.0\n- Couleur basée sur la hauteur',
    checks: ['Les points forment un cercle dans le plan XZ (rayon ~1.0)', 'Y varie de proche de 0 à proche de 2 (l\'hélice monte)'],
    explanation: 'Multiplie l\'angle par 6π pour 3 tours complets. Définis Y = t * height pour la montée verticale. Le résultat ressemble à une double hélice, comme l\'ADN.',
  },
  // ── modulo-patterns ──
  'mod-1': {
    title: 'Que retourne `int(2.9)` ?',
    explanation: '`int()` **tronque** vers zéro — il supprime la partie décimale. Donc `int(2.9) = 2`, `int(-1.7) = -1`.',
    choices: ['2', '3', '2.9', '0'],
  },
  'mod-2': {
    title: 'Quelle expression donne 0 pour un index pair, 1 pour impair ?',
    explanation: '`@ptnum % 2` cycle 0, 1, 0, 1… — exactement 0 pour pair, 1 pour impair.',
    choices: ['@ptnum % 2', '@ptnum / 2', '@ptnum * 2', 'int(@ptnum * 0.5)'],
  },
  'mod-fill-1': {
    title: "Rayures le long de l'axe X",
    codeLines: [
      "// Crée des rayures alternées le long de X",
      '// Échelle = 2.0 signifie une rayure toutes les 0.5 unités',
      'int stripe = int(@P.x * 2.0 + 10.0) ___ ___;',
      '',
      'if (stripe == 0) {',
      '    @Cd = {1.0, 0.3, 0.0};',
      '} else {',
      '    @Cd = {0.1, 0.1, 0.3};',
      '}',
    ],
    hints: ['Opérateur modulo', 'Deux valeurs alternées (0 et 1)'],
    explanation: '`% 2` crée un cycle de 0 et 1. Combiné avec `int(@P.x * scale)`, ça quantifie l\'espace en rayures.',
  },
  'mod-code-1': {
    title: 'Damier',
    prompt: 'Crée un **motif en damier** — cases sombres et claires alternées sur le plan XZ.\n\nIndice : combine rayures X et rayures Z. Si les deux sont 0 ou les deux sont 1 → clair. Sinon → sombre.\n`int(@P.x * 3 + 10) % 2` donne l\'index de rayure pour X.',
    checks: ['Au moins deux couleurs distinctes utilisées', 'Nombre à peu près égal de points clairs et sombres'],
    explanation: '`(sx + sz) % 2` est un XOR : 0+0=0 (pair→clair), 0+1=1 (impair→sombre), 1+1=2%2=0 (pair→clair). Damier classique.',
  },
  'mod-code-2': {
    title: 'Anneaux concentriques',
    prompt: 'Crée des **anneaux colorés concentriques** sur la sphère. Utilise `length(@P)` comme coordonnée radiale et divise-la en bandes.\n\n- 5 anneaux visibles (contrôle avec le facteur d\'échelle)\n- Alterne entre deux couleurs contrastées\n- Donne aux anneaux une variation de largeur avec du bruit (bonus optionnel)',
    checks: ['Au moins 2 bandes de couleur distinctes visibles', 'Couleurs pas toutes identiques (anneaux visibles)'],
    explanation: '`length(@P)` sur une sphère vaut toujours ~1, donc multiplie par une échelle plus grande (comme 5) pour créer plusieurs anneaux. Les anneaux apparaissent où `dist` franchit des limites entières.',
  },
  // ── attr-creation ──
  'ca-1': {
    title: 'Tu écris `@speed = 3.5;` dans un wrangle. Quel type est créé ?',
    explanation: '`3.5` est un littéral float, donc Houdini crée un attribut `float` nommé `speed`. Si tu avais écrit `@speed = {1,0,0}` ce serait un vecteur.',
    choices: ['float', 'int', 'vector', 'string'],
  },
  'ca-fill-1': {
    title: 'Stocke du bruit comme attribut mask',
    codeLines: [
      '// Crée un attribut float "mask" à partir du bruit',
      '@___ = noise(@P * 2.0);',
      '',
      '// Utilise le mask : déplace seulement où mask > 0.4',
      'if (@mask ___ 0.4) {',
      '    @P.y += 0.5;',
      '}',
    ],
    hints: ["Nom de l'attribut", 'Comparaison supérieur à'],
    explanation: '`@mask = noise(@P * 2.0)` crée un attribut float par point avec des valeurs de bruit. La condition l\'utilise ensuite pour déplacer sélectivement les points.',
  },
  'ca-code-1': {
    title: 'Attribut mask de bruit',
    prompt: 'Crée un attribut **mask basé sur le bruit** et utilise-le pour contrôler à la fois le déplacement et la couleur.\n\n1. Calcule `@mask = noise(@P * 2.5)` — lisse, 0..1 par point\n2. Déplace `@P.y` de `(@mask - 0.5) * 0.8`\n3. Couleur : mélange entre deux couleurs selon `@mask`\n\nLe résultat doit sembler organique — bosselé et coloré.',
    checks: ['Les positions Y varient (déplacement appliqué)', 'Les couleurs varient entre les points'],
    explanation: '`(@mask - 0.5) * 0.8` centre le bruit autour de 0 pour que les points montent ET descendent. `lerp()` avec `@mask` comme t mélange en douceur les deux couleurs.',
  },
  'ca-code-2': {
    title: 'Superposition à deux attributs',
    prompt: 'Utilise **deux attributs séparés** pour créer un effet en couches :\n\n1. `@largeMask = noise(@P * 1.0)` — variation à grande échelle\n2. `@detailMask = noise(@P * 5.0)` — détail fin\n3. Combine-les : `@P.y += (@largeMask * 0.6) + (@detailMask * 0.15)`\n4. Couleur : utilise `@largeMask` pour la teinte, `@detailMask` pour la luminosité',
    checks: ['Grande plage de déplacement Y (> 0.5)', 'Riche variation de couleur'],
    explanation: 'Superposer du bruit à différentes fréquences crée du "détail fractal" — une technique courante en VFX. Le bruit large gère la forme globale, le bruit fin ajoute de la texture.',
  },
  // ── multi-step ──
  'comb-1': {
    title: 'Que donne `normalize(@P)` sur une sphère ?',
    explanation: "Sur une sphère, `@P` pointe déjà loin de l'origine. `normalize(@P)` donne un **vecteur unitaire pointant radialement vers l'extérieur**. Déplacer le long de ce vecteur pousse les points loin du centre.",
    choices: [
      "Un vecteur unitaire pointant radialement vers l'extérieur depuis le centre",
      'La position normalisée entre 0..1',
      'Un vecteur pointant vers le centre',
      'La normale de surface (identique à @N sur une sphère)',
    ],
    choiceExplanations: { 3: 'Presque ! Sur une sphère parfaite @N = normalize(@P), mais ce n\'est pas toujours le cas.' },
  },
  'comb-fill-1': {
    title: 'Structure de boucle FBM',
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
    hints: ["Nombre d'octaves (4-6 est typique)", "Variable d'amplitude actuelle"],
    explanation: '4 octaves est un bon équilibre. Chaque octave double la fréquence et divise l\'amplitude par deux, créant un détail auto-similaire à plusieurs échelles.',
  },
  'comb-code-1': {
    title: 'Déplacement FBM',
    prompt: 'Implémente le **FBM (Fractal Brownian Motion)** pour créer une surface organique détaillée.\n\nUtilise 4 octaves de bruit. Après la boucle, déplace `@P` vers l\'extérieur (`+= normalize(@P) * (fbm - 0.5) * 0.6`) et colore selon la valeur fbm.',
    checks: ['Déplacement significatif (plage Y > 0.5)', 'Riche variation de couleur'],
    explanation: 'Le FBM accumule du bruit à plusieurs échelles. Multiplier pos par 2 à chaque itération zoome vers un détail plus fin. Le résultat a de grandes formes ET une texture fine, comme un vrai terrain.',
  },
  'comb-code-2': {
    title: '🏔️ Surface de planète',
    prompt: "Pas d'indices. Construis une **surface de planète** depuis zéro.\n\nExigences :\n- Déplacement FBM vers l'extérieur\n- Au moins 3 zones de couleur distinctes basées sur la latitude ou la valeur de bruit (ex. pôles = blanc, montagnes = gris, plaines = colorées)\n- Apparence lisse et organique\n\nC'est un défi ouvert — exprime-toi.",
    checks: ['Déplacement appliqué (plage Y > 0.3)', 'Au moins 3 régions de couleur distinctes'],
    explanation: "Un vrai shader de planète combine déplacement FBM, zones basées sur la latitude, et transitions de couleur pilotées par le bruit. C'est le genre d'effet qu'on construirait dans un pipeline de production Houdini.",
  },
}
