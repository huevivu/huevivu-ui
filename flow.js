/* ========================================
   HueViVu — AI Question Flow Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  const state = {
    currentStep: 1,
    totalSteps: 5,
    answers: {
      duration: null,
      styles: [],
      companion: null,
      budget: null,
      food: []
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
    else if (step === 2) enabled = state.answers.styles.length > 0;
    else if (step === 3) enabled = !!state.answers.companion;
    else if (step === 4) enabled = !!state.answers.budget;
    else if (step === 5) enabled = state.answers.food.length > 0;
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
      if (target >= 6) {
        footer.classList.add('hidden');
      } else {
        footer.classList.remove('hidden');
      }

      // Show/hide back & skip
      btnBack.style.visibility = target === 1 ? 'hidden' : 'visible';

      // Trigger AI thinking if step 6
      if (target === 6) runAIThinking();
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
            if (state.currentStep < 6) {
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
          if (state.currentStep < 6) {
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
          if (state.currentStep < 6) {
            goToStep(state.currentStep + 1, 'forward');
          }
        }, 400);
      });
    });
  }

  // --- Initialize selections ---
  setupGridCards('options-duration', 'duration', false);
  setupGridCards('options-style', 'styles', true);
  setupRowList('options-companion', 'companion');
  setupBudgetCards();
  setupGridCards('options-food', 'food', true);

  // --- Continue button ---
  btnNext.addEventListener('click', () => {
    if (state.currentStep < 6) {
      goToStep(state.currentStep + 1, 'forward');
    }
  });

  // --- Back button ---
  btnBack.addEventListener('click', () => {
    if (state.currentStep === 7) {
      // From results, go back to step 5
      goToStep(5, 'back');
    } else if (state.currentStep > 1) {
      goToStep(state.currentStep - 1, 'back');
    } else {
      // Go back to landing page
      window.location.href = 'home.html';
    }
  });

  // --- Skip button ---
  btnSkip.addEventListener('click', () => {
    if (state.currentStep < 5) {
      goToStep(state.currentStep + 1, 'forward');
    } else if (state.currentStep === 5) {
      goToStep(6, 'forward');
    }
  });

  // --- AI Thinking Animation ---
  function runAIThinking() {
    const steps = document.querySelectorAll('#ai-steps .ai-step');
    const title = document.getElementById('ai-thinking-title');
    const sub = document.getElementById('ai-thinking-sub');
    const factEl = document.getElementById('ai-fun-fact');

    const facts = [
      "Huế has over 1,300 unique dishes in its culinary tradition!",
      "The Imperial City was built in 1805 and took 30 years to complete.",
      "Huế's Perfume River got its name from flowers that fall into the water upstream.",
      "The city has 7 UNESCO World Heritage Sites within its borders.",
      "Bánh bèo alone has over 10 regional variations in Huế."
    ];

    const titles = [
      "Creating your journey...",
      "Almost there...",
      "Finalizing your plan..."
    ];

    let factIdx = 0;
    factEl.querySelector('.fact-text').textContent = facts[0];

    // Animate steps one by one
    let i = 0;
    function animateStep() {
      if (i >= steps.length) {
        // All done
        title.textContent = "Your journey is ready! ✨";
        sub.textContent = "Crafted just for you";
        setTimeout(() => {
          goToStep(7, 'forward');
          updateResultMeta();
        }, 800);
        return;
      }

      steps[i].classList.add('active');

      if (i === 2) title.textContent = titles[1];
      if (i === 3) title.textContent = titles[2];

      setTimeout(() => {
        steps[i].classList.remove('active');
        steps[i].classList.add('done');

        // Rotate fun fact
        factIdx = (factIdx + 1) % facts.length;
        factEl.querySelector('.fact-text').textContent = facts[factIdx];
        factEl.style.opacity = '0';
        setTimeout(() => { factEl.style.opacity = '1'; }, 150);

        i++;
        animateStep();
      }, 1200);
    }

    setTimeout(animateStep, 600);
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
      btnSave.innerHTML = '<span class="btn-sparkle">✅</span><span class="btn-text">Trip Saved!</span>';
      btnSave.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
      btnSave.style.boxShadow = '0 8px 32px rgba(76, 175, 80, 0.3)';
      btnSave.style.pointerEvents = 'none';
      // Navigate to Itinerary Hub
      setTimeout(() => { window.location.href = 'hub.html'; }, 800);
    });
  }

  // --- Regenerate button ---
  const btnRegen = document.getElementById('btn-regenerate');
  if (btnRegen) {
    btnRegen.addEventListener('click', () => {
      goToStep(6, 'forward');
    });
  }

  // --- Initial state ---
  updateProgress();
  updateNextButton();
  btnBack.style.visibility = 'hidden';

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
