/* ========================================
   HueViVu — Community Feed Interactions
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

  // --- Filter Chips ---
  const filters = document.querySelectorAll('.cm-filter');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(p => p.classList.remove('active'));
      f.classList.add('active');
      f.style.transform = 'scale(0.93)';
      setTimeout(() => { f.style.transform = ''; }, 150);
    });
  });

  // --- Like/Save Toggle ---
  document.querySelectorAll('.cm-action-btn[data-action="like"]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('liked');
      const icon = btn.querySelector('.cm-action-icon');
      const count = btn.querySelector('.cm-action-count');
      if (btn.classList.contains('liked')) {
        icon.textContent = '❤️';
        count.textContent = parseInt(count.textContent) + 1;
      } else {
        icon.textContent = '♡';
        count.textContent = parseInt(count.textContent) - 1;
      }
      btn.style.transform = 'scale(1.15)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });

  document.querySelectorAll('.cm-action-btn[data-action="save"]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('saved');
      const icon = btn.querySelector('.cm-action-icon');
      const count = btn.querySelector('.cm-action-count');
      if (btn.classList.contains('saved')) {
        icon.textContent = '🔖';
        count.textContent = parseInt(count.textContent) + 1;
      } else {
        icon.textContent = '🔖';
        count.textContent = parseInt(count.textContent) - 1;
      }
      btn.style.transform = 'scale(1.1)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });

  // --- Clone Button ---
  document.querySelectorAll('.cm-clone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const origText = btn.querySelector('span:last-child').textContent;
      btn.querySelector('span:last-child').textContent = 'Đã clone! ✓';
      btn.style.background = 'linear-gradient(135deg, var(--coral), var(--warm-orange))';
      btn.style.color = 'white';
      setTimeout(() => {
        btn.querySelector('span:last-child').textContent = origText;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    });
  });

  // --- Trip Card Navigation ---
  document.querySelectorAll('.cm-trip-card').forEach(card => {
    card.querySelector('.cm-trip-cover').addEventListener('click', () => {
      const tripId = card.dataset.trip || 'shared1';
      window.location.href = `shared-trip-detail.html?id=${tripId}`;
    });
    card.querySelector('.cm-trip-title').addEventListener('click', () => {
      const tripId = card.dataset.trip || 'shared1';
      window.location.href = `shared-trip-detail.html?id=${tripId}`;
    });
  });

  // --- Trending Card Navigation ---
  document.querySelectorAll('.cm-trending-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.96)';
      setTimeout(() => {
        window.location.href = `shared-trip-detail.html?id=${card.dataset.trip || 'shared1'}`;
      }, 200);
    });
  });

  // --- AI Banner ---
  const aiSee = document.getElementById('cm-ai-see');
  if (aiSee) {
    aiSee.addEventListener('click', () => {
      aiSee.textContent = 'Đang tải...';
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        aiSee.textContent = 'Xem →';
      }, 800);
    });
  }

  console.log('🌐 HueViVu Community loaded');
});
