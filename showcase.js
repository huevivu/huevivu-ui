/* ================================================================
   HueViVu — Cinematic Showcase JavaScript
   Orchestrates all 8 scenes with timing, animations, transitions
   ================================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     SCENE CONFIGURATION
     Each scene has a duration and an optional onEnter callback
  ────────────────────────────────────────────────────────────── */
  const SCENES = [
    { id: 0, duration: 6000,  label: 'Opening' },
    { id: 1, duration: 5500,  label: 'Pain Point' },
    { id: 2, duration: 7000,  label: 'AI Planner' },
    { id: 3, duration: 6500,  label: 'Weather AI' },
    { id: 4, duration: 6000,  label: 'AI Chat' },
    { id: 5, duration: 5500,  label: 'Hidden Gems' },
    { id: 6, duration: 6000,  label: 'Audio Guide' },
    { id: 7, duration: 99999, label: 'Finale' }, // stays until user interacts
  ];

  /* ──────────────────────────────────────────────────────────────
     STATE
  ────────────────────────────────────────────────────────────── */
  let currentScene = 0;
  let isPlaying    = true;
  let timer        = null;
  let progressTimer = null;
  let progressStart = null;

  const totalScenes = SCENES.length;

  /* ──────────────────────────────────────────────────────────────
     DOM REFERENCES
  ────────────────────────────────────────────────────────────── */
  const progressFill = document.getElementById('sc-progress-fill');
  const dots         = document.querySelectorAll('.sc-dot');
  const scenes       = document.querySelectorAll('.scene');
  const playBtn      = document.getElementById('sc-play-btn');
  const skipBtn      = document.getElementById('sc-skip-btn');
  const iconPause    = document.getElementById('icon-pause');
  const iconPlay     = document.getElementById('icon-play');

  /* ──────────────────────────────────────────────────────────────
     CORE: GO TO SCENE
  ────────────────────────────────────────────────────────────── */
  function goToScene(index, instant = false) {
    if (index < 0 || index >= totalScenes) return;

    // Clear old timers
    clearTimeout(timer);
    cancelAnimationFrame(progressTimer);

    // Deactivate current scene
    scenes.forEach((s) => {
      s.classList.remove('active', 'exit');
    });
    dots.forEach((d) => d.classList.remove('active'));

    // Activate next
    currentScene = index;
    const sceneEl = scenes[index];
    sceneEl.classList.add('active');
    dots[index]?.classList.add('active');

    // Run scene-specific enter logic
    onEnterScene(index);

    // Progress animation
    if (isPlaying && index < totalScenes - 1) {
      startProgress(SCENES[index].duration);

      timer = setTimeout(() => {
        goToScene(index + 1);
      }, SCENES[index].duration);
    } else {
      progressFill.style.width = index === totalScenes - 1 ? '100%' : '0%';
    }
  }

  /* ──────────────────────────────────────────────────────────────
     PROGRESS BAR ANIMATION
  ────────────────────────────────────────────────────────────── */
  function startProgress(duration) {
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    progressStart = performance.now();

    function tick(now) {
      if (!isPlaying) return;
      const elapsed = now - progressStart;
      const pct = Math.min((elapsed / duration) * 100, 100);
      progressFill.style.width = pct + '%';
      if (pct < 100) {
        progressTimer = requestAnimationFrame(tick);
      }
    }
    progressTimer = requestAnimationFrame(tick);
  }

  function pauseProgress() {
    cancelAnimationFrame(progressTimer);
  }

  /* ──────────────────────────────────────────────────────────────
     SCENE ENTER CALLBACKS
  ────────────────────────────────────────────────────────────── */
  function onEnterScene(index) {
    switch (index) {
      case 0: enterScene0(); break;
      case 1: enterScene1(); break;
      case 2: enterScene2(); break;
      case 3: enterScene3(); break;
      case 4: enterScene4(); break;
      case 5: enterScene5(); break;
      case 6: enterScene6(); break;
      case 7: enterScene7(); break;
    }
  }

  /* ── SCENE 0: Opening — spawn particles ───────────────────── */
  function enterScene0() {
    const container = document.getElementById('particles-1');
    if (!container || container.dataset.spawned) return;
    container.dataset.spawned = 'true';

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size  = 2 + Math.random() * 4;
      const delay = Math.random() * 4;
      const dur   = 4 + Math.random() * 6;
      const x     = Math.random() * 100;
      const dy    = -(80 + Math.random() * 200);
      const dx    = (Math.random() - 0.5) * 100;
      const colors = ['rgba(255,127,107,0.6)', 'rgba(255,154,92,0.5)', 'rgba(255,180,130,0.4)', 'rgba(255,200,100,0.5)'];
      const color  = colors[Math.floor(Math.random() * colors.length)];

      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}%; bottom:15%;
        background:${color};
        --dx:${dx}px; --dy:${dy}px;
        animation-duration:${dur}s;
        animation-delay:${delay}s;
      `;
      container.appendChild(p);
    }
  }

  /* ── SCENE 1: Pain Point — nothing special beyond CSS ─────── */
  function enterScene1() {
    // Reset tab chaos positions randomly for reentry
    const tabs = document.querySelectorAll('.s2-tab-scattered');
    tabs.forEach(t => {
      const r = (Math.random() - 0.5) * 8;
      t.style.transform = `rotate(${r}deg)`;
    });
  }

  /* ── SCENE 2: AI Planner — typewriter inputs ──────────────── */
  function enterScene2() {
    const vals = [
      { id: 's3-val-1', text: '2 days' },
      { id: 's3-val-2', text: 'Couple Trip' },
      { id: 's3-val-3', text: '2,000,000 VNĐ' },
    ];

    vals.forEach(({ id, text }, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = '';
      el.style.borderRight = '2px solid var(--coral)';

      setTimeout(() => {
        typeText(el, text, 60, () => {
          // blink stays via CSS
        });
      }, 900 + i * 600);
    });
  }

  function typeText(el, text, speed, onDone) {
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        onDone?.();
      }
    }, speed);
  }

  /* ── SCENE 3: Weather AI ──────────────────────────────────── */
  function enterScene3() {
    const rain = document.getElementById('s4-rain');
    const sky  = document.getElementById('s4-sky');
    const weatherIcon = document.getElementById('s4-weather-icon');
    const weatherStatus = document.getElementById('s4-weather-status');
    const alert = document.getElementById('s4-ai-alert');
    const item2Name = document.getElementById('s4-item-2-name');
    const item3Name = document.getElementById('s4-item-3-name');
    const item3Type = document.getElementById('s4-item-3-type');
    const item2    = document.getElementById('s4-item-2');
    const item3    = document.getElementById('s4-item-3');

    if (!rain) return;

    // Reset state
    rain.classList.remove('active');
    sky?.classList.remove('rainy');
    if (alert) { alert.classList.remove('visible'); }
    if (item2) { item2.className = 's4-item'; }
    if (item3) { item3.className = 's4-item'; }
    if (item2Name) item2Name.textContent = 'Bún bò Bà Tuyết';
    if (item3Name) item3Name.textContent = 'Chùa Thiên Mụ';
    if (item3Type) item3Type.textContent = '🛕 Spiritual';
    if (weatherIcon) weatherIcon.textContent = '🌤️ 28°C';
    if (weatherStatus) { weatherStatus.textContent = 'Perfect weather'; weatherStatus.style.color = '#5B8A5B'; }

    // Spawn rain drops
    if (!rain.dataset.spawned) {
      rain.dataset.spawned = 'true';
      for (let i = 0; i < 80; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const dur   = 0.4 + Math.random() * 0.6;
        drop.style.cssText = `
          left:${left}%;
          animation-duration:${dur}s;
          animation-delay:${delay}s;
          height:${14 + Math.random() * 12}px;
        `;
        rain.appendChild(drop);
      }
    }

    // Sequence: rain starts after 2s
    setTimeout(() => {
      rain.classList.add('active');
      sky?.classList.add('rainy');
      if (weatherIcon) weatherIcon.textContent = '🌧️ 22°C';
      if (weatherStatus) {
        weatherStatus.textContent = 'Rain detected';
        weatherStatus.style.color = '#6B8AAA';
      }
    }, 2000);

    // AI alert appears
    setTimeout(() => {
      alert?.classList.add('visible');
    }, 2800);

    // Itinerary rescheduling
    setTimeout(() => {
      if (item3) {
        item3.className = 's4-item rescheduled';
        if (item3Name) item3Name.textContent = '☕ Riverside Café (Rain Alternative)';
        if (item3Type) item3Type.textContent = '☕ Chill • Indoor';
      }
    }, 3800);
  }

  /* ── SCENE 4: AI Chat ─────────────────────────────────────── */
  function enterScene4() {
    // Chat messages animate via CSS (stagger-delayed), nothing special
  }

  /* ── SCENE 5: Hidden Gems ─────────────────────────────────── */
  function enterScene5() {
    // Pins animate via CSS, nothing extra needed
  }

  /* ── SCENE 6: Audio Guide ─────────────────────────────────── */
  function enterScene6() {
    // Progress fills via CSS animation
  }

  /* ── SCENE 7: Finale — burst particles ───────────────────── */
  function enterScene7() {
    const container = document.getElementById('s8-particles');
    if (!container || container.dataset.spawned) return;
    container.dataset.spawned = 'true';

    // Delayed burst
    setTimeout(() => {
      for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size  = 3 + Math.random() * 6;
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const dist  = 100 + Math.random() * 300;
        const dx    = Math.cos(angle) * dist;
        const dy    = Math.sin(angle) * dist - 200;
        const delay = Math.random() * 0.8;
        const dur   = 1.5 + Math.random() * 2;

        const colors = [
          'rgba(255,127,107,0.8)', 'rgba(255,154,92,0.8)',
          'rgba(245,200,66,0.8)',  'rgba(255,200,150,0.7)',
          'rgba(255,255,255,0.6)',
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        p.style.cssText = `
          width:${size}px; height:${size}px;
          left:50%; top:40%;
          background:${color};
          --dx:${dx}px; --dy:${dy}px;
          animation-duration:${dur}s;
          animation-delay:${delay}s;
          animation-fill-mode:both;
        `;
        container.appendChild(p);
      }
    }, 800);
  }

  /* ──────────────────────────────────────────────────────────────
     CONTROLS
  ────────────────────────────────────────────────────────────── */
  function togglePlay() {
    if (isPlaying) {
      // Pause
      isPlaying = false;
      clearTimeout(timer);
      pauseProgress();
      iconPause.style.display = 'none';
      iconPlay.style.display  = 'block';
    } else {
      // Resume
      isPlaying = true;
      iconPause.style.display = 'block';
      iconPlay.style.display  = 'none';

      if (currentScene < totalScenes - 1) {
        const remaining = SCENES[currentScene].duration * (1 - parseFloat(progressFill.style.width) / 100);
        startProgressFrom(remaining, SCENES[currentScene].duration);
        timer = setTimeout(() => goToScene(currentScene + 1), remaining);
      }
    }
  }

  function startProgressFrom(remaining, total) {
    const startWidth = parseFloat(progressFill.style.width) || 0;
    progressStart = performance.now() - (total - remaining);

    function tick(now) {
      if (!isPlaying) return;
      const elapsed = now - progressStart;
      const pct = Math.min((elapsed / total) * 100, 100);
      progressFill.style.width = pct + '%';
      if (pct < 100) {
        progressTimer = requestAnimationFrame(tick);
      }
    }
    progressTimer = requestAnimationFrame(tick);
  }

  function skipToNext() {
    if (currentScene < totalScenes - 1) {
      goToScene(currentScene + 1);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     EVENT LISTENERS
  ────────────────────────────────────────────────────────────── */
  playBtn?.addEventListener('click', togglePlay);
  skipBtn?.addEventListener('click', skipToNext);

  // Dot navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.scene);
      if (!isNaN(idx)) goToScene(idx);
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        skipToNext();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentScene > 0) goToScene(currentScene - 1);
        break;
      case 'p':
      case 'P':
        togglePlay();
        break;
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) skipToNext();                                      // swipe left = next
      else if (currentScene > 0) goToScene(currentScene - 1);       // swipe right = prev
    }
  }, { passive: true });

  /* ──────────────────────────────────────────────────────────────
     PUBLIC: restart
  ────────────────────────────────────────────────────────────── */
  window.restartShowcase = function () {
    // Clean up spawned particles
    ['s8-particles', 'particles-1'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.innerHTML = ''; delete el.dataset.spawned; }
    });
    const rain = document.getElementById('s4-rain');
    if (rain) { rain.innerHTML = ''; delete rain.dataset.spawned; }

    isPlaying = true;
    iconPause.style.display = 'block';
    iconPlay.style.display  = 'none';

    goToScene(0);
  };

  /* ──────────────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────────────── */
  function init() {
    // Ensure only first scene is active
    scenes.forEach((s, i) => {
      s.classList.toggle('active', i === 0);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === 0);
    });

    goToScene(0);
  }

  // Small delay to let fonts & images load
  window.addEventListener('load', () => {
    setTimeout(init, 300);
  });

})();
