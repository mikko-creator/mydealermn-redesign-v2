# Design system: "Lake Country" (version 2)

Version 2 of the My Dealer redesign keeps the same site architecture and the same content as version 1, word for
word. Only the design style changes: **glassmorphism combined with Minnesota's Land of 10,000 Lakes**.

My Dealer's own brand stays in charge:
- the noir dealer character in a fedora and sunglasses;
- near-black ink, cream, gold and sage;
- the dry, honest voice.

The lake-country layer is built around those anchors:
- night over the lake with a faint northern-lights glow and the North Star;
- wool cream and birch;
- lake blues and pine greens, with a warm sunset glow on the water;
- a pine shoreline on the horizon;
- a slab-serif headline with a single word in retro postcard script.

All of it is seen through frosted, ice-clear glass.

## Three planes

1. **Grounds (back).** Full-bleed bands alternate between three grounds. Body text never sits on a busy pattern.

   | Ground | Class | What it is |
   |---|---|---|
   | Night over the lake | `.band--night` | Deep lake navy `#0a1620`, a soft aurora glow at the top, a lake-blue bloom low down and two star fields, dimmer behind the reading column |
   | Wool and birch | `.band--paper` | Warm cream `#f1ece1`, a soft vignette, paper grain and a faint lake depth-chart (contour lines) watermark clipped to the band's corner |
   | Sunset on the lake | `.band--dusk` | Night at the top, lake blue in the middle and a warm coral glow on the water line, for the statement moments |

2. **Glass (middle).** Glass is used where something varied sits behind it: the film, star fields, photos, the smoke loop.
   - Frosted glass on night (`.glass`) and milk glass on cream (`.glass--milk`).
   - Every panel has a soft blur, an ice-white hairline edge, a thin inner rule and a deep soft shadow.
   - `.glass--tarot` puts four small North Stars on the inner rule's corners. The v2 class name is kept.
   - `.glass--lift` cards rise on hover; the edge cools to ice blue and a sheen crosses the glass.
   - Long reading uses plain surfaces.
   - Hero text sits straight on its ground with no glass box behind it.
3. **Front.** Objects cross section seams:
   - the dealer character steps out of the hero's arched film window;
   - the pine shoreline rises from a band's lower edge;
   - a moon or a snapshot photo overlaps the band above it.

   The recipe: a band's backdrop layers live in an inner clip layer. The band itself stays `overflow: visible` and
   stacks above the next band, and the object is placed with a negative offset.

## Ornament layer

Fine linework that draws itself when it scrolls into view. Each piece has a helper in `src/theme/util.mjs`; the helper
names are kept from earlier versions.

| Piece | Class | Helper |
|---|---|---|
| Wave underline under the accent word | `.scribble` | `skUnderline` |
| Ripple rings around a word | `.sk-circled` | `skCircle` |
| Drawn arrow | `.sk-arrow` | `skArrow` |
| Corner brackets | `.sk-frame` | `skFrame` |
| Divider: rule, ripples, the North Star, ripples, rule | `.or-rule` | `orRule` |
| Constellations | `.or-con` | `orConstellation` |
| The North Star (four points) and a compass star (eight points) | `.or-star` | `orStar` |
| Moon | `.or-moon` | `orMoon` |
| Slowly turning compass rose | `.or-rowel` | `orRowel` |
| The pine shoreline over water | `.or-mesa` | `orMesa` |
| A single pine | `.or-cactus` | `orCactus` |
| Twinkling sky with an occasional shooting star | `.or-sky` | `orSky` |

Photos are framed in three ways:
- in arched windows (`.arch`, `.arch-frame`);
- in a double-rule frame with star corners (`.sk-frame`);
- as snapshot cards pinned with a brass tack (`.sk-tape`).

Captions are set in Lora italic. Engraving illustrations multiply onto cream; on night grounds they are recoloured to
gold lines.

## Type

| Typeface | Use |
|---|---|
| Bitter (sturdy slab serif) | Display, headings and numerals |
| Yellowtail (retro script) | One accent word per heading, like a lake-resort postcard: gold on night, deep lake blue on cream |
| Lora | Ledes, quotes and captions |
| Jost | Body and UI labels |

Labels, kickers and buttons are set in spaced capitals, and kickers sit beside a small North Star. All four typefaces
are self-hosted.

## Colour

| Role | Values |
|---|---|
| Lake night | `#0a1620`, `#10212d`, `#172c3a` |
| Lake blues | `#12324a`, `#1d4a66` (links and accents on cream), `#2b6f93` |
| Ice | `#d8eef5` |
| Wool and birch | `#f1ece1`, `#e4dccb`, `#fbf8f1` |
| Pine | `#23453c` |
| Gold (the brand's) | `#e2b65a`, with starlight `#f6dc9c` |
| Sage (the brand's) | `#9fb07a` |
| Sunset coral | `#e07a5f` |
| Northern-lights green | `#46c79b`, as glow only |

Body text keeps a contrast of at least 4.5:1 on its ground.

## Motion

- Scroll reveals (fade and lift, staggered), with a fail-safe that shows everything after 2.5 seconds.
- Ornaments draw on as they enter.
- Stars twinkle at their own pace and a shooting star crosses the hero sky now and then.
- The compass rose turns slowly.
- Gentle parallax on decorative objects (desktop and tablet).
- Pointer tilt with a soft glint on a few cards (fine pointers only).
- A slow marquee of the site's own short phrases.
- Hover:
  - glass lifts;
  - gold buttons shift their sheen;
  - links draw a wave;
  - snapshot cards straighten.
- The hero film has a pause button, and films pause off-screen.
- `prefers-reduced-motion: reduce` turns all of it off: everything is shown, drawn and still.

## Header and navigation

The header and navigation match version 1:
- a promo bar;
- the licence line with "Pick up at My Dealer Bayport";
- a frosted header with the logo, the main navigation in the adopted order and a "View the menu" button.

From 1024 px wide every destination is reachable from the bar: each mega menu is a glass panel with grouped links and
one image card in an arched window. Below 1024 px the same navigation becomes a drawer.

## Accessibility

- One level-one heading per page, landmarks, real links and buttons, and a skip link.
- Focus rings are always visible.
- Every meaningful image has alt text; decorative images and ornaments are hidden from assistive technology.
- Nothing essential is behind hover only.
- The menus, drawer and age gate work from the keyboard.
- The reduced-motion behaviour is described under Motion.
- The 21+ age gate never blocks the page when JavaScript is off.
