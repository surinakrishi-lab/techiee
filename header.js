/* ============================================================
   CrossTecch shared MEGA HEADER  (single source of truth)
   Use: add  <script src="header.js"></script>  right before </body>.
   index_files/ ke andar wale pages: <script src="../header.js"></script>
   Ek hi jagah edit -> sab pages me update. (hero1.html par use mat karo)
   ============================================================ */
(function() {
    if (window.__ctHeaderLoaded) return;
    window.__ctHeaderLoaded = true;

    /* base prefix: index_files/ ke andar wale pages ko ../ chahiye */
    var B = (location.pathname.indexOf('/index_files/') !== -1) ? '../' : '';

    /* ---------- 1) STYLES ---------- */
    var css = `
    /* legacy inline headers hide -> sirf naya ek header dikhe (JS error se bachne ke liye remove nahi, hide) */
    nav.nav:not(.ct-nav), nav.nav-menu, nav.nav-links, header.nav:not(.ct-nav), nav[classname="nav"], aside.sidebar { display: none !important; }
    .ct-nav, .ct-nav *, .ct-nav *::before, .ct-nav *::after { box-sizing: border-box; }
    .ct-nav {
        position: sticky; top: 0; left: 0; right: 0; width: 100%;
        display: flex; align-items: center; justify-content: flex-start;
        padding: 0 40px; height: 88px; z-index: 1000;
        background: rgba(255, 255, 255, 0.9);
        -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba(13, 18, 36, 0.07);
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .ct-nav .navLogo { display: flex; gap: 12px; align-items: center; }
    .ct-nav .logoImage { height: 150px; width: auto; object-fit: contain; }
    .ct-nav .navLinks { display: flex; gap: 34px; list-style: none; margin: 0 0 0 44px; padding: 0; align-items: center; }
    .ct-nav .navLinks > li > a {
        font-size: 15.5px; font-weight: 600; letter-spacing: .1px;
        color: #1f2540; text-decoration: none; cursor: pointer; white-space: nowrap;
        display: inline-flex; align-items: center; gap: 5px; transition: color .2s ease;
    }
    .ct-nav .navLinks > li > a:hover { color: #5b4bff; }
    .ct-nav .navLinks > li > a:hover .caret { stroke: #5b4bff; }
    .ct-nav .navActions { display: flex; align-items: center; gap: 14px; margin-left: auto; }
    .ct-nav .navCta {
        font-size: 14px; font-weight: 700; letter-spacing: .2px; color: #fff;
        background: linear-gradient(135deg, #5b4bff 0%, #8b5cf6 55%, #06b6d4 120%);
        padding: 12px 24px; border-radius: 999px; text-decoration: none; white-space: nowrap;
        box-shadow: 0 16px 34px -16px rgba(91,75,255,.8); transition: transform .2s ease, box-shadow .2s ease;
    }
    .ct-nav .navCta:hover { transform: translateY(-2px); box-shadow: 0 22px 44px -16px rgba(91,75,255,.9); }

    /* mega */
    .ct-nav .nav-item { position: static; }
    .ct-nav .navLinks .caret { margin-left: 3px; display: inline-block; stroke: #6b7290; transition: transform .28s ease, stroke .2s ease; }
    .ct-nav .nav-item.active-mega > a .caret { transform: rotate(180deg); stroke: #5b4bff; }
    .ct-nav .nav-item.active-mega > a { color: #5b4bff; }
    .ct-nav .mega {
        position: absolute; top: 100%; left: 0; right: 0;
        background: #ffffff;
        -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px);
        box-shadow: 0 36px 70px -24px rgba(13,18,36,.28);
        border-top: 1px solid rgba(13,18,36,.06); border-bottom: 1px solid rgba(13,18,36,.06);
        border-radius: 0 0 22px 22px;
        opacity: 0; visibility: hidden; transform: translateY(8px);
        transition: opacity .25s ease, transform .25s ease, visibility .25s; z-index: 49;
    }
    .ct-nav .mega::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background: linear-gradient(90deg,#5b4bff,#8b5cf6,#06b6d4); }
    .ct-nav .mega.open { opacity: 1; visibility: visible; transform: translateY(0); }
    .ct-nav .mega-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 40px; padding: 34px 48px; }
    .ct-nav .mega-cols { display: flex; gap: 56px; flex: 1; }
    .ct-nav .mega-col { display: flex; flex-direction: column; gap: 18px; min-width: 210px; }
    .ct-nav .mega-head { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #8a90a6; }
    .ct-nav .mega-link { text-decoration: none; display: flex; flex-direction: column; gap: 3px; }
    .ct-nav .mega-link strong { font-size: 15.5px; font-weight: 700; color: #11162a; transition: color .2s ease; }
    .ct-nav .mega-link span { font-size: 12.5px; color: #6b7185; }
    .ct-nav .mega-link:hover strong { color: #5b4bff; }
    .ct-nav .mega-feature {
        width: 290px; flex-shrink: 0; border-radius: 18px; padding: 28px;
        background: linear-gradient(150deg, #5b4bff, #8b5cf6 55%, #06b6d4); color: #fff;
        display: flex; flex-direction: column; align-items: flex-start; gap: 12px; position: relative; overflow: hidden;
    }
    .ct-nav .mega-feature-img { position: absolute; right: -14px; bottom: -14px; width: 120px; opacity: .9; pointer-events: none; }
    .ct-nav .mega-feature h4 { font-size: 22px; font-weight: 800; line-height: 1.15; position: relative; z-index: 1; color:#fff !important; }
    .ct-nav .mega-feature-sub { font-size: 13px; opacity: .9; position: relative; z-index: 1; color:#fff !important; }
    .ct-nav .mega-feature-btn {
        margin-top: 6px; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.5); color: #fff !important;
        padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 13px; font-weight: 700; position: relative; z-index: 1; transition: background .2s ease;
    }
    .ct-nav .mega-feature-btn:hover { background: rgba(255,255,255,.3); }

    /* hamburger */
    .ct-nav .hamburger {
        display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 9px 10px; z-index: 60;
        background: rgba(255,255,255,.9); border: 1px solid rgba(13,18,36,.14); border-radius: 12px;
        transition: transform .2s ease;
    }
    .ct-nav .hamburger:active { transform: scale(0.95); }
    .ct-nav .hamburger span { width: 24px; height: 3px; background: #11162a; border-radius: 3px; transition: .3s; }
    .ct-nav.open .hamburger span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .ct-nav.open .hamburger span:nth-child(2) { opacity: 0; }
    .ct-nav.open .hamburger span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

    @media (max-width: 860px) {
        .ct-nav { flex-wrap: wrap; height: auto; padding: 12px 18px; }
        .ct-nav .logoImage { height: 50px; }
        .ct-nav .hamburger { display: flex; margin-left: auto; }
        .ct-nav .navLinks, .ct-nav .navActions { display: none; flex-basis: 100%; }
        .ct-nav.open .navLinks { display: flex; flex-direction: column; gap: 14px; width: 100%; padding: 10px 0 4px; align-items: stretch; }
        .ct-nav.open .navActions { display: flex; flex-direction: row; flex-wrap: wrap; gap: 12px; width: 100%; padding-bottom: 8px; }
        .ct-nav .nav-item { width: 100%; }
        .ct-nav .nav-item > a { display: flex; align-items: center; justify-content: space-between; }
        .ct-nav .mega { position: static; opacity: 1; visibility: visible; transform: none; box-shadow: none; border: 0; border-radius: 12px; background: rgba(248,248,252,.9); display: none; margin-top: 8px; }
        .ct-nav .mega::before { display: none; }
        .ct-nav .nav-item.active-mega .mega { display: block; }
        .ct-nav .mega-inner { flex-direction: column; padding: 14px 16px; gap: 16px; }
        .ct-nav .mega-cols { flex-direction: column; gap: 18px; }
        .ct-nav .mega-col { min-width: 0; }
        .ct-nav .mega-feature { display: none; }
    }`;

    var styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    /* ---------- 2) MARKUP ---------- */
    var html = `
    <a href="${B}index.html" target="_top" class="navLogo">
        <img src="${B}images/bg.png" alt="CrossTecch Logo" class="logoImage" />
    </a>
    <ul class="navLinks">
        <li class="nav-item" data-mega="platform"><a href="${B}solution.html" target="_top">Platform <svg class="caret" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a></li>
        <li class="nav-item" data-mega="product"><a href="${B}solution.html" target="_top">Product <svg class="caret" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a></li>
        <li class="nav-item" data-mega="service"><a href="${B}services.html" target="_top">Service <svg class="caret" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a></li>
        <li class="nav-item" data-mega="resources"><a href="${B}blog.html" target="_top">Resources <svg class="caret" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a></li>
    </ul>

    <div class="mega" id="mega-platform"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">PLATFORM</span>
            <a href="${B}solution.html" target="_top" class="mega-link"><strong>QA Cloud</strong><span>Scalable, cloud-based test infrastructure</span></a>
            <a href="${B}solution.html" target="_top" class="mega-link"><strong>AI Test Engine</strong><span>The AI core that powers our products</span></a>
            <a href="${B}solution.html" target="_top" class="mega-link"><strong>Integrations</strong><span>Plug into your CI/CD &amp; tools</span></a></div>
        <div class="mega-col"><span class="mega-head">WHY CROSSTECCH</span>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>How We Work</strong><span>Our process &amp; approach</span></a>
            <a href="${B}index_files/WhyChooseUs_preview.html" target="_top" class="mega-link"><strong>Why CrossTecch</strong><span>What sets us apart</span></a></div>
        </div><div class="mega-feature"><img src="${B}images/robo2.png" alt="" class="mega-feature-img" />
        <h4>One platform,<br>full coverage</h4><p class="mega-feature-sub">Test, build &amp; ship with confidence.</p>
        <a href="${B}solution.html" target="_top" class="mega-feature-btn">Explore the Platform</a></div></div></div>

    <div class="mega" id="mega-product"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">OUR PRODUCTS</span>
            <a href="${B}bug-finder.html" target="_top" class="mega-link"><strong>Bug Finder</strong><span>AI that catches bugs before production</span></a>
            <a href="${B}blog-engine.html" target="_top" class="mega-link"><strong>Content Engine</strong><span>SEO-ready content, drafted in minutes</span></a></div>
        <div class="mega-col"><span class="mega-head">EXPLORE</span>
            <a href="${B}solution.html" target="_top" class="mega-link"><strong>All Solutions</strong><span>See both tools in action</span></a>
            <a href="${B}future.html" target="_top" class="mega-link"><strong>Book a Demo</strong><span>Watch them live</span></a></div>
        </div><div class="mega-feature"><img src="${B}images/robo3.png" alt="" class="mega-feature-img" />
        <h4>Build. Test.<br>Deploy.</h4><p class="mega-feature-sub">Two products, everything your team needs.</p>
        <a href="${B}solution.html" target="_top" class="mega-feature-btn">See Products</a></div></div></div>

    <div class="mega" id="mega-service"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">TESTING &amp; QA</span>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>Manual QA Testing</strong><span>Human-driven test cycles for every flow</span></a>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>Automation Testing</strong><span>Selenium, Playwright &amp; Cypress at scale</span></a>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>Performance Testing</strong><span>Load &amp; stress at any scale</span></a>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>Functional &amp; Security Testing</strong><span>UI, DB, API &amp; security audits</span></a></div>
        <div class="mega-col"><span class="mega-head">ENGINEERING</span>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>DevOps Services</strong><span>CI/CD, Docker &amp; Kubernetes</span></a>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>Cloud Services</strong><span>AWS, GCP &amp; Azure architecture</span></a>
            <a href="${B}services.html" target="_top" class="mega-link"><strong>UI/UX &amp; Web Design</strong><span>Fast, usable, on-brand interfaces</span></a></div>
        </div><div class="mega-feature"><img src="${B}images/robok.png" alt="" class="mega-feature-img" />
        <h4>End-to-end<br>delivery</h4><p class="mega-feature-sub">From QA to cloud, one expert team.</p>
        <a href="${B}services.html" target="_top" class="mega-feature-btn">View All Services</a></div></div></div>

    <div class="mega" id="mega-resources"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">LEARN</span>
            <a href="${B}blog.html" target="_top" class="mega-link"><strong>Blog</strong><span>Latest articles &amp; insights</span></a>
            <a href="${B}blog.html" target="_top" class="mega-link"><strong>Case Studies</strong><span>Real-world client results</span></a>
            <a href="${B}blog.html" target="_top" class="mega-link"><strong>Guides</strong><span>Deep-dive tutorials</span></a></div>
        <div class="mega-col"><span class="mega-head">COMPANY</span>
            <a href="${B}about.html" target="_top" class="mega-link"><strong>About CrossTecch</strong><span>Who we are</span></a>
            <a href="${B}ContactUs.html" target="_top" class="mega-link"><strong>Contact</strong><span>Talk to our team</span></a></div>
        </div><div class="mega-feature"><img src="${B}images/girl.png" alt="" class="mega-feature-img" />
        <h4>Read.<br>Learn. Grow.</h4><p class="mega-feature-sub">Insights for modern teams.</p>
        <a href="${B}blog.html" target="_top" class="mega-feature-btn">Visit the Blog</a></div></div></div>

    <div class="navActions">
        <a href="${B}future.html" target="_top" class="navCta">Future &rarr;</a>
    </div>
    <div class="hamburger" aria-label="Menu" role="button" tabindex="0"><span></span><span></span><span></span></div>`;

    /* ---------- 3) INSERT (legacy headers CSS se hidden hain) ---------- */
    var nav = document.createElement('nav');
    nav.className = 'ct-nav';
    nav.innerHTML = html;
    document.body.insertBefore(nav, document.body.firstChild);

    /* ---------- 5) BEHAVIOUR ---------- */
    var hb = nav.querySelector('.hamburger');
    var megaItems = Array.prototype.slice.call(nav.querySelectorAll('.nav-item[data-mega]'));

    function isMobile() { return window.matchMedia('(max-width: 860px)').matches; }

    megaItems.forEach(function(it) {
        var p = nav.querySelector('#mega-' + it.getAttribute('data-mega'));
        if (p) it.appendChild(p);
    });

    if (hb) hb.addEventListener('click', function() { nav.classList.toggle('open'); });

    function closeMega() {
        megaItems.forEach(function(it) {
            it.classList.remove('active-mega');
            var p = it.querySelector('.mega');
            if (p) p.classList.remove('open');
        });
    }

    megaItems.forEach(function(it) {
        it.addEventListener('mouseenter', function() {
            if (isMobile()) return;
            closeMega();
            var p = it.querySelector('.mega');
            if (p) {
                p.classList.add('open');
                it.classList.add('active-mega');
            }
        });
    });
    nav.querySelectorAll('.navLinks li:not(.nav-item)').forEach(function(li) {
        li.addEventListener('mouseenter', function() { if (!isMobile()) closeMega(); });
    });
    nav.addEventListener('mouseleave', function() { if (!isMobile()) closeMega(); });

    megaItems.forEach(function(it) {
        var link = it.querySelector('a');
        if (!link) return;
        link.addEventListener('click', function(e) {
            if (!isMobile()) return;
            e.preventDefault();
            var open = it.classList.contains('active-mega');
            closeMega();
            if (!open) {
                var p = it.querySelector('.mega');
                if (p) p.classList.add('open');
                it.classList.add('active-mega');
            }
        });
    });

    nav.querySelectorAll('.navLinks li:not(.nav-item) > a, .mega a').forEach(function(a) {
        a.addEventListener('click', function() {
            nav.classList.remove('open');
            closeMega();
        });
    });
})();