/* ========================================
   HueViVu — Trips Page Interactions
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

  // Tab switching
  const tabs = document.querySelectorAll('.trips-tab');
  const tabContents = {
    active: document.getElementById('tab-active'),
    upcoming: document.getElementById('tab-upcoming'),
    past: document.getElementById('tab-past')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      Object.values(tabContents).forEach(c => c.classList.remove('active'));
      if (tabContents[target]) {
        tabContents[target].classList.add('active');
        // Re-observe sections in newly visible tab
        tabContents[target].querySelectorAll('.section').forEach(s => {
          s.classList.remove('visible');
          obs.observe(s);
        });
      }
    });
  });

  // Card taps
  document.querySelectorAll('.today-card, .memory-item').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { card.style.transform = ''; }, 200);
    });
  });

  // --- Trip item navigation ---
  document.querySelectorAll('.trip-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transform = 'scale(0.97)';
      item.style.background = 'rgba(255, 127, 107, 0.04)';
      setTimeout(() => {
        window.location.href = 'hub.html';
      }, 300);
    });
  });

  // --- Add Trip button ---
  const btnAddTrip = document.getElementById('btn-add-trip');
  if (btnAddTrip) {
    btnAddTrip.addEventListener('click', () => {
      btnAddTrip.style.transform = 'scale(0.85)';
      setTimeout(() => {
        window.location.href = 'flow.html';
      }, 200);
    });
  }

  // --- Empty state plan button ---
  const btnEmptyPlan = document.getElementById('btn-empty-plan');
  if (btnEmptyPlan) {
    btnEmptyPlan.addEventListener('click', () => {
      btnEmptyPlan.querySelector('.btn-text').textContent = 'Đang chuẩn bị...';
      setTimeout(() => {
        window.location.href = 'flow.html';
      }, 500);
    });
  }

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

  // Animate progress bar on load
  setTimeout(() => {
    const fill = document.querySelector('.ct-progress-fill');
    if (fill) {
      fill.style.width = '42%';
    }
  }, 500);

  console.log('📅 HueViVu Trips loaded');
});
