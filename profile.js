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

  // Settings gear → cuộn tới mục "Cài đặt" + nhấp nháy nhẹ
  const btnSettings = document.getElementById('btn-settings');
  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      const sec = document.getElementById('menu-language')?.closest('.section')
        || document.getElementById('menu-language');
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        sec.style.transition = 'background 0.4s';
        sec.style.background = 'rgba(255,127,107,0.06)';
        setTimeout(() => { sec.style.background = ''; }, 900);
      }
    });
  }

  // Sửa tên hồ sơ — chạm vào tên để đổi (lưu thật qua API)
  const nameEl = document.querySelector('.pf-name');
  if (nameEl) {
    nameEl.style.cursor = 'pointer';
    nameEl.title = 'Chạm để đổi tên';
    nameEl.addEventListener('click', async () => {
      const current = nameEl.textContent.trim();
      const next = (window.prompt('Tên hiển thị của bạn:', current) || '').trim();
      if (!next || next === current) return;
      nameEl.textContent = next;
      const avatarEl = document.querySelector('.pf-avatar > span');
      if (avatarEl) avatarEl.textContent = next.charAt(0).toUpperCase();
      if (typeof API !== 'undefined') {
        try { await API.updateProfile({ name: next }); if (window.toast) toast('Đã cập nhật hồ sơ ✨', 'success'); }
        catch { if (window.toast) toast('Không lưu được, thử lại nhé', 'error'); }
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        if (typeof API !== 'undefined') API.logout();
        window.location.href = 'index.html';
      }
    });
  }

  // --- Load profile thật từ backend ---
  async function loadProfile() {
    if (typeof API === 'undefined') return;
    let p;
    try { p = await API.getProfile(); } catch { return; }
    if (!p) return;

    const nameEl = document.querySelector('.pf-name');
    if (nameEl && p.name) nameEl.textContent = p.name;
    const emailEl = document.querySelector('.pf-email');
    if (emailEl && p.email) emailEl.textContent = p.email;
    const avatarEl = document.querySelector('.pf-avatar > span');
    if (avatarEl && p.name) avatarEl.textContent = p.name.trim().charAt(0).toUpperCase();
    const levelEl = document.querySelector('.pf-level-badge');
    if (levelEl && p.level) levelEl.textContent = `🌟 Explorer Level ${p.level}`;

    const statVals = document.querySelectorAll('.pf-stats .pf-stat-val');
    if (statVals[0]) statVals[0].textContent = p.trip_count != null ? p.trip_count : (p.total_trips || 0);
    if (statVals[1]) statVals[1].textContent = p.total_places || 0;
    // statVals[2] = số ảnh (chưa có nguồn) → giữ nguyên
  }
  loadProfile();

  console.log('👤 HueViVu Profile loaded');
});
