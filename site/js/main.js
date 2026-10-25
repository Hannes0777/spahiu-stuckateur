// Kontaktformular: eigene Validierung. Versand wird nach Beauftragung an einen Cloudflare Worker angebunden.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');

  function setErr(field, msg) {
    var err = document.getElementById(field.id + '-err');
    if (err) err.textContent = msg;
    if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, first = null;
    var name = form.elements['name'], mail = form.elements['email'], msg = form.elements['message'];
    setErr(name, ''); setErr(mail, ''); setErr(msg, '');
    if (!name.value.trim()) { setErr(name, 'Bitte geben Sie Ihren Namen an.'); ok = false; first = first || name; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim())) { setErr(mail, 'Bitte geben Sie eine gültige E-Mail-Adresse an.'); ok = false; first = first || mail; }
    if (msg.value.trim().length < 10) { setErr(msg, 'Bitte beschreiben Sie kurz, worum es geht.'); ok = false; first = first || msg; }
    if (!ok) { first.focus(); return; }
    status.hidden = false;
    status.textContent = 'Demo: Hier würde die Nachricht jetzt an Spahiu Stuckateur & Maler gehen.';
    form.reset();
  });
})();

// Sanftes Einblenden beim Scrollen. Ohne IntersectionObserver oder bei reduzierter Bewegung bleibt alles einfach sichtbar.
(function () {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.lz, .pair, .gal figure, .service, .about > *, .split > *, .steps div, .proj header, .job, .side, .sect.sauber .wrap > *, .contact .grid > *');
  if (!els.length) return;
  document.documentElement.setAttribute('data-rv', '');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  Array.prototype.forEach.call(els, function (el, i) {
    var sibs = el.parentNode.children, n = Array.prototype.indexOf.call(sibs, el);
    el.classList.add('rv');
    el.style.setProperty('--d', (Math.min(n, 3) * 0.09) + 's');
    io.observe(el);
  });
})();
