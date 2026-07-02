/* ============================================================
   CrossTecch AI Assistant — animated, site-wide chat widget.
   Drop-in: add ONE line before </body> on any page:
       <script src="crosstech-chatbot.js" defer></script>
   Everything (markup, styles, animation, logic) is injected by
   this file, so nothing else is needed. Safe to include twice —
   it guards against double-mounting.
============================================================ */
(function () {
  'use strict';
  if (window.__crosstechChatMounted) return;      // never mount twice
  window.__crosstechChatMounted = true;

  /* ---- Company facts — EDIT THESE with your real details ---- */
  var COMPANY = {
    name: 'CrossTecch',
    email: 'info@crosstecch.ai',
    phone: '+91 00000 00000',
    address: 'Hyderabad, Telangana, India',
    hours: 'Mon – Sat, 9 AM – 7 PM IST'
  };

  /* ---- Services (also power the quick-reply chips) ---- */
  var SERVICES = [
    { key: 'manual', name: 'Manual Testing', reply: 'Manual Testing — exploratory, functional and cross-browser testing by real QA engineers. We cover regression testing, usability & accessibility review, and detailed, reproducible bug reports.' },
    { key: 'automation', name: 'Automation Testing', reply: 'Automation Testing — UI, API and load suites (Selenium, Playwright, Cypress) that run on every commit and integrate with your CI/CD, so regressions are caught in minutes.' },
    { key: 'cloud', name: 'Cloud Services', reply: 'Cloud Services — secure, cost-efficient infrastructure across AWS, Azure and Google Cloud: migration & architecture, auto-scaling, security hardening, backups and disaster recovery.' },
    { key: 'devops', name: 'DevOps', reply: 'DevOps — automated CI/CD pipelines (GitHub Actions, GitLab, Jenkins), Infrastructure as Code (Terraform, Ansible), Docker/Kubernetes, monitoring and zero-downtime deployments.' },
    { key: 'web', name: 'Web Development', reply: 'Web Development — fast, responsive sites and apps in React & Next.js, REST/GraphQL APIs, SEO & Core Web Vitals tuning, plus CMS and third-party integrations.' },
    { key: 'blog', name: 'Blog Content Writing', reply: 'Blog Content Writing — SEO-friendly, well-researched articles: keyword research, technical long-form writing, editing, a content calendar and ongoing performance tracking.' }
  ];

  /* ---- Knowledge base — keywords the search scores against ---- */
  var KB = [
    { tags: ['about', 'company', 'who are you', 'what is crosstecch', 'crosstecch', 'crosstech', 'what do you do', 'tell me about'],
      reply: 'CrossTecch is a technology services company based in Hyderabad. We help startups and teams build, test, ship and grow — across QA, cloud, DevOps, web development and content.' },
    { tags: ['location', 'where', 'where is', 'address', 'office', 'based', 'located', 'city', 'country', 'map', 'find you', 'reach you', 'hyderabad'],
      reply: 'We’re based in ' + COMPANY.address + ', and we work remotely with clients worldwide.' },
    { tags: ['hours', 'timing', 'timings', 'open', 'available', 'working hours', 'office hours', 'business hours', 'when open', 'what time'],
      reply: 'Our working hours are ' + COMPANY.hours + '. We usually reply to messages within one business day.' },
    { tags: ['contact', 'email', 'phone', 'call', 'reach', 'talk', 'human', 'number', 'mobile', 'whatsapp', 'mail', 'get in touch'],
      reply: 'You can reach us at ' + COMPANY.email + ' or ' + COMPANY.phone + '. Prefer we contact you? Leave your details below and we’ll reach out.', form: true },
    { tags: ['price', 'pricing', 'cost', 'quote', 'budget', 'rate', 'rates', 'charge', 'charges', 'fees', 'how much', 'estimate'],
      reply: 'Pricing depends on scope and engagement model (fixed project or team augmentation). Share your details and we’ll send a tailored quote — usually within one business day.' },
    { tags: ['process', 'how you work', 'how do you work', 'steps', 'approach', 'methodology', 'workflow', 'engagement', 'model', 'hire', 'onboarding'],
      reply: 'How we work: 1) a free consultation to understand your goals, 2) a scoped plan with timeline & cost, 3) delivery in short iterations with regular updates, 4) support after launch. Engage us per-project or as an extension of your team.' },
    { tags: ['why', 'why choose', 'why you', 'better', 'different', 'trust', 'experience', 'expert', 'experts', 'advantage'],
      reply: 'Why CrossTecch: certified QA, cloud & DevOps engineers, tailored (no-template) solutions, flexible engagement, and end-to-end delivery from first commit to production and beyond.' },
    { tags: ['tech', 'stack', 'tech stack', 'tools', 'technologies', 'technology', 'languages', 'framework', 'frameworks', 'which tools'],
      reply: 'We work across React & Next.js, Node, REST/GraphQL, Selenium/Playwright/Cypress, AWS/Azure/GCP, Docker/Kubernetes, Terraform, and CI/CD tools like GitHub Actions, GitLab and Jenkins.' },
    { tags: ['start', 'get started', 'begin', 'consultation', 'book', 'book a call', 'demo', 'free', 'schedule', 'meeting'],
      reply: 'Great — we offer a free project consultation this month. Leave your name, email, phone and a short message and we’ll set it up.', form: true },
    { tags: ['support', 'maintenance', 'after launch', 'warranty', 'sla', 'post launch', 'ongoing'],
      reply: 'Yes — we provide ongoing support and maintenance after launch, including monitoring, updates and bug fixes.' },
    { tags: ['career', 'careers', 'job', 'jobs', 'hiring', 'vacancy', 'vacancies', 'internship', 'work with you', 'join'],
      reply: 'For careers, share your details with a short note about your background and our team will get back to you.', form: true },
    { tags: ['industries', 'clients', 'who do you work with', 'startups', 'enterprise', 'domain'],
      reply: 'We work with startups and established teams alike — from first MVP to large-scale production systems, across a range of industries.' },
    { tags: ['timeline', 'how long', 'duration', 'delivery time', 'when ready', 'deadline'],
      reply: 'Timelines depend on scope. After a quick consultation we give you a clear plan with milestones and dates. Small projects often ship in a few weeks.' },
    { tags: ['thanks', 'thank you', 'great', 'cool', 'awesome', 'nice', 'okay', 'ok'],
      reply: 'You’re welcome! 😊 Anything else I can help you with?' },
    { tags: ['hi', 'hello', 'hey', 'hii', 'greetings', 'good morning', 'good afternoon', 'good evening'],
      reply: 'Hi! 👋 I’m the ' + COMPANY.name + ' assistant. Ask me anything about our services, pricing, process, or how to get in touch.' }
  ];

  /* ---- Lightweight relevance search over services + KB ---- */
  var STOP = { the: 1, a: 1, an: 1, is: 1, are: 1, do: 1, does: 1, you: 1, i: 1, to: 1, of: 1, for: 1, in: 1, on: 1, and: 1, me: 1, my: 1, your: 1, can: 1, could: 1, would: 1, please: 1, it: 1, we: 1, with: 1, at: 1, by: 1, or: 1, be: 1, have: 1, has: 1, about: 1, tell: 1, give: 1, want: 1, need: 1 };
  function norm(s) { return (' ' + s + ' ').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' '); }
  function words(s) { return norm(s).trim().split(' ').filter(function (w) { return w && !STOP[w]; }); }
  function scoreEntry(query, entry) {
    var q = norm(query), hay = norm((entry.tags || []).join(' ') + ' ' + (entry.name || '') + ' ' + (entry.reply || ''));
    var s = 0;
    (entry.tags || []).forEach(function (t) {
      var nt = norm(t).trim();
      if (nt && q.indexOf(' ' + nt + ' ') > -1) s += (nt.indexOf(' ') > -1 ? 6 : 3);
    });
    words(query).forEach(function (w) { if (hay.indexOf(' ' + w) > -1) s += 1; });
    return s;
  }
  function answer(text) {
    var pool = SERVICES.map(function (s) {
      return { tags: [s.key, s.name, s.name.split(' ')[0]], name: s.name, reply: s.reply };
    }).concat(KB);
    var best = null, bestScore = 0;
    pool.forEach(function (e) { var sc = scoreEntry(text, e); if (sc > bestScore) { bestScore = sc; best = e; } });
    if (best && bestScore >= 3) return { reply: best.reply, form: best.form };
    return {
      reply: 'I didn’t quite catch that. I can help with our services (QA, Cloud, DevOps, Web, Content), plus pricing, process, tech stack, location, hours or contact. Pick a topic below or leave your details.',
      suggest: true
    };
  }

  /* ================= Styles (scoped under #ctc) ================= */
  var CSS =
  '#ctc{--g900:#14301f;--g800:#1c3a2a;--g700:#285a3c;--g600:#2f6b45;--soft:#e4efe0;--ink:#1b2a20;--muted:#5d6b61;--line:rgba(20,48,31,.14);' +
  'position:fixed;right:22px;bottom:22px;z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}' +
  '#ctc *{box-sizing:border-box;}' +

  /* --- launcher + its animated aura --- */
  '.ctc-launch{position:relative;width:64px;height:64px;animation:ctc-float 4.2s ease-in-out infinite;}' +
  '.ctc-launch:after{content:"";position:absolute;left:50%;bottom:-14px;width:44px;height:10px;border-radius:50%;' +
  'background:rgba(20,48,31,.28);transform:translateX(-50%);filter:blur(3px);animation:ctc-shadow 4.2s ease-in-out infinite;pointer-events:none;}' +
  '.ctc-ring{position:absolute;inset:0;border-radius:50%;background:var(--g600);opacity:.55;animation:ctc-radar 2.6s ease-out infinite;pointer-events:none;}' +
  '.ctc-ring.r2{animation-delay:1.3s;}' +
  '.ctc-fab{position:absolute;inset:3px;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;' +
  'background:linear-gradient(135deg,var(--g700),var(--g900));color:#fff;display:flex;align-items:center;justify-content:center;' +
  'box-shadow:0 12px 28px rgba(20,48,31,.42);transition:transform .2s,box-shadow .2s;}' +
  '.ctc-fab:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 18px 36px rgba(20,48,31,.5);}' +
  '.ctc-fab:active{transform:scale(.96);}' +
  '.ctc-fab svg{transition:transform .35s cubic-bezier(.34,1.56,.64,1);}' +
  '.ctc-open-state .ctc-fab svg{transform:rotate(90deg) scale(.9);}' +
  '.ctc-open-state .ctc-launch{animation:none;}' +
  '.ctc-open-state .ctc-launch:after{display:none;}' +
  '.ctc-open-state .ctc-ring{display:none;}' +
  /* notification badge */
  '.ctc-badge{position:absolute;top:-2px;right:-2px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#ff4d4f;' +
  'color:#fff;font-size:.68rem;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.25);' +
  'transform:scale(0);transition:transform .3s cubic-bezier(.34,1.56,.64,1);}' +
  '.ctc-badge.show{transform:scale(1);}' +

  /* --- greeting teaser bubble --- */
  '.ctc-teaser{position:absolute;bottom:8px;right:74px;max-width:230px;background:#fff;color:var(--ink);border:1px solid var(--line);' +
  'border-radius:14px 14px 4px 14px;padding:11px 30px 11px 13px;font-size:.83rem;line-height:1.35;box-shadow:0 14px 34px rgba(20,48,31,.22);' +
  'opacity:0;visibility:hidden;transform:translateX(12px) scale(.9);transform-origin:bottom right;' +
  'transition:opacity .3s ease,transform .38s cubic-bezier(.34,1.56,.64,1),visibility 0s linear .4s;}' +
  '.ctc-teaser.show{opacity:1;visibility:visible;transform:translateX(0) scale(1);transition:opacity .3s ease,transform .4s cubic-bezier(.34,1.56,.64,1),visibility 0s;}' +
  '.ctc-teaser b{color:var(--g900);}' +
  '.ctc-teaser-x{position:absolute;top:4px;right:6px;border:none;background:transparent;color:var(--muted);font-size:.85rem;cursor:pointer;line-height:1;}' +
  '.ctc-teaser-x:hover{color:var(--ink);}' +

  /* --- panel --- */
  '.ctc-panel{position:absolute;right:0;bottom:76px;width:360px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 130px);' +
  'background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 26px 64px rgba(20,48,31,.3);display:flex;flex-direction:column;' +
  'overflow:hidden;transform-origin:bottom right;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(20px) scale(.92);' +
  'transition:opacity .26s ease,transform .3s cubic-bezier(.22,1,.36,1),visibility 0s linear .32s;}' +
  '.ctc-open-state .ctc-panel{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0) scale(1);' +
  'transition:opacity .24s ease,transform .38s cubic-bezier(.34,1.56,.64,1),visibility 0s;}' +

  '.ctc-head{display:flex;align-items:center;gap:11px;padding:14px 16px;background:linear-gradient(135deg,var(--g800),var(--g600));color:#fff;position:relative;overflow:hidden;}' +
  '.ctc-head:before{content:"";position:absolute;top:-40%;left:-20%;width:60%;height:180%;background:linear-gradient(120deg,transparent,rgba(255,255,255,.18),transparent);transform:skewX(-18deg);animation:ctc-sheen 6s ease-in-out infinite;}' +
  '.ctc-avatar{position:relative;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;}' +
  '.ctc-name{margin:0;font-weight:700;font-size:.96rem;}' +
  '.ctc-status{margin:2px 0 0;font-size:.72rem;opacity:.9;display:flex;align-items:center;gap:6px;}' +
  '.ctc-dot{width:8px;height:8px;border-radius:50%;background:#7ee2a8;display:inline-block;box-shadow:0 0 0 0 rgba(126,226,168,.7);animation:ctc-live 2s ease-out infinite;}' +
  '.ctc-close{margin-left:auto;background:transparent;border:none;color:#fff;font-size:1rem;cursor:pointer;opacity:.85;position:relative;}' +
  '.ctc-close:hover{opacity:1;}' +

  '.ctc-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f7faf6;}' +
  '.ctc-msg{max-width:84%;padding:10px 13px;border-radius:14px;font-size:.86rem;line-height:1.42;white-space:pre-wrap;animation:ctc-in .32s cubic-bezier(.22,1,.36,1) both;}' +
  '.ctc-msg.bot{align-self:flex-start;background:#fff;color:var(--ink);border:1px solid var(--line);border-bottom-left-radius:4px;}' +
  '.ctc-msg.user{align-self:flex-end;background:var(--g800);color:#fff;border-bottom-right-radius:4px;}' +

  /* typing dots */
  '.ctc-typing{align-self:flex-start;background:#fff;border:1px solid var(--line);border-bottom-left-radius:4px;border-radius:14px;padding:12px 14px;display:flex;gap:5px;animation:ctc-in .3s ease both;}' +
  '.ctc-typing i{width:7px;height:7px;border-radius:50%;background:var(--g600);opacity:.5;animation:ctc-blink 1.2s infinite;}' +
  '.ctc-typing i:nth-child(2){animation-delay:.2s;}' +
  '.ctc-typing i:nth-child(3){animation-delay:.4s;}' +

  '.ctc-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px;animation:ctc-in .32s ease both;}' +
  '.ctc-chip{border:1px solid var(--line);background:#fff;color:var(--g700);padding:7px 12px;border-radius:999px;font-size:.78rem;cursor:pointer;transition:background .15s,transform .15s;}' +
  '.ctc-chip:hover{background:var(--soft);transform:translateY(-1px);}' +
  '.ctc-chip.cta{background:var(--g800);color:#fff;border-color:var(--g800);}' +
  '.ctc-chip.cta:hover{background:var(--g700);}' +
  '.ctc-chip:disabled{opacity:.45;cursor:default;transform:none;}' +
  '.ctc-chip:disabled:hover{background:#fff;}' +
  '.ctc-chip.picked{background:var(--g800);color:#fff;border-color:var(--g800);opacity:1;}' +

  '.ctc-form{display:flex;flex-direction:column;gap:9px;margin-top:2px;animation:ctc-in .3s ease both;}' +
  '.ctc-form-title{margin:0;font-size:.85rem;font-weight:700;color:var(--g900);}' +
  '.ctc-input{border:1px solid var(--line);border-radius:10px;padding:9px 11px;font-size:.85rem;font-family:inherit;color:var(--ink);background:#fff;outline:none;width:100%;}' +
  '.ctc-input:focus{border-color:var(--g600);box-shadow:0 0 0 3px rgba(47,107,69,.12);}' +
  'textarea.ctc-input{resize:vertical;min-height:64px;}' +
  '.ctc-form-actions{display:flex;gap:8px;}' +
  '.ctc-btn{flex:1;border:none;border-radius:10px;padding:10px;font-size:.85rem;font-weight:600;cursor:pointer;background:var(--g800);color:#fff;transition:background .15s;}' +
  '.ctc-btn:hover{background:var(--g700);}' +
  '.ctc-btn.ghost{flex:0 0 84px;background:#fff;color:var(--g800);border:1px solid var(--line);}' +
  '.ctc-btn.ghost:hover{background:var(--soft);}' +

  '.ctc-composer{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid var(--line);background:#fff;}' +
  '.ctc-field{flex:1;border:1px solid var(--line);border-radius:999px;padding:9px 14px;font-size:.85rem;font-family:inherit;outline:none;color:var(--ink);}' +
  '.ctc-field:focus{border-color:var(--g600);box-shadow:0 0 0 3px rgba(47,107,69,.12);}' +
  '.ctc-send{width:38px;height:38px;flex:0 0 38px;border:none;border-radius:50%;background:var(--g800);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .15s;}' +
  '.ctc-send:hover{background:var(--g700);transform:scale(1.06);}' +

  /* keyframes */
  '@keyframes ctc-radar{0%{transform:scale(.7);opacity:.55;}100%{transform:scale(1.7);opacity:0;}}' +
  '@keyframes ctc-float{0%,100%{transform:translateY(0) rotate(0deg);}25%{transform:translateY(-7px) rotate(-3deg);}50%{transform:translateY(-12px) rotate(0deg);}75%{transform:translateY(-7px) rotate(3deg);}}' +
  '@keyframes ctc-shadow{0%,100%{transform:translateX(-50%) scale(1);opacity:.28;}50%{transform:translateX(-50%) scale(.62);opacity:.14;}}' +
  '@keyframes ctc-live{0%{box-shadow:0 0 0 0 rgba(126,226,168,.7);}70%{box-shadow:0 0 0 7px rgba(126,226,168,0);}100%{box-shadow:0 0 0 0 rgba(126,226,168,0);}}' +
  '@keyframes ctc-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}' +
  '@keyframes ctc-blink{0%,60%,100%{opacity:.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-3px);}}' +
  '@keyframes ctc-sheen{0%,100%{left:-30%;}50%{left:120%;}}' +
  '@media (prefers-reduced-motion:reduce){' +
  '.ctc-launch,.ctc-launch:after,.ctc-fab,.ctc-ring,.ctc-dot,.ctc-head:before,.ctc-typing i{animation:none!important;}' +
  '.ctc-msg,.ctc-chips,.ctc-form,.ctc-typing{animation:none!important;}}';

  /* ================= Build DOM ================= */
  var root = document.createElement('div');
  root.id = 'ctc';
  root.innerHTML =
    '<style>' + CSS + '</style>' +
    '<div class="ctc-panel" role="dialog" aria-label="Chat with ' + COMPANY.name + '">' +
      '<header class="ctc-head">' +
        '<div class="ctc-avatar">' + COMPANY.name.charAt(0) + '</div>' +
        '<div><p class="ctc-name">' + COMPANY.name + ' Assistant</p>' +
        '<p class="ctc-status"><span class="ctc-dot"></span> Online • typically replies in a day</p></div>' +
        '<button class="ctc-close" aria-label="Close">✕</button>' +
      '</header>' +
      '<div class="ctc-body"></div>' +
      '<form class="ctc-composer"><input class="ctc-field" placeholder="Type your message…" autocomplete="off" />' +
        '<button class="ctc-send" type="submit" aria-label="Send">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button></form>' +
    '</div>' +
    '<div class="ctc-teaser"><button class="ctc-teaser-x" aria-label="Dismiss">✕</button>' +
      '👋 Hi there! Need help with <b>QA, cloud or web</b>? Ask me anything.</div>' +
    '<div class="ctc-launch">' +
      '<span class="ctc-ring"></span><span class="ctc-ring r2"></span>' +
      '<button class="ctc-fab" aria-label="Open chat">' +
        '<span class="ctc-badge">1</span>' +
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.7L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z"/><line x1="8.5" y1="11.5" x2="8.5" y2="11.5"/><line x1="12" y1="11.5" x2="12" y2="11.5"/><line x1="15.5" y1="11.5" x2="15.5" y2="11.5"/></svg>' +
      '</button>' +
    '</div>';

  function mount() {
    document.body.appendChild(root);
    wire();
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  /* ================= Behaviour ================= */
  function wire() {
    var panel   = root.querySelector('.ctc-panel');
    var fab     = root.querySelector('.ctc-fab');
    var badge   = root.querySelector('.ctc-badge');
    var teaser  = root.querySelector('.ctc-teaser');
    var teaserX = root.querySelector('.ctc-teaser-x');
    var body    = root.querySelector('.ctc-body');
    var composer= root.querySelector('.ctc-composer');
    var field   = root.querySelector('.ctc-field');
    var closeB  = root.querySelector('.ctc-close');
    var greeted = false;

    function scroll() { body.scrollTop = body.scrollHeight; }

    function addMsg(text, who) {
      var el = document.createElement('div');
      el.className = 'ctc-msg ' + who;
      el.textContent = text;
      body.appendChild(el); scroll();
    }

    /* bot reply preceded by an animated typing indicator */
    function botSay(text, delay) {
      var t = document.createElement('div');
      t.className = 'ctc-typing';
      t.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(t); scroll();
      setTimeout(function () {
        if (t.parentNode) t.parentNode.removeChild(t);
        addMsg(text, 'bot');
      }, delay || 750);
    }

    function showChips() {
      var wrap = document.createElement('div');
      wrap.className = 'ctc-chips';
      SERVICES.forEach(function (s) {
        var b = document.createElement('button');
        b.className = 'ctc-chip'; b.textContent = s.name;
        b.onclick = function () { pickService(s, b, wrap); };
        wrap.appendChild(b);
      });
      var cta = document.createElement('button');
      cta.className = 'ctc-chip cta'; cta.textContent = '💬 Talk to us';
      cta.onclick = showForm;
      wrap.appendChild(cta);
      body.appendChild(wrap); scroll();
    }

    function pickService(s, btn, wrap) {
      var all = wrap.querySelectorAll('.ctc-chip');
      for (var i = 0; i < all.length; i++) all[i].disabled = true;
      btn.classList.add('picked');
      send(s.name);
      setTimeout(showForm, 900);
    }

    function showForm() {
      if (root.querySelector('.ctc-form')) return;
      composer.style.display = 'none';
      var f = document.createElement('form');
      f.className = 'ctc-form';
      f.innerHTML =
        '<p class="ctc-form-title">Share your details</p>' +
        '<input class="ctc-input" name="name" placeholder="Your name *" required>' +
        '<input class="ctc-input" name="email" type="email" placeholder="Email *" required>' +
        '<input class="ctc-input" name="phone" type="tel" placeholder="Phone number">' +
        '<textarea class="ctc-input" name="message" rows="3" placeholder="How can we help? *" required></textarea>' +
        '<div class="ctc-form-actions"><button type="button" class="ctc-btn ghost">Back</button>' +
        '<button type="submit" class="ctc-btn">Send</button></div>';
      body.appendChild(f); scroll();
      f.querySelector('.ghost').onclick = function () { f.remove(); composer.style.display = ''; };
      f.onsubmit = function (e) {
        e.preventDefault();
        var lead = {
          name: f.name.value.trim(), email: f.email.value.trim(),
          phone: f.phone.value.trim(), message: f.message.value.trim(),
          at: new Date().toISOString()
        };
        if (!lead.name || !lead.email || !lead.message) return;

        /* Keep a local backup (survives offline / DB-not-connected). */
        try { var a = JSON.parse(localStorage.getItem('crosstecch_leads') || '[]'); a.push(lead); localStorage.setItem('crosstecch_leads', JSON.stringify(a)); } catch (_) {}
        if (window.console) console.log('[CrossTecch Chat] New lead:', lead);

        f.remove(); composer.style.display = '';
        addMsg('📨 ' + lead.name + ' · ' + lead.email + (lead.phone ? ' · ' + lead.phone : ''), 'user');

        /* Send to the SAME backend the contact form uses (POST /api/contact ->
           MongoDB). Phone isn't a DB field, so it's folded into the message.
           View saved leads at /admin/submissions or GET /api/contact. */
        var payload = {
          name: lead.name,
          email: lead.email,
          need: 'Chatbot enquiry',
          message: lead.message + (lead.phone ? '\n\nPhone: ' + lead.phone : '')
        };
        var done = false;
        function thanks() { if (done) return; done = true; botSay('Thanks! We’ve got your details and will reach out within one business day. 🚀'); }
        try {
          fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(function () { thanks(); }).catch(function () { thanks(); });
        } catch (_) { thanks(); }
      };
    }

    function send(raw) {
      var text = (raw != null ? raw : field.value).trim();
      if (!text) return;
      addMsg(text, 'user');
      field.value = '';
      var res = answer(text);
      botSay(res.reply);
      if (res.form) setTimeout(showForm, 900);
      if (res.suggest) setTimeout(showChips, 900);
    }

    function hideTeaser() { teaser.classList.remove('show'); }

    function openPanel() {
      root.classList.add('ctc-open-state');
      fab.setAttribute('aria-label', 'Close chat');
      badge.classList.remove('show');
      hideTeaser();
      if (!greeted) {
        greeted = true;
        botSay('Hi! 👋 I’m the ' + COMPANY.name + ' assistant. Ask me about our services, or tap a topic below.', 500);
        setTimeout(showChips, 1250);
      }
      setTimeout(function () { field.focus(); }, 300);
    }
    function closePanel() {
      root.classList.remove('ctc-open-state');
      fab.setAttribute('aria-label', 'Open chat');
    }

    fab.onclick = function () { root.classList.contains('ctc-open-state') ? closePanel() : openPanel(); };
    closeB.onclick = closePanel;
    composer.onsubmit = function (e) { e.preventDefault(); send(); };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
    teaserX.onclick = function (e) { e.stopPropagation(); hideTeaser(); };
    teaser.onclick = function () { openPanel(); };

    /* attention cues (skip if user already opened it) */
    setTimeout(function () { if (!greeted) badge.classList.add('show'); }, 2500);
    setTimeout(function () { if (!root.classList.contains('ctc-open-state')) teaser.classList.add('show'); }, 4000);
    setTimeout(hideTeaser, 12000);
  }
})();
