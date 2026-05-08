/* ========================================
   HueViVu — Explore Page Interactions
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('page-scroll');
  const header = document.getElementById('page-header');

  if (scroll && header) {
    scroll.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', scroll.scrollTop > 10);
    });
  }

  // Section reveal
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: scroll });
  sections.forEach(s => obs.observe(s));

  // Filter chips
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(c => {
    c.addEventListener('click', () => {
      chips.forEach(p => p.classList.remove('active'));
      c.classList.add('active');
      c.style.transform = 'scale(0.93)';
      setTimeout(() => { c.style.transform = ''; }, 150);
    });
  });

  // Map pin tooltips
  const pins = document.querySelectorAll('.map-pin');
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pin.style.transform = 'scale(1.4)';
      setTimeout(() => { pin.style.transform = ''; }, 300);
    });
  });

  // Nearby card tap
  document.querySelectorAll('.nearby-card, .exp-card, .collection-card, .tip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { card.style.transform = ''; }, 200);
    });
  });

  // AI Plan button (fab-ai style)
  const navAi = document.getElementById('nav-ai');
  if (navAi) {
    navAi.addEventListener('click', () => {
      const btn = navAi.querySelector('.nav-ai-btn');
      if (btn) {
        btn.style.transform = 'scale(0.85)';
        btn.style.boxShadow = '0 4px 16px rgba(255, 127, 107, 0.6)';
      }
      setTimeout(() => { window.location.href = 'flow.html'; }, 300);
    });
  }

  console.log('🔍 HueViVu Explore loaded');
});
