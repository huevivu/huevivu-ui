/* ========================================
   HueViVu — Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Parallax tilt on hero image ---
  const heroContainer = document.querySelector('.hero-image-container');
  if (heroContainer) {
    heroContainer.addEventListener('mousemove', (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroContainer.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    heroContainer.addEventListener('mouseleave', () => {
      heroContainer.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      heroContainer.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    heroContainer.addEventListener('mouseenter', () => {
      heroContainer.style.transition = 'none';
    });
  }

  // --- Button ripple effect ---
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleEffect {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // --- Language toggle ---
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    let isEn = true;
    langToggle.addEventListener('click', () => {
      isEn = !isEn;
      const active = langToggle.querySelector('.lang-active');
      const inactive = langToggle.querySelector('.lang-inactive');
      if (isEn) {
        active.textContent = 'EN';
        inactive.textContent = 'VI';
      } else {
        active.textContent = 'VI';
        inactive.textContent = 'EN';
      }
      langToggle.style.transform = 'scale(0.95)';
      setTimeout(() => { langToggle.style.transform = 'scale(1)'; }, 150);
    });
  }

  // --- Start Planning CTA ---
  const btnStart = document.getElementById('btn-start-planning');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      btnStart.innerHTML = '<span class="btn-sparkle">🚀</span><span class="btn-text">Preparing your journey...</span>';
      btnStart.style.pointerEvents = 'none';
      // Navigate to AI question flow
      setTimeout(() => {
        window.location.href = 'flow.html';
      }, 600);
    });
  }

  // --- Intersection Observer for scroll animations ---
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // --- Touch feedback for mobile ---
  if ('ontouchstart' in window) {
    document.querySelectorAll('.floating-card, .language-pill').forEach(el => {
      el.addEventListener('touchstart', () => {
        el.style.transform = 'scale(0.96)';
        el.style.transition = 'transform 0.15s ease';
      });
      el.addEventListener('touchend', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  console.log('🌸 HueViVu — AI Travel Companion loaded');
});
