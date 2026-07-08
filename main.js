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
        <a href="/index.html">Home</a>
        <a href="/gallery.html">Gallery</a>
        <a href="/blog.html">Blog</a>
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
    </div>`;

    const footerHTML = `
    <div class="footer-glow"></div>
    <div class="footer-grid">
        <div class="footer-col">
            <h2 style="font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem;">Fardin Rahman<br><span class="gradient-text">Khan Raafi</span></h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem; max-width: 350px; line-height: 1.6;">
                Marketing professional passionate about brand communication, creative strategies, and growth leadership.
            </p>
        </div>
        <div class="footer-col">
            <h4>Quick Links</h4>
            <div class="footer-col-links">
                <a href="/index.html">Home</a>
                <a href="/gallery.html">Gallery</a>
                <a href="/blog.html">Blog</a>
                <a href="/certificates.html">Certificates</a>
                <a href="/volunteer.html">Leadership</a>
                <a href="/resume.html">Resume</a>
                <a href="/contact.html">Contact</a>
            </div>
        </div>
        <div class="footer-col">
            <h4>Contact Info</h4>
            <div class="footer-col-links">
                <a href="mailto:fardinraafi@gmail.com">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align: middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    fardinraafi@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/fardinraafi" target="_blank">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align: middle;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    LinkedIn Profile
                </a>
             <a href="https://www.pinterest.com/yourusername" target="_blank">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align: middle;"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.63 7.85 6.35 9.31-.09-.79-.16-2.01.03-2.87.18-.8.18-.8 1.18-4.52 0 0-.31-.62-.31-1.53 0-1.43.83-2.5 1.86-2.5.86 0 1.27.65 1.27 1.43 0 .86-.55 2.15-.83 3.35-.24 1.01.5 1.83 1.49 1.83 1.79 0 3.17-1.89 3.17-4.6 0-2.4-1.73-4.08-4.22-4.08-3 0-4.76 2.25-4.76 4.58 0 .86.33 1.78.74 2.28.08.1.09.19.06.29-.09.36-.28 1.15-.32 1.32-.05.21-.18.25-.4.15-1.49-.69-2.42-2.88-2.42-4.63 0-3.75 2.73-7.2 7.91-7.2 4.16 0 7.39 2.97 7.39 6.94 0 4.14-2.61 7.48-6.24 7.48-1.22 0-2.37-.63-2.76-1.38l-.75 2.87c-.27 1.04-1.01 2.34-1.5 3.13 1.11.34 2.29.53 3.52.53 5.52 0 10-4.48 10-10S17.52 2 12 2z"></path></svg>
                Pinterest
            </a>
                <a href="Fardin_Resume.pdf" download="Fardin_Rahman_Khan_Raafi_Resume.pdf" class="btn" style="background: #E2E8F0; color: #0F172A; padding: 10px 20px; font-weight: 800; margin-top: 1rem; text-align: center; border: 1px solid #CBD5E1; border-radius: 100px;">Download Resume 📥</a>
            </div>
        </div>
    </div>
    <div class="copyright">
        © <span id="current-year"></span> Fardin Rahman Khan Raafi. All rights reserved. Built for Humans & AI.
    </div>`;

    if (globalNav) {
        globalNav.innerHTML = navHTML;
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = globalNav.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '/' + currentPath || link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    if (globalFooter) globalFooter.innerHTML = footerHTML;

    /* =========================================
       CUSTOM DYNAMIC FAVICON
    ========================================= */
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='#7C3AED'/><text x='50' y='72' font-family='sans-serif' font-size='55' font-weight='900' text-anchor='middle' fill='white'>FR</text></svg>`;
    favicon.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgIcon);
    document.head.appendChild(favicon);

    /* =========================================
       1. THEME TOGGLE LOGIC
    ========================================= */
    const themeBtn = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'light') document.body.classList.remove('dark-mode');
    else { document.body.classList.add('dark-mode'); localStorage.setItem('theme', 'dark'); }
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
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
        const words = ['Marketing Specialist', 'Growth Associate', 'B2B Strategist', 'Branding Expert', 'ALP 2026 Fellow'];
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
       4. LOCAL TIME WIDGET
    ========================================= */
    const localTimeEl = document.getElementById('local-time');
    if (localTimeEl) {
        function updateTime() {
            localTimeEl.textContent = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' });
        }
        setInterval(updateTime, 1000); updateTime();
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
        window.addEventListener('scroll', () => { scrollTopBtn.classList.toggle('show', window.scrollY > 400); });
        scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    /* =========================================
       7. DYNAMIC CERTIFICATES GENERATOR
    ========================================= */
    const certGrid = document.getElementById('cert-grid');
    if (certGrid) {
        let certNumbers = Array.from({length: 40}, (_, i) => i + 1);
        certNumbers.sort(() => Math.random() - 0.5); 
        let certsHTML = '';
        certNumbers.forEach(c => {
            certsHTML += `<img src="cert-${c}.jpg" class="cert-img" loading="lazy" style="cursor: zoom-in;" onerror="this.onerror=null; this.src='https://placehold.co/800x600/F8FAFC/64748B?text=Certificate+${c}'" alt="Certificate ${c}">`;
        });
        certGrid.innerHTML = certsHTML;
    }

   /* =========================================
       8. GLOBAL LIGHTBOX (For Certificates & Volunteer pages)
    ========================================= */
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');

    // Only run this if we are NOT on the gallery page (gallery has its own custom script)
    if (lightbox && lightboxImg && !window.location.pathname.includes('gallery.html')) {
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
            document.body.style.overflow = 'auto';
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
         if (this.hostname === window.location.hostname && this.target !== '_blank' && !this.hasAttribute('download') && this.getAttribute('href') !== '#' && !this.getAttribute('href').startsWith('#')) {
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
            window.open('/B2B_Growth_Playbook.pdf', '_blank');
            
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcwqAKQ8S_LzdlYhTRQUw73dQGU8o_T0KfSHKPKYN6lY-V9n_jdxxGFoCLkHWfWRE0VA/exec'; 
            
            if (GOOGLE_SCRIPT_URL !== 'INSERT_YOUR_GOOGLE_SCRIPT_URL_HERE') {
                const formData = new FormData();
                formData.append('email', emailInput);
                formData.append('date', new Date().toLocaleString());

                fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData })
                .then(() => { submitBtn.innerHTML = 'Success!'; setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000); })
                .catch(error => { console.error(error); submitBtn.innerHTML = 'Success!'; setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000); });
            } else {
                setTimeout(() => { submitBtn.innerHTML = 'Enjoy!'; setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000); }, 800);
            }
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
        progressBar.style.width = (winScroll / height) * 100 + '%';
    });

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

    /* =========================================
       12. DYNAMIC LIVE STATUS WIDGET
    ========================================= */
    const statusWidget = document.getElementById('liveStatusBtn');
    const statusTextEl = document.getElementById('live-status-text');
    
    if (statusWidget && statusTextEl) {
        const statusMessages = ["Open to new B2B projects", "📍 Based in Dhaka, Bangladesh", "🎧 Listening to: My First Million", "📚 Reading: Hacking Growth", "⚡ Optimizing conversion rates..."];
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
        openChatBtn.addEventListener('click', () => chatModal.classList.add('show'));
        closeChatBtn.addEventListener('click', () => chatModal.classList.remove('show'));
        document.addEventListener('click', (e) => { if (chatModal.classList.contains('show') && !chatModal.contains(e.target) && !openChatBtn.contains(e.target)) chatModal.classList.remove('show'); });
    }

    window.sendQuery = function(query) {
        if (chatGreeting) chatGreeting.style.display = 'none';
        if (chatOptions) chatOptions.style.display = 'none';
        if (resetChatBtn) resetChatBtn.style.display = 'block';

        const userMsg = document.createElement('div'); userMsg.className = 'chat-bubble user-bubble'; userMsg.textContent = query;
        if(chatLog) chatLog.appendChild(userMsg);

        setTimeout(() => {
            const aiMsg = document.createElement('div'); aiMsg.className = 'chat-bubble ai-bubble';
            if (query.includes('skills')) aiMsg.innerHTML = 'Fardin specializes in <strong>B2B Lead Generation</strong>, CRM management (Salesforce, Apollo.io), and Brand Strategy.';
            else if (query.includes('B2B')) aiMsg.innerHTML = 'He currently works at Augmex Technologies, enriching 40,000+ CRM records and executing multi-channel outreach strategies.';
            else if (query.includes('contact')) aiMsg.innerHTML = 'You can reach him directly through his <a href="/contact.html" style="color: var(--c1); font-weight: bold;">Contact Page</a>.';
            else if (query.includes('Resume')) aiMsg.innerHTML = 'You can view and download his full resume on his <a href="/resume.html" style="color: var(--c1); font-weight: bold;">Resume Page</a>.';
            else if (query.includes('academics')) aiMsg.innerHTML = 'Fardin holds a Bachelor of Business Administration (BBA) in Marketing from BUBT, graduating with an excellent CGPA of 3.80.';
            else if (query.includes('extracurriculars')) aiMsg.innerHTML = 'He has extensive leadership experience! Check out his <a href="/volunteer.html" style="color: var(--c1); font-weight: bold;">Leadership & Extracurriculars page</a> to learn more.';
            else aiMsg.textContent = 'Thanks for asking! Please explore the rest of the portfolio for more details.';
            
            if(chatLog) { chatLog.appendChild(aiMsg); const chatArea = document.getElementById('chatArea'); if (chatArea) chatArea.scrollTop = chatArea.scrollHeight; }
        }, 600); 
    };

    if (resetChatBtn) {
        resetChatBtn.addEventListener('click', () => {
            if(chatLog) chatLog.innerHTML = '';
            if (chatGreeting) chatGreeting.style.display = 'block';
            if (chatOptions) chatOptions.style.display = 'grid';
            resetChatBtn.style.display = 'none';
        });
    }
}); // END DOM CONTENT LOADED

/* =========================================
   16. GOOGLE ANALYTICS 4
========================================= */
(function() {
  const gaScript = document.createElement('script'); gaScript.async = true; gaScript.src = `https://www.googletagmanager.com/gtag/js?id=G-4QBSVPL8H6`; document.head.appendChild(gaScript);
  window.dataLayer = window.dataLayer || []; window.gtag = function() { dataLayer.push(arguments); };
  window.gtag('js', new Date()); window.gtag('config', 'G-4QBSVPL8H6');
})();

/* =========================================
   17. ANTI-INSPECT & ANTI-COPY LOGIC
========================================= */
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) || ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u'))) e.preventDefault();
});
