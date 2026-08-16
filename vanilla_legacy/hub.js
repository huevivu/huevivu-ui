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

  // --- Trip context ---
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');
  let currentTrip = null;
  let chatHistory = [];

  // Đổ dữ liệu trip thật vào giao diện (hero + timeline)
  function renderTrip(trip) {
    currentTrip = trip;
    const itinerary = trip.itinerary || trip;

    // Hero title + summary
    const titleEl = document.querySelector('.hero-card-title');
    if (titleEl && trip.title) titleEl.textContent = trip.title;
    const subEl = document.querySelector('.hero-card-sub');
    if (subEl && trip.summary) subEl.textContent = trip.summary;

    // Hero stats: [Duration, Budget, Weather, Locations]
    const statVals = document.querySelectorAll('.hero-stats .hero-stat .hs-val');
    if (statVals.length >= 4) {
      if (trip.duration) statVals[0].textContent = trip.duration + (trip.duration > 1 ? ' Ngày' : ' Ngày');
      const cost = trip.total_cost_estimate || itinerary.total_cost_estimate;
      if (cost) statVals[1].textContent = cost;
      const placeCount = window.TripRender ? TripRender.countPlaces(itinerary) : null;
      if (placeCount) statVals[3].textContent = placeCount;
    }

    // Timeline động
    const tlSection = document.getElementById('timeline-section');
    if (window.TripRender && tlSection) {
      const ok = TripRender.renderTimeline(tlSection, itinerary);
      if (ok) initTimelineInteractions();
    }

    // AI insight → chèn vào insights nếu có
    if (itinerary.ai_insight) {
      const insightsScroll = document.querySelector('.insights-scroll');
      if (insightsScroll) {
        const chip = document.createElement('div');
        chip.className = 'insight-chip insight-sunset';
        chip.innerHTML = `<span class="ic-icon">🧠</span><span class="ic-text">${TripRender.esc(itinerary.ai_insight)}</span>`;
        insightsScroll.insertBefore(chip, insightsScroll.firstChild);
      }
    }
  }

  if (tripId && typeof API !== 'undefined') {
    API.getTrip(tripId).then(trip => {
      renderTrip(trip);
      API.trackEvent('view', { trip_id: tripId });
    }).catch(() => { initTimelineInteractions(); });
  } else {
    // Không có id → giữ nội dung mẫu tĩnh, vẫn gắn tương tác
    initTimelineInteractions();
  }

  // --- AI Chat ---
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

  // Offline fallback responses (dùng khi không có backend)
  const _fallbackResponses = {
    'mưa': 'Nếu trời mưa, hãy ghé The Time Coffee — quán vintage ấm cúng nhất Huế! ☕ Hoặc tham quan Bảo tàng Cổ vật Cung đình Huế.',
    'cafe': 'Gợi ý 3 quán cà phê gần lịch trình:\n1. **The Time Coffee** — vintage, rang xay tại chỗ\n2. **Mộc Café** — view sông Hương\n3. **Chè Hẻm** — chè ngọt + cà phê đặc trưng',
    'ăn': 'Ẩm thực phải thử ở Huế:\n1. **Bún bò** sáng sớm tại Bà Tuyết\n2. **Cơm hến** tại Cồn Hến chính gốc\n3. **Bánh khoái** phố Chi Lăng buổi chiều',
    'default': 'Tôi đang tìm hiểu câu hỏi của bạn... Hãy thử hỏi về địa điểm, ẩm thực, hay thời tiết ở Huế nhé! 🌸'
  };

  function _getFallback(q) {
    const lower = q.toLowerCase();
    if (lower.includes('mưa') || lower.includes('rain')) return _fallbackResponses['mưa'];
    if (lower.includes('caf') || lower.includes('coffee')) return _fallbackResponses['cafe'];
    if (lower.includes('ăn') || lower.includes('food') || lower.includes('bún') || lower.includes('món')) return _fallbackResponses['ăn'];
    return _fallbackResponses['default'];
  }

  async function handleSend() {
    const q = aiInput.value.trim();
    if (!q) return;
    addMessage(q, true);
    aiInput.value = '';
    aiSend.disabled = true;
    showTyping();

    chatHistory.push({ role: 'user', content: q });

    try {
      if (typeof API === 'undefined') throw new Error('API not loaded');
      const data = await API.sendChat(q, tripId || undefined, chatHistory.slice(-10));
      hideTyping();
      addMessage(data.reply, false);
      chatHistory.push({ role: 'assistant', content: data.reply });
    } catch (err) {
      hideTyping();
      // Graceful fallback to local responses
      const fallback = _getFallback(q);
      addMessage(fallback, false);
      chatHistory.push({ role: 'assistant', content: fallback });
    } finally {
      aiSend.disabled = false;
    }
  }

  aiSend.addEventListener('click', handleSend);
  aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });

  // --- AI Suggestions ---
  document.querySelectorAll('.ai-sug').forEach(btn => {
    btn.addEventListener('click', () => {
      aiInput.value = btn.dataset.q;
      handleSend();
      btn.style.display = 'none';
    });
  });

  // --- Customize Chips (gọi AI thật để chỉnh lịch trình) ---
  const CUST_INSTRUCTIONS = {
    'less-walk': 'Giảm đi bộ — chọn các điểm gần nhau, sắp xếp lại để di chuyển ít nhất.',
    'more-food': 'Thêm nhiều trải nghiệm ẩm thực bản địa Huế vào lịch trình.',
    'nightlife': 'Thêm hoạt động về đêm — quán bar, chợ đêm, phố đi bộ buổi tối.',
    'relaxed': 'Làm lịch trình thư giãn hơn — ít điểm mỗi ngày, nhịp chậm, nhiều thời gian nghỉ.',
    'hidden': 'Thêm nhiều địa điểm bí mật, ít khách du lịch, dân địa phương hay đến.',
    'photo': 'Ưu tiên các điểm chụp ảnh đẹp, góc sống ảo và giờ vàng ánh sáng.',
    'budget': 'Tối ưu chi phí — chọn các lựa chọn rẻ hơn, nhiều điểm miễn phí.',
    'romantic': 'Làm lịch trình lãng mạn hơn cho cặp đôi — hoàng hôn, không gian riêng tư.',
  };

  const custChips = document.querySelectorAll('.cust-chip');
  custChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const mod = chip.dataset.mod;
      const instruction = CUST_INSTRUCTIONS[mod] || chip.textContent.trim();
      applyCustomize(instruction, chip);
    });
  });

  async function applyCustomize(instruction, chip) {
    const progressText = document.getElementById('cust-progress-text');
    const spinner = document.querySelector('.cust-spinner');
    if (spinner) spinner.style.display = '';
    if (progressText) progressText.textContent = 'AI đang điều chỉnh lịch trình của bạn...';
    custOverlay.classList.add('open');
    custSheet.classList.add('open');
    if (chip) chip.classList.add('applied');

    // Không có trip thật → chỉ minh hoạ
    if (!tripId || typeof API === 'undefined') {
      setTimeout(() => {
        if (progressText) progressText.textContent = 'Cần tạo lịch trình trước đã ✨';
        setTimeout(closeCust, 1200);
        if (chip) chip.classList.remove('applied');
      }, 1200);
      return;
    }

    try {
      const data = await API.customizeTrip(tripId, instruction);
      const newTrip = data.trip || data;
      // Re-render timeline + hero
      renderTrip({ ...newTrip, itinerary: newTrip, duration: currentTrip?.duration, total_cost_estimate: newTrip.total_cost_estimate });
      if (progressText) progressText.textContent = 'Đã cập nhật lịch trình! ✨';
      setTimeout(() => {
        closeCust();
        document.querySelectorAll('.tl-card').forEach((c, i) => {
          setTimeout(() => {
            c.style.transition = 'all 0.3s';
            c.style.borderColor = 'rgba(255,127,107,0.4)';
            setTimeout(() => { c.style.borderColor = ''; }, 700);
          }, i * 80);
        });
      }, 900);
    } catch (err) {
      if (progressText) progressText.textContent = 'Không điều chỉnh được, thử lại nhé.';
      setTimeout(closeCust, 1400);
    } finally {
      if (chip) setTimeout(() => chip.classList.remove('applied'), 1500);
    }
  }

  function closeCust() {
    custOverlay.classList.remove('open');
    custSheet.classList.remove('open');
    const spinner = document.querySelector('.cust-spinner');
    if (spinner) spinner.style.display = '';
  }

  custOverlay.addEventListener('click', closeCust);

  // Nút "Customize" → cuộn tới khu vực chip
  const btnCustomize = document.getElementById('btn-hub-customize');
  if (btnCustomize) {
    btnCustomize.addEventListener('click', () => {
      const sec = document.getElementById('customize-section');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // --- Save Trip ---
  const btnSave = document.getElementById('btn-hub-save');
  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const done = () => {
        btnSave.innerHTML = '<span class="btn-sparkle">✅</span><span class="btn-text">Đã lưu chuyến đi!</span>';
        btnSave.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
        btnSave.style.boxShadow = '0 8px 32px rgba(76,175,80,0.3)';
        btnSave.style.pointerEvents = 'none';
        if (window.toast) toast('Đã lưu vào "Chuyến đi của bạn" 🌸', 'success');
      };
      if (tripId && typeof API !== 'undefined') {
        try { await API.setTripStatus(tripId, 'active'); } catch {}
      }
      done();
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
    const title = currentTrip?.title || document.querySelector('.hero-card-title')?.textContent || 'Lịch trình Huế của tôi';
    if (window.hvShare) window.hvShare(title, `${title} — lên kế hoạch bởi HueViVu AI`);
  });

  // --- Timeline interactions (gắn lại sau mỗi lần render động) ---
  function initTimelineInteractions() {
    // Actions (Journal / Review) — tránh gắn trùng
    document.querySelectorAll('.tl-card').forEach(card => {
      if (card.querySelector('.tl-actions')) return;
      const actions = document.createElement('div');
      actions.className = 'tl-actions';
      actions.innerHTML = `
        <button class="tl-action-btn" data-action="journal">📝 Nhật ký</button>
        <button class="tl-action-btn" data-action="review">⭐ Đánh giá</button>
      `;
      actions.addEventListener('click', (e) => {
        e.stopPropagation();
        const btn = e.target.closest('.tl-action-btn');
        if (!btn) return;
        if (btn.dataset.action === 'journal') {
          const place = card.querySelector('.tl-name')?.textContent || '';
          window.location.href = 'journal.html' + (place ? `?place=${encodeURIComponent(place)}` : '');
        } else if (btn.dataset.action === 'review') {
          openFeedback();
        }
      });
      card.appendChild(actions);
    });

    // Card click → expand description
    document.querySelectorAll('.tl-card').forEach(card => {
      if (card.dataset.expandBound) return;
      card.dataset.expandBound = '1';
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

    // Collapse descriptions ban đầu
    document.querySelectorAll('.tl-desc').forEach(d => {
      d.style.maxHeight = '0px';
      d.style.opacity = '0';
      d.style.overflow = 'hidden';
      d.style.marginBottom = '0';
      d.style.transition = 'all 0.35s cubic-bezier(0.16,1,0.3,1)';
    });
  }

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

  // --- Feedback Form ---
  const feedbackOverlay = document.getElementById('feedback-overlay');
  const feedbackModal   = document.getElementById('feedback-modal');
  const feedbackClose   = document.getElementById('feedback-close');
  const feedbackForm    = document.getElementById('feedback-form');
  const btnFeedback     = document.getElementById('btn-hub-feedback');

  function openFeedback() {
    if (!feedbackOverlay) return;
    // Populate places checkboxes from current trip
    const placesList = document.getElementById('feedback-places');
    if (placesList && currentTrip?.days) {
      placesList.innerHTML = '';
      const seen = new Set();
      currentTrip.days.forEach(day => {
        (day.activities || []).forEach(act => {
          if (act.name && !seen.has(act.name)) {
            seen.add(act.name);
            const label = document.createElement('label');
            label.className = 'feedback-place-item';
            label.innerHTML = `<input type="checkbox" name="visited" value="${act.name}"> <span>${act.name}</span>`;
            placesList.appendChild(label);
          }
        });
      });
    }
    feedbackOverlay.classList.add('open');
    feedbackModal.classList.add('open');
  }

  function closeFeedback() {
    if (!feedbackOverlay) return;
    feedbackOverlay.classList.remove('open');
    feedbackModal.classList.remove('open');
  }

  if (btnFeedback)  btnFeedback.addEventListener('click', openFeedback);
  if (feedbackClose) feedbackClose.addEventListener('click', closeFeedback);
  if (feedbackOverlay) feedbackOverlay.addEventListener('click', (e) => { if (e.target === feedbackOverlay) closeFeedback(); });

  // Star rating logic
  document.querySelectorAll('.star-rating').forEach(group => {
    const stars = group.querySelectorAll('.star');
    const input  = group.querySelector('input[type=hidden]');
    stars.forEach((star, idx) => {
      star.addEventListener('click', () => {
        const val = idx + 1;
        if (input) input.value = val;
        stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
      });
      star.addEventListener('mouseenter', () => stars.forEach((s, i) => s.classList.toggle('hover', i <= idx)));
      star.addEventListener('mouseleave', () => stars.forEach(s => s.classList.remove('hover')));
    });
  });

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!tripId || typeof API === 'undefined') return;
      const fd = new FormData(feedbackForm);
      const overallRating = Number(feedbackForm.querySelector('#rating-overall')?.value || 0);
      const aiRating      = Number(feedbackForm.querySelector('#rating-ai')?.value     || 0);
      if (!overallRating) { alert('Vui lòng đánh giá tổng thể chuyến đi!'); return; }

      const visited = Array.from(feedbackForm.querySelectorAll('input[name=visited]:checked')).map(el => el.value);
      const notes   = feedbackForm.querySelector('#feedback-notes')?.value || '';

      const submitBtn = feedbackForm.querySelector('.feedback-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi...';

      try {
        await API.submitFeedback({
          trip_id: tripId,
          overall_rating: overallRating,
          ai_rating: aiRating || overallRating,
          places_visited: visited,
          notes,
        });
        submitBtn.textContent = '✅ Cảm ơn bạn!';
        submitBtn.style.background = 'linear-gradient(135deg,#4CAF50,#66BB6A)';
        setTimeout(closeFeedback, 1500);
      } catch {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gửi đánh giá';
        alert('Không thể gửi đánh giá, vui lòng thử lại.');
      }
    });
  }

  // Auto-prompt feedback if user has been on page > 3 min
  if (tripId) {
    setTimeout(() => {
      if (!document.getElementById('feedback-overlay')?.classList.contains('open')) {
        openFeedback();
      }
    }, 3 * 60 * 1000);
  }

  console.log('🌸 HueViVu — Itinerary Hub loaded');
});
