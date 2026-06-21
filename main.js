// Advanced Theme Toggle Logic
const themeBtn = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-mode'); }
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) { localStorage.setItem('theme', 'dark'); } 
  else { localStorage.setItem('theme', 'light'); }
});

// ── LIGHTBOX JAVASCRIPT ──
let currentImageIndex = 0;
let imageArray = [];
const lightbox = document.getElementById('lightbox-overlay');
const lightboxImg = document.getElementById('lightbox-img');

// Initialize images into an array for sliding
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const images = document.querySelectorAll('.grid-img');
    imageArray = Array.from(images).map(img => img.src);
    images.forEach((img, index) => {
      img.onclick = () => openLightbox(index);
    });
  }, 100);
});

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxImage();
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden'; // Stop background scrolling
}

function closeLightbox() {
  lightbox.classList.remove('show');
  document.body.style.overflow = 'auto';
}

function changeImage(step, event) {
  if(event) event.stopPropagation(); // Stop clicks from closing the modal
  currentImageIndex += step;
  if (currentImageIndex < 0) currentImageIndex = imageArray.length - 1;
  if (currentImageIndex >= imageArray.length) currentImageIndex = 0;
  updateLightboxImage();
}

function updateLightboxImage() {
  lightboxImg.src = imageArray[currentImageIndex];
}

// Close when clicking the dark background
lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
});

// Mobile Swipe Gestures
let touchStartX = 0;
let touchEndX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
lightbox.addEventListener('touchend', e => { 
  touchEndX = e.changedTouches[0].screenX; 
  if (touchStartX - touchEndX > 50) changeImage(1); // Swipe left = Next
  if (touchEndX - touchStartX > 50) changeImage(-1); // Swipe right = Prev
}, {passive: true});

// Keyboard Arrows
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') changeImage(1);
  if (e.key === 'ArrowLeft') changeImage(-1);
});

document.getElementById('current-year').textContent = new Date().getFullYear();
