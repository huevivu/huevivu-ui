/* ========================================
   HueViVu — Shared Trip Detail Interactions
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  const scroll = document.getElementById('page-scroll');

  // Section reveal
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: scroll });
  sections.forEach(s => obs.observe(s));

  // --- Day Accordion ---
  document.querySelectorAll('.std-day-header').forEach(header => {
    header.addEventListener('click', () => {
      const day = header.closest('.std-day');
      const body = day.querySelector('.std-day-body');
      const isOpen = body.classList.contains('open');

      // Toggle
      body.classList.toggle('open');
      day.classList.toggle('open');
    });
  });

  // Open first day by default
  const firstDay = document.querySelector('.std-day');
  if (firstDay) {
    firstDay.classList.add('open');
  }

  // --- Clone Button ---
  const cloneBtn = document.getElementById('std-btn-clone');
  if (cloneBtn) {
    cloneBtn.addEventListener('click', () => {
      cloneBtn.innerHTML = '✓ Đã clone!';
      cloneBtn.style.background = 'linear-gradient(135deg, #22C55E, #4ADE80)';
      cloneBtn.style.color = 'white';
      cloneBtn.style.borderColor = 'transparent';
      setTimeout(() => {
        cloneBtn.innerHTML = '📋 Clone';
        cloneBtn.style.background = '';
        cloneBtn.style.color = '';
        cloneBtn.style.borderColor = '';
      }, 2500);
    });
  }

  // --- AI Optimize ---
  const optimizeBtn = document.getElementById('std-btn-optimize');
  if (optimizeBtn) {
    optimizeBtn.addEventListener('click', () => {
      optimizeBtn.innerHTML = '⏳ Đang tối ưu...';
      setTimeout(() => {
        optimizeBtn.innerHTML = '✅ Đã tạo bản mới!';
        optimizeBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #A78BFA)';
      }, 1500);
      setTimeout(() => {
        optimizeBtn.innerHTML = '✨ Tối ưu AI';
        optimizeBtn.style.background = '';
      }, 3500);
    });
  }

  // --- Comment Send ---
  const commentInput = document.getElementById('std-comment-input');
  const commentSend = document.getElementById('std-comment-send');
  if (commentInput && commentSend) {
    commentSend.addEventListener('click', () => {
      const text = commentInput.value.trim();
      if (!text) return;

      const commentsContainer = document.querySelector('.std-comments');
      const newComment = document.createElement('div');
      newComment.className = 'std-comment';
      newComment.style.opacity = '0';
      newComment.style.transform = 'translateY(10px)';
      newComment.innerHTML = `
        <div class="std-comment-avatar" style="background:linear-gradient(135deg,var(--coral),var(--warm-orange))">H</div>
        <div class="std-comment-body">
          <span class="std-comment-name">Hue Traveler</span>
          <p class="std-comment-text">${text}</p>
          <span class="std-comment-time">Vừa xong</span>
        </div>
      `;
      commentsContainer.appendChild(newComment);
      commentInput.value = '';

      requestAnimationFrame(() => {
        newComment.style.transition = 'all 0.4s var(--ease-out)';
        newComment.style.opacity = '1';
        newComment.style.transform = 'translateY(0)';
      });
    });
  }

  // --- AI Match Optimize inline ---
  const aiOptimize = document.getElementById('std-ai-optimize');
  if (aiOptimize) {
    aiOptimize.addEventListener('click', () => {
      aiOptimize.textContent = 'Đang phân tích...';
      setTimeout(() => {
        aiOptimize.textContent = '✓ Đã áp dụng';
        aiOptimize.style.background = 'rgba(34,197,94,0.1)';
        aiOptimize.style.color = '#22C55E';
        aiOptimize.style.borderColor = 'rgba(34,197,94,0.2)';
      }, 1200);
    });
  }

  console.log('📋 HueViVu Shared Trip Detail loaded');
});
