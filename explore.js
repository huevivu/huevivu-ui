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

  // Filter chips → lọc địa điểm thật theo danh mục
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(c => {
    c.addEventListener('click', () => {
      chips.forEach(p => p.classList.remove('active'));
      c.classList.add('active');
      c.style.transform = 'scale(0.93)';
      setTimeout(() => { c.style.transform = ''; }, 150);
      loadPlaces(c.dataset.filter);
    });
  });

  // --- Render danh sách địa điểm thật vào #nearby-list ---
  const CAT_LABEL = {
    heritage: '🏛️ Di tích lịch sử', food: '🍜 Ẩm thực', nature: '🌿 Thiên nhiên',
    temple: '🛕 Chùa chiền', cafe: '☕ Cà phê', market: '🛍️ Chợ', beach: '🏖️ Biển',
  };
  const nearbyList = document.getElementById('nearby-list');

  function nearbyCardHTML(p) {
    return `
      <div class="nearby-card" data-place="${p.id}">
        <div class="nearby-img"><img src="${p.img || 'assets/citadel.png'}" alt="${p.name}" /></div>
        <div class="nearby-body">
          <span class="nearby-name">${p.name}</span>
          <span class="nearby-cat">${CAT_LABEL[p.category] || p.category || ''}</span>
          <div class="nearby-bottom">
            <span class="nearby-dist">📍 ${p.distance || 'Huế'}</span>
            <span class="nearby-rating">⭐ ${p.rating || ''}</span>
          </div>
        </div>
      </div>`;
  }

  async function loadPlaces(category) {
    if (typeof API === 'undefined' || !nearbyList) return;
    const params = (category && category !== 'all' && category !== 'photo') ? { category } : {};
    try {
      let places = await API.getPlaces(params);
      // 'photo' không phải category DB → lọc theo tag chứa 'photo'
      if (category === 'photo') {
        places = (places || []).filter(p => JSON.stringify(p.tags || []).includes('photo'));
      }
      if (Array.isArray(places) && places.length) {
        nearbyList.innerHTML = places.map(nearbyCardHTML).join('');
      } else {
        nearbyList.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text-muted,#8a8a8a);font-size:13px">Chưa có địa điểm trong nhóm này 🌸</p>';
      }
    } catch {}
  }

  // Đọc ?cat từ URL (đến từ Home category pill)
  const urlCat = new URLSearchParams(window.location.search).get('cat')
    || (window.location.hash ? window.location.hash.slice(1) : '');
  if (urlCat) {
    const chip = Array.from(chips).find(c => c.dataset.filter === urlCat);
    if (chip) { chips.forEach(p => p.classList.remove('active')); chip.classList.add('active'); }
    loadPlaces(urlCat);
  } else {
    loadPlaces('all');
  }

  // Map pin tooltips
  const pins = document.querySelectorAll('.map-pin');
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pin.style.transform = 'scale(1.4)';
      setTimeout(() => { pin.style.transform = ''; }, 300);
    });
  });

  // --- Nearby card → place detail (delegation vì render động) ---
  if (nearbyList) {
    nearbyList.addEventListener('click', (e) => {
      const card = e.target.closest('.nearby-card');
      if (!card) return;
      card.style.transform = 'scale(0.97)';
      const placeId = card.dataset.place || 'citadel';
      setTimeout(() => { window.location.href = `place-detail.html?id=${placeId}`; }, 180);
    });
  }

  // --- Experience card → experience detail ---
  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      const expId = card.dataset.exp || 'sunset';
      setTimeout(() => { window.location.href = `experience-detail.html?id=${expId}`; }, 200);
    });
  });

  // --- Collection card → collection detail ---
  document.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      const colId = card.dataset.col || 'unesco';
      setTimeout(() => { window.location.href = `collection-detail.html?id=${colId}`; }, 200);
    });
  });

  // --- Tip card tap ---
  document.querySelectorAll('.tip-card').forEach(card => {
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

  // --- AI Explore Bar action → place detail ---
  const aiExploreAction = document.getElementById('ai-explore-action');
  if (aiExploreAction) {
    aiExploreAction.addEventListener('click', () => {
      aiExploreAction.textContent = 'Đang mở...';
      setTimeout(() => { window.location.href = 'place-detail.html?id=pagoda'; }, 300);
    });
  }

  // --- Search thật ---
  const exploreResults = document.getElementById('explore-search-results');
  let searchTimer = null;

  function placeResultHTML(p) {
    return `
      <div class="search-result-item" data-place="${p.id}" style="display:flex;gap:12px;align-items:center;padding:12px;border-radius:14px;cursor:pointer">
        <img src="${p.img || 'assets/citadel.png'}" alt="${p.name}" style="width:56px;height:56px;border-radius:12px;object-fit:cover;flex-shrink:0" />
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:14px;color:var(--text,#2c2c2c)">${p.name}</div>
          <div style="font-size:12px;color:var(--text-muted,#8a8a8a);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.address || p.category || ''}</div>
        </div>
        <span style="font-size:12px;color:var(--coral,#FF7F6B);font-weight:600">⭐ ${p.rating || ''}</span>
      </div>`;
  }

  async function runSearch(q) {
    if (!exploreResults) return;
    q = (q || '').trim();
    if (!q) { exploreResults.innerHTML = ''; return; }
    exploreResults.innerHTML = '<p style="text-align:center;color:var(--text-muted,#8a8a8a);padding:20px;font-size:13px">Đang tìm...</p>';
    if (typeof API === 'undefined') return;
    try {
      const places = await API.getPlaces({ q });
      exploreResults.innerHTML = places.length
        ? places.map(placeResultHTML).join('')
        : `<p style="text-align:center;color:var(--text-muted,#8a8a8a);padding:24px;font-size:13px">Không tìm thấy "${q}" 🌸</p>`;
    } catch { exploreResults.innerHTML = ''; }
  }

  if (overlayInput) {
    overlayInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => runSearch(overlayInput.value), 280);
    });
  }
  if (exploreResults) {
    exploreResults.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item && item.dataset.place) window.location.href = `place-detail.html?id=${item.dataset.place}`;
    });
  }
  // Trend chip / recent / ai-suggest → trigger search
  document.querySelectorAll('.search-overlay .trend-chip, .recent-item, .ai-suggest-card').forEach(el => {
    el.addEventListener('click', () => { if (overlayInput) runSearch(overlayInput.value); });
  });

  // --- Weather strip thật ---
  (async () => {
    if (typeof API === 'undefined') return;
    try {
      const w = await API.getWeather();
      if (!w) return;
      const icon = w.condition === 'rainy' ? '🌧️' : w.condition === 'cloudy' ? '⛅' : '🌤️';
      const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
      set('.weather-icon', icon);
      set('.weather-temp', `${w.temp}°C`);
      set('.weather-desc', w.condition_vi || '');
      const details = document.querySelector('.weather-details');
      if (details) details.innerHTML = `<span>💧 ${w.humidity}%</span><span>🌬️ ${w.wind_kmh} km/h</span><span>🌅 17:45</span>`;
    } catch {}
  })();

  // ════════════════════════════════════════════
  // MAP OVERLAY + chế độ NGOẠI TUYẾN (hành trình đã lưu)
  // ════════════════════════════════════════════
  const CACHE_KEY = 'hv_offline_trip';

  // Lịch trình mẫu — luôn có sẵn để offline không bao giờ trống
  const SAMPLE_TRIP = {
    title: 'Khám Phá Huế',
    savedAt: null,
    itinerary: { days: [
      { day: 1, theme: 'Di sản cố đô', activities: [
        { time: '08:00', name: 'Hoàng Thành Huế', type: 'heritage', location: 'Đại Nội' },
        { time: '11:30', name: 'Bún bò Bà Tuyết', type: 'food', location: 'Thuận Hòa' },
        { time: '15:00', name: 'Chùa Thiên Mụ', type: 'temple', location: 'Sông Hương' },
        { time: '17:30', name: 'Hoàng hôn sông Hương', type: 'nature', location: 'Bến Tòa Khâm' },
      ]},
      { day: 2, theme: 'Lăng tẩm & ẩm thực', activities: [
        { time: '08:30', name: 'Lăng Tự Đức', type: 'heritage', location: 'Thủy Xuân' },
        { time: '12:00', name: 'Cơm hến Cồn Hến', type: 'food', location: 'Cồn Hến' },
        { time: '16:00', name: 'Làng hương Thủy Xuân', type: 'experience', location: 'Thủy Xuân' },
      ]},
    ]},
  };

  const EMOJI = { heritage:'🏛️', food:'🍜', nature:'🌿', cafe:'☕', experience:'✨', temple:'🛕', market:'🛍️', beach:'🏖️', nightlife:'🌙', shopping:'🛍️' };
  const emojiFor = (t) => (window.TripRender && window.TripRender.emojiFor(t)) || EMOJI[t] || '📍';
  const daysOf = (trip) => (window.TripRender ? window.TripRender.extractDays(trip && trip.itinerary) : ((trip && trip.itinerary && trip.itinerary.days) || []));

  // Lưu lịch trình gần nhất xuống máy (để dùng khi mất mạng)
  async function cacheLatestTrip() {
    if (!navigator.onLine || typeof API === 'undefined') return;
    try {
      const trips = await API.getTrips();
      const trip = Array.isArray(trips) ? trips[0] : (trips && trips.trips && trips.trips[0]);
      if (trip && (trip.itinerary || trip.days)) {
        const snap = {
          title: trip.title || trip.name || 'Hành trình của bạn',
          itinerary: trip.itinerary || { days: trip.days },
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(snap));
      }
    } catch {}
  }

  function getSavedTrip() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return SAMPLE_TRIP;
  }

  function fmtSaved(iso) {
    if (!iso) return 'Lịch trình mẫu (offline)';
    try {
      const d = new Date(iso);
      const p = (n) => String(n).padStart(2, '0');
      return `Đã lưu ${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}`;
    } catch { return 'Đã lưu'; }
  }

  function renderRoute(trip) {
    const box = document.getElementById('map-route');
    if (!box) return;
    const days = daysOf(trip);
    if (!days.length) {
      box.innerHTML = '<div class="mov-empty">Chưa có hành trình nào được lưu.<br>Tạo lịch trình để xem được cả khi ngoại tuyến 🌸</div>';
      return;
    }
    box.innerHTML = days.map(day => {
      const stops = (day.activities || []).map(a => `
        <div class="mov-stop">
          <span class="mov-stop-time">${a.time || ''}</span>
          <span class="mov-stop-emoji">${emojiFor(a.type)}</span>
          <div class="mov-stop-body">
            <div class="mov-stop-name">${a.name || ''}</div>
            ${a.location ? `<div class="mov-stop-meta">📍 ${String(a.location).split(',')[0]}</div>` : ''}
          </div>
        </div>`).join('');
      return `
        <div class="mov-day">
          <div class="mov-day-pill">Ngày ${day.day || ''} <span class="theme">${day.theme || ''}</span></div>
          ${stops}
        </div>`;
    }).join('');
  }

  const overlay = document.getElementById('map-overlay');

  function refreshMapState() {
    if (!overlay) return;
    const online = navigator.onLine;
    overlay.classList.toggle('is-offline', !online);
    const status = document.getElementById('map-ov-status');
    if (status) status.textContent = online ? '● Trực tuyến' : '● Ngoại tuyến';
    const trip = getSavedTrip();
    const title = document.getElementById('map-ov-route-title');
    const saved = document.getElementById('map-ov-saved');
    if (title) title.textContent = trip.title || 'Hành trình của bạn';
    if (saved) saved.textContent = online ? '' : fmtSaved(trip.savedAt);
    renderRoute(trip);
  }

  function openMap() {
    if (!overlay) return;
    refreshMapState();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }
  function closeMap() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('btn-map')?.addEventListener('click', openMap);
  document.getElementById('map-expand')?.addEventListener('click', openMap);
  document.getElementById('map-ov-close')?.addEventListener('click', closeMap);

  // Cập nhật trạng thái ngay khi mạng đổi
  window.addEventListener('online', () => { cacheLatestTrip(); if (overlay?.classList.contains('open')) refreshMapState(); });
  window.addEventListener('offline', () => { if (overlay?.classList.contains('open')) refreshMapState(); });

  // Lưu lịch trình ngay khi vào trang (lúc còn mạng)
  cacheLatestTrip();

  console.log('🔍 HueViVu Explore loaded');
});
