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

  // --- Save Entry ---
  const saveBtn = document.getElementById('jr-write-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const text = document.getElementById('jr-write-text');
      if (text && text.value.trim().length < 3) {
        saveBtn.style.transform = 'translateX(-4px)';
        setTimeout(() => { saveBtn.style.transform = 'translateX(4px)'; }, 100);
        setTimeout(() => { saveBtn.style.transform = ''; }, 200);
        return;
      }
      saveBtn.querySelector('span').textContent = '✓ Đã lưu!';
      saveBtn.style.background = 'linear-gradient(135deg, #22C55E, #4ADE80)';
      setTimeout(() => {
        closeSheet();
        saveBtn.querySelector('span').textContent = '✨ Lưu nhật ký';
        saveBtn.style.background = '';
        if (text) text.value = '';
      }, 1200);
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
