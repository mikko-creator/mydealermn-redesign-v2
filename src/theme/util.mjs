// util.mjs - shared helpers (FOUNDATION owns this file; others import, never edit - ask through your report).
import { img, picture, imgUrl, hasGenerated } from '../lib/images.mjs';
export { img, picture, imgUrl, hasGenerated };

// Generated image by id (see docs/BUILD-CONTRACT.md "Generated image ids"). While IMAGERY is still producing, a lane
// build with ALLOW_MISSING_GEN=1 gets a styled placeholder slot instead of a build failure; the final build (no env)
// fails on any missing id.
export function gimg(id, opts = {}) {
  if (hasGenerated(id) || process.env.ALLOW_MISSING_GEN !== '1') return img(id, opts);
  return `<span class="img-slot ${opts.cls || ''}" data-slot="${String(id).replace(/"/g, '')}" role="img" aria-label="${String(opts.alt || '').replace(/"/g, '&quot;')}"></span>`;
}

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escA = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const attrs = (o = {}) => Object.entries(o).filter(([, v]) => v !== false && v != null && v !== '').map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${escA(v)}"`)).join('');

export const LIVE_ORIGIN = 'https://mydealermn.com';
export const isExternal = (u) => /^(https?:)?\/\//i.test(String(u)) || /^(mailto|tel|sms):/i.test(String(u));

// Internal page paths are written as directories ("/flower" -> "/flower/"), so every internal link gets the trailing
// slash; "#frag" and "?q" survive; files ("/404.html", "/assets/...") are left alone. External URLs unchanged.
export function href(u) {
  const s = String(u ?? '');
  if (!s || isExternal(s) || s.startsWith('#')) return s;
  // the live menu is external (contract D4): captured "/bayport" and "/bayport/menu/..." links go to the live site
  if (/^\/bayport(?:[/?#]|$)/.test(s)) return LIVE_ORIGIN + s;
  const m = s.match(/^([^?#]*)([?#].*)?$/);
  let p = m[1];
  const rest = m[2] || '';
  if (!p.startsWith('/')) return s;
  if (p.startsWith('/assets/') || /\.[a-z0-9]{2,5}$/i.test(p)) return s;
  if (!p.endsWith('/')) p += '/';
  return p + rest;
}

// <a> attributes for any URL: external links open in a new tab with rel noopener (mailto/tel stay in place).
export function linkAttrs(u, extra = {}) {
  const h = href(String(u ?? ''));
  const ext = /^(https?:)?\/\//i.test(h);
  return attrs({ href: h, ...(ext ? { target: '_blank', rel: 'noopener' } : {}), ...extra });
}

// Rewrite the root-absolute links inside captured inline HTML (paragraphs from the block JSON) to the trailing-slash
// form, and give external links target/rel. Text is never touched.
export function fixLinks(html) {
  return String(html ?? '').replace(/<a\s([^>]*?)href="([^"]*)"([^>]*)>/g, (all, pre, u, post) => {
    const rest = (pre + post).replace(/\s?(target|rel)="[^"]*"/g, '');
    return `<a ${rest.trim() ? rest.trim() + ' ' : ''}${linkAttrs(u.replace(/&amp;/g, '&')).trim()}>`;
  });
}

// Photo registry (src/content/images.json, written by IMAGERY): photo(id, opts) -> <img> for a client photo by id.
// Falls back to the captured source path under /assets/photos/ when the id is a path.
export function photo(ctx, id, opts = {}) {
  const p = (ctx.images.photos || {})[id];
  if (p) return img({ src: p.src, w: p.w, h: p.h, alt: p.alt }, opts);
  if (String(id).startsWith('/assets/')) return img({ src: id }, opts);
  throw new Error('missing image: unknown photo id "' + id + '"');
}

export const slugify = (s) => String(s).toLowerCase().replace(/&[a-z]+;/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// ---------- ornament SVG helpers (v2 "Midnight Mesa"; main session owns these) ----------
// v1's helper names are kept (the templates call them); they now draw the mystical-western ornament set. Each returns
// an inline <svg class="sk ..." aria-hidden="true">; stroked paths carry pathLength="1" + class "sk-p", and an svg with
// data-draw draws them on when site.js marks it .is-in (motion.css). Colour = currentColor (sketch.css sets it).
// Shared defs (skDefs(), written once per page by the shell): #sk-rough (kept under its v1 id because templates use
// it; now a soft starlight glow, user-space region so a single straight line is never clipped), #or-foil (gold foil
// gradient, for FILLED shapes only: an objectBoundingBox gradient does not paint on a perfectly straight stroke),
// #or-shoot (shooting-star tail), symbols #or-star4 (four-point sparkle) and #or-star8 (eight-point spur rowel).
//   skUnderline({ cls, hover })   double-rule flourish under an accent word; hover: true draws only while the
//                                 parent .sk-hover is hovered or focused
//   skCircle({ cls })             a lasso: rope loop + trailing end, around a word or an object (.sk-circled)
//   skArrow(dir, { cls })         a fletched arrow; dir: right | left | down | up | down-right | down-left
//   skFrame({ cls })              four engraved corner brackets inside a .sk-frame
//   skPath(d, { vb, cls, sw })    any path(s), drawn on
//   orStar({ cls, kind, foil })   filled four-point sparkle (kind '4') or eight-point spur rowel ('8')
//   orRule({ cls })               ornamental divider: rule, diamond, rowel, diamond, rule (drawn on)
//   orMoon({ cls })               crescent moon (filled; rotate it with CSS for variety)
//   orRowel({ cls })              large spur-rowel / star-chart wheel (thin outlines) for slow rotation behind things
//   orConstellation(points, { cls, links, vb })  stars at [x, y] joined by drawn lines (links: [[i, j], ...])
//   orMesa({ cls })               desert skyline: far mesas (.or-mesa__far) + near ridge with saguaros (.or-mesa__near)
//   orCactus({ cls })             one saguaro silhouette
//   orSky({ cls, n, seed, shoot }) twinkling star layer that covers its positioned parent (for a .band__clip)
const skSvg = (vb, inner, cls, { par = 'none', rough = false, draw = true } = {}) =>
  `<svg class="sk ${cls}" viewBox="${vb}" preserveAspectRatio="${par}" aria-hidden="true" focusable="false"${draw ? ' data-draw' : ''}>${rough ? `<g filter="url(#sk-rough)">${inner}</g>` : inner}</svg>`;
const skP = (d, extra = '') => `<path class="sk-p" pathLength="1" d="${d}"${extra}/>`;
const fx = (n) => +n.toFixed(1);
const STAR4 = 'M0-10C1-3 3-1 10 0C3 1 1 3 0 10C-1 3-3 1-10 0C-3-1-1-3 0-10Z';
const STAR8 = (() => {
  let d = '';
  for (let k = 0; k < 16; k++) { const a = (k * Math.PI) / 8 - Math.PI / 2; const r = k % 2 ? 3.7 : 10; d += (k ? 'L' : 'M') + fx(r * Math.cos(a)) + ' ' + fx(r * Math.sin(a)); }
  return d + 'ZM1.7 0A1.7 1.7 0 1 1-1.7 0A1.7 1.7 0 1 1 1.7 0Z';
})();
function prng(seed) { let s = seed | 0; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function skDefs() {
  return `<svg class="sk-defs" aria-hidden="true" focusable="false" width="0" height="0"><defs>`
    + `<filter id="sk-rough" filterUnits="userSpaceOnUse" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="0.9" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
    + `<linearGradient id="or-foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dc9c"/><stop offset="0.35" stop-color="#e2b65a"/><stop offset="0.62" stop-color="#b8872f"/><stop offset="0.82" stop-color="#f0cf86"/><stop offset="1" stop-color="#c99a3c"/></linearGradient>`
    + `<linearGradient id="or-shoot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff8ea" stop-opacity="0"/><stop offset="1" stop-color="#fff8ea"/></linearGradient>`
    + `<symbol id="or-star4" viewBox="-10 -10 20 20"><path d="${STAR4}"/></symbol>`
    + `<symbol id="or-star8" viewBox="-10 -10 20 20"><path fill-rule="evenodd" d="${STAR8}"/></symbol>`
    + `</defs></svg>`;
}
export function skUnderline({ cls = '', hover = false } = {}) {
  return skSvg('0 0 200 20', skP('M4 11C50 6 150 6 196 11') + skP('M34 15.5C80 12.5 120 12.5 166 15.5', ' style="--d:.4s" opacity="0.7"'), `sk-underline${hover ? ' sk-underline--hover' : ''} ${cls}`.trim());
}
export function skCircle({ cls = '' } = {}) {
  return skSvg('0 0 200 100',
    skP('M120 9C62 2 11 19 10 50C9 82 64 96 117 92C168 88 195 68 190 41C185 16 148 5 90 10')
    + skP('M114 14C64 9 18 25 17 50C17 77 66 89 115 86C160 82 185 64 182 42', ' style="--d:.25s" opacity="0.55"')
    + skP('M90 10C70 13 54 5 40-4', ' style="--d:1.1s"'), `sk-circle ${cls}`.trim());
}
export function skArrow(dir = 'right', { cls = '' } = {}) {
  return skSvg('0 0 120 60',
    skP('M14 42C40 28 74 21 109 22')
    + skP('M95 13L111 22L96 31', ' style="--d:.9s"')
    + skP('M14 42L7 33M14 42L5 46M21 38.6L14 29.6M21 38.6L12 42.6M28 35.3L21 26.3M28 35.3L19 39.3', ' style="--d:1.1s"'),
    `sk-arrow sk-arrow--${dir} ${cls}`.trim(), { par: 'xMidYMid meet' });
}
export function skFrame({ cls = '' } = {}) {
  return skSvg('0 0 100 100', skP('M2 14V2H14M86 2H98V14M98 86V98H86M14 98H2V86'), `sk-frame__marks ${cls}`.trim());
}
export function skPath(d, { vb = '0 0 100 100', cls = '', sw = '', par = 'xMidYMid meet', rough = true } = {}) {
  const ds = Array.isArray(d) ? d : [d];
  return skSvg(vb, ds.map((x, i) => skP(x, ` style="--d:${(i * 0.18).toFixed(2)}s"`)).join(''), `sk-path ${cls}`.trim(), { par, rough }).replace('<svg ', sw ? `<svg stroke-width="${sw}" ` : '<svg ');
}
export function orStar({ cls = '', kind = '4', foil = false } = {}) {
  const k = kind === '8' ? '8' : '4';
  return `<svg class="or-star or-star--${k}${foil ? ' or-star--foil' : ''}${cls ? ' ' + cls : ''}" viewBox="-10 -10 20 20" aria-hidden="true" focusable="false"><use href="#or-star${k}" x="-10" y="-10" width="20" height="20"/></svg>`;
}
export function orRule({ cls = '' } = {}) {
  return `<svg class="sk or-rule${cls ? ' ' + cls : ''}" viewBox="0 0 240 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-draw>`
    + skP('M92 12H14') + skP('M148 12H226')
    + skP('M96 12L100 8L104 12L100 16ZM136 12L140 8L144 12L140 16Z', ' style="--d:.55s"')
    + `<g class="or-rule__star"><use href="#or-star8" x="110" y="2" width="20" height="20"/></g><circle class="or-rule__dot" cx="9" cy="12" r="1.8"/><circle class="or-rule__dot" cx="231" cy="12" r="1.8"/></svg>`;
}
export function orMoon({ cls = '' } = {}) {
  return `<svg class="or-moon${cls ? ' ' + cls : ''}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M43.3 10.6A40 40 0 1 0 85.1 69.2A36 36 0 0 1 43.3 10.6Z"/></svg>`;
}
export function orRowel({ cls = '' } = {}) {
  const c = 200;
  let ticks = '';
  for (let i = 0; i < 72; i++) { const a = (i * Math.PI) / 36; const r2 = i % 6 === 0 ? 166 : 177; ticks += `M${fx(c + 188 * Math.cos(a))} ${fx(c + 188 * Math.sin(a))}L${fx(c + r2 * Math.cos(a))} ${fx(c + r2 * Math.sin(a))}`; }
  let star = '';
  for (let k = 0; k < 16; k++) { const a = (k * Math.PI) / 8 - Math.PI / 2; const r = k % 2 ? 52 : 142; star += (k ? 'L' : 'M') + fx(c + r * Math.cos(a)) + ' ' + fx(c + r * Math.sin(a)); }
  let dots = '';
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6 + Math.PI / 12; dots += `<circle cx="${fx(c + 158 * Math.cos(a))}" cy="${fx(c + 158 * Math.sin(a))}" r="2.2"/>`; }
  return `<svg class="or-rowel${cls ? ' ' + cls : ''}" viewBox="0 0 400 400" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1"><circle cx="200" cy="200" r="196"/><circle cx="200" cy="200" r="188"/><circle cx="200" cy="200" r="150"/><circle cx="200" cy="200" r="40"/><circle cx="200" cy="200" r="12"/><path d="${ticks}"/><path d="${star}Z"/></g><g fill="currentColor">${dots}</g></svg>`;
}
export function orConstellation(points, { cls = '', links = null, vb = '0 0 400 200' } = {}) {
  const pairs = links || points.slice(1).map((_, i) => [i, i + 1]);
  const lines = pairs.map(([a, b], i) => skP(`M${points[a][0]} ${points[a][1]}L${points[b][0]} ${points[b][1]}`, ` style="--d:${(i * 0.22).toFixed(2)}s"`)).join('');
  const stars = points.map(([x, y], i) => `<circle class="or-con__star" cx="${x}" cy="${y}" r="${i % 3 === 0 ? 3.2 : 2.2}" style="--i:${i}"/>`).join('');
  return `<svg class="sk or-con${cls ? ' ' + cls : ''}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-draw>${lines}${stars}</svg>`;
}
export function orMesa({ cls = '' } = {}) {
  const far = 'M0 150L60 148L110 120L190 118L215 140L300 142L340 96L470 92L500 132L620 136L690 110L760 108L790 128L900 130L960 84L1120 80L1150 120L1230 124L1290 104L1370 102L1400 126L1500 128L1560 112L1600 114V220H0Z';
  const near = 'M0 186C120 178 220 170 330 176S560 192 700 184S940 168 1080 176S1360 194 1600 180V220H0Z';
  const cacti = 'M262 178V126M262 152H248V136M262 144H276V122M1182 178V118M1182 150H1166V130M1182 138H1197V112M1436 184V146M1436 166H1424V152M1436 160H1448V144';
  return `<svg class="or-mesa${cls ? ' ' + cls : ''}" viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><path class="or-mesa__far" d="${far}"/><path class="or-mesa__near" d="${near}"/><path class="or-mesa__cacti" d="${cacti}" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
export function orCactus({ cls = '' } = {}) {
  return `<svg class="or-cactus${cls ? ' ' + cls : ''}" viewBox="0 0 60 150" aria-hidden="true" focusable="false"><path d="M30 144V16M30 92H13V58M30 74H47V38" fill="none" stroke="currentColor" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
export function orSky({ cls = '', n = 46, seed = 7, shoot = false } = {}) {
  const r = prng(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = fx(r() * 1000), y = fx(r() * 600);
    if (i % 9 === 4) { const s = fx(5 + r() * 6); out += `<use class="or-sky__spark tw" href="#or-star4" x="${fx(x - s / 2)}" y="${fx(y - s / 2)}" width="${s}" height="${s}" style="--tw:${(3 + r() * 4).toFixed(1)}s;--twd:-${(r() * 6).toFixed(1)}s"/>`; continue; }
    const tw = i % 3 === 0;
    out += `<circle${tw ? ' class="tw"' : ''} cx="${x}" cy="${y}" r="${(0.6 + r() * 1.2).toFixed(2)}" opacity="${(0.45 + r() * 0.5).toFixed(2)}"${tw ? ` style="--tw:${(2.6 + r() * 4.4).toFixed(1)}s;--twd:-${(r() * 6).toFixed(1)}s"` : ''}/>`;
  }
  const sh = shoot ? `<g transform="translate(860 70) rotate(158)"><rect class="or-sky__shoot" x="0" y="-0.9" width="150" height="1.8" rx="0.9" fill="url(#or-shoot)"/></g>` : '';
  return `<svg class="or-sky${cls ? ' ' + cls : ''}" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${out}${sh}</svg>`;
}
