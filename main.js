document.addEventListener('DOMContentLoaded', () => {
    // PRELOADER LOGIC
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => { preloader.classList.add('hide'); }, 600); // Gives it a smooth 0.6s delay
        }
    });
    /* =========================================
       CUSTOM DYNAMIC FAVICON
    ========================================= */
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    // Huge white "FR" inside a rounded purple box so it shows up on all browsers
    favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%237C3AED'/><text x='50' y='72' font-family='sans-serif' font-size='55' font-weight='900' text-anchor='middle' fill='white'>FR</text></svg>";
    document.head.appendChild(favicon);

    /* =========================================
       1. THEME TOGGLE LOGIC (DEFAULT: DARK MODE)
    ========================================= */
    const themeBtn = document.getElementById('themeToggle');
    
    // Check local storage. If they explicitly set it to light before, keep it light.
    // Otherwise, force Dark Mode as the default starting state.
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
                this.getAttribute('href') !== '#' &&
                !this.getAttribute('href').startsWith('#')
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

    /* =========================================
       10. PLAYBOOK INSTANT OPEN & GOOGLE SHEETS ADMIN LOGIC
    ========================================= */
    const playbookForm = document.getElementById('playbook-form');
    
    if (playbookForm) {
        playbookForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page refresh
            
            const submitBtn = playbookForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const emailInput = playbookForm.querySelector('input[name="email"]').value;
            
            submitBtn.innerHTML = 'Opening...';
            
            // 1. Instantly open the PDF in a new tab
           window.open('/B2B_Growth_Playbook.pdf', '_blank');
            
            // 2. Secretly log email to Google Sheets (Admin Panel Database)
            // Note: We will generate your personal URL in the next steps!
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcwqAKQ8S_LzdlYhTRQUw73dQGU8o_T0KfSHKPKYN6lY-V9n_jdxxGFoCLkHWfWRE0VA/exec'; 
            
            if (GOOGLE_SCRIPT_URL !== 'INSERT_YOUR_GOOGLE_SCRIPT_URL_HERE') {
                const formData = new FormData();
                formData.append('email', emailInput);
                formData.append('date', new Date().toLocaleString());

                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Bypasses cross-origin restrictions for simple logging
                    body: formData
                }).then(() => {
                    submitBtn.innerHTML = 'Success!';
                    setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000);
                }).catch(error => {
                    console.error('Logging Error:', error);
                    submitBtn.innerHTML = 'Success!'; // Still show success to user even if logging fails
                    setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000);
                });
            } else {
                // If URL isn't set yet, just reset the button normally
                setTimeout(() => {
                    submitBtn.innerHTML = 'Enjoy!';
                    setTimeout(() => { submitBtn.innerHTML = originalText; playbookForm.reset(); }, 3000);
                }, 800);
            }
        });
    }

});

// ── GOOGLE ANALYTICS 4 INJECTION ──
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

    /* =========================================
       11. ADVANCED MICRO-INTERACTIONS
    ========================================= */
    
    // A. Reading Progress Bar Logic
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

 
   // C. 3D Magnetic Hover Effect for ALL Cards
   const magneticCards = document.querySelectorAll('.glass-card:not(.no-hover), .blog-card, .collage-item, .cert-img, .info-card, .stat-box, .highlight-card');
    
    magneticCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X relative to card
            const y = e.clientY - rect.top;  // Mouse Y relative to card
            // Feed mouse coordinates to CSS for the Spotlight effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt based on mouse distance from center
            const rotateX = ((y - centerY) / centerY) * -4; // Max tilt 4 degrees
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            card.style.transition = 'none'; // Remove transition for instant magnetic tracking
        });
        
        // Reset the card smoothly when the mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; 
            card.style.transition = 'all 0.4s ease'; 
        });
    });
    // D. DYNAMIC LIVE STATUS WIDGET LOGIC
    const statusWidget = document.getElementById('liveStatusBtn');
    const statusTextEl = document.getElementById('live-status-text');
    
    if (statusWidget && statusTextEl) {
        // Your rotating messages (Feel free to customize these!)
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

        // Pause rotation on hover
        statusWidget.addEventListener('mouseenter', () => isHovered = true);
        statusWidget.addEventListener('mouseleave', () => isHovered = false);

        // The Rotation Engine
        setInterval(() => {
            if (!isHovered && !isClicked) {
                // Fade out text, move it slightly up
                statusTextEl.style.opacity = '0';
                statusTextEl.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    // Change text, reset position, fade back in
                    statusIndex = (statusIndex + 1) % statusMessages.length;
                    statusTextEl.textContent = statusMessages[statusIndex];
                    
                    statusTextEl.style.transform = 'translateY(10px)';
                    
                    // Small delay to allow DOM to catch up before animating in
                    requestAnimationFrame(() => {
                        statusTextEl.style.opacity = '1';
                        statusTextEl.style.transform = 'translateY(0)';
                    });
                }, 400); // 400ms matches the CSS transition time
            }
        }, 4000); // Changes every 4 seconds

        // The Click-to-Copy Action
        statusWidget.addEventListener('click', () => {
            isClicked = true;
            const email = "fardinraafi@gmail.com";
            
            // Modern copy to clipboard API
            navigator.clipboard.writeText(email).then(() => {
                const originalColor = statusWidget.querySelector('.status-dot').style.backgroundColor;
                
                // Change UI to success state
                statusTextEl.style.opacity = '0';
                setTimeout(() => {
                    statusTextEl.textContent = "Copied email to clipboard! 📋";
                    statusTextEl.style.color = "#10B981"; // Turn text green
                    statusTextEl.style.opacity = '1';
                }, 200);

                // Reset back to normal after 3 seconds
                setTimeout(() => {
                    statusTextEl.style.opacity = '0';
                    setTimeout(() => {
                        statusTextEl.style.color = "var(--text-main)";
                        statusTextEl.textContent = statusMessages[statusIndex];
                        statusTextEl.style.opacity = '1';
                        isClicked = false; // Resume rotation
                    }, 200);
                }, 3000);
            });
        });
    }
    // D. Contact Form Background Submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stops the browser from leaving the page
            
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
                    // Success! Instantly teleport to your custom page
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
})();
/* =========================================
   12. FLOATING GLASS PARALLAX ENGINE
========================================= */
const glassIcons = document.querySelectorAll('.floating-glass');

if (glassIcons.length > 0) {
    // 1. Set the initial tilt before the user even scrolls
    glassIcons.forEach(icon => {
        const rot = icon.getAttribute('data-rot') || '0';
        icon.style.transform = `translate3d(0, 0px, 0) rotate(${rot}deg)`;
    });

    // 2. Keep the tilt applied while scrolling up
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        glassIcons.forEach((icon, index) => {
            const speed = (index + 1) * 0.12; 
            const rot = icon.getAttribute('data-rot') || '0';
            
            // Combines the upward movement (translate3d) with the permanent tilt (rotate)
            icon.style.transform = `translate3d(0, -${scrolled * speed}px, 0) rotate(${rot}deg)`;
        });
    }, { passive: true });
}
/* =========================================
   13. AUTOMATED CHAT WIDGET
========================================= */
const chatBotBtn = document.getElementById('chatBotBtn');
const chatBotModal = document.getElementById('chatBotModal');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatOptions = document.querySelectorAll('.chat-opt-btn');
const chatLog = document.getElementById('chatLog');
const chatGreeting = document.getElementById('chatGreeting');
const chatOptionsGrid = document.getElementById('chatOptionsGrid');
const chatScrollArea = document.getElementById('chatScrollArea');

if (chatBotBtn && chatBotModal) {
    // Open/Close Modal
    chatBotBtn.addEventListener('click', () => {
        chatBotModal.classList.toggle('show');
    });
    closeChatBtn.addEventListener('click', () => {
        chatBotModal.classList.remove('show');
    });
    
    // Handle Question Clicks & Spotlight Hover
    chatOptions.forEach(btn => {
        
        // Spotlight Hover Effect Fix specifically for Chat Buttons
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            btn.style.setProperty('--mouse-x', `${x}px`);
            btn.style.setProperty('--mouse-y', `${y}px`);
        });

        btn.addEventListener('click', function() {
            
            const questionText = this.innerText;
            const answerHTML = this.getAttribute('data-answer');
            
            // Hide the initial greeting and grid
            chatGreeting.style.display = 'none';
            chatOptionsGrid.style.display = 'none';
            
            // Append User Question Bubble
            const userBubble = document.createElement('div');
            userBubble.className = 'chat-bubble user-bubble';
            userBubble.innerText = questionText; // Uses innerText so the HTML span tag doesn't copy over
            chatLog.appendChild(userBubble);
            
            chatScrollArea.scrollTop = chatScrollArea.scrollHeight;
            
            // Simulate Fifi "Thinking" delay (600ms)
            setTimeout(() => {
                const aiBubble = document.createElement('div');
                aiBubble.className = 'chat-bubble ai-bubble';
                aiBubble.innerHTML = answerHTML; // Uses innerHTML so your new Contact Button renders!
                chatLog.appendChild(aiBubble);
                
                // Add a "Ask another question" button
                const resetBtn = document.createElement('button');
                resetBtn.className = 'reset-chat-btn';
                resetBtn.style.display = 'block';
                resetBtn.innerText = '↺ Ask another question';
                resetBtn.onclick = () => {
                    chatLog.innerHTML = ''; // Clear chat
                    chatGreeting.style.display = 'block'; // Show greeting
                    chatOptionsGrid.style.display = 'grid'; // Show options
                };
                chatLog.appendChild(resetBtn);
                
                chatScrollArea.scrollTop = chatScrollArea.scrollHeight;
            }, 600);
        });
    });
}
/* =========================================
   12. ANTI-INSPECT & ANTI-COPY LOGIC
========================================= */

// Disable Right-Click
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Block F12
    if (e.key === 'F12') {
        e.preventDefault();
    }
    // Block Ctrl+Shift+I or Cmd+Option+I (Inspect)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
    }
    // Block Ctrl+Shift+J or Cmd+Option+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
    }
    // Block Ctrl+U or Cmd+Option+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
    }
    // Block Ctrl+Shift+C or Cmd+Option+C (Inspect Element)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
    }
});
