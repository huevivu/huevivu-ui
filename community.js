/* ========================================
   HueViVu — Community Feed (nối backend thật)
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('page-scroll');
  const header = document.getElementById('page-header');

  if (scroll && header) {
    scroll.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', scroll.scrollTop > 10);
    });
  }

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const COMPANION = { solo: '👤 Solo', couple: '👫 Cặp đôi', friends: '🧑‍🤝‍🧑 Bạn bè', family: '👨‍👩‍👧 Gia đình' };
  const STYLE_TAG = {
    cultural: '🏛️ Văn hóa', foodie: '🍜 Ẩm thực', relaxed: '😌 Thư giãn',
    nature: '🌿 Thiên nhiên', adventure: '🧭 Phiêu lưu', budget: '💰 Tiết kiệm', romantic: '💕 Lãng mạn',
  };

  function timeAgo(s) {
    if (!s) return '';
    const d = new Date(s.replace(' ', 'T'));
    if (isNaN(d)) return '';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 3600) return Math.max(1, Math.floor(diff / 60)) + ' phút trước';
    if (diff < 86400) return Math.floor(diff / 3600) + ' giờ trước';
    return Math.floor(diff / 86400) + ' ngày trước';
  }

  function placeCount(trip) {
    const days = (trip.itinerary && trip.itinerary.days) || [];
    return days.reduce((n, d) => n + ((d.activities || []).length), 0);
  }

  const COVER_IMGS = ['assets/hero-hub.png', 'assets/river.png', 'assets/citadel.png', 'assets/food.png', 'assets/hero.png'];

  function cardHTML(t, i) {
    const styles = (t.style || '').split(',').filter(Boolean);
    const coverTags = styles.slice(0, 2).map(s => `<span class="cm-cover-tag">${STYLE_TAG[s] || '🌸 ' + s}</span>`).join('');
    const tagChips = styles.map(s => `<span class="cm-tag">#${esc(s)}</span>`).join('');
    const places = placeCount(t);
    const cost = t.total_cost_estimate || (t.budget ? (t.budget / 1000000).toFixed(1) + 'M VND' : '');
    const avatar = (t.owner_name || 'H').trim().charAt(0).toUpperCase();
    return `
      <div class="cm-trip-card" data-trip-id="${t.id}">
        <div class="cm-trip-header">
          <div class="cm-trip-avatar">${avatar}</div>
          <div class="cm-trip-user">
            <span class="cm-trip-username">${esc(t.owner_name || 'Lữ khách Huế')}</span>
            <span class="cm-trip-time">${timeAgo(t.created_at)}</span>
          </div>
          <div class="cm-trip-ai-match">
            <span class="cm-match-val">${t.ai_match_score || 85}%</span>
            <span class="cm-match-label">phù hợp</span>
          </div>
        </div>
        <div class="cm-trip-cover">
          <img src="${COVER_IMGS[i % COVER_IMGS.length]}" alt="Trip" class="cm-trip-img" />
          <div class="cm-trip-cover-overlay"></div>
          <div class="cm-trip-cover-tags">${coverTags}</div>
        </div>
        <div class="cm-trip-body">
          <h3 class="cm-trip-title">${esc(t.title)}</h3>
          <p class="cm-trip-desc">${esc(t.summary || '')}</p>
          <div class="cm-trip-meta">
            <span class="cm-meta-item">📅 ${t.duration} ngày</span>
            ${places ? `<span class="cm-meta-item">📍 ${places} điểm</span>` : ''}
            ${cost ? `<span class="cm-meta-item">💰 ${esc(cost)}</span>` : ''}
            <span class="cm-meta-item">${COMPANION[t.companion] || ''}</span>
          </div>
          <div class="cm-trip-tags">${tagChips}</div>
        </div>
        <div class="cm-trip-actions">
          <button class="cm-action-btn${t.liked ? ' liked' : ''}" data-action="like">
            <span class="cm-action-icon">${t.liked ? '❤️' : '♡'}</span>
            <span class="cm-action-count">${t.like_count || 0}</span>
          </button>
          <button class="cm-action-btn" data-action="comment">
            <span class="cm-action-icon">💬</span>
            <span class="cm-action-count">${t.comment_count || 0}</span>
          </button>
          <button class="cm-action-btn${t.saved ? ' saved' : ''}" data-action="save">
            <span class="cm-action-icon">🔖</span>
            <span class="cm-action-count">${t.save_count || 0}</span>
          </button>
          <button class="cm-action-btn cm-clone-btn" data-action="clone">
            <span class="cm-action-icon">📋</span>
            <span>Clone</span>
          </button>
        </div>
      </div>`;
  }

  const feedEl = document.getElementById('cm-feed');
  let allTrips = [];
  let activeFilter = 'all';

  function applyFilter() {
    if (!feedEl) return;
    let list = allTrips.slice();
    if (activeFilter !== 'all') {
      if (activeFilter === 'budget') {
        list = list.filter(t => (t.budget || 0) <= 1500000 || (t.style || '').includes('budget') || (t.style || '').includes('relaxed'));
      } else {
        list = list.filter(t => (t.style || '').includes(activeFilter));
      }
    }
    // Ưu tiên AI match score (đúng triết lý: AI match > popularity)
    list.sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0));
    feedEl.innerHTML = list.length
      ? list.map((t, i) => cardHTML(t, i)).join('')
      : '<p style="text-align:center;color:var(--text-muted,#8a8a8a);padding:32px 0;font-size:14px">Chưa có lịch trình nào trong nhóm này 🌸</p>';
  }

  async function loadFeed() {
    if (typeof API === 'undefined' || !feedEl) return;
    let trips;
    try { trips = await API.getFeed(); } catch { return; }
    if (!Array.isArray(trips) || !trips.length) return; // giữ card mẫu nếu rỗng
    allTrips = trips;
    applyFilter();
  }
  loadFeed();

  // --- Filter chips ---
  const filters = document.querySelectorAll('.cm-filter');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(p => p.classList.remove('active'));
      f.classList.add('active');
      f.style.transform = 'scale(0.93)';
      setTimeout(() => { f.style.transform = ''; }, 150);
      activeFilter = f.dataset.filter || 'all';
      if (allTrips.length) applyFilter();
    });
  });

  // --- Search cộng đồng (lọc feed tại chỗ theo từ khoá) ---
  const searchBtn = document.getElementById('btn-search-community');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = (window.prompt('Tìm lịch trình cộng đồng (tên, #tag, người tạo):') || '').trim().toLowerCase();
      const cards = feedEl ? feedEl.querySelectorAll('.cm-trip-card') : [];
      if (!cards.length) return;
      let shown = 0;
      cards.forEach(c => {
        const match = !q || c.textContent.toLowerCase().includes(q);
        c.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      if (window.toast) toast(q ? `${shown} kết quả cho "${q}"` : 'Hiện tất cả lịch trình', shown ? '' : 'error');
    });
  }

  // --- Feed delegation: like / save / clone / mở chi tiết ---
  if (feedEl) {
    feedEl.addEventListener('click', async (e) => {
      const card = e.target.closest('.cm-trip-card');
      if (!card) return;
      const tripId = card.dataset.tripId;
      const btn = e.target.closest('.cm-action-btn');

      // Mở chi tiết khi bấm cover/title
      if (!btn) {
        if (e.target.closest('.cm-trip-cover') || e.target.closest('.cm-trip-title')) {
          if (tripId) window.location.href = `shared-trip-detail.html?id=${tripId}`;
        }
        return;
      }

      const action = btn.dataset.action;

      if (action === 'like') {
        const icon = btn.querySelector('.cm-action-icon');
        const count = btn.querySelector('.cm-action-count');
        btn.classList.toggle('liked');
        const liked = btn.classList.contains('liked');
        icon.textContent = liked ? '❤️' : '♡';
        count.textContent = Math.max(0, parseInt(count.textContent || '0') + (liked ? 1 : -1));
        btn.style.transform = 'scale(1.15)';
        setTimeout(() => { btn.style.transform = ''; }, 200);
        if (tripId && typeof API !== 'undefined') {
          API.likeTrip(tripId).catch(() => {
            btn.classList.toggle('liked');
            icon.textContent = liked ? '♡' : '❤️';
            count.textContent = Math.max(0, parseInt(count.textContent || '0') + (liked ? -1 : 1));
          });
        }
      } else if (action === 'save') {
        const count = btn.querySelector('.cm-action-count');
        btn.classList.toggle('saved');
        const saved = btn.classList.contains('saved');
        count.textContent = Math.max(0, parseInt(count.textContent || '0') + (saved ? 1 : -1));
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => { btn.style.transform = ''; }, 200);
        if (tripId && typeof API !== 'undefined') API.saveTrip(tripId).catch(() => {});
        if (window.toast) toast(saved ? 'Đã lưu lịch trình 🔖' : 'Đã bỏ lưu', saved ? 'success' : '');
      } else if (action === 'clone') {
        const label = btn.querySelector('span:last-child');
        const orig = label.textContent;
        label.textContent = 'Đang clone...';
        btn.style.pointerEvents = 'none';
        let newId = null;
        if (tripId && typeof API !== 'undefined') {
          try { const d = await API.cloneTrip(tripId); newId = d.tripId; } catch {}
        }
        label.textContent = 'Đã clone! ✓';
        btn.style.background = 'linear-gradient(135deg, var(--coral,#FF7F6B), var(--warm-orange,#FF9A76))';
        btn.style.color = 'white';
        setTimeout(() => {
          if (newId) {
            window.location.href = `hub.html?id=${newId}`;
          } else {
            label.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.pointerEvents = '';
          }
        }, 1100);
      } else if (action === 'comment') {
        if (window.toast) toast('Tính năng bình luận sắp ra mắt 💬');
      }
    });
  }

  // --- Trending cards → mở lịch trình thật (nếu có) ---
  document.querySelectorAll('.cm-trending-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.96)';
      setTimeout(() => {
        const t = allTrips[i];
        if (t) window.location.href = `shared-trip-detail.html?id=${t.id}`;
        else if (window.toast) toast('Đang tải lịch trình...');
      }, 200);
    });
  });

  // --- AI Banner: cuộn về đầu feed ---
  const aiSee = document.getElementById('cm-ai-see');
  if (aiSee) {
    aiSee.addEventListener('click', () => {
      const feedSection = feedEl ? feedEl.closest('.section') : null;
      if (feedSection && scroll) {
        feedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Section reveal
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: scroll });
  sections.forEach(s => obs.observe(s));

  console.log('🌐 HueViVu Community loaded');
});
