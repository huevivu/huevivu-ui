/* ========================================
   HueViVu — Shared Trip Detail (nối backend)
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('page-scroll');
  const tripId = new URLSearchParams(window.location.search).get('id');

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const TYPE_EMOJI = { heritage: '🏛️', food: '🍜', nature: '🌿', cafe: '☕', experience: '✨', temple: '🛕', market: '🛍️' };
  const STYLE_TAG = { cultural: '🏛️ Văn hóa', foodie: '🍜 Ẩm thực', relaxed: '😌 Thư giãn', nature: '🌿 Thiên nhiên', adventure: '🧭 Phiêu lưu', budget: '💰 Tiết kiệm', romantic: '💕 Lãng mạn' };
  const COMPANION = { solo: 'Solo', couple: 'Cặp đôi', friends: 'Bạn bè', family: 'Gia đình' };

  // --- Render accordion ngày từ itinerary ---
  function renderDays(itinerary) {
    const wrap = document.getElementById('std-day-list');
    const days = (itinerary && itinerary.days) || [];
    if (!wrap || !days.length) return;
    wrap.innerHTML = days.map((day, di) => {
      const places = (day.activities || []).map((a, i, arr) => `
        <div class="std-place">
          <span class="std-place-time">${esc(a.time || '')}</span>
          <div class="std-place-dot${i === arr.length - 1 ? ' last' : ''}"></div>
          <div class="std-place-card">
            <span class="std-place-emoji">${TYPE_EMOJI[a.type] || '📍'}</span>
            <div class="std-place-info">
              <span class="std-place-name">${esc(a.name || '')}</span>
              <span class="std-place-meta">${[a.cost ? '💰 ' + a.cost : '', a.duration ? '⏱ ' + a.duration : ''].filter(Boolean).join(' · ')}</span>
              ${a.ai_tip ? `<p class="std-place-review">"${esc(a.ai_tip)}"</p>` : (a.description ? `<p class="std-place-review">${esc(a.description)}</p>` : '')}
            </div>
          </div>
        </div>`).join('');
      return `
        <div class="std-day${di === 0 ? ' open' : ''}" id="std-day-${day.day}">
          <div class="std-day-header" data-day="${day.day}">
            <span class="std-day-num">N${day.day}</span>
            <div class="std-day-info">
              <span class="std-day-title">${esc(day.theme || 'Ngày ' + day.day)}</span>
              <span class="std-day-sub">${esc(day.day_tip || '')}</span>
            </div>
            <span class="std-day-chevron">▾</span>
          </div>
          <div class="std-day-body${di === 0 ? ' open' : ''}">${places}</div>
        </div>`;
    }).join('');
  }

  function renderTrip(t) {
    const it = t.itinerary || {};
    const set = (id, val) => { const el = document.getElementById(id); if (el != null && val != null) el.textContent = val; };
    set('std-title', t.title);
    set('std-subtitle', t.summary);
    set('std-hero-username', t.owner_name || 'Lữ khách Huế');
    const avatar = (t.owner_name || 'H').trim().charAt(0).toUpperCase();
    const av = document.getElementById('std-hero-avatar'); if (av) av.textContent = avatar;

    // AI match
    const matchLabel = document.querySelector('.std-ai-match-label');
    if (matchLabel) matchLabel.textContent = `PHÙ HỢP ${t.ai_match_score || 85}% VỚI BẠN`;

    // Stats
    const placeCount = ((it.days) || []).reduce((n, d) => n + ((d.activities || []).length), 0);
    set('std-days', t.duration ? t.duration + ' ngày' : null);
    set('std-places', placeCount ? placeCount + ' điểm' : null);
    set('std-budget', t.total_cost_estimate || (t.budget ? (t.budget / 1000000).toFixed(1) + 'M VND' : null));
    set('std-style', COMPANION[t.companion] || t.companion);

    // Mood tags từ style
    const moodWrap = document.querySelector('.std-mood-tags');
    if (moodWrap && t.style) {
      const tags = t.style.split(',').filter(Boolean).map(s => `<span class="std-mood-tag">${STYLE_TAG[s] || '🌸 ' + s}</span>`).join('');
      if (tags) moodWrap.innerHTML = tags;
    }

    // CTA stats
    const ctaStats = document.querySelectorAll('.std-cta-stat');
    if (ctaStats[0]) ctaStats[0].textContent = `❤️ ${t.like_count || 0}`;
    if (ctaStats[1]) ctaStats[1].textContent = `🔖 ${t.save_count || 0}`;
    if (ctaStats[2]) ctaStats[2].textContent = `📋 ${t.clone_count || 0}`;

    renderDays(it);
    bindAccordion();
  }

  if (tripId && typeof API !== 'undefined') {
    API.getTrip(tripId).then(renderTrip).catch(() => bindAccordion());
  } else {
    bindAccordion();
  }

  // --- Accordion ---
  function bindAccordion() {
    document.querySelectorAll('.std-day-header').forEach(header => {
      if (header.dataset.bound) return;
      header.dataset.bound = '1';
      header.addEventListener('click', () => {
        const day = header.closest('.std-day');
        const body = day.querySelector('.std-day-body');
        body.classList.toggle('open');
        day.classList.toggle('open');
      });
    });
  }

  // Section reveal
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: scroll });
  sections.forEach(s => obs.observe(s));

  // --- Clone ---
  async function doClone(btn, label) {
    const orig = btn.innerHTML;
    btn.innerHTML = label || '⏳ Đang clone...';
    btn.style.pointerEvents = 'none';
    let newId = null;
    if (tripId && typeof API !== 'undefined') {
      try { const d = await API.cloneTrip(tripId); newId = d.tripId; } catch {}
    }
    btn.innerHTML = '✓ Đã tạo bản của bạn!';
    btn.style.background = 'linear-gradient(135deg, #22C55E, #4ADE80)';
    btn.style.color = 'white';
    btn.style.borderColor = 'transparent';
    setTimeout(() => {
      if (newId) window.location.href = `hub.html?id=${newId}`;
      else { btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = ''; btn.style.pointerEvents = ''; }
    }, 1100);
  }

  const cloneBtn = document.getElementById('std-btn-clone');
  if (cloneBtn) cloneBtn.addEventListener('click', () => doClone(cloneBtn, '⏳ Đang clone...'));

  // --- AI Optimize: clone rồi mở hub để tinh chỉnh bằng AI ---
  const optimizeBtn = document.getElementById('std-btn-optimize');
  if (optimizeBtn) {
    optimizeBtn.addEventListener('click', () => {
      if (window.toast) toast('Đang tạo bản tối ưu cho bạn ✨');
      doClone(optimizeBtn, '⏳ Đang tối ưu...');
    });
  }
  const aiOptimize = document.getElementById('std-ai-optimize');
  if (aiOptimize) {
    aiOptimize.addEventListener('click', () => {
      if (window.toast) toast('Đang tạo bản tùy chỉnh ✨');
      doClone(aiOptimize, 'Đang xử lý...');
    });
  }

  // --- Share ---
  const shareBtn = document.getElementById('std-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const title = document.getElementById('std-title')?.textContent || 'Lịch trình Huế';
      if (window.hvShare) window.hvShare(title, title + ' — HueViVu');
    });
  }

  // --- Comment (thêm cục bộ — chưa có API bình luận) ---
  const commentInput = document.getElementById('std-comment-input');
  const commentSend = document.getElementById('std-comment-send');
  if (commentInput && commentSend) {
    const addComment = () => {
      const text = commentInput.value.trim();
      if (!text) return;
      const container = document.querySelector('.std-comments');
      const c = document.createElement('div');
      c.className = 'std-comment';
      c.style.opacity = '0';
      c.style.transform = 'translateY(10px)';
      c.innerHTML = `
        <div class="std-comment-avatar" style="background:linear-gradient(135deg,var(--coral,#FF7F6B),var(--warm-orange,#FF9A76))">H</div>
        <div class="std-comment-body">
          <span class="std-comment-name">Bạn</span>
          <p class="std-comment-text">${esc(text)}</p>
          <span class="std-comment-time">Vừa xong</span>
        </div>`;
      container.appendChild(c);
      commentInput.value = '';
      requestAnimationFrame(() => {
        c.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      });
    };
    commentSend.addEventListener('click', addComment);
    commentInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addComment(); });
  }

  console.log('📋 HueViVu Shared Trip Detail loaded');
});
