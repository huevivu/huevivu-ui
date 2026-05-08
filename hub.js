/* ========================================
   HueViVu — Itinerary Hub Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- DOM ---
  const fabAi = document.getElementById('fab-ai');
  const aiOverlay = document.getElementById('ai-overlay');
  const aiSheet = document.getElementById('ai-sheet');
  const aiClose = document.getElementById('ai-sheet-close');
  const aiChat = document.getElementById('ai-chat');
  const aiInput = document.getElementById('ai-input');
  const aiSend = document.getElementById('ai-send');
  const custOverlay = document.getElementById('cust-overlay');
  const custSheet = document.getElementById('cust-sheet');

  // --- Ask AI Sheet ---
  function openAI() {
    aiOverlay.classList.add('open');
    aiSheet.classList.add('open');
    setTimeout(() => aiInput.focus(), 400);
  }
  function closeAI() {
    aiOverlay.classList.remove('open');
    aiSheet.classList.remove('open');
  }
  fabAi.addEventListener('click', openAI);
  aiClose.addEventListener('click', closeAI);
  aiOverlay.addEventListener('click', closeAI);

  // --- AI Chat ---
  const aiResponses = {
    'rain': "Good thinking! 🌧️ If it rains tomorrow, I've already placed indoor activities in the afternoon — the salt coffee at Vi Café is perfect rainy-day vibes. I can also swap in the Huế Museum of Royal Antiquities.",
    'cafe': "Great choice! ☕ Here are 3 top cafés near your route:\n\n1. **Vi Café** — Famous salt coffee, cozy garden\n2. **Mộc Café** — River view, great wifi\n3. **Chè Hẻm** — Sweet soup + coffee combo\n\nWant me to add one to your itinerary?",
    'chill': "Got it! 😌 I've adjusted your Day 2 — removed the early market visit and pushed everything 2 hours later. Added a riverside hammock café for the morning. Your new step count: ~5,200 (down from 8,500).",
    'photo': "📸 Here are the best golden-hour spots on your route:\n\n1. **Thiên Mụ Pagoda** at 17:30 — river reflection shot\n2. **Thanh Toàn Bridge** at 16:00 — village atmosphere\n3. **Imperial Citadel** at 07:30 — empty courtyards\n\nI've marked them with 📸 in your timeline!",
    'default': "That's a great question! 🤔 Based on your itinerary, I'd suggest exploring more of the riverside area. The Perfume River at dusk is magical. Want me to adjust your plan?"
  };

  function getAIResponse(q) {
    const lower = q.toLowerCase();
    if (lower.includes('rain')) return aiResponses.rain;
    if (lower.includes('caf')) return aiResponses.cafe;
    if (lower.includes('chill') || lower.includes('relax')) return aiResponses.chill;
    if (lower.includes('photo')) return aiResponses.photo;
    return aiResponses.default;
  }

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-bot'}`;
    div.innerHTML = `<div class="ai-msg-bubble">${text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
    div.style.opacity = '0';
    div.style.transform = 'translateY(10px)';
    aiChat.appendChild(div);
    requestAnimationFrame(() => {
      div.style.transition = 'all 0.3s cubic-bezier(0.16,1,0.3,1)';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });
    aiChat.scrollTop = aiChat.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg-bot ai-typing';
    div.id = 'ai-typing-indicator';
    div.innerHTML = '<div class="ai-msg-bubble"></div>';
    aiChat.appendChild(div);
    aiChat.scrollTop = aiChat.scrollHeight;
  }
  function hideTyping() {
    const t = document.getElementById('ai-typing-indicator');
    if (t) t.remove();
  }

  function handleSend() {
    const q = aiInput.value.trim();
    if (!q) return;
    addMessage(q, true);
    aiInput.value = '';
    showTyping();
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      hideTyping();
      addMessage(getAIResponse(q), false);
    }, delay);
  }

  aiSend.addEventListener('click', handleSend);
  aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

  // --- AI Suggestions ---
  document.querySelectorAll('.ai-sug').forEach(btn => {
    btn.addEventListener('click', () => {
      aiInput.value = btn.dataset.q;
      handleSend();
      btn.style.display = 'none';
    });
  });

  // --- Customize Chips ---
  const custChips = document.querySelectorAll('.cust-chip');
  custChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.classList.contains('applied')) return;
      chip.classList.add('applied');
      openCustSheet(chip.textContent.trim());
    });
  });

  function openCustSheet(label) {
    const progressText = document.getElementById('cust-progress-text');
    progressText.textContent = `Applying: ${label}`;
    custOverlay.classList.add('open');
    custSheet.classList.add('open');

    setTimeout(() => {
      progressText.textContent = 'Itinerary updated! ✨';
      document.querySelector('.cust-spinner').style.display = 'none';
      setTimeout(() => {
        custOverlay.classList.remove('open');
        custSheet.classList.remove('open');
        document.querySelector('.cust-spinner').style.display = '';
        // Flash timeline to show "update"
        document.querySelectorAll('.tl-card').forEach((c, i) => {
          setTimeout(() => {
            c.style.transition = 'all 0.3s';
            c.style.borderColor = 'rgba(255,127,107,0.3)';
            setTimeout(() => { c.style.borderColor = ''; }, 600);
          }, i * 100);
        });
      }, 1000);
    }, 2000);
  }

  custOverlay.addEventListener('click', () => {
    custOverlay.classList.remove('open');
    custSheet.classList.remove('open');
  });

  // --- Save Trip ---
  const btnSave = document.getElementById('btn-hub-save');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      btnSave.innerHTML = '<span class="btn-sparkle">✅</span><span class="btn-text">Trip Saved!</span>';
      btnSave.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
      btnSave.style.boxShadow = '0 8px 32px rgba(76,175,80,0.3)';
      btnSave.style.pointerEvents = 'none';
    });
  }

  // --- Regenerate ---
  const btnRegen = document.getElementById('btn-hub-regen');
  if (btnRegen) {
    btnRegen.addEventListener('click', () => {
      window.location.href = 'flow.html';
    });
  }

  // --- Back ---
  document.getElementById('hub-back').addEventListener('click', () => {
    window.location.href = 'trips.html';
  });

  // --- Share ---
  document.getElementById('hub-share').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: 'My Huế Journey', text: '3-Day Food & Culture Journey — planned by HueViVu AI', url: window.location.href });
    }
  });

  // --- Timeline card click expansion ---
  document.querySelectorAll('.tl-card').forEach(card => {
    card.addEventListener('click', () => {
      const desc = card.querySelector('.tl-desc');
      if (!desc) return;
      const isExpanded = desc.style.maxHeight && desc.style.maxHeight !== '0px';
      document.querySelectorAll('.tl-desc').forEach(d => {
        d.style.maxHeight = '0px';
        d.style.opacity = '0';
        d.style.marginBottom = '0';
      });
      if (!isExpanded) {
        desc.style.maxHeight = desc.scrollHeight + 'px';
        desc.style.opacity = '1';
        desc.style.marginBottom = '10px';
      }
    });
  });

  // Initialize: collapse descriptions
  document.querySelectorAll('.tl-desc').forEach(d => {
    d.style.maxHeight = '0px';
    d.style.opacity = '0';
    d.style.overflow = 'hidden';
    d.style.marginBottom = '0';
    d.style.transition = 'all 0.35s cubic-bezier(0.16,1,0.3,1)';
  });

  // --- Ripple effect ---
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleEffect { to { transform:scale(2.5); opacity:0; } }`;
  document.head.appendChild(style);

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const s = Math.max(rect.width, rect.height);
      ripple.style.cssText = `position:absolute;width:${s}px;height:${s}px;border-radius:50%;background:rgba(255,255,255,0.3);left:${e.clientX-rect.left-s/2}px;top:${e.clientY-rect.top-s/2}px;transform:scale(0);animation:rippleEffect 0.6s ease-out forwards;pointer-events:none;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // --- Scroll-based FAB hide ---
  const hubScroll = document.getElementById('hub-scroll');
  let lastScrollY = 0;
  hubScroll.addEventListener('scroll', () => {
    const y = hubScroll.scrollTop;
    if (y > lastScrollY + 10) {
      fabAi.style.transform = 'translateY(80px)';
      fabAi.style.opacity = '0';
    } else if (y < lastScrollY - 10) {
      fabAi.style.transform = '';
      fabAi.style.opacity = '';
    }
    lastScrollY = y;
  });

  console.log('🌸 HueViVu — Itinerary Hub loaded');
});
