document.addEventListener('DOMContentLoaded', () => {
/* =========================================
       CUSTOM DYNAMIC FAVICON
    ========================================= */
   /* =========================================
       CUSTOM DYNAMIC FAVICON
    ========================================= */
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    // Huge white "FR" inside a rounded purple box so it shows up on all browsers
    favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%237C3AED'/><text x='50' y='72' font-family='sans-serif' font-size='55' font-weight='900' text-anchor='middle' fill='white'>FR</text></svg>";
    document.head.appendChild(favicon);
    /* =========================================
       1. THEME TOGGLE LOGIC
    ========================================= */
    const themeBtn = document.getElementById('themeToggle');
    // Check local storage immediately
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    /* =========================================
       2. CURRENT YEAR UPDATER (Footer)
    ========================================= */
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    /* =========================================
       3. TYPEWRITER EFFECT (Homepage)
    ========================================= */
    const twText = document.getElementById('tw-text');
    if (twText) {
        const words = ['Marketing Specialist', 'Growth Associate', 'B2B Strategist', 'Branding Expert', 'ALP 2026 Fellow'];
        let i = 0, j = 0, isDeleting = false;
        
        function type() {
            const currentWord = words[i];
            if (isDeleting) {
                twText.textContent = currentWord.substring(0, j - 1); 
                j--;
            } else {
                twText.textContent = currentWord.substring(0, j + 1); 
                j++;
            }
            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && j === currentWord.length) { 
                typeSpeed = 2000; 
                isDeleting = true; 
            } else if (isDeleting && j === 0) { 
                isDeleting = false; 
                i = (i + 1) % words.length;
                typeSpeed = 500; 
            }
            setTimeout(type, typeSpeed);
        }
        type(); // Start the typing effect
    }

    /* =========================================
       4. LOCAL TIME WIDGET (Homepage)
    ========================================= */
    const localTimeEl = document.getElementById('local-time');
    if (localTimeEl) {
        function updateTime() {
            const timeStr = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' });
            localTimeEl.textContent = timeStr;
        }
        setInterval(updateTime, 1000); 
        updateTime();
    }

    /* =========================================
       5. SCROLL REVEAL ANIMATIONS
    ========================================= */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    /* =========================================
       6. SCROLL TO TOP BUTTON
    ========================================= */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) { scrollTopBtn.classList.add('show'); }
            else { scrollTopBtn.classList.remove('show'); }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =========================================
       7. DYNAMIC CERTIFICATES GENERATOR
    ========================================= */
    const certGrid = document.getElementById('cert-grid');
    if (certGrid) {
        let certNumbers = Array.from({length: 40}, (_, i) => i + 1);
        certNumbers.sort(() => Math.random() - 0.5); // Randomizes the order
        let certsHTML = '';
        certNumbers.forEach(c => {
            certsHTML += `<img src="cert-${c}.jpg" class="cert-img" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/800x600/F8FAFC/64748B?text=Certificate+${c}'" alt="Certificate ${c}">`;
        });
        certGrid.innerHTML = certsHTML;
    }

    /* =========================================
       8. LIGHTBOX LOGIC (Gallery & Certificates)
    ========================================= */
    const lightbox = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg) {
        let currentImageIndex = 0;
        let imageArray = [];

        // Set a slight delay to allow the DOM/dynamic images to load first
        setTimeout(() => {
            const images = document.querySelectorAll('.grid-img, .cert-img');
            if (images.length > 0) {
                imageArray = Array.from(images).map(img => img.src);
                images.forEach((img, index) => {
                    // Overwrite inline onclicks with clean event listeners
                    img.onclick = null; 
                    img.addEventListener('click', () => {
                        currentImageIndex = index;
                        lightboxImg.src = imageArray[currentImageIndex];
                        lightbox.classList.add('show');
                        document.body.style.overflow = 'hidden'; // Stop background scrolling
                    });
                });
            }
        }, 150);

        // Make window functions globally accessible for the HTML buttons
        window.closeLightbox = function() {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        window.changeImage = function(step, event) {
            if(event) event.stopPropagation(); // Prevent closing when clicking nav
            currentImageIndex += step;
            if (currentImageIndex < 0) currentImageIndex = imageArray.length - 1;
            if (currentImageIndex >= imageArray.length) currentImageIndex = 0;
            lightboxImg.src = imageArray[currentImageIndex];
        };

        // Close when clicking the dark background
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                window.closeLightbox();
            }
        });

        // Mobile Swipe Gestures
        let touchStartX = 0; let touchEndX = 0;
        lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) window.changeImage(1); // Swipe left = Next
            if (touchEndX - touchStartX > 50) window.changeImage(-1); // Swipe right = Prev
        }, {passive: true});

        // Keyboard Arrows
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
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only trigger for internal links (ignores external links, downloads, and new tabs)
            if (
                this.hostname === window.location.hostname && 
                this.target !== '_blank' &&
                !this.hasAttribute('download') &&
                this.getAttribute('href') !== '#'
            ) {
                e.preventDefault(); // Stop the hard refresh
                const destination = this.href;
                
                // Add the fade-out class to the body
                document.body.classList.add('fade-out');
                
                // Wait exactly 300ms (matching our CSS) before changing pages
                setTimeout(() => {
                    window.location.href = destination;
                }, 300);
            }
        });
    });

    // Fix for the browser "Back" button so the page doesn't get stuck invisible
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('fade-out');
        }
    });
});
// ── 6. GOOGLE ANALYTICS 4 INJECTION ──
(function() {
  const GA_MEASUREMENT_ID = 'G-4QBSVPL8H6';

  // 1. Create the <script async src="..."></script> tag dynamically
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);

  // 2. Set up the window.dataLayer array and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  
  // 3. Initialize the configuration
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
})();
