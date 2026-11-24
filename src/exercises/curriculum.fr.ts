// ─── French translation overlay ───────────────────────────────────────────────
// Keyed by id so it can be merged onto the canonical (English) CURRICULUM
// without duplicating check logic, code samples, or ids.

export const FR_MODULES: Record<string, { title: string }> = {
  basics: { title: 'Les bases de VEX' },
  math: { title: 'Maths et vecteurs' },
  control: { title: 'Structures de contrôle' },
  noise: { title: 'Bruit et motifs' },
  bridge: { title: 'Temps et dégradés' },
  patterns: { title: 'Motifs procéduraux' },
  'custom-attrs': { title: 'Attributs personnalisés' },
  combined: { title: 'Techniques combinées' },
}

export const FR_LESSONS: Record<string, { title: string; description: string }> = {
  intro: { title: "Qu'est-ce que VEX ?", description: 'Comprendre la place de VEX dans Houdini' },
  variables: { title: 'Nombres et texte', description: 'Déclarer des variables int, float et string' },
  'vector-intro': { title: 'Vecteurs', description: 'Déclarer et manipuler des valeurs vector' },
  attributes: { title: 'Attributs', description: 'Lire et écrire les attributs de points avec @' },
  params: { title: 'Paramètres et sliders', description: 'Piloter un wrangle en direct avec ch(), chf() et chramp()' },
  arithmetic: { title: 'Arithmétique', description: 'Maths de base avec floats et vecteurs' },
  'fit-remap': { title: 'fit() — remapper des plages', description: 'Transformer une plage de valeurs en une autre' },
  vectors: { title: 'length() & normalize()', description: 'Mesurer et transformer la magnitude des vecteurs' },
  'clamp-lerp': { title: 'clamp() & lerp()', description: 'Contraindre une plage, puis interpoler dedans' },
  'dot-cross': { title: 'dot() & cross()', description: 'Mesurer un alignement et trouver des directions perpendiculaires' },
  conditionals: { title: 'Si / Sinon', description: 'Brancher la logique selon des conditions' },
  loops: { title: 'Boucles', description: 'for, while, break & continue' },
  'noise-basics': { title: 'Bruit et aléatoire', description: 'rand, noise, et motifs organiques' },
  animation: { title: 'Anime avec @Time', description: 'Fais bouger tes wrangles' },
  'relbbox-gradients': { title: 'relbbox() — des dégradés propres', description: 'Des dégradés 0–1 insensibles à la taille de l\'objet' },
  circles: { title: 'Cercles et spirales', description: 'Placer des points avec cos/sin' },
  'modulo-patterns': { title: 'Motifs répétitifs', description: 'Rayures, anneaux et damiers' },
  'attr-creation': { title: 'Créer des attributs', description: 'Exporter tes propres données avec @monAttr' },
  'multi-step': { title: 'Effets multi-étapes', description: 'Combiner boucles, bruit, conditions et maths' },
}

export const FR_LEARN_CARDS: Record<string, { title: string; body: string; keyPoints?: string[]; inProduction?: string }> = {
  'learn-vec-set': {
    title: 'Les constantes entre accolades, les variables dans set()',
    inProduction: "C'est la première erreur que presque tout le monde rencontre dans un wrangle. Tu calcules une valeur, tu essaies de la mettre dans une couleur avec des accolades, Houdini refuse — et la correction est toujours la même : remplacer les accolades par `set()`.",
    body: "Un vecteur reste **trois floats** dans les deux cas. Mais les deux façons de l'écrire ne sont pas interchangeables.\n\n`{1.0, 0.0, 0.0}` est un **littéral** : Houdini le résout à la compilation, donc tout ce qu'il contient doit être un nombre brut. Mets-y une variable et ça ne compile plus — c'est une erreur de syntaxe, pas un avertissement.\n\n`set()` construit un vecteur à partir de **n'importe quoi** : variables, attributs, résultats de fonctions, calculs.\n\nEn pratique, presque tous les vecteurs que tu **calcules** passent par `set()`, et `{}` sert aux quelques-uns que tu écris à la main.",
    keyPoints: [
      '{} n\'accepte que des nombres constants — négatifs compris',
      'set(a, b, c) prend des variables, des attributs, tout',
      'Une variable dans {} est une erreur de syntaxe, pas un avertissement',
      'Trois floats dans les deux cas — seule l\'écriture change',
    ],
  },
  'learn-intro-1': {
    inProduction: 'Presque tous les effets Houdini que tu as vus cachent un wrangle quelque part — éparpiller des débris sur un mur qui explose, décaler une foule pour que personne ne bouge pareil, colorer un océan selon la hauteur des vagues. C\'est le chemin le plus court entre une idée et quelque chose à l\'écran.',
    title: "Qu'est-ce que VEX ?",
    body: "VEX est le **langage d'expression au cœur de Houdini**. Il te permet d'écrire une logique personnalisée qui s'exécute directement sur la géométrie — modifier positions, couleurs, normales, et tout autre attribut imaginable.\n\nVEX a une syntaxe **proche du C** : accolades, points-virgules, variables typées. Si tu as déjà écrit du C, C++ ou GLSL, tu seras en terrain familier.",
    keyPoints: [
      "VEX = le langage d'expression intégré à Houdini",
      'Syntaxe proche du C (accolades, points-virgules, types)',
      "S'exécute une fois par point par défaut dans un wrangle",
    ],
  },
  'learn-intro-2': {
    title: 'Le Geometry Wrangle',
    body: "Dans Houdini, on écrit du VEX dans un nœud **Geometry Wrangle**. Son réglage **Run Over** choisit sur quoi ton code boucle : Points (par défaut), Primitives, Vertices, ou Detail.\n\nChanger de mode ne te bloque l'accès à rien — `@ptnum`, `@numpt`, et les autres restent lisibles partout, ils s'adaptent juste à ce que tu boucles.\n\nLe mode **Detail** est le cas spécial : il fait tourner ton code **une seule fois pour toute la géométrie** — parfait pour une valeur qui n'est pas vraiment \"par point\", comme un compteur global.\n\nUne chose que Run Over *change* bien : où atterrit un nouvel attribut. `f@mask = 1;` crée un attribut de **point** en mode Points, mais un attribut de **primitive** en mode Primitives.",
    keyPoints: [
      'Run Over choisit ce que tu boucles : Points, Primitives, Vertices, Detail',
      '@ptnum, @numpt et les autres restent lisibles dans tous les modes',
      'Le mode Detail tourne une fois pour toute la géométrie — pour une valeur globale',
      'Un nouvel attribut (f@nom = ...) atterrit sur le type de composant que tu boucles',
    ],
  },
  'learn-var-1': {
    inProduction: 'Les types sont la source de la plupart des bugs « pourquoi mon attribut est faux ? ». Un `int` jette les décimales sans prévenir, donc `0.9` devient `0` ; un `float` envoyé dans un vecteur remplit les trois canaux d\'un coup. Choisir le bon type dès le départ t\'évite un après-midi de debug.',
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
    body: "En 3D, presque tout est un vecteur : positions, couleurs, directions, normales.\n\nUn vecteur `{x, y, z}` regroupe trois floats. Tu peux accéder à chaque composante avec un **point** : `v.x`, `v.y`, `v.z`.\n\nLes couleurs utilisent le même type — le rouge c'est `.x`, le vert `.y`, le bleu `.z`.\n\nIl existe une seconde façon de construire un vecteur : la fonction `set(x, y, z)`. Elle fait exactement la même chose que `{x, y, z}` — utilise celle qui te semble la plus lisible selon le contexte.\n\nUn raccourci pratique : assigner **un seul nombre** à un vecteur remplit les trois composantes — `vector v = 1;` devient `{1, 1, 1}`. C'est pour ça que `@Cd = 0.5;` donne un gris moyen.",
    keyPoints: [
      'vector regroupe 3 floats : {x, y, z}',
      'Les vecteurs ont des composantes .x .y .z',
      'Les couleurs sont aussi des vecteurs : .x=R, .y=G, .z=B',
      'set(x, y, z) construit un vecteur depuis des variables — {} ne peut pas',
      'Un seul nombre remplit les 3 : vector v = 1 → {1, 1, 1}',
    ],
  },
  'learn-attr-1': {
    inProduction: 'Les attributs sont la façon dont les départements se passent le travail. Le layout écrit `@pscale` sur les arbres éparpillés, les FX le lisent pour dimensionner les morceaux de destruction, l\'éclairage lit `@Cd` pour varier le shader — et personne n\'a besoin d\'ouvrir la scène de l\'autre.',
    title: 'Les attributs : le préfixe @',
    body: "Un **attribut** est une valeur nommée stockée sur la géométrie — chaque point peut avoir sa propre position, couleur, normale, etc.\n\nEn VEX, on lit et écrit les attributs avec le préfixe `@`. Lire `@P` donne la position du point courant. Écrire `@Cd = ...` change sa couleur.\n\nLes attributs (tout ce qui a un `@`) persistent après le wrangle — ils font partie des données de la géométrie. C'est différent des variables locales de la leçon précédente : `float maVar = 2;` (sans `@`) n'est qu'un espace de calcul temporaire pour ce wrangle — ça disparaît dès que le nœud suivant tourne. Seuls les noms préfixés par `@` sont vraiment sauvegardés sur la géométrie.\n\nLors de la création d'un nouvel attribut, précise son type juste avant le `@` : `f@nom` (float), `i@nom` (int), `v@nom` (vector), `s@nom` (string).\n\n**Important :** un `@nom` nu, sans préfixe, défaut en **float**. Pour un float c'est bon (`f@` est optionnel), mais pour tout le reste tu *dois* utiliser le préfixe — `v@col = {1,0,0}` est un vecteur, alors qu'un `@col = {1,0,0}` nu serait lu comme un float et donnerait de mauvais résultats. Houdini connaît déjà le type des attributs intégrés comme `@P`, `@Cd`, `@N`, donc eux n'ont jamais besoin de préfixe.",
    keyPoints: [
      '@ lit ou écrit un attribut de géométrie',
      'Les attributs (avec @) persistent sur la géométrie après le wrangle',
      'Les variables locales (sans @, ex. float x = 2;) ne persistent PAS',
      'Un @nom nu défaut en float — utilise v@/i@/s@ pour les autres types',
      'f@/i@/v@/s@ typent explicitement un nouvel attribut (float/int/vector/string)',
    ],
  },
  'learn-attr-2': {
    title: 'Les attributs intégrés',
    body: "Houdini possède déjà plusieurs attributs sur la géométrie :\n\n- `@P` *(vector)* — position dans l'espace 3D\n- `@Cd` *(vector)* — couleur diffuse, où X=R, Y=G, Z=B (0–1)\n- `@N` *(vector)* — normale de surface (vecteur unitaire pointant \"vers l'extérieur\")\n- `@ptnum` *(int, lecture seule)* — index du point courant\n- `@numpt` *(int, lecture seule)* — nombre total de points\n\nTu utiliseras `@P` et `@Cd` dans presque tous tes wrangles.\n\nUne subtilité avec `@N` : ça n'a vraiment de sens **que par rapport à une surface**. Un mesh polygonal (comme une sphère SOP) le calcule pour toi à partir de comment les faces se connectent. Un nuage de points isolés, sans face, n'a rien à partir de quoi le calculer — il n'aura pas de `@N` significatif sauf si quelque chose en amont (comme un nœud Point Cloud Normal) en crée un explicitement.",
    keyPoints: [
      '@P = position (vector)',
      '@Cd = couleur, X=rouge Y=vert Z=bleu',
      '@N = normale (vecteur directionnel unitaire)',
      '@N vient d\'une surface (ex. un mesh) — un nuage de points isolés n\'en a pas par défaut',
      '@ptnum / @numpt = index / total (lecture seule)',
    ],
  },
  'learn-params-1': {
    inProduction: 'C\'est le moment où ton code arrête d\'être le tien et devient un outil. Tu enfermes le wrangle dans un HDA, tu remontes les sliders `ch()` sur son interface, et un collègue règle l\'effet sans jamais ouvrir le code.',
    title: 'ch() et chf() — lire des paramètres',
    body: "Dans le vrai Houdini, un nœud wrangle a sa propre interface de paramètres — des sliders qu'un artiste peut déplacer sans toucher au code. `chf(\"nom\")` **lit** la valeur actuelle d'un paramètre appelé \"nom\" (ça retourne 0 si ce paramètre n'existe pas encore).\n\nCréer le slider lui-même est une étape séparée : un bouton à côté de l'éditeur de code (« Create spare parameter for each ch() ») scanne ton code et ajoute un vrai paramètre, déplaçable, pour chaque `chf()`/`ch()` trouvé. Donc `chf()` ne fait que lire — c'est le bouton qui crée.\n\n`ch()` est ambigu sur le type de la valeur, donc la doc VEX recommande les formes typées explicites à la place : `chf(\"nom\")` pour un float, `chi(\"nom\")` pour un int.",
    keyPoints: [
      'chf("nom") lit un paramètre de nœud par son nom (0 s\'il n\'existe pas encore)',
      "chf(\"nom\") est la forme float explicite — recommandée par rapport au ch() ambigu",
      'Un bouton séparé crée le vrai slider pour tout chf()/ch() dans ton code',
      "Déplacer ce slider relance le wrangle avec la nouvelle valeur — sans toucher au code",
    ],
  },
  'learn-params-2': {
    title: 'chramp() — échantillonner une rampe',
    body: "Un **paramètre rampe** permet à un artiste de dessiner une courbe au lieu de régler un seul nombre — utile quand une valeur doit changer en douceur sur une plage, comme un dégradé ou une courbe d'accélération.\n\n`chramp(\"nom\", pos)` prend deux arguments séparés :\n- `\"nom\"` — QUELLE rampe échantillonner (comme la chaîne dans `chf(\"nom\")`)\n- `pos` — OÙ échantillonner sur la courbe de cette rampe, de 0 (le tout début) à 1 (la toute fin)\n\n`chramp()` retourne toujours **une seule valeur, à cette position précise** — jamais une plage. `chramp(\"falloff\", 0.0)` échantillonne la valeur tout au début de la courbe, `chramp(\"falloff\", 1.0)` l'échantillonne tout à sa fin, et n'importe quel `pos` entre les deux échantillonne ce que fait la courbe à cet endroit-là.",
    keyPoints: [
      'chramp("nom", pos) — "nom" choisit la rampe, pos choisit où dessus (0..1)',
      "Une rampe est une courbe que l'artiste dessine dans l'interface — plus expressive qu'un seul slider",
      'pos est automatiquement contraint entre 0 et 1',
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
    inProduction: '`fit()` est la colle entre n\'importe quoi et n\'importe quoi d\'autre. Le bruit sort entre −1 et 1, une opacité veut 0 à 1, une échelle veut 0.5 à 3 — `fit()` est la ligne qui les relie, et c\'est probablement la fonction que tu taperas le plus souvent.',
    title: 'Remapper des valeurs avec fit()',
    body: "`fit(x, omin, omax, nmin, nmax)` est l'une des fonctions VEX les plus utiles.\n\nElle **remappe** une valeur d'une plage vers une autre. Si `x` est dans `[omin, omax]`, le résultat est dans `[nmin, nmax]`.\n\nExemple : la position Y va de -1 à 1. Tu veux l'utiliser comme couleur (0 à 1). `fit(@P.y, -1, 1, 0, 1)` fait exactement ça.\n\nDeux raccourcis existent pour le cas courant où l'entrée est déjà entre 0 et 1 : `fit01(x, nmin, nmax)` est exactement `fit(x, 0, 1, nmin, nmax)`, `fit10(x, nmin, nmax)` fait pareil mais avec la direction d'entrée inversée. **Aucune des deux ne limite la valeur** — si `x` sort de la plage supposée, le résultat extrapole simplement hors de `[nmin, nmax]`. Si tu veux forcer l'entrée dans la plage d'abord, combine avec `clamp()`.",
    keyPoints: [
      'fit(x, omin, omax, nmin, nmax) remappe une plage',
      'Utile pour transformer des positions en valeurs de couleur',
      'fit01(x, nmin, nmax) est exactement fit(x, 0, 1, nmin, nmax)',
      'fit/fit01/fit10 ne limitent jamais — combine avec clamp() si besoin',
    ],
  },
  'learn-vec-1': {
    inProduction: '`length()` te donne une atténuation depuis une source : une onde de choc qui s\'estompe avec la distance, un aimant qui n\'attrape que les points proches. `normalize()` garde la direction et jette la distance — exactement ce qu\'il faut pour pousser des points vers l\'extérieur à vitesse constante.',
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
    inProduction: '`clamp()` est un garde-fou : il empêche un pic de bruit d\'envoyer un point en orbite. `lerp()` est la base de toute transition — un fondu, un morph, un balayage ne sont qu\'un mélange de 0 à 1 entre deux états.',
    title: 'clamp() et lerp()',
    body: "`clamp(x, min, max)` force une valeur à rester dans une plage donnée — tout ce qui est sous `min` devient `min`, tout ce qui est au-dessus de `max` devient `max`. C'est le moyen le plus simple de ramener une distance (ou n'importe quelle valeur non bornée) dans une plage propre de 0 à 1 avant de l'utiliser comme couleur.\n\n`lerp(a, b, t)` **interpole** entre deux valeurs. À `t=0` on obtient `a`, à `t=1` on obtient `b`, entre les deux un mélange. Fonctionne sur les floats et les vecteurs. Comme `fit()`/`fit01()`, `lerp()` ne limite **pas** `t` — si tu passes `t=1.5`, ça dépasse `b`. `clamp()` est la seule de ces fonctions qui force vraiment une valeur dans une plage.",
    keyPoints: [
      'clamp(x, min, max) garde une valeur dans [min, max]',
      'lerp(a, b, t) → interpole entre a et b',
      'lerp fonctionne sur les floats et les vecteurs',
      'lerp ne limite pas t — combine avec clamp() si besoin',
    ],
  },
  'learn-dot-cross-1': {
    inProduction: '`dot()` contre une direction de lumière est la base de tout shader diffus ; `dot()` contre la direction caméra sert à trouver les bords en contre-jour ou à masquer les points qui tournent le dos. `cross()` construit l\'axe perpendiculaire dont tu as besoin pour faire tourner des points autour d\'un axe quelconque.',
    title: 'dot() et cross()',
    body: "`dot(a, b)` retourne un seul float : le **produit scalaire**. Il mesure à quel point deux vecteurs sont alignés. Si les deux sont des vecteurs unitaires, `dot(a, b)` va de **-1** (directions opposées) à **+1** (même direction), avec **0** signifiant perpendiculaire.\n\n`cross(a, b)` retourne un **vecteur** perpendiculaire à `a` et `b` à la fois — utile pour trouver \"la direction de côté\" par rapport à deux autres directions (comme construire un repère local).",
    keyPoints: [
      'dot(a, b) → float : mesure l\'alignement (-1 à 1)',
      'dot(a, b) = 0 signifie que a et b sont perpendiculaires',
      'cross(a, b) → vecteur : perpendiculaire à a et b',
    ],
  },
  'learn-if-1': {
    inProduction: 'Les conditions permettent à un seul wrangle de gérer tout un plan : les points sous la ligne d\'eau passent en bleu, les morceaux à plus de 5 unités de l\'impact ne bougent pas, un bâtiment sur trois reçoit un autre toit. Un nœud, plein de règles.',
    title: 'La logique conditionnelle en VEX',
    body: "VEX utilise la même syntaxe `if/else` que le C. La condition va entre parenthèses ; le corps entre accolades.\n\nTu peux comparer :\n- Des nombres : `<`, `>`, `<=`, `>=`, `==`, `!=`\n- L'opérateur `%` (modulo) est utile pour les motifs : `@ptnum % 2 == 0` est vrai pour un point sur deux.\n\nLes conditions peuvent se combiner avec `&&` (et) et `||` (ou).\n\nPour plus de deux cas, on chaîne avec `else if` : il vérifie la première condition, puis ne vérifie la suivante que si la première était fausse, et ainsi de suite — une seule branche s'exécute, jamais plusieurs.",
    keyPoints: [
      'if (condition) { ... } else { ... }',
      'Comparaison : == != < > <= >=',
      'Combiner : && (et), || (ou)',
      'else if enchaîne plus de deux cas',
      '% modulo : utile pour les motifs alternés',
    ],
  },
  'learn-loop-1': {
    inProduction: 'Les boucles servent à atteindre ce sur quoi le wrangle ne tourne pas — parcourir tous les points d\'une courbe pour mesurer sa longueur, moyenner les voisins d\'un point pour flouter un attribut, ou empiler plusieurs octaves de bruit en un seul résultat détaillé.',
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
  'learn-loop-3': {
    title: 'La boucle while',
    body: "Une boucle `while` répète son corps tant qu'une condition reste vraie. Contrairement à `for`, elle n'a pas d'init ni d'incrément intégrés — c'est à toi de gérer la variable de boucle, à l'intérieur du corps.\n\nUtilise `while` quand tu ne connais pas à l'avance le nombre d'itérations nécessaires.",
    keyPoints: [
      'while (condition) { corps } — tourne tant que la condition est vraie',
      'Tu dois mettre à jour la variable de boucle toi-même, dans le corps',
      "L'oublier cause une boucle infinie",
      "Utilise while quand le nombre d'itérations n'est pas connu à l'avance",
    ],
  },
  'learn-loop-4': {
    title: 'break et continue',
    body: "`break` quitte immédiatement la boucle entièrement — aucune itération suivante ne s'exécute, même si la condition est encore vraie.\n\n`continue` passe directement à l'itération suivante — le reste du corps de l'itération en cours est ignoré, mais la boucle continue.\n\nLes deux fonctionnent de la même façon dans les boucles `for` et `while`.",
    keyPoints: [
      "break quitte la boucle immédiatement, en sautant les itérations restantes",
      "continue saute le reste de l'itération en cours ; la boucle continue",
      'Les deux fonctionnent dans for et while',
      'break est utile pour les recherches "arrête dès que trouvé"',
    ],
  },
  'learn-noise-1': {
    inProduction: '`rand(@ptnum)` est le cheval de bataille de la variation : une taille différente pour chaque caillou, une frame de départ différente pour chaque cycle de marche d\'une foule, une teinte différente pour chaque feuille. Et comme c\'est déterministe, le rendu de demain colle encore au playblast d\'aujourd\'hui.',
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
    inProduction: '`noise()` est le moment où ça arrête de faire « généré par ordinateur ». Terrain, rouille, nuages, tremblement des muscles, crépitement d\'une boule de feu — c\'est presque toujours le même champ de bruit, lu à différentes échelles.',
    title: 'noise() — une variation organique',
    body: "`noise(position)` est un **aléatoire lisse**. Contrairement à `rand()`, des entrées voisines donnent des sorties voisines — le bruit est continu. Cela crée une variation organique et fluide plutôt qu'un aléatoire en pics.\n\nPasser `@P` (la position 3D du point) en entrée signifie que des points voisins dans l'espace obtiennent des valeurs de bruit similaires, ce qui semble naturel.",
    keyPoints: [
      'noise(pos) → float 0..1 (médiane 0.5), lisse entre voisins',
      'Passer @P pour une variation spatialement cohérente',
      "Multiplier l'entrée pour contrôler la fréquence",
      'Utiliser noise() pour des effets organiques et naturels',
    ],
  },
  'learn-noise-3': {
    inProduction: 'La fréquence et le contraste sont les deux réglages sur lesquels tu vas réellement passer du temps. Le même bruit en basse fréquence donne des collines, en haute fréquence du gravier ; pousse le contraste et une fumée douce devient un banc de nuages aux bords nets.',
    title: 'Façonner le bruit : fréquence et contraste',
    body: "Deux réglages que tu utiliseras tout le temps :\n\n- **Fréquence** — mets l'entrée à l'échelle : `noise(@P * 5)` tasse plus de variation dans le même espace (détail plus fin). `noise(@P * 0.5)` l'étire.\n- **Contraste** — le bruit va de 0 à 1 mais sa **médiane est 0.5** : la plupart des valeurs s'entassent au milieu, donc le bruit brut a l'air d'un gris plat. Étire le milieu avec `fit(n, 0.3, 0.7, 0, 1)` pour retrouver de vrais sombres et de vrais clairs.",
    keyPoints: [
      'noise(@P * f) — plus f est grand, plus le détail est fin',
      'Le bruit brut s\'entasse autour de 0.5 — plat par défaut',
      'fit(n, 0.3, 0.7, 0, 1) étire le milieu sur toute la plage',
    ],
  },
  'learn-anim-1': {
    inProduction: 'Tout effet animé qui n\'est pas en keyframes tourne sur `@Time` — nuages qui dérivent, bouclier d\'énergie qui pulse, bruit qui rampe sur une surface. Remplace `@Time` par `@Time * 0.2` et tout ralentit sans toucher une seule clé.',
    title: '@Time — l\'horloge de lecture',
    body: "Tout ce que tu as écrit jusqu'ici est figé. `@Time` dé-fige : c'est le temps de lecture en **secondes**, et il change à chaque frame — donc tout code qui le lit produit un résultat différent à chaque frame. C'est ça, l'animation en VEX.\n\nDeux motifs couvrent la plupart des cas :\n- `sin(@Time)` — oscillation douce, aller-retour sans fin\n- `noise(@P + @Time)` — le motif de bruit **défile** dans l'espace au fil du temps\n\n(`@Frame` est la même horloge comptée en frames plutôt qu'en secondes. Aux 24 fps par défaut de Houdini, elles se correspondent par `frame = temps × 24 + 1` — la frame **1** est le temps 0, la frame 25 le temps 1 s.)",
    keyPoints: [
      '@Time = temps de lecture en secondes — change à chaque frame',
      'sin(@Time) → oscillation douce sans fin',
      'noise(@P + @Time) → le motif défile avec le temps',
      '@Frame = @Time × fps + 1 (frame 1 = temps 0, à 24 fps)',
    ],
  },
  'learn-relbbox-1': {
    inProduction: 'C\'est ce qui rend un setup réutilisable. Écris `@P.y / 5` en dur et ton effet casse dès qu\'on te passe un modèle plus grand ; avec `relbbox()`, le même dégradé marche sur une tasse comme sur un gratte-ciel.',
    title: 'Arrête de coder tes dégradés en dur',
    body: "Jusqu'ici on construisait les dégradés de hauteur avec `fit(@P.y, -1, 1, 0, 1)` — ce qui suppose silencieusement que l'objet fait exactement 2 unités de haut et est centré. Change l'échelle de la géométrie et le dégradé casse.\n\n`relbbox(0, @P)` corrige ça : il retourne ta position **relative à la bounding box** de la géométrie — `{0,0,0}` au coin min, `{1,1,1}` au coin max, quelle que soit la taille. `.y` est un dégradé bas→haut tout prêt, pour *n'importe quel* objet.",
    keyPoints: [
      'relbbox(0, @P) → position relative à la bbox, 0..1 par axe',
      '{0,0,0} au coin min, {1,1,1} au coin max — peu importe la taille',
      '.y = dégradé bas→haut instantané, .x et .z marchent aussi',
      'Le remplaçant insensible à la taille de fit(@P.y, min, max, 0, 1)',
    ],
  },
  'learn-circ-1': {
    inProduction: 'C\'est du mouvement circulaire sans rien animer : étincelles en orbite, spirale de points qui monte un escalier, tourbillon autour du cœur d\'une tornade, rides qui traversent une surface d\'eau.',
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
    inProduction: 'Le modulo est la machine à motifs : carrelage, décalage des briques, bandes de piste d\'atterrissage, « un point sur 4 reçoit une lumière ». Associé à `rand()`, c\'est aussi comme ça qu\'on découpe une foule en groupes qui se comportent différemment.',
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
    body: "Tu n'es pas limité à `@P`, `@Cd` et `@N`. Tu peux **créer n'importe quel attribut** en écrivant dedans — Houdini le crée automatiquement à la première écriture.\n\nLes attributs personnalisés sont utiles pour :\n- **Masquer** des opérations en aval (ex. un float `@mask` 0–1)\n- **Transmettre des données** entre nœuds (calculer dans un wrangle, utiliser dans un autre)\n- **Contrôler des effets** de façon non destructive\n\nNomme-le par son type : un `@mask` nu est un **float** (donc `@mask` et `f@mask` sont identiques). Mais un **vecteur** personnalisé doit utiliser `v@` — `v@customColor = {1,0,0}`. Sans le `v@`, Houdini le traite comme un float et abîme ton vecteur.",
    keyPoints: [
      'Écrire @monattr = valeur crée un attribut personnalisé',
      "Un attribut @ nu est un float — utilise v@ pour un vecteur, i@ pour un int, s@ pour une string",
      'Les attributs personnalisés persistent après le wrangle — utilisables en aval',
      'Pattern courant : calculer un mask, l\'utiliser plus tard',
    ],
  },
  'learn-ca-2': {
    inProduction: 'Les masques sont ce qui garde les gros setups contrôlables. Tu peins ou calcules un `@mask` entre 0 et 1, puis chaque effet en aval le multiplie — l\'érosion ne mord que sur la falaise, et le vent ne secoue que les feuilles extérieures.',
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
    inProduction: 'Empiler des octaves dans une boucle, c\'est littéralement comme ça que sont construits les terrains FBM, les nuages et les surfaces de planète. Une boucle et quelques lignes te donnent du détail à toutes les échelles au lieu d\'une seule couche de bruit plate.',
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
  altNotes?: string[]   // one per altAnswers entry, same order
}

export const FR_EXERCISES: Record<string, ExTranslation> = {
  'vec-set-1': {
    title: 'Un wrangle calcule `float n = rand(@ptnum);`. Quelle ligne compile ?',
    explanation: 'Seul `set()` accepte une variable. `{}` est un littéral constant que Houdini résout à la compilation : `{n, 0, 0}` et `{@P.y, 0, 0}` sont donc des erreurs de syntaxe, pas des avertissements. Vérifié sur Houdini 22.',
    choices: ['@Cd = set(n, 0, 0);', '@Cd = {n, 0, 0};', '@Cd = {@P.y, 0, 0};', 'La première et la deuxième'],
    choiceExplanations: {
      1: 'n est une variable, et les accolades ne prennent que des constantes — c\'est une erreur de syntaxe.',
      2: 'Un attribut n\'est pas une constante non plus. Même erreur de syntaxe.',
      3: 'Seul set() fonctionne — la version avec accolades ne compile pas.',
    },
  },
  'vec-set-2': {
    title: 'Construis une couleur à partir d\'une valeur calculée',
    codeLines: [
      '// height est une variable : les accolades ne compileront pas ici.',
      'float height = fit(@P.y, -1.0, 1.0, 0.0, 1.0);',
      '@Cd = ___(height, 0.0, 1.0 - ___);',
    ],
    hints: ['La fonction qui construit un vecteur à partir de variables', 'La variable déclarée à la ligne du dessus'],
    explanation: '`set(height, 0.0, 1.0 - height)` — la première et la troisième case contiennent une variable et un calcul, donc les accolades sont exclues. Les points du bas ressortent bleus, ceux du haut rouges.',
  },
  // ── intro ──
  'intro-1': {
    title: "Qu'est-ce que VEX, fondamentalement ?",
    explanation: 'VEX est le **langage d\'expression** intégré à Houdini pour traiter la géométrie — ce n\'est pas un plugin séparé, un format de fichier, ou un outil réservé au shading. Il exécute ton code directement sur des points, primitives, vertices, ou tout le detail.',
    choices: ['Un langage d\'expression intégré pour traiter la géométrie', 'Un plugin tiers à installer dans Houdini', 'Un format de fichier 3D pour exporter de la géométrie', 'Un moteur de rendu réservé au shading, pas à la géométrie'],
  },
  'intro-2': {
    title: 'Avec Run Over réglé sur sa valeur par défaut, ton code de wrangle tourne...',
    explanation: 'Le mode **Run Over** par défaut est **Points** — le code tourne **une fois par point**. `@ptnum` est l\'index du point courant, `@numpt` le total. (Les autres modes Run Over bouclent sur les primitives, les vertices, ou une seule fois pour tout le detail — plus de détails ensuite.)',
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
  'intro-5': {
    title: 'Tu règles le Run Over d\'un wrangle sur Primitives. Qu\'arrive-t-il à `@ptnum` et `@numpt` ?',
    explanation: '`@ptnum` et `@numpt` restent entièrement disponibles — ils ne disparaissent pas juste parce que tu as changé de mode. `@ptnum` signifie maintenant "le point du premier vertex de cette primitive" au lieu de "le point courant", et `@numpt` te donne toujours le nombre total de points de la géométrie, exactement comme avant.',
    choices: ['Toujours lisibles — @ptnum adapte juste son sens', 'Les deux deviennent indisponibles jusqu\'au retour', 'Le code tourne une fois par frame, pas par calcul', 'La syntaxe VEX devient un dialecte réservé aux primitives'],
  },
  'intro-6': {
    title: 'Tu écris `f@mask = 1;` alors que Run Over est réglé sur Primitives. Qu\'est-ce qui se passe ?',
    explanation: 'Run Over ne change pas juste quelle boucle tourne — ça change OÙ les nouvelles données sont stockées. Le nouvel attribut est créé sur le type de composant que le wrangle boucle actuellement : les primitives ici. La même ligne de code en mode Points créerait un attribut de point à la place.',
    choices: ['"mask" est maintenant un attribut de primitive', '"mask" est toujours un attribut de point', '"mask" atterrit sur les points ET les primitives', 'Erreur — impossible de créer un attribut dans ce mode'],
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
    altNotes: ["Ça marche aussi — mais `i@count` crée un **attribut** entier sur la géométrie : il reste sur les points et tous les nœuds en aval peuvent le lire. `int count` est une variable locale : elle n'existe que pendant que ce wrangle tourne sur ce point, puis elle disparaît. Attention, pas d'espace après `i@` — `i@ count` est une erreur de syntaxe."],
    title: 'Déclare un entier',
    codeLines: ['// Déclare un entier nommé "count" avec la valeur 42', '___ = ___;'],
    hints: ['Mot-clé de type pour les nombres entiers, puis le nom', 'La valeur'],
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
    title: 'Que crée `vector pos = 1.0;` ?',
    explanation: 'Assigner un seul nombre à un vecteur est parfaitement valide en VEX — la valeur se **diffuse** sur les trois composantes, donc `pos` devient `{1, 1, 1}`. C\'est le même raccourci qui rend `@Cd = 0.5;` gris moyen (0.5 remplit R, G et B).',
    choices: ['{1, 1, 1} — la valeur remplit les trois composantes', 'Une erreur de compilation — un vecteur a besoin de 3 valeurs entre accolades', '{1, 0, 0} — seule la première composante est définie', '{0, 0, 0} — l\'assignation est ignorée'],
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
  'attr-8': {
    title: 'Fais-le survivre au wrangle',
    prompt: 'Ça devrait teinter la sphère selon la hauteur — mais elle sort **noire**. Regarde bien : la valeur est calculée dans une **variable locale** `float height`, alors que la couleur lit l\'**attribut** `@height`. Ce sont deux choses différentes, et `@height` n\'a jamais été écrit.\n\n**Exécute-le et regarde les checks échouer.** Puis change **un seul token** sur la ligne 3 pour que la valeur atterrisse vraiment sur `@height`.',
    checks: [
      'Un attribut "height" existe sur la géométrie (f@height, pas float height)',
      'height va de 0 en bas → 1 en haut',
      'Les points sont teintés en niveaux de gris selon height (sombre en bas, clair en haut)',
    ],
    explanation: 'Un seul token faisait toute la différence. `float height` ne vit qu\'à l\'intérieur de cette exécution du wrangle ; `f@height` est écrit sur chaque point et voyage en aval avec la géométrie — un autre wrangle, un nœud Color, ou un rendu peuvent tous le lire plus tard. Confondre ces deux formes est probablement l\'erreur de débutant la plus courante en VEX.',
  },
  // ── params ──
  'params-1': {
    title: 'Que fait réellement le déplacement d\'un slider créé depuis `chf("amplitude")` ?',
    explanation: 'Houdini relance le wrangle avec la nouvelle valeur injectée dans chaque appel `chf("amplitude")` du code — exactement comme si tu avais édité le nombre toi-même, mais en direct et sans toucher au VEX.',
    choices: ['Modifie la valeur "amplitude" partout où elle est utilisée dans le code', 'Change seulement la valeur affichée dans le viewport, pas le code réel', 'Renomme le channel partout où il est utilisé', 'N\'a aucun effet jusqu\'à ce que tu retapes le code manuellement'],
  },
  'params-2': {
    title: 'Lis un paramètre float',
    codeLines: [
      '// Lis un paramètre "frequency" au lieu de coder un nombre en dur',
      'float freq = ___("frequency");',
    ],
    hints: ['La fonction explicite et recommandée pour lire un float'],
    explanation: '`chf("frequency")` lit la valeur actuelle du paramètre "frequency" — ça retourne 0 si ce paramètre n\'existe pas encore. Le simple `ch()` lirait la même chose, mais la doc VEX recommande la forme typée puisque `ch()` ne précise pas si tu veux un float, un int, un vector ou une string. (Créer le slider lui-même est une étape séparée — voir la carte de théorie précédente.)',
  },
  'params-3': {
    title: 'Pourquoi la doc de SideFX recommande-t-elle chf()/chi()/chv() plutôt que le simple ch() ?',
    explanation: '`ch()` a plusieurs surcharges et Houdini doit deviner laquelle tu veux d\'après le contexte. `chf()`, `chi()` et `chv()` s\'engagent chacun sur un type précis (float, int, vector), donc il n\'y a plus rien à deviner.',
    choices: ['ch() ne précise pas son type de retour ; chf()/chi()/chv() s\'engagent chacun sur un type précis', 'ch() est obsolète et sera retiré dans une future version de Houdini', 'ch() ne fonctionne que dans les SOPs, pas dans les wrangles', 'ch() ne peut lire que des valeurs int, jamais des floats'],
  },
  'params-4': {
    title: 'Échantillonne un paramètre rampe',
    codeLines: [
      '// "gradient" = quelle rampe, t = où dessus (0 à 1)',
      'float t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);',
      'float val = ___("gradient", t);',
    ],
    hints: ['Échantillonne un paramètre rampe à une position 0..1'],
    explanation: '`chramp("gradient", t)` échantillonne le paramètre rampe "gradient" à la position `t` — une valeur qui varie en douceur sur la plage, pilotée par une courbe plutôt qu\'un seul nombre.',
  },
  'params-5': {
    title: 'Colore une sphère avec une rampe',
    prompt: 'Regarde ce que `chramp()` produit vraiment. `t` va de 0 en bas de cette sphère à 1 en haut — utilise `chramp("falloff", t)` pour en faire une valeur de luminosité, puis mélange deux couleurs avec `lerp()`.',
    checks: ['Utilise chramp("falloff", t) pour échantillonner la rampe', 'Le haut de la sphère est plus chaud que le bas (la forme de la rampe se voit)', 'Les couleurs suivent la courbe de la rampe, pas un mélange linéaire simple'],
    explanation: '`chramp("falloff", t)` transforme la hauteur en une valeur de luminosité qui suit la forme réelle de la rampe, pas juste un mélange linéaire — cette rampe reste sombre sur le premier tiers avant de monter, donc le bas de la sphère reste nettement plus sombre qu\'un simple fondu linéaire ne le donnerait.',
  },
  'params-6': {
    title: 'Slider de luminosité en direct',
    prompt: 'Colore tous les points avec une luminosité en niveaux de gris, pilotée par un **paramètre en direct** au lieu d\'un nombre codé en dur.\n\nL\'appel `chf("brightness")` est déjà là — utilise juste `b` pour définir `@Cd`. Glisse le slider à droite et regarde la couleur changer en direct.',
    checks: ['Lit le paramètre brightness avec chf("brightness")', 'La couleur est en niveaux de gris et correspond à la valeur du slider'],
    explanation: 'Glisser le slider change ce que retourne `chf("brightness")`, ce qui change `b`, ce qui change la couleur de tous les points — en direct, sans éditer le code. C\'est tout l\'intérêt d\'exposer une valeur comme paramètre plutôt que de la coder en dur.',
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
    codeLines: [
      '// noise() est déjà entre 0 et 1. Remappe-le vers 0.2-0.9 pour que',
      '// les points les plus sombres ne soient jamais tout noirs, ni tout blancs.',
      'float n = noise(@P * 2.0);',
      'float c = ___(n, 0.2, 0.9);',
      '@Cd = set(c, c, c);',
    ],
    hints: ['La variante de fit pour les entrées déjà entre 0 et 1'],
    explanation: '`fit01(n, nmin, nmax)` est un raccourci pour `fit(n, 0, 1, nmin, nmax)` — utilise-la quand l\'entrée est déjà connue pour être entre 0 et 1. Dans l\'aperçu, aucun point n\'est jamais tout noir ni tout blanc : tout le dégradé vit entre 0.2 et 0.9.',
  },
  'fit-4': {
    title: 'Que retourne `fit01(1.5, 0, 10)` ?',
    explanation: '`fit01()` ne limite **pas** son entrée — elle suppose juste que tu lui passes du 0–1 et remappe de façon linéaire quoi qu\'il arrive. Avec `x=1.5` (déjà au-delà de la plage supposée), le résultat extrapole aussi hors de la plage cible : `0 + 1.5 × (10-0) = 15`. Si tu veux forcer l\'entrée dans 0–1 d\'abord, combine avec `clamp()`.',
    choices: [
      '15 — fit01 extrapole hors de la plage cible, elle ne limite pas',
      '10 — fit01 limite x à 1 d\'abord',
      '0 — fit01 limite x à 0 d\'abord',
      'Une erreur d\'exécution, puisque x sort de 0–1',
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
      '@Cd = set(___, dist, dist);',
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
    codeLines: [
      '// raw dépasse largement 1 vers le haut — contrains-le',
      '// dans 0..1 avant de l\'utiliser comme canal de couleur.',
      'float raw  = @P.y * 2.0;',
      'float safe = ___(raw, 0.0, 1.0);',
      '@Cd = set(safe, 0.1, 0.2);',
    ],
    hints: ['Force une valeur à rester dans [min, max]'],
    explanation: '`clamp(raw, 0.0, 1.0)` est la méthode standard pour garder une valeur calculée dans une plage sûre. Regarde l\'aperçu : le rouge monte le long de la sphère, puis **sature** — toute la région du haut est également rouge parce que tout ce qui dépassait 1.0 a été ramené exactement à 1.0.',
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
    explanation: 'Non — `lerp()` applique toujours le calcul tel quel. `t=1.5` dépasse `b`. Si tu veux que le résultat reste dans `[a, b]`, applique `clamp()` toi-même — aucune des fonctions de remap de VEX (`fit`/`fit01`/`fit10`/`lerp`) ne limite d\'elle-même.',
    choices: [
      'Non — ça dépasse b. Combine avec clamp() si tu veux rester dans la plage',
      'Oui — t est toujours limité à 0–1 automatiquement',
      'Ça déclenche une erreur d\'exécution',
      'Ça retourne a sans changement',
    ],
  },
  'cl-6': {
    title: 'Mélange deux couleurs',
    codeLines: [
      '// Mélange du bleu (bas) vers le jaune (haut) selon la hauteur',
      'float t = fit(@P.y, -1.0, 1.0, 0.0, 1.0);',
      '@Cd = ___({0, 0, 1}, {1, 1, 0}, t);',
    ],
    hints: ['Interpole entre deux couleurs selon t'],
    explanation: '`lerp(a, b, t)` est la méthode standard pour mélanger deux couleurs — ça fonctionne exactement pareil sur des vecteurs que sur des floats, en interpolant chaque canal. L\'aperçu montre le résultat : bleu pur à t=0, jaune pur à t=1, tous les mélanges entre les deux.',
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
    explanation: 'Sur cette sphère, la normale `@N` pointe directement vers l\'extérieur, donc `dot(@N, up)` est maximal au pôle du haut et minimal en bas — `fit()` transforme ça en une luminosité 0–1 propre. La coque translucide montre POURQUOI : une normale n\'a de sens que par rapport à une surface — un nuage de points isolés dans un vrai Houdini n\'en aurait pas, sauf si ces points viennent réellement d\'une surface comme celle-ci.',
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
  'if-3': {
    title: 'Que vérifie `@P.y > 0 && @ptnum % 2 == 0` ?',
    explanation: '`&&` exige que **les deux** côtés soient vrais. C\'est vrai seulement pour les points qui sont dans la moitié haute ET ont un index pair — pas l\'un ou l\'autre seul.',
    choices: ['Le point est dans la moitié haute ET a un index pair', 'Le point est dans la moitié haute OU a un index pair', 'Seule la condition de moitié haute compte', "Seule la condition d'index pair compte"],
  },
  'if-4': {
    title: 'Combine deux conditions avec ET',
    codeLines: [
      '// Colore en blanc seulement si le point est dans la moitié haute ET a un index pair',
      'if (@P.y > 0 ___ @ptnum % 2 == 0) {',
      '    @Cd = {1.0, 1.0, 1.0};',
      '}',
    ],
    hints: ['Les deux conditions doivent être vraies'],
    explanation: '`&&` (ET) ne laisse la branche s\'exécuter que quand toutes les conditions des deux côtés sont vraies.',
  },
  'if-5': {
    title: 'Que vérifie `@P.y > 0.3 || @P.y < -0.3` ?',
    explanation: '`||` n\'a besoin que d\'**un seul** côté vrai. Cela correspond aux points bien au-dessus du milieu OU bien au-dessous — la bande du milieu est exclue.',
    choices: ['Le point est loin du milieu (au-dessus de 0.3 OU en-dessous de -0.3)', 'Le point est exactement dans la bande du milieu', 'Les deux conditions doivent être vraies à la fois', 'Aucune des deux conditions ne peut jamais être vraie'],
  },
  'if-6': {
    title: 'Chaîne une troisième branche avec else if',
    codeLines: [
      '// Séparation en trois : haut = jaune, bas = bleu, milieu = blanc',
      'if (@P.y > 0.3) {',
      '    @Cd = {1.0, 1.0, 0.0};',
      '} ___ (@P.y < -0.3) {',
      '    @Cd = {0.0, 0.0, 1.0};',
      '} else {',
      '    @Cd = {1.0, 1.0, 1.0};',
      '}',
    ],
    hints: ['Le couple de mots-clés pour "sinon, si cette autre condition est vraie"'],
    explanation: '`else if` n\'est vérifié que si le premier `if` était faux — en enchaîner plusieurs permet de séparer en plus de deux cas, et une seule branche s\'exécute toujours.',
  },
  'if-7': {
    title: 'Pourquoi `0 < @P.y < 1` ne vérifie-t-il pas correctement que @P.y est entre 0 et 1 ?',
    explanation: 'VEX (comme le C) évalue ceci de gauche à droite en deux étapes séparées : d\'abord `0 < @P.y` produit `0` ou `1` (un booléen-en-int), puis **ce résultat** est comparé à `1`. Donc `5 < @P.y < 1` ne signifie pas du tout "@P.y est entre 0 et 1" — ça fait silencieusement autre chose. Utilise plutôt `@P.y > 0 && @P.y < 1`.',
    choices: ["C'est évalué comme `(0 < @P.y) < 1`, pas \"entre 0 et 1\" — utilise && à la place", 'C\'est une erreur de syntaxe en VEX', 'Ça fonctionne correctement — c\'est une façon valide de vérifier une plage', 'Ça ne vérifie que la première comparaison et ignore la seconde'],
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
    checks: ['Le déplacement Y varie par point (une vraie vague, pas une absence de code ou un décalage uniforme)', 'La couleur a été changée par rapport au gris par défaut'],
    explanation: '`sin(@ptnum * 0.3) * 0.4` — la fréquence 0.3 contrôle la "tension" de la vague, l\'amplitude 0.4 contrôle la hauteur. Une grille montre mieux les vagues.',
  },
  'loop-4': {
    title: 'Superpose des vagues avec une boucle for',
    prompt: 'Cette fois, utilise une vraie boucle `for` : additionne 3 ondes sinusoïdales de fréquence croissante (multiplie la fréquence par le compteur de boucle `i`), puis utilise le total pour déplacer `@P.y`.',
    checks: ['Utilise une boucle for', 'Le déplacement Y varie par point dans la grille (une vraie vague superposée, pas une absence de code)'],
    explanation: 'La boucle `for` tourne 3 fois, ajoutant chaque fois une onde sinusoïdale de fréquence plus élevée (`0.15 * i`). Additionner des ondes comme ça, c\'est la base d\'effets plus complexes comme le bruit FBM, que tu verras plus tard.',
  },
  'loop-5': {
    title: 'Combien de fois cette boucle tourne-t-elle ?  `int i = 0; while (i < 3) { i += 1; }`',
    explanation: 'i commence à 0 et gagne 1 à chaque itération : i = 0, 1, 2 — trois itérations. Une fois que i devient 3, `i < 3` est faux et la boucle s\'arrête.',
    choices: ['3 fois', '2 fois', '4 fois', 'Indéfiniment — c\'est une boucle infinie'],
  },
  'loop-6': {
    title: 'Écris une boucle while',
    codeLines: [
      '// Somme 1 à 5, avec une boucle while au lieu d\'une boucle for',
      'float sum = 0;',
      'int i = 1;',
      '___ (i <= 5) {',
      '    sum += i;',
      '    ___;',
      '}',
      '// sum devrait valoir 1+2+3+4+5 = 15',
    ],
    hints: ['Mot-clé de boucle à condition seule', 'Mets à jour le compteur, sinon ça ne s\'arrête jamais'],
    explanation: '`while (i <= 5)` continue de boucler tant que `i` vaut au plus 5. Sans `i++`, la condition ne deviendrait jamais fausse — le compteur d\'une boucle while doit être mis à jour dans son propre corps.',
  },
  'loop-7': {
    title: 'Qu\'est-ce qui ne va pas avec cette boucle ?  `int i = 0; while (i < 5) { @Cd = {1, 0, 0}; }`',
    explanation: '`i` est déclaré mais jamais mis à jour dans le corps de la boucle, donc `i < 5` est toujours vrai — c\'est une boucle infinie. Chaque boucle `while` a besoin de quelque chose dans son corps qui finit par rendre la condition fausse.',
    choices: ['i n\'est jamais mis à jour dans la boucle, donc elle tourne indéfiniment', 'Rien ne va mal — elle colore 5 points en rouge', 'Les boucles while ne peuvent pas définir @Cd', 'La condition devrait être i <= 5'],
  },
  'loop-8': {
    title: 'Arrête-toi tôt avec break',
    codeLines: [
      '// Trouve le PREMIER multiple de 7 entre 1 et 50',
      'int found = -1;',
      'for (int i = 1; i <= 50; i++) {',
      '    if (i % 7 == 0) {',
      '        found = i;',
      '        ___;',
      '    }',
      '}',
      '// found devrait valoir 7 — le plus petit multiple, pas le plus grand',
    ],
    hints: ['Quitte la boucle immédiatement'],
    explanation: '`break` arrête la boucle dès que le premier multiple de 7 (qui est 7 lui-même) est trouvé. Sans lui, la boucle continue d\'écraser `found` avec chaque multiple suivant, en terminant à 49 — le DERNIER sous 50, pas le premier.',
  },
  'loop-9': {
    title: 'Que vaut `total` après cette boucle ?  `float total = 0; for (int i = 0; i < 6; i++) { if (i % 2 == 0) continue; total += i; }`',
    explanation: '`continue` saute `total += i;` chaque fois que `i` est pair (0, 2, 4) — mais la boucle continue de tourner. Seules les valeurs impaires 1, 3, 5 atteignent la ligne `total += i;`, donc total = 1 + 3 + 5 = 9.',
    choices: ['9', '15', '0 — la boucle s\'arrête au premier i pair', '6'],
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
      '@Cd = set(r, r * ___, 0.0);',
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
  'noise-4': {
    title: 'Tu recalcules le même wrangle deux fois avec `rand(@ptnum)`. Les couleurs changent-elles ?',
    explanation: '`rand()` est basé sur une graine — la même graine retourne toujours la même valeur, et `@ptnum` ne change pas entre les calculs. Chaque point garde exactement la même couleur, pour toujours. Ce déterminisme est ce qui rend rand() fiable pour le rendu : la frame 1 et la frame 400 sont d\'accord.',
    choices: ['Non — même graine, même résultat, à chaque fois', 'Oui — rand() donne de nouvelles valeurs à chaque calcul', 'Seulement au premier calcul après le chargement de la scène', 'Ça alterne entre deux motifs'],
  },
  'noise-5': {
    title: 'Comparé à `noise(@P)`, à quoi ressemble `noise(@P * 8)` ?',
    explanation: 'Multiplier la position d\'entrée compresse l\'espace : le motif qui s\'étalait sur 8 unités tient maintenant dans 1. Même bruit, échantillonné 8× "plus vite" — un détail bien plus fin et chargé. La plage de sortie ne change pas du tout, seulement la vitesse à laquelle les valeurs varient entre points voisins.',
    choices: ['Un détail bien plus fin et chargé dans le même espace', 'Des valeurs 8× plus lumineuses', 'Le même motif, juste plus lent à calculer', 'Un dégradé parfaitement lisse de haut en bas'],
  },
  'noise-6': {
    title: 'Détail plus fin + plus de contraste',
    codeLines: [
      '// Plus l\'échelle d\'entrée est grande, plus le détail est fin',
      'float n = noise(@P * ___);   // essaie 5.0',
      '// Le bruit brut colle à 0.5 — étire le milieu pour le contraste',
      'float c = fit(n, 0.3, 0.7, 0.0, 1.0);',
      '@Cd = set(c, c, c);',
    ],
    hints: ['N\'importe quelle échelle entre ~2 et 20 — regarde l\'aperçu devenir plus chargé quand elle grandit'],
    explanation: 'Mettre l\'entrée à l\'échelle tasse plus de variation dans la même sphère — c\'est le réglage de fréquence. La ligne `fit()` étire ensuite le milieu encombré (0.3–0.7) sur toute la plage 0–1, transformant un gris plat en vrais sombres et vrais clairs.',
  },
  'noise-7': {
    title: 'Tu colores les points avec `noise(@P)` brut et tout a l\'air d\'un gris plat et uniforme. Pourquoi ?',
    explanation: 'Directement depuis la doc : la sortie de noise "est dans la plage 0-1 avec une médiane de 0.5". La plupart des valeurs s\'entassent au milieu ; les vrais sombres et clairs sont rares. Étire le milieu vers l\'extérieur — `fit(n, 0.3, 0.7, 0, 1)` — et le contraste revient.',
    choices: ['Le bruit s\'entasse autour de 0.5 — remappe-le pour le contraste', 'noise() ne marche que sur les grilles, pas les sphères', '@P doit être normalisé avant d\'appeler noise()', 'Le viewport ignore tes couleurs'],
  },
  'noise-3': {
    title: 'Surface organique',
    prompt: 'Utilise `noise(@P)` pour créer un déplacement organique sur la sphère.\n\n- Déplace `@P` dans une direction en utilisant le bruit\n- Colore les points selon la valeur du bruit\n- Le résultat doit sembler bosselé et organique, pas plat',
    checks: ['Les points sont déplacés (plage Y > 0.3)', 'Les couleurs varient entre les points'],
    explanation: '`noise(@P)` donne des valeurs spatialement cohérentes — les points voisins ont un bruit similaire. Déplacer le long de `@N` (normale) pousse les points vers l\'extérieur/intérieur pour un aspect bosselé.',
  },
  // ── animation ──
  'anim-1': {
    title: 'Que contient `@Time` ?',
    explanation: '`@Time` est le temps de lecture en **secondes** (0.0 au début de la timeline). Comme il change à chaque frame, tout code qui le lit se réévalue vers quelque chose de nouveau à chaque frame — c\'est ce qui fait bouger les wrangles.',
    choices: ['Le temps de lecture en secondes', 'Le numéro de la frame courante', 'Le temps qu\'a mis le wrangle à calculer', 'Une valeur aléatoire qui change à chaque calcul'],
  },
  'anim-2': {
    title: 'Dé-fige une vague',
    codeLines: [
      '// Cette vague est figée. Ajoute l\'horloge à sa phase pour qu\'elle bouge.',
      '@P.y += sin(@P.x * 2.0 + ___) * 0.3;',
    ],
    hints: ['L\'horloge de lecture, en secondes'],
    explanation: 'Ajouter `@Time` à la phase du sinus décale toute la vague un peu plus à chaque frame — appuie sur play dans l\'exercice suivant pour la voir vraiment bouger.',
  },
  'anim-3': {
    title: 'Ta première animation',
    prompt: 'Fais **onduler cette grille dans le temps** : déplace `@P.y` avec un sinus dont la phase inclut `@Time`, et donne une couleur aux points.\n\nPuis appuie sur **▶ à côté de @Time** et regarde-la bouger — c\'est ton code qui tourne une fois par point, à chaque frame.',
    checks: ['Le déplacement lit @Time (sinon rien ne peut bouger)', 'Le déplacement Y varie à travers la grille (une vraie vague)'],
    explanation: 'La phase `@P.x * 2.0 + @Time * 3.0` mélange espace et temps : la partie `@P.x` donne sa forme à la vague, la partie `@Time` la fait glisser. Scrub ou lance le contrôle @Time — dans le vrai Houdini, c\'est juste appuyer sur play sur la timeline.',
  },
  'anim-4': {
    title: 'Bruit vivant',
    prompt: 'Fais **dériver le bruit** : colore la sphère avec `noise()`, mais décale la position d\'entrée avec `@Time` pour que le motif défile quand tu appuies sur play.\n\nBonus : déplace le long de `@N` avec la même valeur pour une surface organique qui respire.',
    checks: ['L\'entrée du noise inclut @Time (pour que le motif puisse dériver)', 'Les couleurs varient entre les points (c\'est le bruit qui les pilote)'],
    explanation: 'Ajouter `@Time` à la position d\'entrée du bruit fait glisser le point d\'échantillonnage à travers le champ de bruit — le motif semble couler sur la surface. Cette seule astuce alimente une énorme part des effets de "surface vivante" en production.',
  },
  // ── relbbox-gradients ──
  'rb-1': {
    title: 'Que retourne `relbbox(0, @P)` pour un point tout en bas, au coin minimum de la géométrie ?',
    explanation: '`relbbox` normalise la position par rapport à la bounding box : le coin min correspond à `{0,0,0}` et le coin max à `{1,1,1}`, quelle que soit la taille de l\'objet.',
    choices: ['{0, 0, 0}', '{1, 1, 1}', 'La position monde du point, inchangée', '-1'],
  },
  'rb-2': {
    title: 'Un dégradé qui survit à toutes les échelles',
    codeLines: [
      '// 0 en bas de la bbox, 1 en haut — quelle que soit la taille',
      'vector rel = ___(0, @P);',
      '@Cd = set(rel.y, rel.y, rel.y);',
    ],
    hints: ['Position relative dans la bounding box'],
    explanation: '`relbbox(0, @P).y` est LE dégradé de hauteur idiomatique de Houdini — zéro nombre codé en dur, donc il continue de marcher quand la géométrie change de taille.',
  },
  'rb-3': {
    title: 'Ton dégradé `fit(@P.y, -1, 1, 0, 1)` a cassé après un scale ×10 du modèle. Pourquoi ?',
    explanation: 'Le `-1` et le `1` étaient les bornes de l\'*ancien* objet — codées en dur. Après le scale, @P.y va de -10 à 10, donc le fit sature presque immédiatement. `relbbox(0, @P).y` mesure contre la vraie bounding box, donc il ne périme jamais.',
    choices: ['Les -1..1 codés en dur ne correspondent plus à l\'objet — utilise relbbox à la place', 'fit() ne marche plus sur les objets de plus de 2 unités', '@P.y devient en lecture seule après un scale', 'Le dégradé est bon — c\'est le viewport qui est faux'],
  },
  'rb-4': {
    title: 'Heat-map sur n\'importe quel objet',
    prompt: 'Colore la sphère comme une carte de chaleur — bleu froid à la base, orange chaud au sommet — en utilisant `relbbox` pour que ça marche sur **n\'importe quelle** géométrie, et `lerp()` pour le mélange.\n\nRègle de l\'exercice : aucune borne codée en dur (pas de `fit(@P.y, -1, 1, …)`).',
    checks: ['Utilise relbbox (aucune borne codée en dur)', 'Le sommet de la sphère est plus chaud que la base'],
    explanation: '`lerp(froid, chaud, relbbox(0, @P).y)` est un dégradé de hauteur de qualité production en une ligne : redimensionne l\'objet, et ça continue juste de marcher. C\'est exactement le motif derrière la plupart des setups "dégradé le long d\'un objet".',
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
    prompt: 'Crée des **anneaux colorés concentriques** sur cette grille plate. `length(@P)` est la distance de chaque point au centre — quantifie-la en bandes.\n\n- Plusieurs anneaux visibles (contrôle avec le facteur d\'échelle)\n- Alterne entre deux couleurs contrastées\n\n(Les anneaux ont besoin d\'une forme où la distance *varie* — une grille plate est parfaite. Sur une sphère, chaque point est à la même distance du centre, donc cette astuce ne montrerait rien.)',
    checks: ['Au moins 2 bandes de couleur distinctes visibles', 'Couleurs pas toutes identiques (anneaux visibles)'],
    explanation: '`length(@P)` sur la grille croît de 0 au centre à ~1,4 aux coins. `int(dist * 5)` découpe ça en bandes entières, et `% 2` alterne leur couleur — des anneaux concentriques. Augmente l\'échelle pour des anneaux plus serrés. (C\'est exactement pour ça qu\'une sphère ne marcherait pas : là, chaque point est à distance ~1 du centre, donc rien à découper.)',
  },
  // ── attr-creation ──
  'ca-1': {
    title: 'Tu écris `@speed = 3.5;` dans un wrangle. Quel type est créé ?',
    explanation: 'Un `@nom` nu défaut en **float**, et `3.5` est un float — donc tu obtiens un attribut `float` nommé `speed`. Attention : `@speed = {1,0,0}` ne te donnerait PAS un vecteur — un `@` nu est toujours float, donc tu aurais de mauvais résultats. Utilise `v@speed` quand tu veux un vecteur.',
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
