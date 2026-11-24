
/* ===== Haptic tap feedback (Android; iOS browsers ignore vibrate) ===== */
(() => {
    if (!('vibrate' in navigator) || !matchMedia('(pointer: coarse)').matches) return;
    let last = 0;
    window.FRHaptic = (ms = 8) => { const n = Date.now(); if (n - last < 60) return; last = n; try { navigator.vibrate(ms); } catch (e) {} };
    document.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        if (e.target.closest('button, a, [role="button"], .chip, .hl-chip, .hl-plat, .fifi-chip, .tab, label, summary, input[type="checkbox"], input[type="radio"]')) window.FRHaptic(8);
    }, { passive: true, capture: true });
})();

/* ===== Swipe helper for lightboxes: drag left/right to change, drag down to close ===== */
window.FRSwipe = function (area, img, h) {
    if (!area || area._frSwipe) return; area._frSwipe = true;
    let x0 = 0, y0 = 0, dx = 0, dy = 0, on = false, axis = '';
    const set = (t, o, anim) => { if (!img) return; img.style.transition = anim ? 'transform .25s ease, opacity .25s ease' : 'none'; img.style.transform = t; img.style.opacity = o; };
    area.addEventListener('touchstart', (e) => { if (e.touches.length > 1) return; on = true; axis = ''; dx = dy = 0; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    area.addEventListener('touchmove', (e) => {
        if (!on) return;
        dx = e.touches[0].clientX - x0; dy = e.touches[0].clientY - y0;
        if (!axis && Math.hypot(dx, dy) > 8) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis === 'x') set(`translateX(${dx}px) rotate(${dx / 40}deg)`, 1 - Math.min(Math.abs(dx) / 600, .35));
        else if (axis === 'y' && dy > 0) set(`translateY(${dy}px) scale(${1 - Math.min(dy / 1200, .15)})`, 1 - Math.min(dy / 400, .6));
    }, { passive: true });
    area.addEventListener('touchend', () => {
        if (!on) return; on = false;
        const W = innerWidth * 0.18;
        if (axis === 'x' && Math.abs(dx) > Math.min(W, 70)) {
            const dir = dx < 0 ? 1 : -1;
            set(`translateX(${-dir * innerWidth}px)`, 0, true);
            window.FRHaptic && window.FRHaptic(10);
            setTimeout(() => { dir > 0 ? h.next() : h.prev(); set(`translateX(${dir * 60}px)`, 0, false); requestAnimationFrame(() => requestAnimationFrame(() => set('', '', true))); }, 180);
        } else if (axis === 'y' && dy > 110 && h.close) {
            window.FRHaptic && window.FRHaptic(10);
            set(`translateY(${innerHeight}px)`, 0, true);
            setTimeout(() => { h.close(); set('', '', false); }, 200);
        } else set('', '', true);
    }, { passive: true });
};

/* ===== Blog image viewer: tap an article image to open, swipe between them ===== */
document.addEventListener('DOMContentLoaded', () => {
    if (!/^\/blog\/./.test(location.pathname)) return;
    const imgs = [...document.querySelectorAll('main img, article img, .layout-wrapper img')]
        .filter(i => !i.closest('a, .keep-reading, .site-footer, nav, #chatModal, .chat-bot-btn') && i.naturalWidth !== 1);
    if (!imgs.length) return;
    const st = document.createElement('style');
    st.textContent = `.frv{position:fixed;inset:0;z-index:10050;background:rgba(2,6,23,.94);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s;touch-action:none}
.frv.on{opacity:1;visibility:visible}.frv img{max-width:94vw;max-height:84vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.5);user-select:none;-webkit-user-drag:none}
.frv button{position:absolute;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:#fff;border-radius:50%;width:46px;height:46px;font-size:1.3rem;cursor:pointer}
.frv .x{top:16px;right:16px}.frv .pv{left:16px;top:50%;transform:translateY(-50%)}.frv .nx{right:16px;top:50%;transform:translateY(-50%)}
.frv .ct{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);color:#cbd5e1;font:600 13px 'DM Sans',sans-serif;background:rgba(255,255,255,.08);padding:6px 14px;border-radius:100px}
.frv-zoom{cursor:zoom-in}@media(max-width:768px){.frv .pv,.frv .nx{display:none}}`;
    document.head.appendChild(st);
    const v = document.createElement('div'); v.className = 'frv'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-label', 'Image viewer');
    v.innerHTML = '<img alt=""><button class="x" aria-label="Close">✕</button><button class="pv" aria-label="Previous">‹</button><button class="nx" aria-label="Next">›</button><div class="ct"></div>';
    document.body.appendChild(v);
    const vi = v.querySelector('img'), ct = v.querySelector('.ct'); let idx = 0;
    const show = (i) => { idx = (i + imgs.length) % imgs.length; vi.src = imgs[idx].currentSrc || imgs[idx].src; vi.alt = imgs[idx].alt || ''; ct.textContent = imgs.length > 1 ? `${idx + 1} / ${imgs.length}` : 'Swipe down to close'; };
    const open = (i) => { show(i); v.classList.add('on'); document.body.style.overflow = 'hidden'; };
    const close = () => { v.classList.remove('on'); document.body.style.overflow = ''; };
    imgs.forEach((im, i) => { im.classList.add('frv-zoom'); im.addEventListener('click', () => open(i)); });
    if (imgs.length < 2) v.querySelectorAll('.pv,.nx').forEach(b => b.remove());
    v.querySelector('.x').onclick = close;
    v.querySelector('.pv') && (v.querySelector('.pv').onclick = (e) => { e.stopPropagation(); show(idx - 1); });
    v.querySelector('.nx') && (v.querySelector('.nx').onclick = (e) => { e.stopPropagation(); show(idx + 1); });
    v.addEventListener('click', (e) => { if (e.target === v) close(); });
    document.addEventListener('keydown', (e) => { if (!v.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
    window.FRSwipe(v, vi, { next: () => show(idx + 1), prev: () => show(idx - 1), close });
});
document.addEventListener('DOMContentLoaded', () => {
    // PRELOADER: "FRKR" assembles from pixels with a scanner box, % counter + bar (~1.5s)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const MIN_MS = 1500, MAX_MS = 3500, t0 = performance.now();
        let pageLoaded = document.readyState === 'complete', hidden = false;
        const hide = () => { if (hidden) return; hidden = true; preloader.classList.add('hide'); setTimeout(() => preloader.remove(), 900); };
        const tryHide = () => { if (pageLoaded && performance.now() - t0 >= MIN_MS) hide(); };
        window.addEventListener('load', () => { pageLoaded = true; tryHide(); });
        setTimeout(hide, MAX_MS);

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        preloader.innerHTML = `
            <div class="pl-stage">
                <canvas class="pl-canvas" aria-hidden="true"></canvas>
                <div class="pl-text">FR<span class="gradient-text">KR</span></div>
                <div class="pl-meta"><span class="pl-label">Loading portfolio</span><span class="pl-pct">0%</span></div>
                <div class="pl-bar"><i></i></div>
            </div>`;
        const cv = preloader.querySelector('.pl-canvas'), g = cv.getContext('2d');
        const pctEl = preloader.querySelector('.pl-pct'), barEl = preloader.querySelector('.pl-bar i');
        const W = Math.round(Math.min(window.innerWidth * 0.86, 520)), H = Math.round(W * 0.42), dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
        g.setTransform(dpr, 0, 0, dpr, 0, 0);

        const start = () => {
            // sample the word into particles
            const off = document.createElement('canvas'); off.width = W; off.height = H;
            const o = off.getContext('2d');
            // fit the word inside the canvas (Syne is wide, so shrink on narrow phones)
            let fs = H * 0.78;
            o.font = `800 ${fs}px Syne, "DM Sans", Arial, sans-serif`;
            const fit = (W * 0.9) / o.measureText('FRKR').width;
            if (fit < 1) fs *= fit;
            o.font = `800 ${fs}px Syne, "DM Sans", Arial, sans-serif`; o.textAlign = 'center'; o.textBaseline = 'middle';
            o.fillText('FRKR', W / 2, H / 2 + fs * 0.04);
            const tw = o.measureText('FRKR').width, left = W / 2 - tw / 2;
            const data = o.getImageData(0, 0, W, H).data, step = Math.max(3, Math.round(W / 140));
            const P = [];
            for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) {
                if (data[(y * W + x) * 4 + 3] > 128) {
                    const a = Math.random() * Math.PI * 2, r = W * (0.35 + Math.random() * 0.5);
                    P.push({ tx: x, ty: y, sx: W / 2 + Math.cos(a) * r, sy: H / 2 + Math.sin(a) * r * 0.6, d: ((x - left) / tw) * 0.45 + Math.random() * 0.12 });
                }
            }
            const grad = g.createLinearGradient(left, 0, left + tw, 0);
            grad.addColorStop(0, '#60A5FA'); grad.addColorStop(0.5, '#A78BFA'); grad.addColorStop(1, '#F472B6');
            const ease = (k) => 1 - Math.pow(1 - k, 3);
            const DUR = 1.25;
            const frame = (now) => {
                if (hidden) return;
                const t = (now - t0) / 1000;
                g.clearRect(0, 0, W, H);
                // particles
                g.fillStyle = grad;
                let settled = 0;
                for (const p of P) {
                    const k = Math.min(1, Math.max(0, (t - p.d) / 0.55));
                    const e = ease(k);
                    if (k >= 1) settled++;
                    const x = p.sx + (p.tx - p.sx) * e, y = p.sy + (p.ty - p.sy) * e;
                    const s = step * (0.45 + 0.5 * e);
                    g.globalAlpha = 0.25 + 0.75 * e;
                    g.fillRect(x - s / 2, y - s / 2, s, s);
                }
                g.globalAlpha = 1;
                // scanner box sweeping across the letters
                const sk = Math.min(1, t / DUR);
                if (sk < 1) {
                    const bx = left - 10 + (tw + 20) * ease(sk), bw = Math.max(26, tw * 0.16), bh = fs * 0.92, by = H / 2 - bh / 2;
                    g.strokeStyle = 'rgba(167,139,250,.9)'; g.lineWidth = 1.2; g.setLineDash([4, 4]);
                    g.strokeRect(bx - bw / 2, by, bw, bh); g.setLineDash([]);
                    g.fillStyle = '#C4B5FD';
                    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => g.fillRect(bx + sx * bw / 2 - 3, H / 2 + sy * bh / 2 - 3, 6, 6));
                    g.font = '600 10px "DM Sans", monospace'; g.textAlign = 'left';
                    g.fillText(`${Math.round(bx)} × ${Math.round(by)}`, bx - bw / 2, by - 8);
                    g.fillStyle = 'rgba(96,165,250,.18)'; g.fillRect(bx - bw / 2, by, bw, bh);
                }
                // percent: time-based, waits at 96% until the page has loaded
                const raw = Math.min(1, (now - t0) / MIN_MS);
                const pct = Math.round(pageLoaded ? raw * 100 : Math.min(96, raw * 100));
                pctEl.textContent = pct + '%'; barEl.style.width = pct + '%';
                if (settled === P.length && t > DUR) preloader.classList.add('pl-done');
                if (pct >= 100) tryHide();
                requestAnimationFrame(frame);
            };
            requestAnimationFrame(frame);
        };
        if (reduce) {
            preloader.classList.add('pl-static');
            const tick = () => { const p = Math.min(100, Math.round((performance.now() - t0) / MIN_MS * 100)); pctEl.textContent = p + '%'; barEl.style.width = p + '%'; if (p >= 100) tryHide(); else if (!hidden) requestAnimationFrame(tick); };
            requestAnimationFrame(tick);
        } else {
            const fontReady = document.fonts && document.fonts.load ? document.fonts.load('800 80px Syne') : Promise.resolve();
            Promise.race([fontReady, new Promise(r => setTimeout(r, 250))]).then(start, start);
        }
    }

    /* =========================================
       0. GLOBAL COMPONENT INJECTOR (Nav & Footer)
    ========================================= */
    const globalNav = document.querySelector('.top-nav');
    const globalFooter = document.querySelector('.site-footer');

    const navHTML = `
    <a href="/" class="nav-brand">FR<span class="gradient-text">KR</span></a>
    <div class="nav-menu">
        <span class="nav-ind" aria-hidden="true"></span>
        <a href="/">Home</a>
        <a href="/gallery">Gallery</a>
        <a href="/blog">Blog</a>
        <a href="/resources">Resources</a>
        <a href="/certificates">Certificates</a>
        <a href="/volunteer">Leadership</a>
        <a href="/resume">Resume</a>
        <a href="/projects">Projects</a>
        <a href="/contact">Contact</a>
    </div>
    <div class="nav-actions">
        <a href="/contact" class="btn btn-primary">Let's Talk</a>
      <button id="themeToggle" class="theme-toggle-track" aria-label="Toggle Dark Mode">
            <span class="theme-text text-dark">Dark</span>
            <span class="theme-text text-light">Light</span>
            <div class="theme-liquid-bubble">
                <svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </div>
        </button>
        <button class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false" aria-controls="navDrawer">
            <span></span><span></span><span></span>
        </button>
    </div>
    <div class="nav-drawer" id="navDrawer">
        <div class="nav-drawer-inner">
            <div class="nav-drawer-links">
<a href="/"><small>01</small>Home</a>
                <a href="/gallery"><small>02</small>Gallery</a>
                <a href="/blog"><small>03</small>Blog</a>
                <a href="/resources"><small>04</small>Resources</a>
                <a href="/certificates"><small>05</small>Certificates</a>
                <a href="/volunteer"><small>06</small>Leadership</a>
                <a href="/resume"><small>07</small>Resume</a>
                <a href="/projects"><small>08</small>Projects</a>
                <a href="/contact"><small>09</small>Contact</a>
            </div>
            <a href="/contact" class="nav-drawer-cta">Let's Talk <span>→</span></a>
        </div>
    </div>`;

    const footerHTML = `
    <div class="footer-glow"></div>
    <div class="ft-watermark" aria-hidden="true">FRKR</div>
    <div class="footer-grid ft-grid">
        <div class="footer-col ft-brand">
            <h2 class="ft-name">Fardin Rahman<br><span class="gradient-text">Khan Raafi</span></h2>
            <p class="ft-tag">Marketing professional passionate about brand communication, creative strategies, and growth leadership.</p>
            <div class="ft-status">
                <span class="ft-pill"><span class="ft-dot"></span>Open to opportunities</span>
                <span class="ft-pill ft-time">🕒 <span id="ftClock">--:--</span> in Dhaka</span>
            </div>
            <div class="ft-cta">
                <div>
                    <strong>Have a project in mind?</strong>
                    <span>Let's build something people remember.</span>
                </div>
                <a href="/contact" class="ft-cta-btn">Let's talk <span>→</span></a>
            </div>
            <div class="ft-socials">
                <a href="https://www.linkedin.com/in/fardinraafi" target="_blank" rel="noopener" aria-label="LinkedIn" data-tip="LinkedIn"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
                <a href="https://x.com/fardin_raafi" target="_blank" rel="noopener" aria-label="X" data-tip="X"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://www.instagram.com/fardin_raafi" target="_blank" rel="noopener" aria-label="Instagram" data-tip="Instagram"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
                <a href="https://www.facebook.com/raafi.khan.7545" target="_blank" rel="noopener" aria-label="Facebook" data-tip="Facebook"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                <a href="https://www.threads.com/@fardin_raafi" target="_blank" rel="noopener" aria-label="Threads" data-tip="Threads"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 8.5C16.6 5.9 14.6 4.5 12 4.5c-4 0-6.5 3-6.5 7.5s2.5 7.5 6.5 7.5c3.3 0 5.5-1.8 5.5-4.4 0-2.4-2-3.9-5-3.9-2 0-3.5 1-3.5 2.5 0 1.3 1.1 2.2 2.6 2.2 2.4 0 3.6-1.8 3.6-5"/></svg></a>
                <a href="https://github.com/fardinraafi" target="_blank" rel="noopener" aria-label="GitHub" data-tip="GitHub"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
                <a href="https://www.behance.net/fardinraafi" target="_blank" rel="noopener" aria-label="Behance" data-tip="Behance"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7h-7v2h7V7zm1.72 5.38c-.18-1.54-1.5-3.38-4.22-3.38-3.08 0-4.5 2.5-4.5 5.25 0 2.94 1.7 5.75 5 5.75 3.26 0 4.38-2.3 4.54-3.62h-2.12c-.12.82-.76 1.75-2.32 1.75-1.58 0-2.34-1.12-2.48-2.62h6.98c.04-.46.16-2.18.12-3.13zM17.48 11.5c.08-1.02.76-1.88 2.02-1.88 1.14 0 1.94.76 2.06 1.88h-4.08zM10.12 11c1.24-.46 2.22-1.42 2.22-3.3 0-2.42-1.92-3.7-4.66-3.7H0v16h8.04c2.8 0 4.96-1.34 4.96-4.06 0-2.3-1.68-3.72-2.88-4.94zM2.84 6.22h4.52c1.46 0 2.34.6 2.34 1.88 0 1.34-.84 2.02-2.38 2.02H2.84V6.22zm4.84 9.56H2.84v-4.14h4.74c1.64 0 2.68.74 2.68 2.14 0 1.48-1.12 2-2.58 2z"/></svg></a>
                <a href="https://www.pinterest.com/fardin_raafi/" target="_blank" rel="noopener" aria-label="Pinterest" data-tip="Pinterest"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.63 7.85 6.35 9.31-.09-.79-.16-2.01.03-2.87l1.18-4.52s-.31-.62-.31-1.53c0-1.43.83-2.5 1.86-2.5.86 0 1.27.65 1.27 1.43 0 .86-.55 2.15-.83 3.35-.24 1.01.5 1.83 1.49 1.83 1.79 0 3.17-1.89 3.17-4.6 0-2.4-1.73-4.08-4.22-4.08-3 0-4.76 2.25-4.76 4.58 0 .86.33 1.78.74 2.28.08.1.09.19.06.29l-.32 1.32c-.05.21-.18.25-.4.15-1.49-.69-2.42-2.88-2.42-4.63 0-3.75 2.73-7.2 7.91-7.2 4.16 0 7.39 2.97 7.39 6.94 0 4.14-2.61 7.48-6.24 7.48-1.22 0-2.37-.63-2.76-1.38l-.75 2.87c-.27 1.04-1.01 2.34-1.5 3.13 1.11.34 2.29.53 3.52.53 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg></a>
            </div>
        </div>
        <div class="footer-col ft-nav">
            <h4>Explore</h4>
            <div class="ft-links">
                <a href="/">Home</a>
                <a href="/gallery">Gallery</a>
                <a href="/blog">Blog</a>
                <a href="/resources">Resources</a>
                <a href="/certificates">Certificates</a>
                <a href="/volunteer">Leadership</a>
                <a href="/resume">Resume</a>
                <a href="/projects">Projects</a>
                <a href="/contact">Contact</a>
            </div>
        </div>
        <div class="footer-col ft-contact">
            <h4>Get in touch</h4>
            <button type="button" class="ft-mail" id="ftMail" aria-label="Copy email address">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span class="ft-mail-text">fardinraafi@gmail.com</span>
                <span class="ft-mail-hint">Copy</span>
            </button>
            <p class="ft-loc">📍 Dhaka, Bangladesh · GMT+6</p>
            <a href="/Fardin_Resume.pdf" download="Fardin_Rahman_Khan_Raafi_Resume.pdf" class="ft-resume">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resume
            </a>
        </div>
    </div>
    <div class="copyright ft-bottom">
        <span>© <span id="current-year"></span> Fardin Rahman Khan Raafi. Built for Humans &amp; AI.</span>
        <a href="#top" class="ft-top" id="ftTop">Back to top ↑</a>
    </div>`;
    if (globalNav) {
        globalNav.innerHTML = navHTML;
        // Normalise "/gallery.html", "/gallery/", "/index.html" → "/gallery", "/"; blog posts count as "Blog"
        let current = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1') || '/';
        if (current.startsWith('/blog/')) current = '/blog';
        if (current.startsWith('/projects')) current = '/projects';
        if (current.startsWith('/human-content') || current.startsWith('/self-training')) current = '/resources';
        globalNav.querySelectorAll('.nav-menu a, .nav-drawer-links a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === current);
        });
    }

    if (globalNav) {
        // Sliding pill indicator (desktop)
        const menu = globalNav.querySelector('.nav-menu');
        const ind = globalNav.querySelector('.nav-ind');
        const moveInd = (el) => {
            if (!el) { ind.style.opacity = '0'; return; }
            ind.style.opacity = '1';
            ind.style.width = el.offsetWidth + 'px';
            ind.style.transform = `translateX(${el.offsetLeft}px)`;
        };
        const activeLink = () => menu.querySelector('a.active');
        requestAnimationFrame(() => { ind.classList.add('no-anim'); moveInd(activeLink()); requestAnimationFrame(() => ind.classList.remove('no-anim')); });
        menu.querySelectorAll('a').forEach(a => a.addEventListener('mouseenter', () => moveInd(a)));
        menu.addEventListener('mouseleave', () => moveInd(activeLink()));
        window.addEventListener('resize', () => moveInd(activeLink()));
        if (document.fonts) document.fonts.ready.then(() => moveInd(activeLink()));

        // Mobile drawer
        const burger = document.getElementById('navBurger');
        const setMenu = (open) => {
            globalNav.classList.toggle('menu-open', open);
            burger.setAttribute('aria-expanded', open);
            burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };
        burger.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!globalNav.classList.contains('menu-open')); });
        document.addEventListener('click', (e) => { if (globalNav.classList.contains('menu-open') && !globalNav.contains(e.target)) setMenu(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
        globalNav.querySelectorAll('.nav-drawer a').forEach(a => a.addEventListener('click', () => setMenu(false)));

        // Scrolled state + hide on scroll down
        let lastY = window.scrollY;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            globalNav.classList.toggle('scrolled', y > 20);
            if (!globalNav.classList.contains('menu-open')) globalNav.classList.toggle('nav-hidden', y > lastY && y > 300);
            lastY = y;
        }, { passive: true });
    }

    if (globalFooter) globalFooter.innerHTML = footerHTML;
    if (globalFooter) {
        const ftClock = document.getElementById('ftClock');
        const tickFt = () => { if (ftClock) ftClock.textContent = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', minute: '2-digit' }); };
        tickFt(); setInterval(tickFt, 30000);
        const ftMail = document.getElementById('ftMail');
        if (ftMail) ftMail.addEventListener('click', () => {
            const hint = ftMail.querySelector('.ft-mail-hint');
            const done = () => { hint.textContent = 'Copied ✓'; ftMail.classList.add('copied'); setTimeout(() => { hint.textContent = 'Copy'; ftMail.classList.remove('copied'); }, 2000); };
            if (navigator.clipboard) navigator.clipboard.writeText('fardinraafi@gmail.com').then(done, () => { window.location.href = 'mailto:fardinraafi@gmail.com'; });
            else window.location.href = 'mailto:fardinraafi@gmail.com';
        });
        const ftTop = document.getElementById('ftTop');
        if (ftTop) ftTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    /* =========================================
       CUSTOM DYNAMIC FAVICON
    ========================================= */
    if (!document.querySelector('link[rel~="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='#7C3AED'/><text x='50' y='72' font-family='sans-serif' font-size='55' font-weight='900' text-anchor='middle' fill='white'>FR</text></svg>`;
    favicon.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgIcon);
    document.head.appendChild(favicon);
    }

    /* =========================================
       1. THEME TOGGLE LOGIC
    ========================================= */
    const themeBtn = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'light') document.body.classList.remove('dark-mode');
    else { document.body.classList.add('dark-mode'); localStorage.setItem('theme', 'dark'); }
    
    if (themeBtn) {
        const applyTheme = () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        };
        themeBtn.addEventListener('click', () => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!document.startViewTransition || reduce) {
                document.documentElement.classList.add('theme-switching');
                applyTheme();
                setTimeout(() => document.documentElement.classList.remove('theme-switching'), 50);
                return;
            }
            const r = themeBtn.getBoundingClientRect();
            const x = r.left + r.width / 2, y = r.top + r.height / 2;
            const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
            document.documentElement.classList.add('theme-switching');
            const t = document.startViewTransition(applyTheme);
            t.ready.then(() => {
                document.documentElement.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                    { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
                );
            }).catch(() => {});
            t.finished.finally(() => document.documentElement.classList.remove('theme-switching'));
        });
    }

    /* =========================================
       2. CURRENT YEAR UPDATER
    ========================================= */
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    /* =========================================
       3. TYPEWRITER EFFECT
    ========================================= */
    const twText = document.getElementById('tw-text');
    if (twText) {
        const words = ['Marketing Specialist', 'Content Architect', 'Growth Associate', 'B2B Strategist', 'Branding Expert', 'ALP 2026 Fellow', 'SaaS Marketer', 'RevOps Certified', 'B2B Sales Expert', 'Lead Gen Specialist', 'LinkedIn Strategist'];
        let i = 0, j = 0, isDeleting = false;
        function type() {
            const currentWord = words[i];
            twText.textContent = currentWord.substring(0, isDeleting ? j - 1 : j + 1); 
            isDeleting ? j-- : j++;
            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && j === currentWord.length) { typeSpeed = 2000; isDeleting = true; } 
            else if (isDeleting && j === 0) { isDeleting = false; i = (i + 1) % words.length; typeSpeed = 500; }
            setTimeout(type, typeSpeed);
        }
        type();
    }
    /* =========================================
       5. SCROLL REVEAL ANIMATIONS
    ========================================= */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    /* =========================================
       6. SCROLL TO TOP BUTTON
    ========================================= */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => { scrollTopBtn.classList.toggle('show', window.scrollY > 400); }, { passive: true });
        scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

 /* =========================================
       7. DYNAMIC CERTIFICATES GENERATOR
    ========================================= */
    const certGrid = document.getElementById('cert-grid');
    if (certGrid) {
        // 58 certificates: small WebP thumbnails in the grid (lazy-loaded), full-size WebP opens in the lightbox
        const CERT_DIMS = [[640,465],[640,456],[450,640],[451,640],[454,640],[640,400],[640,451],[640,469],[640,489],[640,459],[455,640],[640,452],[640,453],[640,494],[640,362],[640,448],[435,640],[640,453],[640,452],[640,452],[640,452],[640,452],[512,512],[640,525],[640,452],[640,452],[640,453],[640,453],[640,452],[640,452],[640,406],[640,481],[640,455],[640,454],[640,452],[640,444],[640,452],[640,457],[640,457],[640,470],[640,455],[640,494],[640,452],[640,452],[640,451],[640,361],[640,360],[640,502],[640,453],[640,360],[640,361],[640,452],[640,453],[640,453],[640,361],[640,361],[640,453],[640,361]]; // thumbnail width/height, keeps the layout from jumping while images load
        let certNumbers = Array.from({length: 58}, (_, i) => i + 1);
        certNumbers.sort(() => Math.random() - 0.5);
        let certsHTML = '';
        certNumbers.forEach((c, i) => {
            const [w, h] = CERT_DIMS[c - 1];
            certsHTML += `<img src="/certs/thumb/cert-${c}.webp" data-full="/certs/cert-${c}.webp" width="${w}" height="${h}" class="cert-img" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async" style="cursor: zoom-in;" alt="Fardin Rahman Khan Raafi, Marketing Executive - Professional Certificate ${c}">`;
        });
        certGrid.innerHTML = certsHTML;
    }

   /* =========================================
       8. GLOBAL LIGHTBOX (For Certificates & Volunteer pages)
    ========================================= */
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');

    // Only run this if we are NOT on the gallery page (gallery has its own custom script)
    const isGalleryPage = /\/gallery(\.html)?\/?$/.test(window.location.pathname);
    if (lightbox && lightboxImg && !isGalleryPage) {
        let currentImageIndex = 0;
        let imageArray = [];

        const initializeLightbox = () => {
            // Target certificates and volunteer images specifically
            const images = document.querySelectorAll('.cert-img, .vol-card .grid-img');
            if (images.length > 0) {
                imageArray = Array.from(images).map(img => img.dataset.full || img.currentSrc || img.src);
                images.forEach((img, index) => {
                    img.style.cursor = 'zoom-in';
                    img.onclick = null; // Clear any old handlers
                    img.addEventListener('click', (e) => {
                        e.preventDefault();
                        currentImageIndex = index;
                        lightboxImg.src = imageArray[currentImageIndex];
                        lightbox.classList.add('show');
                        document.body.style.overflow = 'hidden';
                    });
                });
            }
        };

        // Initialize immediately, and again after a short delay (to catch the dynamic certs)
        initializeLightbox();
        setTimeout(initializeLightbox, 300);

        // Global functions called by your HTML buttons (X, <, >)
        window.closeLightbox = function() {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        };

        window.changeImage = function(step, event) {
            if (event) event.stopPropagation();
            currentImageIndex += step;
            if (currentImageIndex < 0) currentImageIndex = imageArray.length - 1;
            if (currentImageIndex >= imageArray.length) currentImageIndex = 0;
            lightboxImg.src = imageArray[currentImageIndex];
        };

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                window.closeLightbox();
            }
        });

        // Touch swipe: image follows the finger, swipe down to close
        window.FRSwipe && window.FRSwipe(lightbox, lightboxImg, { next: () => window.changeImage(1), prev: () => window.changeImage(-1), close: () => window.closeLightbox() });

        // Keyboard arrow support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') window.closeLightbox();
            if (e.key === 'ArrowRight') window.changeImage(1);
            if (e.key === 'ArrowLeft') window.changeImage(-1);
        });
    }
    /* =========================================
       9. SMOOTH PAGE TRANSITIONS
    ========================================= */
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href.startsWith('#') || e.defaultPrevented) return;
            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            if (this.hostname === window.location.hostname && this.target !== '_blank' && !this.hasAttribute('download')) {
                e.preventDefault(); 
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = this.href; }, 300);
            }
        });
    });
    window.addEventListener('pageshow', (event) => { if (event.persisted) document.body.classList.remove('fade-out'); });

    /* =========================================
       10. PLAYBOOK LOGIC
    ========================================= */
    const playbookForm = document.getElementById('playbook-form');
    if (playbookForm) {
        playbookForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const submitBtn = playbookForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const emailInput = playbookForm.querySelector('input[name="email"]').value;
            
            submitBtn.innerHTML = 'Opening...';
            window.open('/misc_files/Marketing_Playbook.pdf', '_blank');
            
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcwqAKQ8S_LzdlYhTRQUw73dQGU8o_T0KfSHKPKYN6lY-V9n_jdxxGFoCLkHWfWRE0VA/exec'; 
            
                const formData = new FormData();
            formData.append('email', emailInput);
            formData.append('date', new Date().toLocaleString());

            fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData })
            .then(() => { submitBtn.innerHTML = 'Success!'; setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000); })
            .catch(error => { console.error(error); submitBtn.innerHTML = 'Success!'; setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000); });
        });
    }

    /* =========================================
       11. MICRO-INTERACTIONS
    ========================================= */
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (height > 0 ? (winScroll / height) * 100 : 0) + '%';
    }, { passive: true });

    document.querySelectorAll('.glass-card:not(.no-hover), .blog-card, .collage-item, .cert-img, .info-card, .stat-box, .highlight-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top; 
            card.style.setProperty('--mouse-x', `${x}px`); card.style.setProperty('--mouse-y', `${y}px`);
            
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4; 
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.transition = 'none'; 
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.transition = 'all 0.4s ease'; });
    });
/* --- Footer Spotlight Tracking (Global Proximity) --- */
    const siteFooter = document.querySelector('.site-footer');
    if (siteFooter) {
        // Listen to the whole window, not just the footer frame!
        let footerVisible = false;
        new IntersectionObserver(([en]) => { footerVisible = en.isIntersecting; }, { rootMargin: '300px' }).observe(siteFooter);
        window.addEventListener('mousemove', (e) => {
            if (!footerVisible) return;
            const rect = siteFooter.getBoundingClientRect();
            siteFooter.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            siteFooter.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
        // We completely removed the 'mouseleave' event so it never abruptly turns off!
    }
    /* =========================================
       12. DYNAMIC LIVE STATUS WIDGET
    ========================================= */
    const statusWidget = document.getElementById('liveStatusBtn');
    const statusTextEl = document.getElementById('live-status-text');
    
    if (statusWidget && statusTextEl) {
        const statusMessages = ["Open to new B2B projects", "📍 Based in Dhaka, Bangladesh", "🤳 Doom-scrolling on Instagram", "🎧 Listening to: My First Million", "⚔ Attacking in Clash of Clans", "📚 Reading: Hacking Growth", "⚡ Optimizing conversion rates...", "✍ Posting daily on linkedin..", "☕ Powered by a good cup of coffee"];
        let statusIndex = 0, isHovered = false, isClicked = false;

        statusWidget.addEventListener('mouseenter', () => isHovered = true);
        statusWidget.addEventListener('mouseleave', () => isHovered = false);

        setInterval(() => {
            if (!isHovered && !isClicked) {
                statusTextEl.style.opacity = '0'; statusTextEl.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    statusIndex = (statusIndex + 1) % statusMessages.length;
                    statusTextEl.textContent = statusMessages[statusIndex];
                    statusTextEl.style.transform = 'translateY(10px)';
                    requestAnimationFrame(() => { statusTextEl.style.opacity = '1'; statusTextEl.style.transform = 'translateY(0)'; });
                }, 400); 
            }
        }, 4000);

        statusWidget.addEventListener('click', () => {
            isClicked = true;
            navigator.clipboard.writeText("fardinraafi@gmail.com").then(() => {
                statusTextEl.style.opacity = '0';
                setTimeout(() => { statusTextEl.textContent = "Copied email to clipboard! 📋"; statusTextEl.style.color = "#10B981"; statusTextEl.style.opacity = '1'; }, 200);
                setTimeout(() => {
                    statusTextEl.style.opacity = '0';
                    setTimeout(() => { statusTextEl.style.color = "var(--text-main)"; statusTextEl.textContent = statusMessages[statusIndex]; statusTextEl.style.opacity = '1'; isClicked = false; }, 200);
                }, 3000);
            });
        });
    }

    /* =========================================
       13. CONTACT FORM SUBMISSION
    ========================================= */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            
            fetch('https://api.web3forms.com/submit', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
            })
            .then(async (response) => {
                if (response.status === 200) window.location.href = '/message-sent';
                else { submitBtn.innerHTML = 'Error. Try Again.'; setTimeout(() => { submitBtn.innerHTML = originalText; }, 3000); }
            }).catch(error => { console.log(error); submitBtn.innerHTML = 'Network Error.'; setTimeout(() => { submitBtn.innerHTML = originalText; }, 3000); });
        });
    }

    /* =========================================
       14. FLOATING GLASS PARALLAX
    ========================================= */
    const glassIcons = document.querySelectorAll('.floating-glass');
    if (glassIcons.length > 0) {
        glassIcons.forEach(icon => icon.style.transform = `translate3d(0, 0px, 0) rotate(${icon.getAttribute('data-rot') || '0'}deg)`);
        window.addEventListener('scroll', () => {
            glassIcons.forEach((icon, index) => icon.style.transform = `translate3d(0, -${window.scrollY * ((index + 1) * 0.12)}px, 0) rotate(${icon.getAttribute('data-rot') || '0'}deg)`);
        }, { passive: true });
    }

});

/* =========================================
   16. GOOGLE ANALYTICS 4
========================================= */
(function() {
  const gaScript = document.createElement('script'); gaScript.async = true; gaScript.src = `https://www.googletagmanager.com/gtag/js?id=G-4QBSVPL8H6`; document.head.appendChild(gaScript);
  window.dataLayer = window.dataLayer || []; window.gtag = function() { dataLayer.push(arguments); };
  window.gtag('js', new Date()); window.gtag('config', 'G-4QBSVPL8H6');
})();

/* =========================================
   4. DIGITAL CLOCK WIDGET
========================================= */
document.addEventListener('DOMContentLoaded', function () {
const hourMinEl = document.getElementById('digital-hour-min');
const ampmEl = document.getElementById('digital-ampm');
const dateEl = document.getElementById('digital-date');

if (hourMinEl && ampmEl && dateEl) {
    function updateClock() {
        const now = new Date();
        
        // Format Time (e.g., 05:50)
        const timeString = now.toLocaleTimeString('en-US', { 
            timeZone: 'Asia/Dhaka', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
        const [time, ampm] = timeString.split(' ');
        
        // Format Date (e.g., Sunday, July 26)
        const dateString = now.toLocaleDateString('en-US', { 
            timeZone: 'Asia/Dhaka', 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });

        hourMinEl.textContent = time;
        ampmEl.textContent = ampm;
        dateEl.textContent = dateString;
    }
    
    // Update the clock every second
    setInterval(updateClock, 1000);
    updateClock(); // Run immediately on load
}
});

/* =========================================
   CALENDLY POPUP: any element with data-calendly opens the booking popup
   (script loads only on first click; falls back to a new tab)
========================================= */
(function () {
    const URL_ = 'https://calendly.com/fardinraafi/30min';
    let loading = null;
    const load = () => loading || (loading = new Promise((resolve, reject) => {
        const css = document.createElement('link');
        css.rel = 'stylesheet'; css.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(css);
        const js = document.createElement('script');
        js.src = 'https://assets.calendly.com/assets/external/widget.js'; js.async = true;
        js.onload = () => resolve(); js.onerror = reject;
        document.head.appendChild(js);
        setTimeout(() => reject(new Error('timeout')), 6000);
    }));
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-calendly]');
        if (!el) return;
        e.preventDefault(); e.stopPropagation();
        const url = (el.getAttribute('data-calendly') || URL_) + (/(\?)/.test(el.getAttribute('data-calendly') || '') ? '&' : '?') + 'hide_gdpr_banner=1&primary_color=7c3aed';
        load().then(() => window.Calendly.initPopupWidget({ url })).catch(() => window.open(URL_, '_blank', 'noopener'));
    }, true);
})();
