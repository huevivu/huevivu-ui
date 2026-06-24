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

  // --- Trip item navigation (gắn lại sau khi render động) ---
  function bindTripItems() {
    document.querySelectorAll('.trip-item').forEach(item => {
      if (item.dataset.bound) return;
      item.dataset.bound = '1';
      item.addEventListener('click', () => {
        item.style.transform = 'scale(0.97)';
        item.style.background = 'rgba(255, 127, 107, 0.04)';
        const id = item.dataset.id;
        setTimeout(() => {
          window.location.href = id ? `hub.html?id=${id}` : 'hub.html';
        }, 250);
      });
    });
  }
  bindTripItems();

  // --- Load chuyến đi thật từ backend ---
  const TAG_CLASSES = ['tag-blue', 'tag-purple', 'tag-green', 'tag-coral'];
  function fmtDate(s) {
    if (!s) return '';
    const d = new Date(s.replace(' ', 'T'));
    if (isNaN(d)) return '';
    return `📅 ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  function tripItemHTML(t, i, past) {
    const imgs = ['assets/citadel.png', 'assets/river.png', 'assets/hero.png', 'assets/food.png'];
    const companionVi = { solo: 'Solo', couple: 'Cặp đôi', friends: 'Bạn bè', family: 'Gia đình' };
    return `
      <div class="trip-item${past ? ' trip-past' : ''}" data-id="${t.id}">
        <div class="trip-item-img"><img src="${imgs[i % imgs.length]}" alt="${t.title}" /></div>
        <div class="trip-item-body">
          <span class="trip-item-name">${t.title}</span>
          <span class="trip-item-date">${fmtDate(t.created_at)}</span>
          <div class="trip-item-meta">
            <span class="tag ${TAG_CLASSES[i % TAG_CLASSES.length]}">${t.duration} ngày</span>
            ${past ? `<span>⭐ ${((t.ai_match_score || 90) / 20).toFixed(1)}</span>` : `<span class="tag tag-purple">${companionVi[t.companion] || t.companion || ''}</span>`}
          </div>
        </div>
        <div class="trip-item-arrow">→</div>
      </div>`;
  }

  async function loadTrips() {
    if (typeof API === 'undefined') return;
    let trips;
    try { trips = await API.getTrips(); } catch { return; }
    if (!Array.isArray(trips)) return;

    const active   = trips.filter(t => t.status === 'active');
    const upcoming = trips.filter(t => t.status === 'upcoming');
    const past     = trips.filter(t => t.status === 'past');

    // --- Active tab: current trip card ---
    const currentCard = document.querySelector('#tab-active .current-trip-card');
    if (active.length) {
      const t = active[0];
      if (currentCard) {
        const titleEl = currentCard.querySelector('.ct-title');
        const subEl = currentCard.querySelector('.ct-subtitle');
        if (titleEl) titleEl.textContent = t.title;
        if (subEl) subEl.textContent = t.summary || 'Lịch trình Huế do AI tạo';
        const statVals = currentCard.querySelectorAll('.ct-stat-val');
        if (statVals[0]) statVals[0].textContent = t.duration;
        if (statVals[3] && t.total_cost_estimate) statVals[3].textContent = t.total_cost_estimate;
        const btn = currentCard.querySelector('.ct-btn');
        if (btn) btn.setAttribute('href', `hub.html?id=${t.id}`);
      }
    } else {
      // Không có chuyến đang diễn ra → empty state thật
      const tabActive = document.getElementById('tab-active');
      if (tabActive) {
        tabActive.innerHTML = `
          <div class="empty-state" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:48px 24px;text-align:center">
            <span class="empty-emoji" style="font-size:48px">🌸</span>
            <span class="empty-title" style="font-weight:700;font-size:17px">Chưa có chuyến đi nào đang diễn ra</span>
            <span class="empty-desc" style="color:var(--text-muted,#8a8a8a);font-size:14px;max-width:280px">Để AI dựng cho bạn một hành trình Huế cá nhân hóa — chỉ mất 30 giây!</span>
            <button class="btn-primary" style="max-width:240px;padding:14px 24px;margin-top:8px" id="btn-active-plan">
              <span class="btn-sparkle">✨</span><span class="btn-text">Lên kế hoạch ngay</span>
            </button>
          </div>`;
        const b = document.getElementById('btn-active-plan');
        if (b) b.addEventListener('click', () => { window.location.href = 'flow.html'; });
      }
    }

    // --- Upcoming tab ---
    const upcomingList = document.querySelector('#tab-upcoming .trip-list');
    const emptyUpcoming = document.getElementById('empty-upcoming');
    if (upcomingList) {
      if (upcoming.length) {
        upcomingList.innerHTML = upcoming.map((t, i) => tripItemHTML(t, i, false)).join('');
        if (emptyUpcoming) emptyUpcoming.style.display = 'none';
      } else {
        upcomingList.innerHTML = '';
        if (emptyUpcoming) emptyUpcoming.style.display = '';
      }
    }

    // --- Past tab ---
    const pastList = document.querySelector('#tab-past .trip-list');
    if (pastList) {
      if (past.length) {
        pastList.innerHTML = past.map((t, i) => tripItemHTML(t, i, true)).join('');
      }
    }

    bindTripItems();
  }
  loadTrips();

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
