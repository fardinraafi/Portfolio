document.addEventListener('DOMContentLoaded', () => {
    // PRELOADER LOGIC (With Fail-Safe)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => { preloader.classList.add('hide'); }, 600);
        });
        setTimeout(() => { preloader.classList.add('hide'); }, 1500);
    }

    /* =========================================
       0. GLOBAL COMPONENT INJECTOR (Nav & Footer)
    ========================================= */
    const globalNav = document.querySelector('.top-nav');
    const globalFooter = document.querySelector('.site-footer');

    const navHTML = `
    <a href="/index.html" class="nav-brand">FR<span class="gradient-text">KR</span></a>
    <div class="nav-menu">
        <span class="nav-ind" aria-hidden="true"></span>
        <a href="/index.html">Home</a>
        <a href="/gallery.html">Gallery</a>
        <a href="/blog.html">Blog</a>
        <a href="/resources.html">Resources</a>
        <a href="/certificates.html">Certificates</a>
        <a href="/volunteer.html">Leadership</a>
        <a href="/resume.html">Resume</a>
        <a href="/contact.html">Contact</a>
    </div>
    <div class="nav-actions">
        <a href="/contact.html" class="btn btn-primary">Let's Talk</a>
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
                <a href="/index.html"><small>01</small>Home</a>
                <a href="/gallery.html"><small>02</small>Gallery</a>
                <a href="/blog.html"><small>03</small>Blog</a>
                <a href="/resources.html"><small>04</small>Resources</a>
                <a href="/certificates.html"><small>05</small>Certificates</a>
                <a href="/volunteer.html"><small>06</small>Leadership</a>
                <a href="/resume.html"><small>07</small>Resume</a>
                <a href="/contact.html"><small>08</small>Contact</a>
            </div>
            <a href="/contact.html" class="nav-drawer-cta">Let's Talk <span>→</span></a>
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
                <a href="/contact.html" class="ft-cta-btn">Let's talk <span>→</span></a>
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
                <a href="/index.html">Home</a>
                <a href="/gallery.html">Gallery</a>
                <a href="/blog.html">Blog</a>
                <a href="/resources.html">Resources</a>
                <a href="/certificates.html">Certificates</a>
                <a href="/volunteer.html">Leadership</a>
                <a href="/resume.html">Resume</a>
                <a href="/contact.html">Contact</a>
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
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = globalNav.querySelectorAll('.nav-menu a, .nav-drawer-links a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '/' + currentPath || link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
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
        // Updated to 58 certificates
        let certNumbers = Array.from({length: 58}, (_, i) => i + 1);
        certNumbers.sort(() => Math.random() - 0.5); 
        let certsHTML = '';
        certNumbers.forEach(c => {
            // Updated to pull from the new 'certs/' folder with SEO Alt tags
            certsHTML += `<img src="certs/cert-${c}.jpg" class="cert-img" loading="lazy" style="cursor: zoom-in;" onerror="this.onerror=null; this.src='https://placehold.co/800x600/F8FAFC/64748B?text=Certificate+${c}'" alt="Fardin Rahman Khan Raafi, Marketing Executive - Professional Certificate ${c}">`;
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
                imageArray = Array.from(images).map(img => img.src);
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

        // Touch Swipe support
        let touchStartX = 0; let touchEndX = 0;
        lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) window.changeImage(1);
            if (touchEndX - touchStartX > 50) window.changeImage(-1);
        }, {passive: true});

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
                if (response.status === 200) window.location.href = '/message-sent.html';
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

 /* =========================================
       15. 🤖 FIFI CHATBOT LOGIC
    ========================================= */
    const openChatBtn = document.getElementById('openChatBtn'), closeChatBtn = document.getElementById('closeChatBtn'), chatModal = document.getElementById('chatModal');
    const chatGreeting = document.getElementById('chatGreeting'), chatOptions = document.getElementById('chatOptions'), chatLog = document.getElementById('chatLog'), resetChatBtn = document.getElementById('resetChatBtn');

   if (openChatBtn && closeChatBtn && chatModal) {
        // Now it toggles open and closed when you click the Fifi button!
        openChatBtn.addEventListener('click', () => chatModal.classList.toggle('show'));
        closeChatBtn.addEventListener('click', () => chatModal.classList.remove('show'));
        // We added a tiny delay to the outside click detector so it doesn't instantly fight the toggle button
        document.addEventListener('click', (e) => { 
            if (chatModal.classList.contains('show') && !chatModal.contains(e.target) && !openChatBtn.contains(e.target)) {
                chatModal.classList.remove('show'); 
            }
        });
    }
    window.sendQuery = function(query) {
        if (chatGreeting) chatGreeting.style.display = 'none';
        if (chatOptions) chatOptions.style.display = 'none';
        if (resetChatBtn) resetChatBtn.style.display = 'block';

        const chatArea = document.getElementById('chatArea');

        // 1. Immediately drop the user's question into the chat
        const userMsg = document.createElement('div'); 
        userMsg.className = 'chat-bubble user-bubble'; 
        userMsg.textContent = query;
        if(chatLog) chatLog.appendChild(userMsg);
        if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;

        // 2. Random Loading Phrases for Fifi
        const loadingPhrases = [
            "Let me check on that...", 
            "Hold on a second...", 
            "Fetching the details...", 
            "Just a moment...",
            "Pulling that up for you..."
        ];
        const randomLoadingText = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];

        // 3. Drop Fifi's Loading Bubble into the chat
        const aiLoadingMsg = document.createElement('div'); 
        aiLoadingMsg.className = 'chat-bubble ai-bubble';
        aiLoadingMsg.innerHTML = `<span style="opacity: 0.6; font-style: italic; display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 2s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> 
            ${randomLoadingText}
        </span>`;
        
        // Add the spin animation once
        if (!document.getElementById('fifi-spin')) {
            const style = document.createElement('style');
            style.id = 'fifi-spin';
            style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        if(chatLog) chatLog.appendChild(aiLoadingMsg);
        if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;

        // 4. Wait a second, remove the loading bubble, and drop the real answer
        setTimeout(() => {
            if (aiLoadingMsg.parentNode) aiLoadingMsg.parentNode.removeChild(aiLoadingMsg);

            const aiMsg = document.createElement('div'); 
            aiMsg.className = 'chat-bubble ai-bubble';
            
            if (query.includes('skills')) aiMsg.innerHTML = 'Fardin specializes in <strong>Brand Strategy</strong>, CRM management (Salesforce, Apollo.io), and B2B Lead Generation.';
            else if (query.includes('B2B')) aiMsg.innerHTML = 'He has <strong>hands-on experience in B2B sales and marketing at Augmex</strong>. He currently works as a Junior Executive, Marketing at Augmex Technologies, enriching 40,000+ CRM records and executing multi-channel outreach strategies.';
            else if (query.includes('contact')) aiMsg.innerHTML = 'You can reach him directly through his <a href="/contact.html" style="color: var(--c1); font-weight: bold;">Contact Page</a>.';
            else if (query.includes('Resume')) aiMsg.innerHTML = 'You can view and download his full resume on his <a href="/resume.html" style="color: var(--c1); font-weight: bold;">Resume Page</a>.';
            else if (query.includes('academics')) aiMsg.innerHTML = 'Fardin holds a Bachelor of Business Administration (BBA) in Marketing from BUBT, graduating with an excellent CGPA of 3.80.';
            else if (query.includes('extracurriculars')) aiMsg.innerHTML = 'He has extensive leadership experience! Check out his <a href="/volunteer.html" style="color: var(--c1); font-weight: bold;">Leadership & Extracurriculars page</a> to learn more.';
            else aiMsg.textContent = 'Thanks for asking! Please explore the rest of the portfolio for more details.';
            
            if(chatLog) { 
                chatLog.appendChild(aiMsg); 
                if (chatArea) chatArea.scrollTop = chatArea.scrollHeight; 
            }
        }, 1200); // Wait 1.2 seconds to simulate typing/thinking
    };

    if (resetChatBtn) {
        resetChatBtn.addEventListener('click', () => {
            if(chatLog) chatLog.innerHTML = '';
            if (chatGreeting) chatGreeting.style.display = 'block';
            if (chatOptions) chatOptions.style.display = 'grid';
            resetChatBtn.style.display = 'none';
        });
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
