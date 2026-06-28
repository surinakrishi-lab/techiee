/* ============================================================
   CROSSTECCH — Shared Dark Mode (universal, synced across pages)
   - Floating sun/moon toggle (bottom-right)
   - Works on any page via smart invert; images/media stay correct
   - State saved in localStorage('ct-theme') -> all pages sync
   - Live sync across open tabs (storage event) + iframes (postMessage)
   - Inside an iframe: NO button, just syncs (one button on the top page)
   ============================================================ */
(function () {
    var KEY = 'ct-theme';
    var inIframe = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();

    function read() {
        try { return localStorage.getItem(KEY) === 'dark'; } catch (e) { return window.__ctDark === true; }
    }
    function save(dark) {
        try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) { window.__ctDark = dark; }
    }

    /* ---------- inject CSS ---------- */
    function injectCss() {
        if (document.getElementById('ctDarkCss')) return;
        var s = document.createElement('style');
        s.id = 'ctDarkCss';
        s.textContent =
            'html.ct-dark{background:#0e0f14!important;filter:invert(1) hue-rotate(180deg);}' +
            /* un-invert media so photos / logos / videos look normal */
            'html.ct-dark img,html.ct-dark video,html.ct-dark canvas,html.ct-dark iframe,' +
            'html.ct-dark [style*="background-image"],html.ct-dark [data-no-invert]{filter:invert(1) hue-rotate(180deg);}' +
            /* keep the floating toggle visually stable */
            'html.ct-dark #ctThemeBtn{filter:invert(1) hue-rotate(180deg);}' +
            /* floating toggle button */
            '#ctThemeBtn{position:fixed;right:20px;bottom:20px;z-index:2147483647;width:50px;height:50px;' +
            'border-radius:50%;border:1px solid rgba(0,0,0,.12);background:#ffffff;color:#1a1a2e;' +
            'font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
            'box-shadow:0 8px 22px rgba(20,20,50,.22);transition:transform .2s ease,box-shadow .2s ease;}' +
            '#ctThemeBtn:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 12px 28px rgba(20,20,50,.3);}' +
            '@media (max-width:600px){#ctThemeBtn{width:44px;height:44px;font-size:19px;right:14px;bottom:14px;}}';
        (document.head || document.documentElement).appendChild(s);
    }

    var btn = null;
    function setIcon(dark) { if (btn) btn.textContent = dark ? '☀️' : '🌙'; } // ☀️ / 🌙

    function apply(dark) {
        document.documentElement.classList.toggle('ct-dark', dark);
        setIcon(dark);
    }

    /* push state down into child iframes and up to parent */
    function propagate(dark) {
        var msg = { ctTheme: dark ? 'dark' : 'light' };
        try {
            var ifr = document.querySelectorAll('iframe');
            for (var i = 0; i < ifr.length; i++) {
                if (ifr[i].contentWindow) ifr[i].contentWindow.postMessage(msg, '*');
            }
        } catch (e) {}
        try { if (inIframe && window.parent) window.parent.postMessage(msg, '*'); } catch (e) {}
    }

    function setTheme(dark, fromRemote) {
        save(dark);
        apply(dark);
        if (!fromRemote) propagate(dark);
    }

    // expose a global so page headers can hook into it
    window.ctToggleTheme = function () { setTheme(!read()); };
    window.ctSetTheme = function (d) { setTheme(!!d); };

    /* ---------- listeners ---------- */
    window.addEventListener('storage', function (e) {
        if (e.key === KEY) apply(read());
    });
    window.addEventListener('message', function (e) {
        if (e.data && e.data.ctTheme) {
            var dark = e.data.ctTheme === 'dark';
            save(dark);
            apply(dark);
            propagate(dark); // relay to own iframes / parent
        }
    });

    /* ---------- smooth scrolling + mobile jank fix (all pages) ---------- */
    function injectSmooth() {
        if (document.getElementById('ctSmoothCss')) return;
        var s = document.createElement('style');
        s.id = 'ctSmoothCss';
        s.textContent =
            'html { scroll-behavior: smooth; }' +
            /* fixed backgrounds = laggy scroll on phones -> make them scroll normally */
            '@media (max-width: 860px) { * { background-attachment: scroll !important; } }';
        (document.head || document.documentElement).appendChild(s);
    }

    /* ---------- init ---------- */
    function init() {
        injectSmooth();
        injectCss();
        if (!inIframe) {
            btn = document.createElement('button');
            btn.id = 'ctThemeBtn';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Toggle dark mode');
            btn.onclick = function () { setTheme(!read()); };
            document.body.appendChild(btn);
        }
        apply(read());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
