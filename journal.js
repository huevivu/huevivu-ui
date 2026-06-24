/* ========================================
   HueViVu — Journal Interactions
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

  // --- Bottom Sheet ---
  const fab = document.getElementById('jr-fab');
  const btnNew = document.getElementById('btn-new-journal');
  const overlay = document.getElementById('jr-write-overlay');
  const sheet = document.getElementById('jr-write-sheet');
  const closeBtn = document.getElementById('jr-write-close');

  function openSheet() {
    overlay.classList.add('open');
    sheet.classList.add('open');
    fab.style.opacity = '0';
    fab.style.pointerEvents = 'none';
  }

  function closeSheet() {
    overlay.classList.remove('open');
    sheet.classList.remove('open');
    fab.style.opacity = '1';
    fab.style.pointerEvents = 'auto';
  }

  if (fab) fab.addEventListener('click', openSheet);
  if (btnNew) btnNew.addEventListener('click', openSheet);
  if (closeBtn) closeBtn.addEventListener('click', closeSheet);
  if (overlay) overlay.addEventListener('click', closeSheet);

  // --- Mood Picker ---
  const moods = document.querySelectorAll('.jr-mood-btn');
  moods.forEach(m => {
    m.addEventListener('click', () => {
      moods.forEach(p => p.classList.remove('active'));
      m.classList.add('active');
      m.style.transform = 'scale(1.2)';
      setTimeout(() => { m.style.transform = m.classList.contains('active') ? 'scale(1.1)' : ''; }, 150);
    });
  });

  // --- Privacy Toggle ---
  const toggle = document.getElementById('jr-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const label = toggle.closest('.jr-privacy-row').querySelector('.jr-privacy-label');
      if (toggle.classList.contains('active')) {
        label.textContent = '🌐 Công khai';
      } else {
        label.textContent = '🔒 Riêng tư';
      }
    });
  }

  // --- Mood emoji map (render) ---
  const MOOD_EMOJI = { happy: '😊', peaceful: '😌', excited: '🤩', nostalgic: '🥹', sparkle: '✨', wonder: '🤩', love: '😍' };

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function entryHTML(e) {
    const emoji = MOOD_EMOJI[e.mood] || '😊';
    const time = (e.time_str ? e.time_str + ' · ' : '') + 'Nhật ký';
    const tag = e.is_private
      ? '<span class="jr-entry-private tag tag-purple">Private</span>'
      : '<span class="jr-entry-public tag tag-green">Public</span>';
    return `
      <div class="jr-entry">
        <div class="jr-entry-header">
          <div class="jr-entry-mood">${emoji}</div>
          <div class="jr-entry-meta">
            <span class="jr-entry-time">${esc(time)}</span>
            ${e.place_name ? `<span class="jr-entry-location">📍 ${esc(e.place_name)}</span>` : ''}
          </div>
          ${tag}
        </div>
        <div class="jr-entry-content">
          <p class="jr-entry-text">${esc(e.content)}</p>
        </div>
      </div>`;
  }

  // Prefill địa điểm từ query (?place=) khi mở từ hub
  const qPlace = new URLSearchParams(window.location.search).get('place');
  if (qPlace) {
    const loc = document.getElementById('jr-loc-input');
    if (loc) loc.value = qPlace;
  }

  // --- Load entries thật ---
  const entriesWrap = document.getElementById('jr-entries');
  async function loadEntries() {
    if (typeof API === 'undefined' || !entriesWrap) return;
    let entries;
    try { entries = await API.getJournal(); } catch { return; }
    if (!Array.isArray(entries)) return;
    if (entries.length) {
      entriesWrap.innerHTML = entries.map(entryHTML).join('');
    } else {
      entriesWrap.innerHTML = '<p style="text-align:center;color:var(--text-muted,#8a8a8a);padding:32px 0;font-size:14px">Chưa có nhật ký nào. Nhấn ✏️ để viết kỷ niệm đầu tiên!</p>';
    }
  }
  loadEntries();

  // --- Nạp danh sách chuyến đi vào dropdown + lọc nhật ký theo chuyến ---
  const tripDropdown = document.getElementById('jr-trip-dropdown');
  async function loadTripOptions() {
    if (!tripDropdown || typeof API === 'undefined') return;
    let trips;
    try { trips = await API.getTrips(); } catch { return; }
    if (!Array.isArray(trips) || !trips.length) return;
    tripDropdown.innerHTML = '<option value="">Tất cả chuyến đi</option>' +
      trips.map(t => `<option value="${t.id}">${esc(t.title || 'Chuyến đi')}</option>`).join('');
  }
  loadTripOptions();
  if (tripDropdown) {
    tripDropdown.addEventListener('change', async () => {
      if (typeof API === 'undefined' || !entriesWrap) return;
      let entries;
      try { entries = await API.getJournal(tripDropdown.value || undefined); } catch { return; }
      entriesWrap.innerHTML = Array.isArray(entries) && entries.length
        ? entries.map(entryHTML).join('')
        : '<p style="text-align:center;color:var(--text-muted,#8a8a8a);padding:32px 0;font-size:14px">Chưa có nhật ký cho chuyến này 🌸</p>';
    });
  }

  // --- Save Entry (lưu thật vào backend) ---
  const saveBtn = document.getElementById('jr-write-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const text = document.getElementById('jr-write-text');
      const content = text ? text.value.trim() : '';
      if (content.length < 3) {
        saveBtn.style.transform = 'translateX(-4px)';
        setTimeout(() => { saveBtn.style.transform = 'translateX(4px)'; }, 100);
        setTimeout(() => { saveBtn.style.transform = ''; }, 200);
        return;
      }

      const mood = document.querySelector('.jr-mood-btn.active')?.dataset.mood || 'happy';
      const placeName = document.getElementById('jr-loc-input')?.value.trim() || '';
      const isPrivate = !document.getElementById('jr-toggle')?.classList.contains('active');
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      saveBtn.querySelector('span').textContent = 'Đang lưu...';
      let saved = null;
      if (typeof API !== 'undefined') {
        try {
          saved = await API.addJournalEntry({
            time_str: timeStr, place_name: placeName || null,
            content, mood, is_private: isPrivate,
          });
        } catch {}
      }

      saveBtn.querySelector('span').textContent = '✓ Đã lưu!';
      saveBtn.style.background = 'linear-gradient(135deg, #22C55E, #4ADE80)';

      // Prepend entry mới vào danh sách
      if (entriesWrap) {
        const data = saved || { content, mood, place_name: placeName, is_private: isPrivate, time_str: timeStr };
        const empty = entriesWrap.querySelector('p');
        if (empty) entriesWrap.innerHTML = '';
        entriesWrap.insertAdjacentHTML('afterbegin', entryHTML(data));
      }
      if (window.toast) toast('Đã lưu vào nhật ký 📖', 'success');

      setTimeout(() => {
        closeSheet();
        saveBtn.querySelector('span').textContent = '✨ Lưu nhật ký';
        saveBtn.style.background = '';
        if (text) text.value = '';
      }, 1000);
    });
  }

  // --- AI Recap ---
  const btnRecap = document.getElementById('btn-view-recap');
  if (btnRecap) {
    btnRecap.addEventListener('click', () => {
      window.location.href = 'travel-memory.html?id=current';
    });
  }

  console.log('📖 HueViVu Journal loaded');
});
