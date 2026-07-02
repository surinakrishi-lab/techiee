/* ============================================================
   CrossTecch FX — shared JS interactivity / animation layer.
   Drop-in: <script src="fx.js" defer></script> before </body>.
   Purely additive & safe: it injects its own CSS, so if JS never
   runs, no content is hidden. Respects prefers-reduced-motion.

   Features:
     1) Scroll progress bar (top gradient)
     2) Floating "back to top" button
     3) Ripple effect on buttons / CTAs
     4) Subtle 3D tilt on cards (pointer devices)
     5) Count-up animation for numeric stats
     6) Reveal-on-scroll — ONLY on pages that don't already have
        their own reveal system (avoids double-handling).
============================================================ */
(function () {
  'use strict';
  if (window.__ctFxLoaded) return;
  window.__ctFxLoaded = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasPointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- injected styles ---------- */
  var css = [
    '#ctfx-progress{position:fixed;top:0;left:0;height:3px;width:0;z-index:2147482000;',
    'background:linear-gradient(90deg,#5b4bff,#8b5cf6,#06b6d4);box-shadow:0 0 10px rgba(91,75,255,.6);',
    'transition:width .1s linear;pointer-events:none;}',
    '#ctfx-top{position:fixed;right:22px;bottom:92px;width:46px;height:46px;border-radius:50%;border:none;cursor:pointer;',
    'background:linear-gradient(135deg,#5b4bff,#8b5cf6 60%,#06b6d4);color:#fff;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 12px 28px rgba(91,75,255,.4);opacity:0;visibility:hidden;transform:translateY(14px) scale(.9);',
    'transition:opacity .3s ease,transform .3s cubic-bezier(.34,1.56,.64,1),visibility 0s linear .3s;z-index:2147481500;}',
    '#ctfx-top.show{opacity:1;visibility:visible;transform:translateY(0) scale(1);transition:opacity .3s ease,transform .35s cubic-bezier(.34,1.56,.64,1),visibility 0s;}',
    '#ctfx-top:hover{transform:translateY(-3px) scale(1.06);}',
    '.ctfx-ripple{position:absolute;border-radius:50%;transform:scale(0);background:rgba(255,255,255,.5);',
    'pointer-events:none;animation:ctfx-rip .6s ease-out forwards;mix-blend-mode:overlay;}',
    '@keyframes ctfx-rip{to{transform:scale(2.6);opacity:0;}}',
    '.ctfx-tilt{transition:transform .25s ease,box-shadow .25s ease;transform-style:preserve-3d;will-change:transform;}',
    '.ctfx-reveal{opacity:0;transform:translateY(26px);}',
    '.ctfx-reveal.ctfx-in{opacity:1;transform:none;transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}',
    (reduce ? '.ctfx-reveal{opacity:1!important;transform:none!important;}#ctfx-progress,.ctfx-ripple{display:none!important;}' : '')
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    /* ---------- 1) scroll progress bar ---------- */
    var bar = document.createElement('div');
    bar.id = 'ctfx-progress';
    document.body.appendChild(bar);

    /* ---------- 2) back to top ---------- */
    var top = document.createElement('button');
    top.id = 'ctfx-top';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(top);
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = p + '%';
        top.classList.toggle('show', window.scrollY > 500);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 3) ripple on buttons / CTAs ---------- */
    var rippleSel = '.btn,.cta-btn,.hero-cta-btn,.hero-cta,.navCta,.mega-feature-btn,.form-submit-btn,.btn-submit,.futureBtn,button.pill,.cta-btn-wrapper button';
    document.addEventListener('click', function (e) {
      if (reduce) return;
      var el = e.target.closest ? e.target.closest(rippleSel) : null;
      if (!el) return;
      var cs = window.getComputedStyle(el);
      if (cs.position === 'static') el.style.position = 'relative';
      if (cs.overflow !== 'hidden') el.style.overflow = 'hidden';
      var r = el.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'ctfx-ripple';
      s.style.width = s.style.height = size + 'px';
      s.style.left = (e.clientX - r.left - size / 2) + 'px';
      s.style.top = (e.clientY - r.top - size / 2) + 'px';
      el.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 600);
    });

    /* ---------- 4) subtle 3D tilt on cards ---------- */
    if (hasPointer && !reduce) {
      var cards = document.querySelectorAll('.service-card,.cloud-card,[class*="card"]:not(.ct-nav *)');
      Array.prototype.slice.call(cards, 0, 60).forEach(function (card) {
        // skip tiny or full-width layout wrappers
        card.classList.add('ctfx-tilt');
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          if (r.width > 640) return; // ignore big section-like blocks
          var cx = (e.clientX - r.left) / r.width - 0.5;
          var cy = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = 'perspective(800px) rotateX(' + (-cy * 6) + 'deg) rotateY(' + (cx * 6) + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', function () { card.style.transform = ''; });
      });
    }

    /* ---------- 5) count-up numeric stats ---------- */
    function countUp(el) {
      var raw = (el.getAttribute('data-count') || el.textContent).trim();
      var m = raw.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
      if (!m) return;
      var prefix = m[1], target = parseFloat(m[2].replace(/,/g, '')), suffix = m[3];
      if (!isFinite(target)) return;
      if (reduce) { el.textContent = raw; return; }
      var dur = 1400, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        var val = target * eased;
        var out = target % 1 === 0 ? Math.round(val).toLocaleString() : val.toFixed(1);
        el.textContent = prefix + out + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var stats = document.querySelectorAll('[data-count],[class*="stat-number"],[class*="counter"],[class*="metric-num"]');
    if ('IntersectionObserver' in window) {
      var sObs = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { countUp(en.target); o.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      stats.forEach(function (el) {
        if (/^\D*[\d,]+/.test((el.getAttribute('data-count') || el.textContent).trim())) sObs.observe(el);
      });
    } else {
      stats.forEach(countUp);
    }

    /* ---------- 6) reveal-on-scroll (only if page has no own system) ---------- */
    var hasOwnReveal = document.querySelector('.scroll-reveal,.reveal,.animate-on-scroll');
    if (!hasOwnReveal && 'IntersectionObserver' in window && !reduce) {
      var targets = document.querySelectorAll(
        'section > *:not(script):not(style), .card, [class*="card"], [class*="feature"], [class*="tile"], footer'
      );
      var rObs = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('ctfx-in'); o.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      Array.prototype.forEach.call(targets, function (el, i) {
        // don't hide nav or already-visible above-the-fold hero content
        if (el.closest('.ct-nav') || el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        el.classList.add('ctfx-reveal');
        rObs.observe(el);
      });
    }
  });
})();
