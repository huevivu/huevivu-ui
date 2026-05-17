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

  // --- Search Overlay ---
  const exploreInput = document.getElementById('explore-input');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('explore-search-close');
  const overlayInput = document.getElementById('explore-overlay-input');

  if (exploreInput && searchOverlay) {
    exploreInput.addEventListener('focus', () => {
      searchOverlay.classList.add('open');
      setTimeout(() => {
        if (overlayInput) overlayInput.focus();
      }, 100);
      // Blur the original input so keyboard doesn't double-show
      exploreInput.blur();
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('open');
      if (overlayInput) overlayInput.value = '';
    });
  }

  // Trending chip click in overlay
  document.querySelectorAll('.search-overlay .trend-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (overlayInput) {
        overlayInput.value = chip.textContent;
        overlayInput.focus();
      }
    });
  });

  // Recent item click in overlay
  document.querySelectorAll('.recent-item').forEach(item => {
    item.addEventListener('click', () => {
      if (overlayInput) {
        overlayInput.value = item.textContent.trim();
        overlayInput.focus();
      }
    });
  });

  // AI suggest card click
  document.querySelectorAll('.ai-suggest-card').forEach(card => {
    card.addEventListener('click', () => {
      if (overlayInput) {
        const text = card.querySelector('.ai-suggest-text');
        if (text) {
          overlayInput.value = text.textContent;
          overlayInput.focus();
        }
      }
    });
  });

  // --- Location Banner ---
  const locEnable = document.getElementById('loc-enable');
  const locBanner = document.getElementById('location-banner');
  if (locEnable && locBanner) {
    locEnable.addEventListener('click', () => {
      locEnable.textContent = 'Đang bật...';
      locEnable.style.opacity = '0.6';
      locEnable.style.pointerEvents = 'none';
      setTimeout(() => {
        locBanner.classList.add('hidden');
        setTimeout(() => {
          locBanner.parentElement.style.display = 'none';
        }, 400);
      }, 800);
    });
  }

  // --- AI Explore Bar action ---
  const aiExploreAction = document.getElementById('ai-explore-action');
  if (aiExploreAction) {
    aiExploreAction.addEventListener('click', () => {
      aiExploreAction.style.transform = 'scale(0.9)';
      setTimeout(() => { aiExploreAction.style.transform = ''; }, 200);
    });
  }

  console.log('🔍 HueViVu Explore loaded');
});
