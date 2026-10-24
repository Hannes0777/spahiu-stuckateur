// Karten-Stapel im Hero: antippen = umdrehen, nach links ziehen = nächste Karte.
// Die Hinweise erscheinen verzögert auf der Karte: erst "Antippen", nach dem Umdrehen "Nach links ziehen".
(function () {
  var deck = document.getElementById('deck');
  if (!deck) return;
  var cards = Array.prototype.slice.call(deck.querySelectorAll('.card'));
  var cap = document.getElementById('deck-cap');
  var ring = document.getElementById('deck-ring');
  var cur = 0, busy = false;
  var flippedOnce = false, swipedOnce = false, tapTimer, swipeTimer;

  function layout() {
    cards.forEach(function (c, i) {
      var rel = (i - cur + cards.length) % cards.length;
      c.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-3');
      if (rel === 0) c.classList.add('pos-0');
      else if (rel === 1) c.classList.add('pos-1');
      else if (rel === 2) c.classList.add('pos-2');
      else if (rel === 3) c.classList.add('pos-3');
      c.tabIndex = rel === 0 ? 0 : -1;
    });
  }
  function label() {
    var c = cards[cur], f = c.classList.contains('flipped');
    c.setAttribute('aria-label', (c.classList.contains('single') ? c.dataset.title + ', fertig' : 'Karte umdrehen: ' + c.dataset.title + ', ' + (f ? 'fertig' : 'vorher')));
    ring.style.strokeDashoffset = 94.25 * (1 - (cur + 1) / cards.length);
    cap.textContent = c.dataset.title + ' · ' + (cur + 1) + '/' + cards.length;
  }
  function hideHints() {
    deck.classList.remove('show-tap', 'show-swipe');
    clearTimeout(tapTimer);
    clearTimeout(swipeTimer);
  }
  function scheduleTap() {
    if (flippedOnce) return;
    tapTimer = setTimeout(function () { deck.classList.add('show-tap'); }, 2500);
  }
  function scheduleSwipe() {
    if (swipedOnce) return;
    swipeTimer = setTimeout(function () {
      if (cards[cur].classList.contains('flipped') || cards[cur].classList.contains('single')) deck.classList.add('show-swipe');
    }, 1200);
  }

  function flip() {
    var cc = cards[cur];
    if (cc.classList.contains('single')) { go(1); return; }
    hideHints();
    cards[cur].classList.toggle('flipped');
    flippedOnce = true;
    label();
    if (cards[cur].classList.contains('flipped')) scheduleSwipe();
  }
  function go(dir) {
    if (busy) return;
    busy = true;
    hideHints();
    swipedOnce = true;
    var old = cards[cur];
    old.classList.remove('pos-0', 'snap');
    old.classList.add(dir > 0 ? 'out-left' : 'out-right');
    old.style.transform = '';
    cur = (cur + (dir > 0 ? 1 : -1) + cards.length) % cards.length;
    var n = cards[cur];
    n.classList.remove('out-left', 'out-right', 'flipped', 'dragging', 'snap');
    n.style.transform = '';
    layout();
    label();
    // erst ganz hinaus fliegen lassen, dann hinter den Stapel zurück (ganz nach hinten, nicht auf Platz 2)
    setTimeout(function () {
      old.classList.remove('out-left', 'out-right', 'flipped');
      old.style.transform = '';
      layout();
    }, 330);
    setTimeout(function () { busy = false; }, 800);
  }

  var sx = 0, dx = 0, drag = false, moved = false, t0 = 0, raf = 0, dragCard = null;
  function paint() {
    raf = 0;
    if (dragCard) dragCard.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 25) + 'deg)';
  }
  deck.addEventListener('pointerdown', function (e) {
    if (e.button > 0 || busy || !e.target.closest('.card.pos-0')) return;
    drag = true; moved = false; sx = e.clientX; dx = 0; t0 = e.timeStamp; dragCard = cards[cur];
    deck.setPointerCapture(e.pointerId);
    hideHints();
    cards[cur].classList.remove('snap');
    cards[cur].classList.add('dragging');
  });
  deck.addEventListener('pointermove', function (e) {
    if (!drag) return;
    dx = e.clientX - sx;
    if (dx > 0) dx = Math.min(12, dx * 0.15); // nach rechts nur leichter Widerstand, Wischen geht nur nach links
    if (Math.abs(dx) > 6) moved = true;
    if (moved && !raf) raf = requestAnimationFrame(paint);
  });
  deck.addEventListener('pointerup', function (e) {
    if (!drag) return;
    drag = false;
    cancelAnimationFrame(raf); raf = 0;
    var c = dragCard;
    c.classList.remove('dragging');
    var fast = Math.abs(dx) / Math.max(1, e.timeStamp - t0) > 0.5;
    if (moved && dx < 0 && (Math.abs(dx) > 70 || (fast && Math.abs(dx) > 25))) { go(1); }
    else {
      c.classList.add('snap');
      c.style.transform = '';
      if (!moved) flip(); else if (c.classList.contains('flipped')) scheduleSwipe(); else scheduleTap();
    }
  });
  deck.addEventListener('pointercancel', function () {
    drag = false;
    cancelAnimationFrame(raf); raf = 0;
    if (!dragCard) return;
    dragCard.classList.remove('dragging');
    dragCard.classList.add('snap');
    dragCard.style.transform = '';
  });
  deck.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
  });
  document.getElementById('deck-next').addEventListener('click', function () { go(1); });
  document.getElementById('deck-prev').addEventListener('click', function () { go(-1); });
  layout();
  label();
  scheduleTap();
})();
