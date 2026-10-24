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
