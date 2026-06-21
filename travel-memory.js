/* ========================================
   HueViVu — Travel Memory Interactions
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('page-scroll');

  // Section reveal
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: scroll });
  sections.forEach(s => obs.observe(s));

  // --- Stat Cards Counter Animation ---
  const statCards = document.querySelectorAll('.tm-stat-card');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3, root: scroll });

  statCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.5s ${i * 0.1}s var(--ease-out)`;
    statObs.observe(card);
  });

  // --- Photo lightbox (simple scale) ---
  document.querySelectorAll('.tm-photo-item').forEach(item => {
    item.addEventListener('click', () => {
      item.style.transform = 'scale(0.95)';
      setTimeout(() => { item.style.transform = ''; }, 200);
    });
  });

  // --- Share Button ---
  const shareBtn = document.getElementById('tm-btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      shareBtn.textContent = '✓ Đã chia sẻ lên cộng đồng!';
      shareBtn.style.background = 'linear-gradient(135deg, #22C55E, #4ADE80)';
      shareBtn.style.color = 'white';
      shareBtn.style.borderColor = 'transparent';
      setTimeout(() => {
        shareBtn.textContent = '🌐 Chia sẻ kỷ niệm';
        shareBtn.style.background = '';
        shareBtn.style.color = '';
        shareBtn.style.borderColor = '';
      }, 2500);
    });
  }

  // --- Create Similar Trip ---
  const planBtn = document.getElementById('tm-btn-plan');
  if (planBtn) {
    planBtn.addEventListener('click', () => {
      planBtn.textContent = '⏳ AI đang tạo...';
      setTimeout(() => {
        window.location.href = 'flow.html';
      }, 1000);
    });
  }

  console.log('💫 HueViVu Travel Memory loaded');
});

// Lắng nghe lệnh auto-scroll từ showcase
window.addEventListener('message', (e) => {
  if (e.data === 'start-auto-scroll') {
    const scroller = document.getElementById('page-scroll');
    if (scroller) {
      scroller.scrollTop = 0;
      let lastTime = 0;
      const speed = 0.08; // 80px / second
      function step(now) {
        if (!lastTime) lastTime = now;
        const dt = now - lastTime;
        lastTime = now;
        scroller.scrollTop += speed * dt;
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }
});
