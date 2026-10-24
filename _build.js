const fs = require('fs');
const OUT = __dirname + '/site/';

const IG = '<svg class="soc-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.3" fill="currentColor"/></svg>';
const FB = '<svg class="soc-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.6 21v-7.6h2.6l.45-3.1H13.6V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.1c-.3 0-1.2-.1-2.3-.1-2.4 0-4 1.4-4 4.1v2.2H7.9v3.1h2.6V21z"/></svg>';
// Inhalte kommen aus content/*.json (werden über das CMS unter /admin gepflegt)
const J = n => JSON.parse(fs.readFileSync(__dirname + '/content/' + n + '.json', 'utf8'));
const K = J('kontakt'), ST = J('start'), PR = J('projekte'), BE = J('betrieb'), KA = J('karriere');
const esc = x => String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const paras = x => String(x || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('\n');
const slug = x => String(x).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const telHref = 'tel:+49' + K.telefon.replace(/\D/g, '').replace(/^0/, '');
const IG_URL = K.instagram, FB_URL = K.facebook;

const NAV = [['index.html','Start'],['leistungen.html','Leistungen'],['projekte.html','Projekte'],['betrieb.html','Der Betrieb'],['karriere.html','Karriere'],['kontakt.html','Kontakt']];

const shell = (file, title, desc, body) => `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="preload" href="fonts/figtree.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<header>
  <div class="wrap top">
    <a class="logo" href="index.html"><img src="img/logo.png" width="800" height="260" alt="Spahiu GmbH – Stuckateur & Maler, zur Startseite"></a>
    <div class="top-soc"><a href="${IG_URL}" target="_blank" rel="noopener" aria-label="Instagram">${IG}</a><a href="${FB_URL}" target="_blank" rel="noopener" aria-label="Facebook">${FB}</a></div>
    <div class="call"><small>Anrufen, Büro Allmersbach</small><a href="${telHref}">${esc(K.telefon)}</a></div>
  </div>
</header>
<nav class="bar" aria-label="Hauptnavigation"><div class="wrap">
    ${NAV.map(([f,l]) => `<a href="${f}"${f===file?' aria-current="page"':''}>${l}</a>`).join('\n    ')}
</div></nav>
<main id="inhalt">
${body}
</main>
<footer><div class="wrap"><span>© Spahiu Stuckateur &amp; Maler GmbH · ${esc(K.strasse)} · ${esc(K.plz_ort)}</span>
<nav aria-label="Rechtliches und Social Media"><a class="soc-f" href="${IG_URL}" target="_blank" rel="noopener">${IG}Instagram</a><a class="soc-f" href="${FB_URL}" target="_blank" rel="noopener">${FB}Facebook</a><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a><a href="https://www.webdesign-ehmann.de" target="_blank" rel="noopener">Erstellt von Webdesign Ehmann</a></nav></div></footer>
<script>var c=document.querySelector('.bar [aria-current]');if(c&&c.scrollIntoView)c.parentNode.scrollLeft=Math.max(0,c.offsetLeft-24);</script>
<script src="js/main.js" defer></script>
</body>
</html>
`;


const DECK = ST.karten.map(k => ({ t: k.titel, v: k.vorher ? [k.vorher.replace(/^img\/|\.webp$/g, ''), 1000, 1333, k.vorher_alt || k.titel] : null, n: [k.nachher.replace(/^img\/|\.webp$/g, ''), 1200, 900, k.nachher_alt || k.titel] }));
const deckCards = DECK.map((d, i) => {
  const img = (x, extra) => '<img src="img/' + x[0] + '.webp" width="' + x[1] + '" height="' + x[2] + '" alt="' + x[3] + '" decoding="async"' + (extra || '') + '>';
  const tap = '<span class="hint" aria-hidden="true"><i class="tapico"></i>Antippen: fertig ansehen</span>';
  const swp = '<span class="hint" aria-hidden="true"><i class="swipeico">←</i>Nach links ziehen: nächstes Projekt</span>';
  const front = d.v
    ? '<div class="face front">' + img(d.v, i === 0 ? ' fetchpriority="high"' : '') + '<span class="badge">Vorher</span>' + tap + '</div><div class="face back">' + img(d.n) + '<span class="badge n">Fertig</span>' + swp + '</div>'
    : '<div class="face front">' + img(d.n) + '<span class="badge n">Fertig</span>' + swp + '</div>';
  return '      <div class="card' + (d.v ? '' : ' single') + (i === 0 ? ' is-active' : '') + '" data-title="' + d.t + '" tabindex="' + (i === 0 ? 0 : -1) + '" role="button" aria-label="' + (d.v ? 'Karte umdrehen: ' + d.t + ', vorher' : d.t + ', fertig') + '">\n        <div class="card-in">' + front + '</div>\n      </div>';
}).join('\n');

const sauberSec = `<section class="sect sauber">
  <div class="wrap">
    <img src="img/abdeckung.webp" width="614" height="461" alt="Mit Folie ausgelegter Weg vor einem Haus, dahinter ein Spahiu-Transporter" loading="lazy">
    <div>
      <p class="eyebrow">Sauberkeit zuerst</p>
      <h2><em>Sauber</em> arbeiten heißt: erst abdecken, dann anfangen.</h2>
      <p class="prose" style="margin-top:16px">Wege, Böden und Pflanzen am Haus werden geschützt, bevor das erste Gerüstteil steht. Das kostet am Anfang Zeit und spart Ihnen hinterher das Putzen.</p>
      <ul class="clean"><li>Folie auf Wegen und Böden</li><li>Pflanzen am Haus werden geschützt</li><li>Das Ergebnis sieht man: Schulmauer, Fassade, Flur</li></ul>
    </div>
  </div>
</section>`;

const kontaktBand = `<section class="contact">
  <div class="wrap grid">
    <div>
      <p class="eyebrow">Kontakt</p>
      <h2>Rufen Sie an oder schreiben Sie uns, wir melden uns.</h2>
      <a class="tel" href="${telHref}">${esc(K.telefon)}</a>
      <p style="margin-top:18px;color:#cfd8da;max-width:30em">${esc(K.termin_hinweis)}</p>
      <div class="btns"><a class="btn w" href="kontakt.html">Anfrage schreiben</a></div>
    </div>
    <div>
      <dl>
        <dt>Adresse</dt><dd>Spahiu Stuckateur &amp; Maler GmbH<br>${esc(K.strasse)}<br>${esc(K.plz_ort)}</dd>
        <dt>E-Mail</dt><dd><a href="mailto:${esc(K.email)}">${esc(K.email)}</a></dd>
        <dt>Fax</dt><dd>${esc(K.fax)}</dd>
        <dt>Social</dt><dd class="soc-row"><a class="soc ig" href="${IG_URL}" target="_blank" rel="noopener">${IG}Instagram</a><a class="soc fb" href="${FB_URL}" target="_blank" rel="noopener">${FB}Facebook</a></dd>
      </dl>
    </div>
  </div>
</section>`;

const pairs = `<div class="pairs">
${PR.projekte.filter(p => p.auf_startseite).slice(0, 2).map(p => {
  const v = p.galerie.find(g => g.art === 'Vorher'), n = p.galerie.find(g => g.art === 'Nachher');
  if (!v || !n) return '';
  return `<div class="pair">
    <figure><img src="${esc(v.bild)}" width="1000" height="1333" alt="${esc(v.alt || p.titel + ', vorher')}" loading="lazy"><figcaption>Vorher</figcaption></figure>
    <figure class="n"><img src="${esc(n.bild)}" width="1000" height="1333" alt="${esc(n.alt || p.titel + ', nachher')}" loading="lazy"><figcaption>Nachher</figcaption></figure>
    <p class="cap"><b>${esc(p.titel)}.</b> ${esc(p.kurztext || '')}</p>
  </div>`;
}).join('\n')}
</div>`;

const pages = {};

/* ---------------- Start ---------------- */
pages['index.html'] = shell('index.html',
  'Stuckateur & Maler in Allmersbach im Tal | Spahiu GmbH',
  'Putz, Wärmedämmung, Malerarbeiten, Altbausanierung und Trockenbau. Familienbetrieb aus Allmersbach im Tal seit 2013. Jetzt Angebot anfragen.',
`<section class="wrap hero">
  <div>
    <p class="eyebrow">${esc(ST.eyebrow)}</p>
    <h1>${esc(ST.titel_vorn)}<em>${esc(ST.titel_betont)}</em>${esc(ST.titel_hinten)}</h1>
    <p class="lead">${esc(ST.text)}</p>
    <div class="btns"><a class="btn" href="kontakt.html">Angebot anfragen</a><a class="btn o" href="projekte.html">Fertige Projekte ansehen</a></div>
  </div>
  <div class="deck-wrap">
    <div class="deck" id="deck" role="group" aria-roledescription="Karten" aria-label="Projekte vorher und nachher">
${deckCards}
    </div>
    <div class="deck-ui">
      <div class="deck-nav"><button type="button" id="deck-prev" aria-label="Vorheriges Projekt">←</button><svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" class="ring-bg"/><circle cx="18" cy="18" r="15" class="ring-fg" id="deck-ring"/></svg><span id="deck-cap" aria-live="polite">${esc(DECK[0].t)} · 1/${DECK.length}</span><button type="button" id="deck-next" aria-label="Nächstes Projekt">→</button></div>
    </div>
  </div>
</section>

${sauberSec}

<section class="sect alt">
  <div class="wrap">
    <p class="eyebrow">Leistungen</p>
    <h2>${esc(ST.leistungen_titel)}</h2>
    <div class="services">
      ${ST.leistungen.map((l, i) => `<a class="service" href="leistungen.html#${esc(l.anker)}"><b>${String(i + 1).padStart(2, '0')}</b><h3>${esc(l.titel)}</h3><p>${esc(l.text)}</p></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="sect">
  <div class="wrap">
    <p class="eyebrow">Projekte</p>
    <h2>Vorher und nachher, von uns gemacht.</h2>
    ${pairs}
    <div class="btns"><a class="btn o" href="projekte.html">Alle Projekte</a></div>
  </div>
</section>

<section class="sect alt">
  <div class="wrap about">
    <img src="img/ajdar.webp" width="844" height="477" alt="Ajdar Spahiu in weißer Arbeitskleidung vor einem Firmenfahrzeug" loading="lazy">
    <div>
      <p class="eyebrow">Der Betrieb</p>
      <h2>Ajdar Spahiu hat 2013 angefangen. Heute stehen mehrere Transporter mit dem Logo auf der Straße.</h2>
      <p class="prose" style="margin-top:22px">Wer bei uns anfragt, bekommt keinen Callcenter-Rückruf. Sie sind beim Gespräch zum Angebot dabei, erfahren während der Arbeit, wo wir stehen, und gehen bei der Abnahme mit uns durchs Haus. Sind Sie zufrieden, sind wir es auch. <a href="betrieb.html" style="color:var(--blue-d);font-weight:700">Mehr über den Betrieb</a></p>
      <div class="steps">
        <div><b>Angebot</b><span>Gespräch vor Ort</span></div>
        <div><b>Ausführung</b><span>Sie sind auf dem Laufenden</span></div>
        <div><b>Abnahme</b><span>Gemeinsam am Objekt</span></div>
        <div><b>Rechnung</b><span>Wie besprochen</span></div>
      </div>
    </div>
  </div>
</section>

${kontaktBand}
<script src="js/deck.js" defer></script>`);

/* ---------------- Leistungen ---------------- */
pages['leistungen.html'] = shell('leistungen.html',
  'Leistungen: Putz, Dämmung, Maler, Trockenbau | Spahiu',
  'Innen- und Außenputz, Wärmedämmung, Malerarbeiten, Altbausanierung und Trockenbau aus Allmersbach im Tal. Für Privat und Gewerbe.',
`<section class="pagehead"><div class="wrap">
  <p class="eyebrow">Leistungen</p>
  <h1>Fünf Gewerke, ein Betrieb in Allmersbach.</h1>
  <p class="lead">Putz, Dämmung, Farbe, Sanierung und Trockenbau bekommen Sie bei uns aus einer Hand. Das spart Abstimmung zwischen Firmen und hält die Baustelle kürzer.</p>
</div></section>

<div class="wrap">
  <section class="lz" id="putz">
    <div class="lz-txt">
      <span class="num">01</span>
      <h2>Innen- &amp; Außenputz</h2>
      <p class="prose" style="margin-top:16px">Ob neuer Putz auf dem Rohbau oder ausgebesserte Stellen im Altbau: Wir bringen Wände und Fassaden in eine saubere, tragfähige Oberfläche, auf der Farbe hält.</p>
      <ul><li>Verputzarbeiten innen und außen</li><li>Fassaden mit Struktur und abgesetztem Sockel</li><li>Ausbesserung an Altbauwänden</li></ul>
      <p class="note">Beispiel: <a href="projekte.html#wohnhaus">Wohnhaus, Fassade rundum</a></p>
    </div>
    <img src="img/haus-sued-nachher.webp" width="1600" height="1200" alt="Verputzte Hausfassade mit grauem Sockel und grau abgesetztem Balkon" loading="lazy">
  </section>

  <section class="lz flip" id="daemmung">
    <div class="lz-txt">
      <span class="num">02</span>
      <h2>Wärmedämmung</h2>
      <p class="prose" style="margin-top:16px">Eine gedämmte Fassade hält die Wärme im Haus. Wir kümmern uns um die Dämmung der Außenwand und um den Putz darüber, damit am Ende eine geschlossene Fassade steht.</p>
      <ul><li>Fassadendämmung</li><li>Putz und Anstrich auf der Dämmung</li><li>Abstimmung mit Gerüst und Fensterbau</li></ul>
      <p class="note">Wie viel eine Dämmung bei Ihrem Haus bringt, klären wir beim Termin vor Ort. <a href="kontakt.html">Termin anfragen</a></p>
    </div>
    <img src="img/haus-west-nachher.webp" width="1400" height="1050" alt="Fertige Hausfassade, Westseite, mit weißen Fenstern und Kupferregenrinne" loading="lazy">
  </section>

  <section class="lz" id="maler">
    <div class="lz-txt">
      <span class="num">03</span>
      <h2>Malerarbeiten</h2>
      <p class="prose" style="margin-top:16px">Vom weißen Flur bis zur einzelnen farbigen Wand im Wohnzimmer: Wir streichen innen und außen, für Wohnungen, Häuser und Gewerbe.</p>
      <ul><li>Wände und Decken</li><li>Fassadenanstrich</li><li>Flure und Treppenhäuser</li></ul>
      <p class="note">Auch Außenarbeit gehört dazu: <a href="projekte.html#schulmauer">Mauer am Schulgelände</a>.</p>
    </div>
    <img src="img/wand-gruen.webp" width="1600" height="758" alt="Wohnzimmerecke mit grün gestrichener Wand und weißen Möbeln" loading="lazy">
  </section>

  <section class="lz flip" id="altbau">
    <div class="lz-txt">
      <span class="num">04</span>
      <h2>Altbausanierung</h2>
      <p class="prose" style="margin-top:16px">Im Altbau schauen wir zuerst, was noch gut ist. Dann saniert, ersetzt und ergänzt werden nur die Stellen, bei denen es nötig ist: Mauern, Putz, Bäder, ganze Wohnungen.</p>
      <ul><li>Mauer- und Betonsanierung</li><li>Komplettsanierung von Bädern</li><li>Restaurierung und Neugestaltung von Wohnräumen und Fassaden</li></ul>
      <p class="note">Beispiele: <a href="projekte.html#schulmauer">Mauer am Schulgelände</a> und <a href="projekte.html#bad">Komplettbad im Dachgeschoss</a></p>
    </div>
    <img src="img/mauer-vorher-2.webp" width="1000" height="750" alt="Stark beschädigte Betonmauer mit Metallzaun vor der Sanierung" loading="lazy">
  </section>

  <section class="lz" id="trockenbau">
    <div class="lz-txt">
      <span class="num">05</span>
      <h2>Trockenbau</h2>
      <p class="prose" style="margin-top:16px">Neue Wände, abgehängte Decken und Durchbrüche in Gipsplatte: schnell gebaut, sauber verspachtelt und direkt bereit für den Anstrich.</p>
      <ul><li>Trennwände und Vorsatzschalen</li><li>Abgehängte Decken</li><li>Spachteln und Übergabe für den Maler</li></ul>
      <p class="note">Weil Trockenbau und Maler bei uns zusammenarbeiten, wartet niemand auf den anderen. <a href="kontakt.html">Anfragen</a></p>
    </div>
    <img src="img/trockenbau.webp" width="700" height="933" alt="Mitarbeiter verspachtelt eine Trockenbauwand in einem Altbauraum" loading="lazy" style="max-height:560px;object-position:50% 30%">
  </section>
</div>

${sauberSec.replace('sect sauber','sect sauber light')}

${kontaktBand}`);

/* ---------------- Projekte ---------------- */
pages['projekte.html'] = shell('projekte.html',
  'Projekte: Fassaden, Mauern, Bäder | Spahiu Stuckateur',
  'Referenzen aus Allmersbach und Umgebung: Fassadensanierung, Mauer am Schulgelände, Komplettbad im Dachgeschoss. Mit Vorher-Nachher-Fotos.',
`<section class="pagehead"><div class="wrap">
  <p class="eyebrow">Projekte</p>
  <h1>${esc(PR.einleitung_titel)}</h1>
  <p class="lead">${esc(PR.einleitung_text)}</p>
</div></section>

<div class="wrap">
${PR.projekte.map(p => {
  const n = p.galerie.length;
  const cls = n === 1 ? 's12 a32' : n === 2 ? 's6 a43' : n === 4 ? 's6 a43' : 's4 a43';
  const dim = n === 1 ? 'width="1400" height="933"' : 'width="1200" height="900"';
  const figs = p.galerie.map(g => {
    const tag = g.art === 'Vorher' ? '<span class="tagc">Vorher' + (g.beschriftung ? ' · ' + esc(g.beschriftung) : '') + '</span>'
      : g.art === 'Nachher' ? '<span class="tagc n">Nachher' + (g.beschriftung ? ' · ' + esc(g.beschriftung) : '') + '</span>'
      : g.beschriftung ? '<figcaption class="cp">' + esc(g.beschriftung) + '</figcaption>' : '';
    return '<figure class="' + cls + '"><img src="' + esc(g.bild) + '" ' + dim + ' alt="' + esc(g.alt || p.titel) + '" loading="lazy">' + tag + '</figure>';
  }).join('\n      ');
  return `  <section class="proj" id="${esc(p.anker || slug(p.titel))}">
    <header>
      <div><p class="eyebrow">${esc(p.kategorie)}</p><h2>${esc(p.titel)}</h2></div>
      <p>${esc(p.text)}</p>
    </header>
    <div class="gal">
      ${figs}
    </div>
  </section>`;
}).join('\n\n')}
</div>

${sauberSec.replace('sect sauber','sect sauber light')}

${kontaktBand}`);

/* ---------------- Betrieb ---------------- */
pages['betrieb.html'] = shell('betrieb.html',
  'Der Betrieb: Familie Spahiu, Allmersbach im Tal',
  'Ajdar Spahiu gründete 2013 den Stuckateur- und Malerbetrieb in Allmersbach im Tal. Familienbetrieb für Privat- und Gewerbekunden.',
`<section class="pagehead"><div class="wrap">
  <p class="eyebrow">Der Betrieb</p>
  <h1>${esc(BE.titel)}</h1>
  <p class="lead">${esc(BE.einleitung)}</p>
</div></section>

<section class="sect">
  <div class="wrap split">
    <img src="${esc(BE.gruppenbild)}" width="823" height="825" alt="${esc(BE.gruppenbild_alt)}" loading="lazy">
    <div>
      <p class="eyebrow">${esc(BE.gruppen_eyebrow)}</p>
      <h2>${esc(BE.gruppen_titel)}</h2>
      <p class="prose" style="margin-top:16px">${esc(BE.gruppen_text)}</p>
      <div class="btns"><a class="btn" href="kontakt.html">Termin im Büro vereinbaren</a></div>
    </div>
  </div>
</section>

${BE.infos.map((b, i) => `<section class="sect${i % 2 ? '' : ' alt'}">
  <div class="wrap about${i % 2 ? ' rev' : ''}">
    ${b.bild ? '<img src="' + esc(b.bild) + '" width="844" height="560" alt="' + esc(b.bild_alt || b.titel) + '" loading="lazy">' : ''}
    <div>
      <h2>${esc(b.titel)}</h2>
      <div class="prose" style="margin-top:20px">
        ${paras(b.text)}
      </div>
      ${i === 0 ? `<div class="steps">
        <div><b>Angebot</b><span>Gespräch vor Ort, Aufmaß, Preis</span></div>
        <div><b>Ausführung</b><span>Sie wissen, wo wir stehen</span></div>
        <div><b>Abnahme</b><span>Gemeinsam am Objekt</span></div>
        <div><b>Rechnung</b><span>Wie im Angebot besprochen</span></div>
      </div>` : ''}
    </div>
  </div>
</section>`).join('\n\n')}

<section class="band"><img src="img/flotte.webp" width="1920" height="697" alt="Mehrere weiße Firmentransporter mit Spahiu-Logo nebeneinander geparkt" loading="lazy"></section>

<section class="sect alt">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Einsatzgebiet</p>
      <h2>Aus Allmersbach im Tal, mit den Transportern zu Ihnen.</h2>
      <p class="prose" style="margin-top:18px">Unser Büro sitzt am Schönblick 7. Von dort fahren wir zu Baustellen in der Umgebung. Wenn Ihr Objekt weiter weg liegt, fragen Sie einfach an.</p>
      <div class="btns"><a class="btn" href="kontakt.html">Anfrage schreiben</a><a class="btn o" href="leistungen.html">Leistungen ansehen</a></div>
    </div>
    <img src="img/mauer-arbeit.webp" width="1400" height="788" alt="Zwei Mitarbeiter streichen Mauerpfeiler" loading="lazy">
  </div>
</section>`);

/* ---------------- Karriere ---------------- */
pages['karriere.html'] = shell('karriere.html',
  'Karriere & Bewerbung | Spahiu Stuckateur Allmersbach',
  'Arbeiten bei Spahiu Stuckateur & Maler in Allmersbach im Tal: offene Stellen ansehen oder direkt bewerben. Telefon ' + K.telefon + '.',
`<section class="pagehead"><div class="wrap">
  <p class="eyebrow">Karriere</p>
  <h1>${esc(KA.titel)}</h1>
  <p class="lead">${esc(KA.einleitung)}</p>
</div></section>

<section class="sect">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Offene Stellen</p>
      <h2>${esc(KA.stellen_titel)}</h2>
      <div class="jobs">
        ${KA.stellen.length ? KA.stellen.map(j => '<div class="job"><b>' + esc(j.titel) + '</b>' + ((j.art || j.ort) ? '<span>' + esc([j.art, j.ort].filter(Boolean).join(' · ')) + '</span>' : '') + (j.text ? '<span>' + esc(j.text) + '</span>' : '') + '<a href="#bewerben">Darauf bewerben</a></div>').join('\n        ') : '<div class="job ph"><b>Stellenangebote folgen</b><span>' + esc(KA.keine_stellen_text) + '</span></div>'}
        <div class="job"><b>Initiativbewerbung</b><span>Keine passende Stelle dabei? Bewerben Sie sich trotzdem, wir sprechen über das, was Sie können.</span><a href="#bewerben">Zum Formular</a></div>
      </div>
    </div>
    <img src="${esc(KA.bild)}" width="823" height="825" alt="${esc(KA.bild_alt)}" loading="lazy">
  </div>
</section>

<section class="sect alt" id="bewerben">
  <div class="wrap kontakt-grid">
    <form class="form" id="contact-form" novalidate>
      <h2 style="margin-bottom:6px">Bewerbung senden</h2>
      <div class="row">
        <div><label for="name">Name *</label><input id="name" name="name" autocomplete="name" required><div class="err" id="name-err"></div></div>
        <div><label for="phone">Telefon</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
      </div>
      <div><label for="email">E-Mail *</label><input id="email" name="email" type="email" autocomplete="email" required><div class="err" id="email-err"></div></div>
      <div><label for="art">Wofür bewerben Sie sich?</label>
        <select id="art" name="art"><option>Stuckateur</option><option>Maler</option><option>Trockenbau</option><option>Ausbildung</option><option>Etwas anderes</option></select></div>
      <div><label for="message">Kurz zu Ihnen *</label><textarea id="message" name="message" required></textarea><div class="err" id="message-err"></div></div>
      <div><button class="btn" type="submit">Bewerbung senden</button></div>
      <p class="ok" id="form-status" role="status" hidden></p>
    </form>
    <aside class="side">
      <dl>
        <div><dt>Lieber anrufen?</dt><dd><a href="${telHref}" style="font-weight:800;font-size:1.5rem;text-decoration:none;color:var(--blue-d)">${esc(K.telefon)}</a></dd></div>
        <div><dt>Per E-Mail</dt><dd><a href="mailto:${esc(K.email)}">${esc(K.email)}</a></dd></div>
        <div><dt>Adresse</dt><dd>Spahiu Stuckateur &amp; Maler GmbH<br>${esc(K.strasse)}<br>${esc(K.plz_ort)}</dd></div>
      </dl>
    </aside>
  </div>
</section>`);

/* ---------------- Kontakt ---------------- */
pages['kontakt.html'] = shell('kontakt.html',
  'Kontakt & Angebot anfragen | Spahiu Stuckateur Allmersbach',
  'Spahiu Stuckateur & Maler, Schönblick 7, 71573 Allmersbach im Tal. Tel. ' + K.telefon + '. Angebot anfragen oder Termin im Büro vereinbaren.',
`<section class="pagehead"><div class="wrap">
  <p class="eyebrow">Kontakt</p>
  <h1>Sagen Sie uns, was an der Wand ansteht.</h1>
  <p class="lead">Am schnellsten geht es per Telefon. Schreiben Sie uns, wenn Ihnen das lieber ist, wir melden uns.</p>
</div></section>

<section class="sect">
  <div class="wrap kontakt-grid">
    <form class="form" id="contact-form" novalidate>
      <div class="row">
        <div><label for="name">Name *</label><input id="name" name="name" autocomplete="name" required><div class="err" id="name-err"></div></div>
        <div><label for="phone">Telefon</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
      </div>
      <div><label for="email">E-Mail *</label><input id="email" name="email" type="email" autocomplete="email" required><div class="err" id="email-err"></div></div>
      <div><label for="art">Worum geht es?</label>
        <select id="art" name="art"><option>Putz / Fassade</option><option>Wärmedämmung</option><option>Malerarbeiten</option><option>Altbausanierung</option><option>Trockenbau</option><option>Etwas anderes</option></select></div>
      <div><label for="message">Ihre Nachricht *</label><textarea id="message" name="message" required></textarea><div class="err" id="message-err"></div></div>
      <div><button class="btn" type="submit">Anfrage senden</button></div>
      <p class="ok" id="form-status" role="status" hidden></p>
    </form>
    <aside class="side">
      <dl>
        <div><dt>Telefon</dt><dd><a href="${telHref}" style="font-weight:800;font-size:1.5rem;text-decoration:none;color:var(--blue-d)">${esc(K.telefon)}</a></dd></div>
        <div><dt>Adresse</dt><dd>Spahiu Stuckateur &amp; Maler GmbH<br>${esc(K.strasse)}<br>${esc(K.plz_ort)}<br><a href="https://www.google.com/maps/search/?api=1&amp;query=Sch%C3%B6nblick+7+71573+Allmersbach+im+Tal" target="_blank" rel="noopener" style="color:var(--blue-d);font-weight:600">Route in Google Maps</a></dd></div>
        <div><dt>E-Mail</dt><dd><a href="mailto:${esc(K.email)}">${esc(K.email)}</a></dd></div>
        <div><dt>Fax</dt><dd>${esc(K.fax)}</dd></div>
        <div><dt>Social Media</dt><dd class="soc-row"><a class="soc ig" href="${IG_URL}" target="_blank" rel="noopener">${IG}Instagram</a><a class="soc fb" href="${FB_URL}" target="_blank" rel="noopener">${FB}Facebook</a></dd></div>
        <div><dt>Termin im Büro</dt><dd>Nach Absprache, auch samstags.</dd></div>
      </dl>
    </aside>
  </div>
</section>`);

/* ---------------- Impressum ---------------- */
pages['impressum.html'] = shell('impressum.html',
  'Impressum | Spahiu Stuckateur & Maler GmbH',
  'Impressum der Spahiu Stuckateur & Maler GmbH, Schönblick 7, 71573 Allmersbach im Tal.',
`<div class="wrap legal">
  <h1 style="font-size:2.2rem">Impressum</h1>
  <h2>Angaben gemäß § 5 DDG</h2>
  <p>Spahiu Stuckateur &amp; Maler GmbH<br>${esc(K.strasse)}<br>${esc(K.plz_ort)}</p>
  <h2>Kontakt</h2>
  <p>Telefon: ${esc(K.telefon)}<br>Fax: ${esc(K.fax)}<br>E-Mail: ${esc(K.email)}</p>
  <h2>Vertretungsberechtigt</h2>
  <p>Geschäftsführer: <span class="todo">[Name laut Handelsregister, bei Kunde erfragen]</span></p>
  <h2>Registereintrag</h2>
  <p>Registergericht: <span class="todo">[erfragen]</span><br>Registernummer: <span class="todo">[HRB erfragen]</span></p>
  <h2>Umsatzsteuer-ID</h2>
  <p>USt-IdNr. gemäß § 27a UStG: <span class="todo">[erfragen]</span></p>
  <h2>Handwerksrolle / Kammer</h2>
  <p><span class="todo">[Zuständige Handwerkskammer und Eintragungsnummer erfragen]</span></p>
  <h2>Verantwortlich für den Inhalt</h2>
  <p><span class="todo">[Name und Anschrift erfragen]</span></p>
  <p style="margin-top:30px"><small>Platzhalter in Gelb müssen vor der Veröffentlichung mit den echten Daten des Betriebs ersetzt werden.</small></p>
</div>`);

/* ---------------- Datenschutz ---------------- */
pages['datenschutz.html'] = shell('datenschutz.html',
  'Datenschutz | Spahiu Stuckateur & Maler GmbH',
  'Datenschutzerklärung der Website der Spahiu Stuckateur & Maler GmbH aus Allmersbach im Tal.',
`<div class="wrap legal">
  <h1 style="font-size:2.2rem">Datenschutzerklärung</h1>
  <h2>1. Verantwortlicher</h2>
  <p>Spahiu Stuckateur &amp; Maler GmbH, Schönblick 7, 71573 Allmersbach im Tal, Tel. ${esc(K.telefon)}, E-Mail ${esc(K.email)}</p>
  <h2>2. Hosting und Server-Logfiles</h2>
  <p>Beim Aufruf dieser Website verarbeitet der Hosting-Anbieter technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp). Das ist für die sichere und stabile Auslieferung der Seite erforderlich (Art. 6 Abs. 1 lit. f DSGVO). <span class="todo">[Hosting-Anbieter nach Livegang eintragen]</span></p>
  <h2>3. Schriftarten</h2>
  <p>Alle Schriftarten werden von unserem eigenen Server ausgeliefert. Es findet keine Verbindung zu Google oder anderen Schriftarten-Diensten statt.</p>
  <h2>4. Kontaktaufnahme</h2>
  <p>Wenn Sie uns per Telefon, E-Mail oder über das Kontaktformular anschreiben, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b oder f DSGVO). Wir löschen sie, wenn die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
  <h2>5. Cookies und Tracking</h2>
  <p>Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Dienste.</p>
  <h2>6. Externe Links</h2>
  <p>Die Links zu Google Maps, Instagram und Facebook öffnen den jeweiligen Dienst in einem neuen Tab. Erst dann werden Daten an den Anbieter übertragen. Es gilt dessen Datenschutzerklärung. Auf dieser Website sind keine Social-Media-Inhalte eingebettet.</p>
  <h2>7. Ihre Rechte</h2>
  <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren, in Baden-Württemberg beim Landesbeauftragten für den Datenschutz und die Informationsfreiheit.</p>
  <p style="margin-top:30px"><small>Entwurf. Vor der Veröffentlichung vom Betrieb prüfen lassen.</small></p>
</div>`);

for (const [f, html] of Object.entries(pages)) fs.writeFileSync(OUT + f, html);
console.log('pages:', Object.keys(pages).join(', '));
