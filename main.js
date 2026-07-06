document.addEventListener('DOMContentLoaded', () => {
    // PRELOADER LOGIC
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => { preloader.classList.add('hide'); }, 600); // Smooth 0.6s delay
        }
    });

    /* =========================================
       CUSTOM DYNAMIC FAVICON (Fixed Encoding)
    ========================================= */
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='#7C3AED'/><text x='50' y='72' font-family='sans-serif' font-size='55' font-weight='900' text-anchor='middle' fill='white'>FR</text></svg>`;
    favicon.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgIcon);
    document.head.appendChild(favicon);

    /* =========================================
       1. THEME TOGGLE LOGIC (DEFAULT: DARK MODE)
    ========================================= */
    const themeBtn = document.getElementById('themeToggle');
    
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
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
        type();
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
        certNumbers.sort(() => Math.random() - 0.5); 
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
        setTimeout(() => {
            const images = document.querySelectorAll('.grid-img, .cert-img');
            if (images.length > 0) {
                imageArray = Array.from(images).map(img => img.src);
                images.forEach((img, index) => {
                    img.onclick = null; 
                    img.addEventListener('click', () => {
                        currentImageIndex = index;
                        lightboxImg.src = imageArray[currentImageIndex];
                        lightbox.classList.add('show');
                        document.body.style.overflow = 'hidden'; 
                    });
                });
            }
        }, 150);
        
        window.closeLightbox = function() {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        };
        window.changeImage = function(step, event) {
            if(event) event.stopPropagation(); 
            currentImageIndex += step;
            if (currentImageIndex < 0) currentImageIndex = imageArray.length - 1;
            if (currentImageIndex >= imageArray.length) currentImageIndex = 0;
            lightboxImg.src = imageArray[currentImageIndex];
        };
        
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                window.closeLightbox();
            }
        });
        
        let touchStartX = 0; let touchEndX = 0;
        lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) window.changeImage(1); 
            if (touchEndX - touchStartX > 50) window.changeImage(-1); 
        }, {passive: true});
        
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
         if (
                this.hostname === window.location.hostname && 
                this.target !== '_blank' &&
                !this.hasAttribute('download') &&
                this.getAttribute('href') !== '#' &&
                !this.getAttribute('href').startsWith('#')
            ) {
                e.preventDefault(); 
                const destination = this.href;
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = destination;
                }, 300);
            }
        });
    });
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('fade-out');
        }
    });

    /* =========================================
       10. PLAYBOOK INSTANT OPEN & GOOGLE SHEETS
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

                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                }).then(() => {
                    submitBtn.innerHTML = 'Success!';
                    setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000);
                }).catch(error => {
                    console.error('Logging Error:', error);
                    submitBtn.innerHTML = 'Success!'; 
                    setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000);
                });
            } else {
                setTimeout(() => {
                    submitBtn.innerHTML = 'Enjoy!';
                    setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000);
                }, 800);
            }
        });
    }

    /* =========================================
       11. ADVANCED MICRO-INTERACTIONS
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
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

   const magneticCards = document.querySelectorAll('.glass-card:not(.no-hover), .blog-card, .collage-item, .cert-img, .info-card, .stat-box, .highlight-card');
    magneticCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top; 
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4; 
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.transition = 'none'; 
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; 
            card.style.transition = 'all 0.4s ease'; 
        });
    });

    /* =========================================
       12. DYNAMIC LIVE STATUS WIDGET
    ========================================= */
    const statusWidget = document.getElementById('liveStatusBtn');
    const statusTextEl = document.getElementById('live-status-text');
    
    if (statusWidget && statusTextEl) {
        const statusMessages = [
            "Open to new B2B projects",
            "📍 Based in Dhaka, Bangladesh",
            "🎧 Listening to: My First Million",
            "📚 Reading: Hacking Growth",
            "⚡ Optimizing conversion rates..."
        ];
        
        let statusIndex = 0;
        let isHovered = false;
        let isClicked = false;

        statusWidget.addEventListener('mouseenter', () => isHovered = true);
        statusWidget.addEventListener('mouseleave', () => isHovered = false);

        setInterval(() => {
            if (!isHovered && !isClicked) {
                statusTextEl.style.opacity = '0';
                statusTextEl.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    statusIndex = (statusIndex + 1) % statusMessages.length;
                    statusTextEl.textContent = statusMessages[statusIndex];
                    statusTextEl.style.transform = 'translateY(10px)';
                    
                    requestAnimationFrame(() => {
                        statusTextEl.style.opacity = '1';
                        statusTextEl.style.transform = 'translateY(0)';
                    });
                }, 400); 
            }
        }, 4000);

        statusWidget.addEventListener('click', () => {
            isClicked = true;
            const email = "fardinraafi@gmail.com";
            
            navigator.clipboard.writeText(email).then(() => {
                statusTextEl.style.opacity = '0';
                setTimeout(() => {
                    statusTextEl.textContent = "Copied email to clipboard! 📋";
                    statusTextEl.style.color = "#10B981"; 
                    statusTextEl.style.opacity = '1';
                }, 200);

                setTimeout(() => {
                    statusTextEl.style.opacity = '0';
                    setTimeout(() => {
                        statusTextEl.style.color = "var(--text-main)";
                        statusTextEl.textContent = statusMessages[statusIndex];
                        statusTextEl.style.opacity = '1';
                        isClicked = false; 
                    }, 200);
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
            
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                if (response.status === 200) {
                    window.location.href = '/message-sent.html';
                } else {
                    submitBtn.innerHTML = 'Error. Try Again.';
                    setTimeout(() => { submitBtn.innerHTML = originalText; }, 3000);
                }
            })
            .catch(error => {
                console.log(error);
                submitBtn.innerHTML = 'Network Error.';
                setTimeout(() => { submitBtn.innerHTML = originalText; }, 3000);
            });
        });
    }

    /* =========================================
       14. FLOATING GLASS PARALLAX ENGINE
    ========================================= */
    const glassIcons = document.querySelectorAll('.floating-glass');
    if (glassIcons.length > 0) {
        glassIcons.forEach(icon => {
            const rot = icon.getAttribute('data-rot') || '0';
            icon.style.transform = `translate3d(0, 0px, 0) rotate(${rot}deg)`;
        });

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            glassIcons.forEach((icon, index) => {
                const speed = (index + 1) * 0.12; 
                const rot = icon.getAttribute('data-rot') || '0';
                icon.style.transform = `translate3d(0, -${scrolled * speed}px, 0) rotate(${rot}deg)`;
            });
        }, { passive: true });
    }

    /* =========================================
       15. 🤖 FIFI CHATBOT LOGIC
    ========================================= */
    const openChatBtn = document.getElementById('openChatBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatModal = document.getElementById('chatModal');
    const chatGreeting = document.getElementById('chatGreeting');
    const chatOptions = document.getElementById('chatOptions');
    const chatLog = document.getElementById('chatLog');
    const resetChatBtn = document.getElementById('resetChatBtn');

    if (openChatBtn && closeChatBtn && chatModal) {
        // Open Modal
        openChatBtn.addEventListener('click', () => {
            chatModal.classList.add('show');
        });

        // Close Modal via X button
        closeChatBtn.addEventListener('click', () => {
            chatModal.classList.remove('show');
        });

        // NEW: Close Modal by clicking outside of it!
        document.addEventListener('click', (e) => {
            if (chatModal.classList.contains('show')) {
                // If the click is NOT inside the modal AND NOT on the button that opens it
                if (!chatModal.contains(e.target) && !openChatBtn.contains(e.target)) {
                    chatModal.classList.remove('show');
                }
            }
        });
    }

    window.sendQuery = function(query) {
        if (chatGreeting) chatGreeting.style.display = 'none';
        if (chatOptions) chatOptions.style.display = 'none';
        if (resetChatBtn) resetChatBtn.style.display = 'block';

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-bubble user-bubble';
        userMsg.textContent = query;
        chatLog.appendChild(userMsg);

        setTimeout(() => {
            const aiMsg = document.createElement('div');
            aiMsg.className = 'chat-bubble ai-bubble';
            
            if (query.includes('skills')) {
                aiMsg.innerHTML = 'Fardin specializes in <strong>B2B Lead Generation</strong>, CRM management (Salesforce, Apollo.io), and Brand Strategy.';
            } else if (query.includes('B2B')) {
                aiMsg.innerHTML = 'He currently works at Augmex Technologies, enriching 40,000+ CRM records and executing multi-channel outreach strategies.';
            } else if (query.includes('contact')) {
                aiMsg.innerHTML = 'You can reach him directly through his <a href="/contact.html" style="color: var(--c1); font-weight: bold;">Contact Page</a>.';
            } else if (query.includes('Resume')) {
                aiMsg.innerHTML = 'You can view and download his full resume on his <a href="/resume.html" style="color: var(--c1); font-weight: bold;">Resume Page</a>.';
            } else if (query.includes('academics')) {
                aiMsg.innerHTML = 'Fardin holds a Bachelor of Business Administration (BBA) in Marketing from BUBT, graduating with an excellent CGPA of 3.80.';
            } else if (query.includes('extracurriculars')) {
                aiMsg.innerHTML = 'He has extensive leadership experience! Check out his <a href="/volunteer.html" style="color: var(--c1); font-weight: bold;">Leadership & Extracurriculars page</a> to learn more.';
            } else {
                aiMsg.textContent = 'Thanks for asking! Please explore the rest of the portfolio for more details.';
            }
            
            chatLog.appendChild(aiMsg);
            
            const chatArea = document.getElementById('chatArea');
            if (chatArea) {
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        }, 600); 
    };

    if (resetChatBtn) {
        resetChatBtn.addEventListener('click', () => {
            chatLog.innerHTML = '';
            if (chatGreeting) chatGreeting.style.display = 'block';
            if (chatOptions) chatOptions.style.display = 'grid';
            resetChatBtn.style.display = 'none';
        });
    }

}); // END OF DOM CONTENT LOADED

/* =========================================
   16. GOOGLE ANALYTICS 4 INJECTION
========================================= */
(function() {
  const GA_MEASUREMENT_ID = 'G-4QBSVPL8H6';
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gaScript);
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
})();

/* =========================================
   17. ANTI-INSPECT & ANTI-COPY LOGIC
========================================= */
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); }
});
