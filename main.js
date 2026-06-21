// =========================================
// FARDIN's GLOBAL JAVASCRIPT
// =========================================

// ── 1. ADVANCED THEME TOGGLE ──
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-mode'); }
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) { localStorage.setItem('theme', 'dark'); } 
    else { localStorage.setItem('theme', 'light'); }
  });
}

// ── 2. CERTIFICATE GENERATOR ──
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

// ── 3. LIGHTBOX LOGIC ──
const lightbox = document.getElementById('lightbox-overlay');
if (lightbox) {
  let currentImageIndex = 0;
  let imageArray = [];
  const lightboxImg = document.getElementById('lightbox-img');

  setTimeout(() => {
    const images = document.querySelectorAll('.grid-img, .cert-img');
    if(images.length > 0) {
      imageArray = Array.from(images).map(img => img.src);
      images.forEach((img, index) => {
        img.onclick = () => {
          currentImageIndex = index;
          lightboxImg.src = imageArray[currentImageIndex];
          lightbox.classList.add('show');
          document.body.style.overflow = 'hidden';
        };
      });
    }
  }, 100);

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
    if(e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
  });

  let touchStartX = 0; let touchEndX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
  lightbox.addEventListener('touchend', e => { 
    touchEndX = e.changedTouches[0].screenX; 
    if (touchStartX - touchEndX > 50) changeImage(1); 
    if (touchEndX - touchStartX > 50) changeImage(-1); 
  }, {passive: true});

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'ArrowLeft') changeImage(-1);
  });
}

// ── 4. SMOOTH PAGE TRANSITIONS ──
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', e => {
      if (
        link.hostname === window.location.hostname && 
        link.target !== '_blank' && 
        !link.hasAttribute('download') &&
        !link.href.includes('mailto:') &&
        link.getAttribute('href') !== '#'
      ) {
        e.preventDefault(); 
        const targetUrl = link.href;
        document.body.classList.add('fade-out');
        setTimeout(() => { window.location.href = targetUrl; }, 300); 
      }
    });
  });
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) { document.body.classList.remove('fade-out'); }
});

// ── 5. CURRENT YEAR ──
const yearSpan = document.getElementById('current-year');
if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
