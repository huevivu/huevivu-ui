/* ========================================
   HueViVu — Shared Trip Rendering Helpers
   Dùng chung cho flow (result), hub, shared-trip-detail.
   Render itinerary JSON từ backend ra timeline đúng style .tl-card.
   ======================================== */
(function () {
  if (typeof window === 'undefined') return;

  const TYPE_EMOJI = {
    heritage: '🏛️', food: '🍜', nature: '🌿', cafe: '☕',
    experience: '✨', temple: '🛕', market: '🛍️', beach: '🏖️',
    nightlife: '🌙', shopping: '🛍️', default: '📍',
  };

  const TYPE_LABEL = {
    heritage: 'Di sản', food: 'Ẩm thực', nature: 'Thiên nhiên', cafe: 'Cà phê',
    experience: 'Trải nghiệm', temple: 'Tâm linh', market: 'Chợ', nightlife: 'Về đêm',
  };

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  function emojiFor(type) {
    return TYPE_EMOJI[type] || TYPE_EMOJI.default;
  }

  // Lấy mảng days từ nhiều shape khác nhau (trip.itinerary.days | trip.days | itinerary.days)
  function extractDays(itinerary) {
    if (!itinerary) return [];
    if (Array.isArray(itinerary.days)) return itinerary.days;
    if (itinerary.itinerary && Array.isArray(itinerary.itinerary.days)) return itinerary.itinerary.days;
    if (Array.isArray(itinerary)) return itinerary;
    return [];
  }

  function renderActivity(act, isLast) {
    const cat = [TYPE_LABEL[act.type] || (act.type || ''), act.location]
      .filter(Boolean).join(' · ');
    const tags = [];
    if (act.cost) tags.push(`<span class="tl-tag">💰 ${esc(act.cost)}</span>`);
    if (act.duration) tags.push(`<span class="tl-tag">⏱ ${esc(act.duration)}</span>`);
    if (act.location) tags.push(`<span class="tl-tag">📍 ${esc(String(act.location).split(',')[0])}</span>`);

    const aiNote = act.ai_tip
      ? `<div class="tl-ai-note"><span class="tl-ai-icon">🧠</span><span>${esc(act.ai_tip)}</span></div>`
      : '';

    return `
      <div class="tl-item">
        <div class="tl-time">${esc(act.time || '')}</div>
        <div class="tl-line"><div class="tl-dot${isLast ? ' last' : ''}"></div></div>
        <div class="tl-card">
          <div class="tl-card-head">
            <span class="tl-emoji">${emojiFor(act.type)}</span>
            <div class="tl-card-info">
              <span class="tl-name">${esc(act.name || '')}</span>
              <span class="tl-cat">${esc(cat)}</span>
            </div>
          </div>
          ${act.description ? `<p class="tl-desc">${esc(act.description)}</p>` : ''}
          ${tags.length ? `<div class="tl-meta">${tags.join('')}</div>` : ''}
          ${aiNote}
        </div>
      </div>`;
  }

  function renderDay(day) {
    const acts = day.activities || [];
    const items = acts.map((a, i) => renderActivity(a, i === acts.length - 1)).join('');
    return `
      <div class="day-block" data-day="${esc(day.day || '')}">
        <div class="day-pill">
          <span class="day-pill-num">Ngày ${esc(day.day || '')}</span>
          <span class="day-pill-theme">${esc(day.theme || '')}</span>
        </div>
        ${day.day_tip ? `<p class="day-tip" style="margin:0 0 12px;padding:0 4px;color:var(--text-muted,#8a8a8a);font-size:13px;font-style:italic;">💡 ${esc(day.day_tip)}</p>` : ''}
        <div class="timeline">${items}</div>
      </div>`;
  }

  // Render toàn bộ timeline vào 1 container element (giữ nguyên markup nếu rỗng → fallback)
  function renderTimeline(container, itinerary) {
    if (!container) return false;
    const days = extractDays(itinerary);
    if (!days.length) return false;
    container.innerHTML = days.map(renderDay).join('');
    return true;
  }

  // Số địa điểm trong itinerary (cho hero stat)
  function countPlaces(itinerary) {
    return extractDays(itinerary).reduce((n, d) => n + ((d.activities || []).length), 0);
  }

  // Render gọn cho màn kết quả flow (.day-card / .day-item)
  function renderCompactDays(container, itinerary) {
    if (!container) return false;
    const days = extractDays(itinerary);
    if (!days.length) return false;
    container.innerHTML = days.map(day => {
      const items = (day.activities || []).map(act => `
        <div class="day-item">
          <span class="item-time">${esc(act.time || '')}</span>
          <div class="item-content">
            <span class="item-name">${esc(act.name || '')}</span>
            <span class="item-type">${emojiFor(act.type)} ${esc(TYPE_LABEL[act.type] || act.type || '')}</span>
          </div>
        </div>`).join('');
      return `
        <div class="day-card">
          <div class="day-header">
            <span class="day-number">Ngày ${esc(day.day || '')}</span>
            <span class="day-theme">${esc(day.theme || '')}</span>
          </div>
          <div class="day-items">${items}</div>
        </div>`;
    }).join('');
    return true;
  }

  window.TripRender = { renderTimeline, renderCompactDays, renderDay, renderActivity, emojiFor, extractDays, countPlaces, esc };
})();
