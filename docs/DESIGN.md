# Design system: "Midnight Mesa" (version 2)

Version 2 of the My Dealer redesign keeps the same site architecture and the same content as version 1, word for
word, and changes only the design style: **glassmorphism combined with a mystical western look**. My Dealer's own
brand stays in charge: the noir dealer character in a fedora and sunglasses, near-black ink, cream, gold and sage, and
the dry, honest voice. The mystical western layer is built around those anchors: night skies full of stars, parchment,
desert clay, engraved capitals, a wood-type accent, spur rowels, lassos, arrows, crescent moons and mesas on the
horizon, seen through gold-rimmed smoked glass.

## Three planes

1. **Grounds (back).** Full-bleed bands alternate between three grounds.
   - **Night sky** (`.band--night`): ink `#0d0c14` with a violet zenith glow, a low clay horizon glow and two star
     fields. The stars are dimmer behind the reading column.
   - **Parchment** (`.band--paper`): warm paper `#f1e4cb` with a soft vignette, paper grain and a faint spur-rowel
     watermark clipped to the band's corner.
   - **Desert twilight** (`.band--dusk`): night at the top, violet in the middle and a clay glow on the horizon. It
     is used for the statement moments.

   Body text never sits on a busy pattern.
2. **Glass (middle).** Smoked glass on night (`.glass`) and milk glass on parchment (`.glass--milk`). Each panel has
   a frosted blur, a gold hairline edge, an inner rule six pixels in (the double rule of a tarot card) and a deep
   soft shadow. `.glass--tarot` adds four small gold stars on the inner rule's corners. `.glass--lift` cards rise on
   hover, their edge warms to gold and a foil sheen crosses the glass. Glass is used where something varied sits
   behind it (the film, star fields, photos, the smoke loop). Long reading uses plain surfaces. Hero text sits
   straight on its ground with no glass box behind it, kept readable by the ground itself and a soft shadow.
3. **Front.** Objects cross section seams:
   - the dealer character steps out of the hero's arched film portal;
   - mesa and saguaro silhouettes rise from a band's lower edge;
   - a crescent moon or a cabinet-card photo overlaps the band above it.

   The recipe: a band's backdrop layers live in an inner clip layer, the band itself stays `overflow: visible` and
   stacks above the next band, and the object is placed with a negative offset.

## Ornament layer

Fine gold linework that draws itself when it scrolls into view. Each piece has a class and a template helper in
`src/theme/util.mjs`.

| Piece | Class | Helper |
|---|---|---|
| Double-rule flourish under the accent word | `.scribble` | `skUnderline` |
| Lasso loop around a word | `.sk-circled` | `skCircle` |
| Fletched arrow | `.sk-arrow` | `skArrow` |
| Engraved corner brackets | `.sk-frame` | `skFrame` |
| Divider: rule, diamond, spur rowel, diamond, rule | `.or-rule` | `orRule` |
| Constellation: stars joined by drawn lines | `.or-con` | `orConstellation` |
| Four-point sparkle or eight-point spur rowel | `.or-star` | `orStar` |
| Crescent moon | `.or-moon` | `orMoon` |
| Slowly turning star-chart wheel | `.or-rowel` | `orRowel` |
| Desert skyline of mesas and saguaros | `.or-mesa` | `orMesa` |
| A single saguaro | `.or-cactus` | `orCactus` |
| Twinkling sky with an occasional shooting star | `.or-sky` | `orSky` |

Photos are framed three ways:
- in arches (`.arch`, `.arch-frame`);
- in a gold double-rule frame with star corners (`.sk-frame`);
- as cabinet cards pinned with a brass tack (`.sk-tape`).

Captions are set in Cormorant italic. Engraving illustrations multiply onto parchment, and on night grounds they are
recoloured to gold lines.

## Type

- **Cinzel** (engraved Roman capitals) for display and headings.
- **Rye** (western wood type) for one accent word per heading, set in gold foil on night and desert clay on
  parchment, and for tarot numerals.
- **Cormorant Garamond** for ledes, quotes and captions.
- **Jost** for body text and UI labels. Labels, kickers and buttons are set in spaced capitals; kickers sit between
  four-point stars.

## Colour

| Role | Values |
|---|---|
| Night | `#0d0c14`, `#16141f`, `#211d2e` |
| Dusk violet | `#2a2240`, `#3d3160`; `#3a2d52` for links and focus on parchment |
| Parchment | `#f1e4cb`, `#e6d3b0`; bone `#fbf3e4` |
| Gold (the brand's) | `#e2b65a` with starlight `#f6dc9c` and deep `#b8872f`; `#7a5714` for small gold text on parchment |
| Sage (the brand's) | `#9fb07a` |
| Desert clay | `#c8693f`, `#9b4a2b` |
| Turquoise | `#62b6a8`, sparingly |

Body text keeps a contrast of at least 4.5:1 on its ground.

## Motion

- Scroll reveals (fade and lift, staggered), with a fail-safe that shows everything after 2.5 seconds.
- Ornaments draw on as they enter: rules, lassos, arrows, constellations, corner brackets.
- Stars twinkle at their own pace, a shooting star crosses the hero sky every few seconds, and star-chart wheels turn
  slowly.
- Gentle parallax on mesas, moons and other decorative objects (transform only, desktop and tablet).
- Pointer tilt with a gold foil glint on a few tarot cards (fine pointers only).
- A slow marquee of the site's own short phrases.
- Hover:
  - glass lifts and its edge warms to gold;
  - gold buttons shift their foil;
  - links draw a flourish;
  - cabinet cards straighten.
- The hero film has a pause button; films pause off-screen.
- `prefers-reduced-motion: reduce` turns all of it off: everything is shown, drawn and still, and the films show
  their posters.

## Header and navigation

The header and navigation are the same as version 1:
- a promo bar;
- the licence line with "Pick up at My Dealer Bayport";
- a smoked-glass header with the logo, the main navigation in the adopted order and a "View the menu" button.

From 1024 px wide, every destination is reachable from the bar: each mega menu is a glass tarot panel with grouped
links and one arched image card. Below 1024 px the same navigation becomes a drawer. Menus open on hover with intent
and a close delay, open on click or Enter, and close on Escape.

## Components (class names)

| Class | Use |
|---|---|
| `.wrap` `.wrap--wide` `.wrap--narrow` | centred content widths |
| `.band` `.band--night` `.band--paper` `.band--dusk` `.band__clip` `.band--over` | full-bleed sections, their backdrop layer, stacking above the next band |
| `.glass` `.glass--night` `.glass--milk` `.glass--tarot` `.glass--lift` `.glass--plain` | smoked and milk glass, tarot corners, lift, no inner rule |
| `.btn` `.btn--gold` `.btn--ghost` `.btn--glass` `.btn--sm` `.btn-row` | buttons (gold foil, outline, smoked glass) |
| `.kicker` `.display` `.lede` `.ui-label` `.numeral` `.accent` | type roles |
| `.arch` `.arch-frame` | arched portals and frames |
| `.scribble` `.sk-circled` `.sk-arrow` `.sk-note` `.sk-frame` `.sk-tape` `.sk-illo` | flourish, lasso, arrow, caption, framed photo, cabinet card, engraving |
| `.or-star` `.or-rule` `.or-moon` `.or-rowel` `.or-con` `.or-mesa` `.or-cactus` `.or-sky` | the v2 ornaments |
| `.chip` `.chip-row` `.card` `.prose` `.crumbs` `.img-slot` `.protrude` | chips, plain cards, long reading, breadcrumbs, placeholder, seam-crossing object |
| `.foil-glint` `.spin` `.pulse` `.float` | pointer glint, slow turn, soft pulse, float |
| `[data-reveal]` `[data-draw]` `[data-depth]` `[data-tilt]` `[data-foil]` `[data-marquee]` | motion hooks |

## Accessibility

- One level-one heading per page, landmarks, real links and buttons, and a skip link.
- Focus rings are always visible: gold on night, dusk violet on parchment.
- Every meaningful image has alt text; decorative images and ornaments are hidden from assistive technology.
- Nothing essential is behind hover only.
- The menus, drawer and age gate work from the keyboard.
- The reduced-motion behaviour is described under Motion.
- The 21+ age gate never blocks the page when JavaScript is off.
