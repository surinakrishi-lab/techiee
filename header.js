/* ============================================================
   CrossTecch shared MEGA HEADER
   Use: add  <script src="header.js"></script>  right after <body>.
   Ek hi jagah edit -> sab pages me update. (hero1.html par use mat karo)
   ============================================================ */
(function () {
    if (window.__ctHeaderLoaded) return; // do baar load na ho
    window.__ctHeaderLoaded = true;

    /* ---------- 1) STYLES ---------- */
    var css = `
    .ct-nav, .ct-nav *, .ct-nav *::before, .ct-nav *::after { box-sizing: border-box; }
    .ct-nav {
        position: sticky; top: 0; left: 0; right: 0; width: 100%;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 48px; height: 92px; z-index: 1000;
        background: rgba(255, 255, 255, 0.88);
        -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .ct-nav .navLogo { display: flex; gap: 12px; align-items: center; }
    .ct-nav .logoImage { height: 80px; width: auto; object-fit: contain; }
    .ct-nav .navLinks { display: flex; gap: 36px; list-style: none; margin: 0; padding: 0; align-items: center; }
    .ct-nav .navLinks > li > a {
        font-size: 13px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase;
        color: rgba(26, 26, 46, 0.66); text-decoration: none; cursor: pointer; white-space: nowrap;
    }
    .ct-nav .navLinks > li > a:hover { color: #1a1a2e; }
    .ct-nav .navActions { display: flex; align-items: center; gap: 16px; }
    .ct-nav .navCta {
        font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
        color: #1a1a2e; border: 1.5px solid rgba(26, 26, 46, 0.5); padding: 10px 22px;
        cursor: pointer; background: rgba(255, 255, 255, 0.3); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
    }
    .ct-nav .futureBtn {
        font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #fff;
        background: linear-gradient(90deg, #fb3d64, #d440ad, #8b45dc, #4f61fb, #fb3d64);
        background-size: 200% 100%; animation: ctBgPan 4s linear infinite;
        padding: 12px 22px; border-radius: 4px; text-decoration: none;
        box-shadow: 0 4px 15px rgba(212, 64, 173, 0.4);
    }
    @keyframes ctBgPan { 0% { background-position: 0% 0%; } 100% { background-position: -200% 0%; } }

    /* mega */
    .ct-nav .nav-item { position: static; }
    .ct-nav .navLinks .caret { font-size: 9px; margin-left: 4px; opacity: 0.7; display: inline-block; transition: transform 0.25s ease; }
    .ct-nav .nav-item.active-mega .caret { transform: rotate(180deg); }
    .ct-nav .mega {
        position: absolute; top: 100%; left: 0; right: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(247,245,255,0.93)), linear-gradient(115deg, rgba(251,61,100,0.06), rgba(139,69,220,0.06) 45%, rgba(79,97,251,0.06));
        -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px);
        box-shadow: 0 30px 60px rgba(20,20,50,0.14);
        border-top: 1px solid rgba(255,255,255,0.6); border-bottom: 1px solid rgba(20,20,50,0.06);
        border-radius: 0 0 20px 20px;
        opacity: 0; visibility: hidden; transform: translateY(8px);
        transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s; z-index: 49;
    }
    .ct-nav .mega::before { content:""; position:absolute; top:0; left:0; right:0; height:2px; background: linear-gradient(90deg,#fb3d64,#d440ad,#8b45dc,#4f61fb); opacity:0.7; }
    .ct-nav .mega.open { opacity: 1; visibility: visible; transform: translateY(0); }
    .ct-nav .mega-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 40px; padding: 32px 48px; }
    .ct-nav .mega-cols { display: flex; gap: 56px; flex: 1; }
    .ct-nav .mega-col { display: flex; flex-direction: column; gap: 18px; min-width: 200px; }
    .ct-nav .mega-head { font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #9aa0b4; }
    .ct-nav .mega-link { text-decoration: none; display: flex; flex-direction: column; gap: 3px; }
    .ct-nav .mega-link strong { font-size: 15px; font-weight: 700; color: #1a1a2e; transition: color 0.2s ease; }
    .ct-nav .mega-link span { font-size: 12.5px; color: #6b7185; }
    .ct-nav .mega-link:hover strong { color: #8b45dc; }
    .ct-nav .mega-feature {
        width: 290px; flex-shrink: 0; border-radius: 16px; padding: 26px;
        background: linear-gradient(160deg, #3a2a6d, #261f49); color: #fff;
        display: flex; flex-direction: column; align-items: flex-start; gap: 12px; position: relative; overflow: hidden;
    }
    .ct-nav .mega-feature-img { position: absolute; right: -14px; bottom: -14px; width: 120px; opacity: 0.85; pointer-events: none; }
    .ct-nav .mega-feature h4 { font-size: 22px; font-weight: 800; line-height: 1.15; position: relative; z-index: 1; color:#fff !important; }
    .ct-nav .mega-feature-sub { font-size: 13px; opacity: 0.85; position: relative; z-index: 1; color:#fff !important; }
    .ct-nav .mega-feature-btn {
        margin-top: 6px; background: rgba(244,242,242,0.14); border: 1px solid rgba(255,255,255,0.4); color: #fff !important;
        padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 13px; font-weight: 600; position: relative; z-index: 1; transition: background 0.2s ease;
    }
    .ct-nav .mega-feature-btn:hover { background: rgba(255,255,255,0.26); }

    /* hamburger */
    .ct-nav .hamburger {
        display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 9px 10px; z-index: 60;
        background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.14); border-radius: 12px;
        box-shadow: 0 4px 14px rgba(20,20,50,0.14); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
        transition: transform 0.2s ease;
    }
    .ct-nav .hamburger:active { transform: scale(0.95); }
    .ct-nav .hamburger span { width: 24px; height: 3px; background: #000; border-radius: 3px; transition: 0.3s; }
    .ct-nav.open .hamburger span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    .ct-nav.open .hamburger span:nth-child(2) { opacity: 0; }
    .ct-nav.open .hamburger span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

    @media (max-width: 860px) {
        .ct-nav { flex-wrap: wrap; height: auto; padding: 12px 18px; }
        .ct-nav .logoImage { height: 52px; }
        .ct-nav .hamburger { display: flex; }
        .ct-nav .navLinks, .ct-nav .navActions { display: none; flex-basis: 100%; }
        .ct-nav.open .navLinks { display: flex; flex-direction: column; gap: 14px; width: 100%; padding: 10px 0 4px; align-items: stretch; }
        .ct-nav.open .navActions { display: flex; flex-direction: row; flex-wrap: wrap; gap: 12px; width: 100%; padding-bottom: 8px; }
        .ct-nav .nav-item { width: 100%; }
        .ct-nav .nav-item > a { display: flex; align-items: center; justify-content: space-between; }
        .ct-nav .mega { position: static; opacity: 1; visibility: visible; transform: none; box-shadow: none; border: 0; border-radius: 12px; background: rgba(255,255,255,0.55); display: none; margin-top: 8px; }
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
    <a href="index.html" target="_top" class="navLogo">
        <img src="images/bg.png" alt="CrossTecch Logo" class="logoImage" />
    </a>
    <ul class="navLinks">
        <li><a href="index.html" target="_top">Home</a></li>
        <li class="nav-item" data-mega="about"><a href="about.html" target="_top">About Us <span class="caret">&#9662;</span></a></li>
        <li class="nav-item" data-mega="services"><a href="services.html" target="_top">Services <span class="caret">&#9662;</span></a></li>
        <li class="nav-item" data-mega="resources"><a href="blog.html" target="_top">Resources <span class="caret">&#9662;</span></a></li>
        <li class="nav-item" data-mega="blog"><a href="blog.html" target="_top">Blogs <span class="caret">&#9662;</span></a></li>
        <li class="nav-item" data-mega="product"><a href="Product.html" target="_top">Product <span class="caret">&#9662;</span></a></li>
        <li class="nav-item" data-mega="contact"><a href="ContactUs.html" target="_top">Contact Us <span class="caret">&#9662;</span></a></li>
    </ul>

    <div class="mega" id="mega-services"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">SERVICES</span>
            <a href="services.html" target="_top" class="mega-link"><strong>Manual QA Testing</strong><span>Human-driven test cycles for every flow</span></a>
            <a href="services.html" target="_top" class="mega-link"><strong>Automation Testing</strong><span>Selenium, Playwright &amp; Cypress at scale</span></a>
            <a href="services.html" target="_top" class="mega-link"><strong>DevOps Pipeline</strong><span>CI/CD, Docker &amp; Kubernetes</span></a></div>
        <div class="mega-col"><span class="mega-head">SOLUTIONS</span>
            <a href="services.html" target="_top" class="mega-link"><strong>UI/UX Design</strong><span>Clean, intuitive interface design</span></a>
            <a href="services.html" target="_top" class="mega-link"><strong>Cloud Services</strong><span>AWS, GCP &amp; Azure architecture</span></a></div>
        </div><div class="mega-feature"><img src="images/robo2.png" alt="" class="mega-feature-img" />
        <h4>AI-ready QA<br>foundation</h4><p class="mega-feature-sub">Test, build &amp; deploy with confidence.</p>
        <a href="future.html" target="_top" class="mega-feature-btn">Book a Demo</a></div></div></div>

    <div class="mega" id="mega-resources"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">RESOURCES</span>
            <a href="blog.html" target="_top" class="mega-link"><strong>Blog</strong><span>Latest articles &amp; insights</span></a>
            <a href="blog.html" target="_top" class="mega-link"><strong>Case Studies</strong><span>Real-world client results</span></a>
            <a href="blog.html" target="_top" class="mega-link"><strong>Documentation</strong><span>Guides &amp; references</span></a></div>
        <div class="mega-col"><span class="mega-head">SUPPORT</span>
            <a href="ContactUs.html" target="_top" class="mega-link"><strong>Contact Us</strong><span>Talk to our team</span></a>
            <a href="about.html" target="_top" class="mega-link"><strong>About CrossTecch</strong><span>Who we are</span></a></div>
        </div><div class="mega-feature"><img src="images/robok.png" alt="" class="mega-feature-img" />
        <h4>See what's<br>next</h4><p class="mega-feature-sub">A glimpse into CROSSTECCH+.</p>
        <a href="future.html" target="_top" class="mega-feature-btn">See the Future</a></div></div></div>

    <div class="mega" id="mega-product"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">PRODUCTS</span>
            <a href="bug-finder.html" target="_top" class="mega-link"><strong>Bug Finder</strong><span>Detect &amp; resolve issues before production</span></a>
            <a href="blog-engine.html" target="_top" class="mega-link"><strong>Blog Engine</strong><span>Create &amp; publish content fast</span></a></div>
        <div class="mega-col"><span class="mega-head">PLATFORM</span>
            <a href="services.html" target="_top" class="mega-link"><strong>QA Cloud</strong><span>Scalable test infrastructure</span></a>
            <a href="services.html" target="_top" class="mega-link"><strong>Integrations</strong><span>Plug into your CI/CD</span></a></div>
        </div><div class="mega-feature"><img src="images/bugf.png" alt="" class="mega-feature-img" />
        <h4>Build. Test.<br>Deploy.</h4><p class="mega-feature-sub">Everything your team needs.</p>
        <a href="Product.html" target="_top" class="mega-feature-btn">Explore Products</a></div></div></div>

    <div class="mega" id="mega-about"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">COMPANY</span>
            <a href="about.html" target="_top" class="mega-link"><strong>Who We Are</strong><span>Our story &amp; mission</span></a>
            <a href="about.html" target="_top" class="mega-link"><strong>Our Team</strong><span>The people behind CrossTecch</span></a>
            <a href="about.html" target="_top" class="mega-link"><strong>Careers</strong><span>Join us &amp; grow</span></a></div>
        <div class="mega-col"><span class="mega-head">WHY US</span>
            <a href="about.html" target="_top" class="mega-link"><strong>Our Values</strong><span>What drives our work</span></a>
            <a href="services.html" target="_top" class="mega-link"><strong>How We Work</strong><span>Process &amp; approach</span></a></div>
        </div><div class="mega-feature"><img src="images/robo2.png" alt="" class="mega-feature-img" />
        <h4>Built by<br>builders</h4><p class="mega-feature-sub">A team obsessed with quality.</p>
        <a href="about.html" target="_top" class="mega-feature-btn">Meet the Team</a></div></div></div>

    <div class="mega" id="mega-blog"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">LATEST</span>
            <a href="blog.html" target="_top" class="mega-link"><strong>Recent Articles</strong><span>Fresh insights every week</span></a>
            <a href="blog.html" target="_top" class="mega-link"><strong>Testing &amp; QA</strong><span>Tips, tools &amp; best practices</span></a>
            <a href="blog.html" target="_top" class="mega-link"><strong>AI &amp; DevOps</strong><span>Trends shaping the future</span></a></div>
        <div class="mega-col"><span class="mega-head">EXPLORE</span>
            <a href="blog.html" target="_top" class="mega-link"><strong>Case Studies</strong><span>Real client results</span></a>
            <a href="blog.html" target="_top" class="mega-link"><strong>Guides</strong><span>Deep-dive tutorials</span></a></div>
        </div><div class="mega-feature"><img src="images/blogen.png" alt="" class="mega-feature-img" />
        <h4>Read.<br>Learn. Grow.</h4><p class="mega-feature-sub">Insights for modern teams.</p>
        <a href="blog.html" target="_top" class="mega-feature-btn">Visit the Blog</a></div></div></div>

    <div class="mega" id="mega-contact"><div class="mega-inner"><div class="mega-cols">
        <div class="mega-col"><span class="mega-head">GET IN TOUCH</span>
            <a href="ContactUs.html" target="_top" class="mega-link"><strong>Talk to Sales</strong><span>Discuss your project</span></a>
            <a href="ContactUs.html" target="_top" class="mega-link"><strong>Support</strong><span>We're here to help</span></a>
            <a href="future.html" target="_top" class="mega-link"><strong>Book a Demo</strong><span>See CrossTecch in action</span></a></div>
        <div class="mega-col"><span class="mega-head">REACH US</span>
            <a href="ContactUs.html" target="_top" class="mega-link"><strong>Email</strong><span>Drop us a message</span></a>
            <a href="ContactUs.html" target="_top" class="mega-link"><strong>Locations</strong><span>Where to find us</span></a></div>
        </div><div class="mega-feature"><img src="images/robok.png" alt="" class="mega-feature-img" />
        <h4>Let's build<br>together</h4><p class="mega-feature-sub">Start a conversation today.</p>
        <a href="ContactUs.html" target="_top" class="mega-feature-btn">Contact Us</a></div></div></div>

    <div class="navActions">
        <a href="ContactUs.html" target="_top" class="navCta">Get Started &rarr;</a>
        <a href="future.html" target="_top" class="futureBtn">See the Future</a>
    </div>
    <div class="hamburger" aria-label="Menu" role="button" tabindex="0"><span></span><span></span><span></span></div>`;

    var nav = document.createElement('nav');
    nav.className = 'ct-nav';
    nav.innerHTML = html;
    document.body.insertBefore(nav, document.body.firstChild);

    /* ---------- 3) BEHAVIOUR ---------- */
    var hb = nav.querySelector('.hamburger');
    var megaItems = Array.prototype.slice.call(nav.querySelectorAll('.nav-item[data-mega]'));

    function isMobile() { return window.matchMedia('(max-width: 860px)').matches; }

    // mega panel ko apne nav-item ke andar le jao
    megaItems.forEach(function (it) {
        var p = nav.querySelector('#mega-' + it.getAttribute('data-mega'));
        if (p) it.appendChild(p);
    });

    if (hb) hb.addEventListener('click', function () { nav.classList.toggle('open'); });

    function closeMega() {
        megaItems.forEach(function (it) {
            it.classList.remove('active-mega');
            var p = it.querySelector('.mega');
            if (p) p.classList.remove('open');
        });
    }

    // desktop: hover
    megaItems.forEach(function (it) {
        it.addEventListener('mouseenter', function () {
            if (isMobile()) return;
            closeMega();
            var p = it.querySelector('.mega');
            if (p) { p.classList.add('open'); it.classList.add('active-mega'); }
        });
    });
    nav.querySelectorAll('.navLinks li:not(.nav-item)').forEach(function (li) {
        li.addEventListener('mouseenter', function () { if (!isMobile()) closeMega(); });
    });
    nav.addEventListener('mouseleave', function () { if (!isMobile()) closeMega(); });

    // mobile: tap to expand accordion
    megaItems.forEach(function (it) {
        var link = it.querySelector('a');
        if (!link) return;
        link.addEventListener('click', function (e) {
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

    // destination link tap -> menu band
    nav.querySelectorAll('.navLinks li:not(.nav-item) > a, .mega a').forEach(function (a) {
        a.addEventListener('click', function () { nav.classList.remove('open'); closeMega(); });
    });
})();
