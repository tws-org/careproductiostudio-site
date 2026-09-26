// Case-study carousel. Add a slide = add another .slide block + a dot button; nothing else changes.
(function () {
  var root = document.getElementById('case-studies');
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.cs-dot'));
  var counter = document.getElementById('cs-counter');
  var idx = 0;
  function show(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.hidden = n !== idx; });
    dots.forEach(function (d, n) { if (n === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    if (counter) counter.textContent = (idx + 1) + ' of ' + slides.length;
  }
  document.getElementById('cs-prev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('cs-next').addEventListener('click', function () { show(idx + 1); });
  dots.forEach(function (d, n) { d.addEventListener('click', function () { show(n); }); });
  show(0);
})();
