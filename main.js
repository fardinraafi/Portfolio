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
    <div class="footer-split-layout">
        <!-- LEFT SIDE: Borderless Links -->
        <div class="footer-left">
            <div class="footer-link-group">
                <h4>Quick Links</h4>
                <a href="/index.html">Home</a>
                <a href="/gallery.html">Gallery</a>
                <a href="/blog.html">Blog</a>
                <a href="/certificates.html">Certificates</a>
                <a href="/volunteer.html">Leadership</a>
                <a href="/resume.html">Resume</a>
                <a href="/contact.html">Contact</a>
            </div>
            <div class="footer-link-group">
                <h4>Contact Info</h4>
                <a href="mailto:fardinraafi@gmail.com">fardinraafi@gmail.com</a>
                <a href="https://www.linkedin.com/in/fardinraafi" target="_blank">LinkedIn Profile</a>
                <a href="https://x.com/fardinraafii" target="_blank">Twitter</a>
                <a href="https://github.com/fardinraafi" target="_blank">GitHub</a>
                <a href="https://www.behance.net/fardinraafi" target="_blank">Behance</a>
                <a href="https://www.pinterest.com/yourusername" target="_blank">Pinterest</a>
                <a href="Fardin_Resume.pdf" download="Fardin_Rahman_Khan_Raafi_Resume.pdf" class="footer-download-btn">Download Resume 📥</a>
            </div>
        </div>
        
        <!-- RIGHT SIDE: Massive Interactive Globe -->
        <div class="footer-right">
            <div class="globe-wrapper">
                <canvas id="cobe-globe" style="width: 100%; height: 100%; cursor: grab; contain: layout paint size;"></canvas>
            </div>
        </div>
    </div>
    
    <div class="copyright" style="border-top: none;">
        © <span id="current-year"></span> Fardin Rahman Khan Raafi. All rights reserved. Built for Humans & AI.
    </div>`;

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
        window.addEventListener('scroll', () => { scrollTopBtn.classList.toggle('show', window.scrollY > 400); });
        scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

 /* =========================================
       7. DYNAMIC CERTIFICATES GENERATOR
    ========================================= */
    const certGrid = document.getElementById('cert-grid');
    if (certGrid) {
        // Updated to 53 certificates
        let certNumbers = Array.from({length: 53}, (_, i) => i + 1);
        certNumbers.sort(() => Math.random() - 0.5); 
        let certsHTML = '';
        certNumbers.forEach(c => {
            // Updated to pull from the new 'certs/' folder
            certsHTML += `<img src="certs/cert-${c}.jpg" class="cert-img" loading="lazy" style="cursor: zoom-in;" onerror="this.onerror=null; this.src='https://placehold.co/800x600/F8FAFC/64748B?text=Certificate+${c}'" alt="Certificate ${c}">`;
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
        
        // Add a quick spin animation for the loading SVG just for this bubble
        const style = document.createElement('style');
        style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);

        if(chatLog) chatLog.appendChild(aiLoadingMsg);
        if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;

        // 4. Wait a second, remove the loading bubble, and drop the real answer
        setTimeout(() => {
            if (aiLoadingMsg.parentNode) aiLoadingMsg.parentNode.removeChild(aiLoadingMsg);

            const aiMsg = document.createElement('div'); 
            aiMsg.className = 'chat-bubble ai-bubble';
            
            if (query.includes('skills')) aiMsg.innerHTML = 'Fardin specializes in <strong>Brand Strategy</strong>, CRM management (Salesforce, Apollo.io), and B2B Lead Generation.';
            else if (query.includes('B2B')) aiMsg.innerHTML = 'He has <strong>one years of professional experience specifically focused on B2B sales and Marketinf at Augmex</strong>. Currently, he works as a Marketing Executive at Augmex Technologies, enriching 40,000+ CRM records and executing multi-channel outreach strategies.';
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
}); // <--- THIS WAS THE MISSING BRACKET!

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
/* =========================================
   4. DIGITAL CLOCK WIDGET
========================================= */
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
