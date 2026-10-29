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

// ---------- ornament SVG helpers (v2 "Lake Country"; main session owns these; v2 names kept) ----------
// v1's helper names are kept (the templates call them); they now draw the mystical-western ornament set. Each returns
// an inline <svg class="sk ..." aria-hidden="true">; stroked paths carry pathLength="1" + class "sk-p", and an svg with
// data-draw draws them on when site.js marks it .is-in (motion.css). Colour = currentColor (sketch.css sets it).
// Shared defs (skDefs(), written once per page by the shell): #sk-rough (kept under its v1 id because templates use
// it; now a soft starlight glow, user-space region so a single straight line is never clipped), #or-foil (gold foil
// gradient, for FILLED shapes only: an objectBoundingBox gradient does not paint on a perfectly straight stroke),
// #or-shoot (shooting-star tail), symbols #or-star4 (four-point sparkle) and #or-star8 (eight-point spur rowel).
//   skUnderline({ cls, hover })   a double wave under an accent word; hover: true draws only while the
//                                 parent .sk-hover is hovered or focused
//   skCircle({ cls })             ripple rings around a word or an object (.sk-circled)
//   skArrow(dir, { cls })         a drawn arrow; dir: right | left | down | up | down-right | down-left
//   skFrame({ cls })              four engraved corner brackets inside a .sk-frame
//   skPath(d, { vb, cls, sw })    any path(s), drawn on
//   orStar({ cls, kind, foil })   filled four-point sparkle (kind '4') or eight-point spur rowel ('8')
//   orRule({ cls })               divider: rule, ripples, the North Star, ripples, rule (drawn on)
//   orMoon({ cls })               crescent moon (filled; rotate it with CSS for variety)
//   orRowel({ cls })              compass rose ring (thin outlines, no letters) for slow rotation behind things
//   orConstellation(points, { cls, links, vb })  stars at [x, y] joined by drawn lines (links: [[i, j], ...])
//   orMesa({ cls })               lake shoreline: far hills (.or-mesa__far), pine tree line (.or-mesa__near), ripples
//   orCactus({ cls })             one pine silhouette
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
  return skSvg('0 0 200 20', skP('M4 10C20 4 36 4 52 10S84 16 100 10S132 4 148 10S180 16 196 10') + skP('M40 16C56 12.5 72 12.5 88 16S120 19.5 136 16S152 12.5 160 15', ' style="--d:.4s" opacity="0.7"'), `sk-underline${hover ? ' sk-underline--hover' : ''} ${cls}`.trim());
}
export function skCircle({ cls = '' } = {}) {
  return skSvg('0 0 200 100',
    skP('M100 10C152 10 190 28 190 50C190 72 152 90 100 90C48 90 10 72 10 50C10 28 48 10 100 10')
    + skP('M100 2C160 2 198 25 198 50', ' style="--d:.35s" opacity="0.55"')
    + skP('M100 98C40 98 2 75 2 50', ' style="--d:.55s" opacity="0.55"'), `sk-circle ${cls}`.trim());
}
export function skArrow(dir = 'right', { cls = '' } = {}) {
  return skSvg('0 0 120 60',
    skP('M12 40C40 26 74 20 108 22')
    + skP('M94 12L110 22L95 32', ' style="--d:.9s"'),
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
    + skP('M98 12H14') + skP('M142 12H226')
    + skP('M60 17C66 15 72 15 78 17M162 17C168 15 174 15 180 17', ' style="--d:.55s" opacity="0.7"')
    + `<g class="or-rule__star"><use href="#or-star4" x="110" y="2" width="20" height="20"/></g><circle class="or-rule__dot" cx="9" cy="12" r="1.8"/><circle class="or-rule__dot" cx="231" cy="12" r="1.8"/></svg>`;
}
export function orMoon({ cls = '' } = {}) {
  return `<svg class="or-moon${cls ? ' ' + cls : ''}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M43.3 10.6A40 40 0 1 0 85.1 69.2A36 36 0 0 1 43.3 10.6Z"/></svg>`;
}
export function orRowel({ cls = '' } = {}) {
  // a compass rose (the North Star State): rings, 72 ticks, a long four-point star over a shorter one, no letters
  const c = 200;
  let ticks = '';
  for (let i = 0; i < 72; i++) { const a = (i * Math.PI) / 36; const r2 = i % 6 === 0 ? 166 : 177; ticks += `M${fx(c + 188 * Math.cos(a))} ${fx(c + 188 * Math.sin(a))}L${fx(c + r2 * Math.cos(a))} ${fx(c + r2 * Math.sin(a))}`; }
  const rose = (R, r, off) => { let d = ''; for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 - Math.PI / 2 + off; const rr = k % 2 ? r : R; d += (k ? 'L' : 'M') + fx(c + rr * Math.cos(a)) + ' ' + fx(c + rr * Math.sin(a)); } return d + 'Z'; };
  return `<svg class="or-rowel${cls ? ' ' + cls : ''}" viewBox="0 0 400 400" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1"><circle cx="200" cy="200" r="196"/><circle cx="200" cy="200" r="188"/><circle cx="200" cy="200" r="150"/><circle cx="200" cy="200" r="16"/><path d="${ticks}"/><path d="${rose(142, 30, 0)}"/><path d="${rose(96, 22, Math.PI / 4)}"/></g><path fill="currentColor" d="M200 58L212 186L200 200L188 186Z"/></svg>`;
}
export function orConstellation(points, { cls = '', links = null, vb = '0 0 400 200' } = {}) {
  const pairs = links || points.slice(1).map((_, i) => [i, i + 1]);
  const lines = pairs.map(([a, b], i) => skP(`M${points[a][0]} ${points[a][1]}L${points[b][0]} ${points[b][1]}`, ` style="--d:${(i * 0.22).toFixed(2)}s"`)).join('');
  const stars = points.map(([x, y], i) => `<circle class="or-con__star" cx="${x}" cy="${y}" r="${i % 3 === 0 ? 3.2 : 2.2}" style="--i:${i}"/>`).join('');
  return `<svg class="sk or-con${cls ? ' ' + cls : ''}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-draw>${lines}${stars}</svg>`;
}
export function orMesa({ cls = '' } = {}) {
  // lake shoreline: rounded far hills (.or-mesa__far), a pine tree line on the near shore (.or-mesa__near) and light
  // ripple strokes on the water in front (.or-mesa__cacti keeps its v2 class name)
  const far = 'M0 150C80 128 160 120 240 132S400 150 480 128S640 104 740 120S900 146 1000 126S1180 100 1280 118S1460 142 1600 124V220H0Z';
  const r = prng(17);
  let near = 'M0 220V192';
  for (let x = 0; x < 1600;) {
    const w = 14 + r() * 22, h = 18 + r() * 46, base = 190 + r() * 4, cx = x + w / 2;
    near += `L${fx(x)} ${fx(base)}L${fx(cx - w * 0.28)} ${fx(base - h * 0.45)}L${fx(cx - w * 0.36)} ${fx(base - h * 0.45)}L${fx(cx)} ${fx(base - h)}L${fx(cx + w * 0.36)} ${fx(base - h * 0.45)}L${fx(cx + w * 0.28)} ${fx(base - h * 0.45)}L${fx(x + w)} ${fx(base)}`;
    x += w * (0.7 + r() * 0.5) + (r() < 0.12 ? 30 + r() * 60 : 0);
  }
  near += 'L1600 192V220Z';
  const water = 'M90 205H250M330 212H420M600 207H780M900 214H990M1120 206H1260M1380 213H1500';
  return `<svg class="or-mesa${cls ? ' ' + cls : ''}" viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><path class="or-mesa__far" d="${far}"/><path class="or-mesa__near" d="${near}"/><path class="or-mesa__cacti" d="${water}" fill="none" stroke-width="2" stroke-linecap="round"/></svg>`;
}
export function orCactus({ cls = '' } = {}) {
  // one pine (kept under the v2 name)
  return `<svg class="or-cactus${cls ? ' ' + cls : ''}" viewBox="0 0 60 150" aria-hidden="true" focusable="false"><path fill="currentColor" d="M30 4L44 40H36L50 74H40L56 112H34V146H26V112H4L20 74H10L24 40H16Z"/></svg>`;
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
