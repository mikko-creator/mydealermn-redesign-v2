// menu.mjs - the store's menu page, /dispensaries/minnesota/bayport/menu/ (the adopted architecture's "Shop" opens the
// chosen store's menu page on the site itself). My Dealer's live menu at mydealermn.com/bayport answers 403 to every
// connection this pitch could test from (scripts, a real browser abroad, a US fetch service), so every "Shop" / "View
// the menu" / category-menu link of the site lands here, and the live menu is one clearly labelled button away.
// Words: site.json strings verbatim (order ahead, categories, brands, what it sells, payment, hours); new words are
// labels only. Links marked data-keep-live are the only ones build.mjs leaves pointing at the live menu.
import { page } from './shell.mjs';
import { esc, escA, linkAttrs, gimg, skUnderline, orRule, orSky, orMesa, orStar } from './util.mjs';

export const MENU_PATH = '/dispensaries/minnesota/bayport/menu/';
// live-menu category URLs as linked by the captured pages, mapped to the category anchors on this page
export const LIVE_CATEGORIES = {
  flower: [['https://mydealermn.com/bayport/menu/flower-9630', 'Flower']],
  'pre-rolls': [['https://mydealermn.com/bayport/menu/pre-rolls-10350', 'Pre-rolls']],
  edibles: [['https://mydealermn.com/bayport/menu/weed-edibles-9631', 'Cannabis edibles'], ['https://mydealermn.com/bayport/menu/hemp-edibles-12319', 'Hemp edibles']],
  vapes: [['https://mydealermn.com/bayport/menu/vapes-10353', 'Vapes']],
  beverages: [['https://mydealermn.com/bayport/menu/hemp-beverages-12318', 'Hemp THC beverages']],
};
const IMG = { flower: 'g-deli-jars', 'pre-rolls': 'g-prerolls', edibles: 'g-edibles', vapes: 'g-vape', beverages: 'g-beverage' };
const live = (url, extra = {}) => linkAttrs(url, { 'data-keep-live': 'true', ...extra });

export async function render(ctx) {
  const s = ctx.site;
  const st = s.store;
  const a = st.address;
  const cats = s.categories.map((c, i) => `<article class="mn-cat glass glass--night glass--tarot glass--lift" id="${escA(c.slug)}" data-reveal style="--i:${i}">
  <span class="numeral mn-cat__num" aria-hidden="true">${['I', 'II', 'III', 'IV', 'V', 'VI'][i] || ''}</span>
  <div class="mn-cat__media arch-frame"><div class="arch">${gimg(IMG[c.slug], { alt: '', sizes: '(max-width: 767px) 80vw, (max-width: 1023px) 40vw, 340px' })}</div></div>
  <div class="mn-cat__body">
    <h3 class="mn-cat__h">${esc(c.name)}</h3>
    <p class="mn-cat__p">${esc(c.blurb)}</p>
    <ul class="mn-cat__links">
      ${(LIVE_CATEGORIES[c.slug] || []).map(([u, l]) => `<li><a class="btn btn--gold btn--sm"${live(u)}>${esc(l)} on the live menu</a></li>`).join('\n      ')}
      <li><a class="btn btn--ghost btn--sm"${linkAttrs(c.path)}>${esc(c.name)} guide</a></li>
    </ul>
  </div>
</article>`).join('\n');

  const main = `
<section class="band band--night band--over mn-hero">
  <div class="band__clip" aria-hidden="true">${orSky({ cls: 'r-hero__sky', n: 64, seed: 41, shoot: true })}${orMesa({ cls: 'r-hero__mesa' })}</div>
  <div class="wrap wrap--wide mn-hero__in">
    <div class="mn-hero__panel">
      <p class="kicker">${esc(st.name)} · ${esc(a.city)}, ${esc(a.region)}</p>
      <h1 class="display mn-hero__h">Shop the <span class="scribble">menu${skUnderline()}</span></h1>
      ${orRule({ cls: 'mn-hero__rule' })}
      <p class="lede">${esc(st.orderAhead)}</p>
      <div class="btn-row">
        <a class="btn btn--gold"${live(st.menuUrl)}>Open the live menu</a>
        <a class="btn btn--glass"${linkAttrs(st.directionsUrl)}>Get directions</a>
        <a class="btn btn--ghost"${linkAttrs('/shop')}>How to shop</a>
      </div>
      <dl class="mn-facts">
        <div><dt>Hours</dt><dd>${esc(st.hoursShort)}</dd></div>
        <div><dt>Address</dt><dd>${esc(a.street)}, ${esc(a.city)}, ${esc(a.region)} ${esc(a.postal)}</dd></div>
        <div><dt>Payment</dt><dd>${esc(st.payment)}</dd></div>
        <div><dt>Age</dt><dd>${esc(st.age)}</dd></div>
      </dl>
    </div>
    <figure class="mn-hero__media arch-frame" aria-hidden="true"><div class="arch">${gimg('g-bud-macro', { alt: '', sizes: '(min-width: 1024px) 420px, 70vw', eager: true })}</div>${orStar({ cls: 'r-hero__arch-star', kind: '8' })}</figure>
  </div>
</section>
<section class="band band--paper mn-cats" aria-labelledby="mn-cats-h">
  <div class="wrap wrap--wide">
    <header class="band__head band__head--center"><p class="kicker">Shop by category</p><h2 class="display" id="mn-cats-h">Categories</h2>${orRule()}</header>
    <div class="mn-cats__grid">
${cats}
    </div>
  </div>
</section>
<section class="band band--dusk mn-shelf" aria-labelledby="mn-shelf-h">
  <div class="wrap wrap--wide mn-shelf__in">
    <div>
      <p class="kicker">On the shelf</p>
      <h2 class="display" id="mn-shelf-h">What the menu carries</h2>
      <p class="lede">${esc(st.sells)}</p>
      <p>${esc(s.brandsCarried.intro)}</p>
      <ul class="chip-row">${s.brandsCarried.items.map((b) => `<li class="chip">${esc(b)}</li>`).join('')}</ul>
    </div>
    <div class="glass glass--night glass--tarot mn-shelf__card">
      <h3 class="mn-cat__h">Before you go</h3>
      <p>${esc(st.limits)}</p>
      <p>${esc(st.atm)}</p>
      <p class="btn-row"><a class="btn btn--gold"${live(st.menuUrl)}>Open the live menu</a></p>
    </div>
  </div>
</section>`;

  const title = `${st.name} Menu | Order Ahead for Pickup`;
  const description = `${st.name} menu: order ahead for pickup at ${a.street}, ${a.city}, ${a.region}. Flower, pre-rolls, edibles, vapes and hemp THC beverages.`;
  return [{
    path: MENU_PATH,
    html: page({
      ctx, path: MENU_PATH, title, description,
      canonical: 'https://mydealermn.com' + MENU_PATH,
      og: { 'og:title': title, 'og:description': description, 'og:type': 'website', 'og:url': 'https://mydealermn.com' + MENU_PATH },
      bodyClass: 'pg-menu',
      crumbs: [['/', 'Home'], ['/dispensaries/', 'Dispensaries'], ['/dispensaries/minnesota/', 'Minnesota'], [st.path, st.name], [MENU_PATH, 'Menu']],
      main,
    }),
  }];
}
