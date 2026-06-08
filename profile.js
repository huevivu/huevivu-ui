/* ========================================
   HueViVu — Profile Page Interactions
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

  // Preference tag toggle
  const prefTags = document.querySelectorAll('.pref-tag');
  prefTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      tag.style.transform = 'scale(0.93)';
      setTimeout(() => { tag.style.transform = ''; }, 150);
    });
  });

  // --- Achievement Badge Dropdown ---
  const achToggle = document.getElementById('ach-toggle');
  const achWrap = document.getElementById('achievement-wrap');
  if (achToggle && achWrap) {
    let firstOpen = true;
    achToggle.addEventListener('click', () => {
      achWrap.classList.toggle('open');
      // Animate progress bars on first open
      if (firstOpen && achWrap.classList.contains('open')) {
        firstOpen = false;
        achWrap.querySelectorAll('.badge-fill').forEach(fill => {
          const target = fill.style.width;
          fill.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              fill.style.width = target;
            });
          });
        });
      }
    });
  }

  // Menu item tap
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.background = 'rgba(255, 127, 107, 0.06)';
      setTimeout(() => { item.style.background = ''; }, 300);
    });
  });

  // Saved card tap
  document.querySelectorAll('.saved-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.93)';
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

  // Logout
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        window.location.href = 'index.html';
      }
    });
  }

  console.log('👤 HueViVu Profile loaded');
});
