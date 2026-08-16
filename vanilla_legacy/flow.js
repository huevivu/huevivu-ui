/* ========================================
   HueViVu — AI Question Flow Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  const state = {
    currentStep: 1,
    totalSteps: 9,
    answers: {
      duration: null,
      companion: null,
      budget: null,
      pacing: null,
      exploration: null,
      energy: null,
      physical: null,
      taste: [],
      styles: []
    }
  };

  // --- DOM refs ---
  const progressFill = document.getElementById('progress-fill');
  const btnBack = document.getElementById('flow-back');
  const btnSkip = document.getElementById('flow-skip');
  const btnNext = document.getElementById('flow-next');
  const footer = document.getElementById('flow-footer');
  const allSteps = document.querySelectorAll('.flow-step');

  // --- Progress ---
  function updateProgress() {
    const pct = (state.currentStep / state.totalSteps) * 100;
    progressFill.style.width = Math.min(pct, 100) + '%';
  }

  // --- Enable/disable Continue ---
  function updateNextButton() {
    const step = state.currentStep;
    let enabled = false;
    if (step === 1) enabled = !!state.answers.duration;
    else if (step === 2) enabled = !!state.answers.companion;
    else if (step === 3) enabled = !!state.answers.budget;
    else if (step === 4) enabled = !!state.answers.pacing;
    else if (step === 5) enabled = !!state.answers.exploration;
    else if (step === 6) enabled = !!state.answers.energy;
    else if (step === 7) enabled = !!state.answers.physical;
    else if (step === 8) enabled = state.answers.taste.length > 0;
    else if (step === 9) enabled = state.answers.styles.length > 0;
    btnNext.disabled = !enabled;
  }

  // --- Navigate steps ---
  function goToStep(target, direction) {
    const currentEl = document.querySelector('.flow-step.active');
    const targetEl = document.getElementById('step-' + target);
    if (!currentEl || !targetEl || currentEl === targetEl) return;

    // Exit current
    currentEl.classList.remove('active');
    currentEl.classList.add(direction === 'forward' ? 'exit-left' : 'exit-right');

    setTimeout(() => {
      currentEl.classList.remove('exit-left', 'exit-right');
      currentEl.style.display = 'none';

      // Enter target
      targetEl.style.display = '';
      targetEl.classList.add('active');

      state.currentStep = target;
      updateProgress();
      updateNextButton();

      // Show/hide footer
      if (target >= 10) {
        footer.classList.add('hidden');
      } else {
        footer.classList.remove('hidden');
      }

      // Show/hide back & skip
      btnBack.style.visibility = target === 1 ? 'hidden' : 'visible';

      // Trigger AI thinking if step 10
      if (target === 10) runAIThinking();
    }, 350);
  }

  // --- Option selection: Grid cards ---
  function setupGridCards(containerId, stateKey, isMulti) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cards = container.querySelectorAll('.option-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const val = card.dataset.value;
        if (isMulti) {
          card.classList.toggle('selected');
          if (card.classList.contains('selected')) {
            state.answers[stateKey].push(val);
          } else {
            state.answers[stateKey] = state.answers[stateKey].filter(v => v !== val);
          }
        } else {
          cards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          state.answers[stateKey] = val;
          // Auto-advance for single-select after short delay
          updateNextButton();
          setTimeout(() => {
            if (state.currentStep < 10) {
              goToStep(state.currentStep + 1, 'forward');
            }
          }, 400);
          return;
        }
        updateNextButton();
      });
    });
  }

  // --- Option selection: Row list ---
  function setupRowList(containerId, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const rows = container.querySelectorAll('.option-row');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        const val = row.dataset.value;
        rows.forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        state.answers[stateKey] = val;
        updateNextButton();
        // Auto-advance
        setTimeout(() => {
          if (state.currentStep < 10) {
            goToStep(state.currentStep + 1, 'forward');
          }
        }, 400);
      });
    });
  }

  // --- Budget cards ---
  function setupBudgetCards() {
    const container = document.getElementById('options-budget');
    if (!container) return;
    const cards = container.querySelectorAll('.budget-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const val = card.dataset.value;
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.answers.budget = val;
        updateNextButton();
        setTimeout(() => {
          if (state.currentStep < 10) {
            goToStep(state.currentStep + 1, 'forward');
          }
        }, 400);
      });
    });
  }

  // --- Initialize selections ---
  setupGridCards('options-duration', 'duration', false);
  setupRowList('options-companion', 'companion');
  setupBudgetCards();
  setupRowList('options-pacing', 'pacing');
  setupRowList('options-exploration', 'exploration');
  setupGridCards('options-energy', 'energy', false);
  setupGridCards('options-physical', 'physical', false);
  setupGridCards('options-taste', 'taste', true);
  setupGridCards('options-style', 'styles', true);

  // --- Continue button ---
  btnNext.addEventListener('click', () => {
    if (state.currentStep < 10) {
      goToStep(state.currentStep + 1, 'forward');
    }
  });

  // --- Back button ---
  btnBack.addEventListener('click', () => {
    if (state.currentStep === 11) {
      // From results, go back to step 9
      goToStep(9, 'back');
    } else if (state.currentStep > 1) {
      goToStep(state.currentStep - 1, 'back');
    } else {
      // Go back to landing page
      window.location.href = 'home.html';
    }
  });

  // --- Skip button ---
  btnSkip.addEventListener('click', () => {
    if (state.currentStep < 9) {
      goToStep(state.currentStep + 1, 'forward');
    } else if (state.currentStep === 9) {
      goToStep(10, 'forward');
    }
  });

  // --- AI Thinking Animation (calls real backend) ---
  let _generatedTripId = null;
  let _generatedTrip = null;

  function runAIThinking() {
    const steps = document.querySelectorAll('#ai-steps .ai-step');
    const title = document.getElementById('ai-thinking-title');
    const sub = document.getElementById('ai-thinking-sub');
    const factEl = document.getElementById('ai-fun-fact');

    const facts = [
      "Huế có hơn 1,300 món ăn đặc trưng trong truyền thống ẩm thực!",
      "Hoàng Thành Huế được xây dựng năm 1805, mất 30 năm để hoàn thành.",
      "Sông Hương được đặt tên vì hoa thơm từ thượng nguồn trôi theo dòng nước.",
      "Thành phố có 7 Di sản Thế giới UNESCO trong phạm vi tỉnh Thừa Thiên Huế.",
      "Chỉ riêng bánh bèo đã có hơn 10 biến thể đặc trưng ở Huế!"
    ];

    const titles = ["Đang tạo hành trình...", "Gần xong rồi...", "Hoàn thiện kế hoạch..."];

    let factIdx = 0;
    if (factEl) factEl.querySelector('.fact-text').textContent = facts[0];

    // Fire real API call in parallel with animation
    const budgetMap = { budget: 1000000, moderate: 2500000, premium: 5000000, luxury: 10000000 };
    const durationMap = { '1-2': 2, '3-4': 3, '5-7': 5, '7+': 7 };

    const sessionId = sessionStorage.getItem('hv_session');
    const apiPromise = (typeof API !== 'undefined')
      ? API.generateTrip({
          duration: durationMap[state.answers.duration] || 3,
          styles: state.answers.styles,
          companion: state.answers.companion,
          budget: budgetMap[state.answers.budget] || 2500000,
          taste: state.answers.taste,
          pacing: state.answers.pacing,
          exploration: state.answers.exploration,
          energy: state.answers.energy,
          physical: state.answers.physical,
          sessionId,
        }).then(data => {
          _generatedTripId = data.tripId;
          _generatedTrip = data.trip;
          renderResult(data.trip);
        }).catch(err => {
          console.warn('[flow] API error, using offline mode:', err.message);
        })
      : Promise.resolve();

    // Run animation while API call is in flight
    let i = 0;
    function animateStep() {
      if (i >= steps.length) {
        // Wait for API if still pending, then advance
        apiPromise.finally(() => {
          if (title) title.textContent = "Lịch trình của bạn đã sẵn sàng! ✨";
          if (sub) sub.textContent = "Được tạo riêng cho bạn";
          setTimeout(() => {
            goToStep(11, 'forward');
            updateResultMeta();
          }, 800);
        });
        return;
      }

      steps[i].classList.add('active');
      if (i === 2 && title) title.textContent = titles[1];
      if (i === 3 && title) title.textContent = titles[2];

      const stepDelay = _generatedTrip ? 600 : 1200; // speed up if API already done
      setTimeout(() => {
        steps[i].classList.remove('active');
        steps[i].classList.add('done');

        factIdx = (factIdx + 1) % facts.length;
        if (factEl) {
          factEl.querySelector('.fact-text').textContent = facts[factIdx];
          factEl.style.opacity = '0';
          setTimeout(() => { factEl.style.opacity = '1'; }, 150);
        }

        i++;
        animateStep();
      }, stepDelay);
    }

    setTimeout(animateStep, 600);
  }

  // --- Render lịch trình AI thật vào màn kết quả ---
  function renderResult(trip) {
    if (!trip) return;
    const titleEl = document.querySelector('.result-title');
    if (titleEl && trip.title) titleEl.textContent = trip.title;

    // Render các ngày thật
    const daysEl = document.getElementById('itinerary-days');
    if (window.TripRender && daysEl) {
      TripRender.renderCompactDays(daysEl, trip);
    }

    // Chèn AI insight + summary lên đầu (nếu chưa có)
    const screen = document.querySelector('.result-screen');
    if (screen && trip.ai_insight && !document.getElementById('result-ai-insight')) {
      const note = document.createElement('div');
      note.id = 'result-ai-insight';
      note.style.cssText = 'margin:14px 0;padding:14px 16px;border-radius:16px;background:rgba(255,127,107,0.08);border:1px solid rgba(255,127,107,0.18);font-size:13.5px;line-height:1.5;color:var(--text,#2c2c2c);';
      note.innerHTML = `<strong style="color:var(--coral,#FF7F6B)">🧠 AI:</strong> ${TripRender.esc(trip.ai_insight)}`;
      const header = document.querySelector('.result-header-card');
      if (header && header.parentNode) header.parentNode.insertBefore(note, header.nextSibling);
    }
  }

  // --- Update result meta from answers ---
  function updateResultMeta() {
    const durationMap = { '1-2': '1–2 days', '3-4': '3–4 days', '5-7': '5–7 days', '7+': '7+ days' };
    const companionMap = { solo: '🧑 Solo', couple: '💑 Couple', friends: '👫 Friends', family: '👨‍👩‍👧 Family' };
    const budgetMap = { budget: '🎒 Budget', moderate: '🌸 Moderate', premium: '✨ Premium', luxury: '👑 Luxury' };

    const rd = document.getElementById('result-duration');
    const rb = document.getElementById('result-budget');
    const rc = document.getElementById('result-companion');

    if (rd && state.answers.duration) rd.textContent = '📅 ' + (durationMap[state.answers.duration] || state.answers.duration);
    if (rb && state.answers.budget) rb.textContent = budgetMap[state.answers.budget] || state.answers.budget;
    if (rc && state.answers.companion) rc.textContent = companionMap[state.answers.companion] || state.answers.companion;
  }

  // --- Save trip button ---
  const btnSave = document.getElementById('btn-save-trip');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      btnSave.innerHTML = '<span class="btn-sparkle">✅</span><span class="btn-text">Đã lưu!</span>';
      btnSave.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
      btnSave.style.boxShadow = '0 8px 32px rgba(76, 175, 80, 0.3)';
      btnSave.style.pointerEvents = 'none';
      const dest = _generatedTripId ? `hub.html?id=${_generatedTripId}` : 'hub.html';
      setTimeout(() => { window.location.href = dest; }, 800);
    });
  }

  // --- Regenerate button ---
  const btnRegen = document.getElementById('btn-regenerate');
  if (btnRegen) {
    btnRegen.addEventListener('click', () => {
      goToStep(10, 'forward');
    });
  }

  // --- Initial state ---
  if (window.location.hash === '#analyzing') {
    state.currentStep = 10;
    document.querySelector('.flow-step.active').classList.remove('active');
    const targetEl = document.getElementById('step-10');
    targetEl.style.display = '';
    targetEl.classList.add('active');
    footer.classList.add('hidden');
    btnBack.style.visibility = 'hidden';
    runAIThinking();
  } else {
    updateProgress();
    updateNextButton();
    btnBack.style.visibility = 'hidden';
  }

  // --- Ripple effect for all buttons ---
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleEffect { to { transform: scale(2.5); opacity: 0; } }`;
  document.head.appendChild(style);

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; width:${size}px; height:${size}px; border-radius:50%;
        background:rgba(255,255,255,0.3);
        left:${e.clientX - rect.left - size/2}px; top:${e.clientY - rect.top - size/2}px;
        transform:scale(0); animation:rippleEffect 0.6s ease-out forwards; pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  console.log('🌸 HueViVu — AI Question Flow loaded');
});
