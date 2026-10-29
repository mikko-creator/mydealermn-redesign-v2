# My Dealer: website redesign concept, version 2

A redesign concept for [mydealermn.com](https://mydealermn.com/), the website of My Dealer, a licensed adult-use
cannabis dispensary at 243 3rd Street North in Bayport, Minnesota. It was built as a pitch and is not affiliated
with or endorsed by My Dealer LLC.

**Preview (noindex):** https://mikko-creator.github.io/mydealermn-redesign-v2/

Version 2 has the same site architecture and the same content as
[version 1](https://github.com/mikko-creator/mydealermn-redesign)
([preview](https://mikko-creator.github.io/mydealermn-redesign/)). Only the design style differs.

## What it is

- **My Dealer's own content, word for word.** Every page of mydealermn.com was captured on 2026-10-29 and rebuilt
  from that capture. `tools/parity.mjs` checks that every captured heading, paragraph, list item and FAQ answer
  appears on the rebuilt page.
- **A bigger site architecture.** The navigation, mega menus, footer columns, page types and URL patterns follow the
  structure of a large multi-state dispensary operator's site. Its added page types are filled only with My Dealer's
  own facts:
  - a store page for Bayport, Minnesota, and all-locations hubs;
  - deals and rewards;
  - a dispensary guide;
  - a Minnesota law summary taken from My Dealer's own FAQ;
  - a blog hub of My Dealer's guides;
  - a site map.
- **"Lake Country" design (version 2).** Glassmorphism combined with Minnesota's Land of 10,000 Lakes, built on My
  Dealer's own brand: the dealer character, ink, cream, gold and sage. It includes:
  - night over the lake with a faint northern-lights glow and the North Star;
  - wool cream and birch, lake blues, pine and a warm sunset on the water;
  - a slab-serif headline with one word in retro postcard script;
  - arched windows and frosted, ice-clear glass;
  - a pine shoreline over the water, ripples, constellations and a compass rose.

  There are three depth layers, with the dealer character and photos breaking out of their sections. Ornaments draw
  themselves as you scroll, stars twinkle, and there are reveal animations and hover states. See
  [docs/DESIGN.md](docs/DESIGN.md).
- **Imagery.** The client's photos and brand film are kept. AI-generated illustrative stills are added and labelled
  as AI-generated; see [docs/MEDIA.md](docs/MEDIA.md).
- **Phones first.** Every page is measured at 390 and 360 px with `tools/phone-audit.mjs` (DPR 3, touch). The checks
  are:
  - no sideways scrolling;
  - every standalone control at least 44 px;
  - no text under 13 px;
  - frosted glass kept to a few places;
  - right-sized WebP photos;
  - background video that loads only when it scrolls into view.
- **No third-party requests for type.** The four typefaces are self-hosted (`assets/fonts/`, SIL Open Font License).

Every "Shop" and "View the menu" link opens the store menu page, `/dispensaries/minnesota/bayport/menu/`. Its labelled
buttons open My Dealer's live menu and preorder at https://mydealermn.com/bayport.

## Build and run locally

Requirements: Node 18+, plus `cwebp` (and optionally `webpmux`) on PATH for the WebP image variants.

```bash
node src/build.mjs                        # writes dist/
node tools/serve.mjs --root dist --port 8080 --not-found 404.html
# open http://127.0.0.1:8080/
```

Checks: `node tools/link-check.mjs --dir dist` (internal links) and `node tools/parity.mjs --dir dist` (captured text).

## Layout

- `src/content/`: the captured pages as ordered content blocks (`pages/*.json`), store facts (`site.json`), the
  navigation and footer (`ia.json`), and the image registry.
- `src/theme/`: the templates (shell, home, captured pages, new page types, site map) and the ornament helpers
  (`util.mjs`).
- `src/styles/`, `src/scripts/`: the design system and its motion.
- `assets/`: the client's photos, brand art and film, the generated images and loop, and the fonts.
- `tools/`: the build, link, parity and preview tools.
