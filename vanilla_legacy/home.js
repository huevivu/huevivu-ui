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

  // --- Category pill selection → mở Khám phá theo danh mục ---
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      pill.style.transform = 'scale(0.93)';
      const cat = pill.dataset.cat;
      setTimeout(() => {
        pill.style.transform = '';
        if (cat && cat !== 'all') window.location.href = `explore.html?cat=${cat}`;
        else window.location.href = 'explore.html';
      }, 180);
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
  let activeTripId = null;
  const btnViewTrip = document.getElementById('btn-view-trip');
  if (btnViewTrip) {
    btnViewTrip.addEventListener('click', () => {
      btnViewTrip.textContent = 'Đang mở...';
      btnViewTrip.style.pointerEvents = 'none';
      setTimeout(() => {
        window.location.href = activeTripId ? `hub.html?id=${activeTripId}` : 'hub.html';
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
        runSearch(chip.textContent);
      }
    });
  });

  // --- Search thật (gọi API.getPlaces) ---
  const searchResults = document.getElementById('search-results');
  const trendingBlock = document.querySelector('.search-trending');
  let searchTimer = null;

  function placeResultHTML(p) {
    return `
      <div class="search-result-item" data-place="${p.id}" style="display:flex;gap:12px;align-items:center;padding:12px;border-radius:14px;cursor:pointer;transition:background .2s">
        <img src="${p.img || 'assets/citadel.png'}" alt="${p.name}" style="width:56px;height:56px;border-radius:12px;object-fit:cover;flex-shrink:0" />
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:14px;color:var(--text,#2c2c2c)">${p.name}</div>
          <div style="font-size:12px;color:var(--text-muted,#8a8a8a);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.address || p.category || ''}</div>
        </div>
        <span style="font-size:12px;color:var(--coral,#FF7F6B);font-weight:600">⭐ ${p.rating || ''}</span>
      </div>`;
  }

  async function runSearch(q) {
    if (!searchResults) return;
    q = (q || '').trim();
    if (!q) {
      searchResults.innerHTML = '';
      if (trendingBlock) trendingBlock.style.display = '';
      return;
    }
    if (trendingBlock) trendingBlock.style.display = 'none';
    searchResults.innerHTML = '<p style="text-align:center;color:var(--text-muted,#8a8a8a);padding:20px;font-size:13px">Đang tìm...</p>';
    if (typeof API === 'undefined') return;
    try {
      const places = await API.getPlaces({ q });
      if (!places.length) {
        searchResults.innerHTML = `<p style="text-align:center;color:var(--text-muted,#8a8a8a);padding:24px;font-size:13px">Không tìm thấy "${q}" 🌸</p>`;
        return;
      }
      searchResults.innerHTML = places.map(placeResultHTML).join('');
    } catch {
      searchResults.innerHTML = '';
    }
  }

  if (searchOverlayInput) {
    searchOverlayInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => runSearch(searchOverlayInput.value), 280);
    });
  }
  if (searchResults) {
    searchResults.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item && item.dataset.place) window.location.href = `place-detail.html?id=${item.dataset.place}`;
    });
  }

  // --- Load dữ liệu thật: active trip + thời tiết ---
  async function loadHome() {
    if (typeof API === 'undefined') return;

    // Active trip
    try {
      const trips = await API.getTrips();
      const active = (trips || []).filter(t => t.status === 'active');
      const section = document.getElementById('active-trip-section');
      if (active.length) {
        const t = active[0];
        activeTripId = t.id;
        const titleEl = document.querySelector('.atc-title');
        if (titleEl) titleEl.textContent = t.title;
        const metaEl = document.querySelector('.atc-meta');
        if (metaEl) metaEl.innerHTML = `<span>📅 ${t.duration} ngày</span><span>·</span><span>📍 ${t.total_cost_estimate || ''}</span>`;
      } else if (section) {
        section.style.display = 'none';
      }
    } catch {}

    // Weather → cập nhật câu chào AI
    try {
      const w = await API.getWeather();
      const txt = document.querySelector('.ai-welcome-text');
      if (txt && w) {
        const tip = w.condition === 'rainy'
          ? 'trời có mưa — ghé The Time Coffee nhâm nhi cà phê và ngắm phố cổ ☕'
          : w.condition === 'cloudy'
            ? 'trời nhiều mây dịu mát — hợp dạo Hoàng Thành và chụp ảnh 🏛️'
            : 'trời đẹp — thích hợp ghé Chùa Thiên Mụ lúc sáng sớm, ánh sáng vàng rất đẹp 🌅';
        txt.textContent = `Chào bạn! Huế hôm nay ${w.temp}°C, ${w.condition_vi || ''} — ${tip}`;
      }
    } catch {}
  }
  loadHome();

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

  // --- Place card → detail page ---
  const placeCards = document.querySelectorAll('.place-card');
  placeCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.96)';
      const placeId = card.dataset.place || 'citadel';
      setTimeout(() => { window.location.href = `place-detail.html?id=${placeId}`; }, 200);
    });
  });

  // --- Food card → detail page ---
  const foodCards = document.querySelectorAll('.food-card');
  foodCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      const placeId = card.dataset.place || 'bunbo';
      setTimeout(() => { window.location.href = `place-detail.html?id=${placeId}`; }, 200);
    });
  });

  // --- Tour card → detail page ---
  const tourCards = document.querySelectorAll('.tour-card');
  tourCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.96)';
      const tourId = card.dataset.tour || 'culture3d';
      setTimeout(() => { window.location.href = `tour-detail.html?id=${tourId}`; }, 200);
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

  // "Xem tất cả" → Khám phá (mục ẩm thực lọc sẵn danh mục food)
  document.querySelectorAll('.see-all').forEach(btn => {
    btn.addEventListener('click', () => {
      const heading = btn.closest('section, .section, .home-section')?.textContent || '';
      const cat = /ẩm thực|món ăn|food/i.test(heading) ? '?cat=food' : '';
      window.location.href = 'explore.html' + cat;
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
