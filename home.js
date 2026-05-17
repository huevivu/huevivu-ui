/* ========================================
   HueViVu — Home Page Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll-based header shadow ---
  const homeScroll = document.getElementById('home-scroll');
  const homeHeader = document.getElementById('home-header');

  if (homeScroll && homeHeader) {
    homeScroll.addEventListener('scroll', () => {
      homeHeader.classList.toggle('scrolled', homeScroll.scrollTop > 10);
    });
  }

  // --- Intersection Observer for section reveal ---
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: homeScroll });

  sections.forEach(s => sectionObserver.observe(s));

  // --- Category pill selection ---
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      pill.style.transform = 'scale(0.93)';
      setTimeout(() => { pill.style.transform = ''; }, 150);
    });
  });

  // --- Quick Action tap & navigation ---
  const qaCards = document.querySelectorAll('.qa-card');
  qaCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.92)';
      setTimeout(() => { card.style.transform = ''; }, 200);
      const action = card.dataset.action;
      
      switch (action) {
        case 'plan':
          setTimeout(() => { window.location.href = 'flow.html'; }, 300);
          break;
        case 'food':
          setTimeout(() => { window.location.href = 'explore.html#food'; }, 300);
          break;
        case 'culture':
          setTimeout(() => { window.location.href = 'explore.html#heritage'; }, 300);
          break;
        case 'photo':
          setTimeout(() => { window.location.href = 'explore.html#photo'; }, 300);
          break;
        default:
          console.log(`🚀 Quick action: ${action}`);
      }
    });
  });

  // --- Active trip card navigation ---
  const btnViewTrip = document.getElementById('btn-view-trip');
  if (btnViewTrip) {
    btnViewTrip.addEventListener('click', () => {
      btnViewTrip.textContent = 'Đang mở...';
      btnViewTrip.style.pointerEvents = 'none';
      setTimeout(() => {
        window.location.href = 'hub.html';
      }, 400);
    });
  }

  // --- Profile avatar navigation ---
  const btnProfile = document.getElementById('btn-profile');
  if (btnProfile) {
    btnProfile.addEventListener('click', () => {
      btnProfile.style.transform = 'scale(0.9)';
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 200);
    });
  }

  // --- Notification Panel ---
  const btnNotif = document.getElementById('btn-notif');
  const notifOverlay = document.getElementById('notif-overlay');
  const notifPanel = document.getElementById('notif-panel');
  const notifClose = document.getElementById('notif-close');

  function openNotif() {
    if (notifOverlay) notifOverlay.classList.add('open');
    if (notifPanel) notifPanel.classList.add('open');
  }

  function closeNotif() {
    if (notifOverlay) notifOverlay.classList.remove('open');
    if (notifPanel) notifPanel.classList.remove('open');
  }

  if (btnNotif) btnNotif.addEventListener('click', openNotif);
  if (notifClose) notifClose.addEventListener('click', closeNotif);
  if (notifOverlay) notifOverlay.addEventListener('click', closeNotif);

  // Notification item click feedback
  document.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.remove('notif-unread');
      item.style.background = 'rgba(255, 127, 107, 0.06)';
      setTimeout(() => { item.style.background = ''; }, 300);
    });
  });

  // --- AI Welcome Banner ---
  const aiChipAccept = document.getElementById('ai-chip-accept');
  const aiChipDismiss = document.getElementById('ai-chip-dismiss');
  const aiWelcomeBanner = document.getElementById('ai-welcome-banner');

  if (aiChipAccept) {
    aiChipAccept.addEventListener('click', () => {
      aiChipAccept.textContent = 'Đang mở...';
      setTimeout(() => { window.location.href = 'hub.html'; }, 400);
    });
  }

  if (aiChipDismiss && aiWelcomeBanner) {
    aiChipDismiss.addEventListener('click', () => {
      aiWelcomeBanner.classList.add('dismissed');
      setTimeout(() => {
        const section = document.getElementById('ai-welcome-section');
        if (section) section.style.display = 'none';
      }, 400);
    });
  }

  // --- Search overlay ---
  const searchInput = document.getElementById('search-input');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchOverlayInput = document.getElementById('search-overlay-input');

  if (searchInput && searchOverlay) {
    searchInput.addEventListener('focus', () => {
      searchOverlay.classList.add('open');
      setTimeout(() => {
        if (searchOverlayInput) searchOverlayInput.focus();
      }, 100);
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('open');
      if (searchOverlayInput) searchOverlayInput.value = '';
      if (searchInput) searchInput.blur();
    });
  }

  // --- Trending chip click ---
  const trendChips = document.querySelectorAll('.trend-chip');
  trendChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (searchOverlayInput) {
        searchOverlayInput.value = chip.textContent;
        searchOverlayInput.focus();
      }
    });
  });

  // --- Bottom navigation ---
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transform = 'scale(0.9)';
      setTimeout(() => { item.style.transform = ''; }, 200);
    });
  });

  // --- AI Plan button (fab-ai style) ---
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

  // --- Place card tap ---
  const placeCards = document.querySelectorAll('.place-card');
  placeCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.96)';
      setTimeout(() => { card.style.transform = ''; }, 200);
    });
  });

  // --- Food card tap ---
  const foodCards = document.querySelectorAll('.food-card');
  foodCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { card.style.transform = ''; }, 200);
    });
  });

  // --- Tour card tap ---
  const tourCards = document.querySelectorAll('.tour-card');
  tourCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.96)';
      setTimeout(() => { card.style.transform = ''; }, 200);
    });
  });

  // --- Button ripple effect ---
  const rippleTargets = document.querySelectorAll('.atc-btn, .qa-card');
  rippleTargets.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        border-radius:50%; background:rgba(255,255,255,0.25);
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        transform:scale(0); animation:rippleEffect 0.5s ease-out forwards;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Add ripple keyframes
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleEffect { to { transform:scale(2.5); opacity:0; } }`;
  document.head.appendChild(style);

  // --- Touch feedback for mobile ---
  if ('ontouchstart' in window) {
    document.querySelectorAll('.header-btn, .avatar, .search-filter, .cat-pill, .trend-chip').forEach(el => {
      el.addEventListener('touchstart', () => {
        el.style.transform = 'scale(0.93)';
        el.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      el.addEventListener('touchend', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1)';
      }, { passive: true });
    });
  }

  console.log('🏠 HueViVu Home loaded');
});
