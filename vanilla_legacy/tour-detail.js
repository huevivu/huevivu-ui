/* ========================================
   HueViVu — Tour Detail Interactions
   ======================================== */

const TOURS = {
  culture3d: {
    name: '3 Ngày Ẩm thực & Văn hóa',
    img: 'assets/citadel.png',
    badge: 'AI Gợi ý',
    days: '3 ngày', spots: '12 điểm', group: '2-6 người', rating: '4.9',
    aiMatch: 'Phù hợp 95% với bạn',
    aiText: 'Gói này có 8/10 hoạt động phù hợp với phong cách Cultural Explorer của bạn.',
    total: '$45',
    dayList: [
      {
        num: 'N1', title: 'Di sản Hoàng gia & Ẩm thực',
        subtitle: 'Một buổi sáng hoành tráng, buổi chiều thư giãn',
        activities: [
          { emoji: '🍜', name: 'Bún bò Bà Tuyết', time: '07:00 — 08:00' },
          { emoji: '🏛️', name: 'Hoàng Thành Huế', time: '08:30 — 11:00' },
          { emoji: '🍽️', name: 'Cơm hến Chợ Đông Ba', time: '11:30 — 12:30' },
          { emoji: '🛕', name: 'Chùa Thiên Mụ', time: '14:00 — 15:30' },
          { emoji: '🌅', name: 'Sunset Cruise sông Hương', time: '17:00 — 19:00' }
        ]
      },
      {
        num: 'N2', title: 'Lăng tẩm & Nghệ thuật',
        subtitle: 'Khám phá kiến trúc và câu chuyện hoàng gia',
        activities: [
          { emoji: '🌺', name: 'Lăng Tự Đức', time: '07:30 — 09:30' },
          { emoji: '🏯', name: 'Lăng Minh Mạng', time: '10:00 — 11:30' },
          { emoji: '🍜', name: 'Bánh khoái Lạc Thiện', time: '12:00 — 13:00' },
          { emoji: '🎨', name: 'Làng hương Thủy Xuân', time: '14:30 — 16:00' },
          { emoji: '☕', name: 'Cà phê muối hoàng hôn', time: '16:30 — 17:30' }
        ]
      },
      {
        num: 'N3', title: 'Đời sống địa phương',
        subtitle: 'Trải nghiệm Huế như người bản địa',
        activities: [
          { emoji: '🛍️', name: 'Chợ Đông Ba buổi sáng', time: '06:00 — 07:30' },
          { emoji: '🍜', name: 'Food tour đường phố', time: '08:00 — 10:30' },
          { emoji: '🌿', name: 'Vườn rau Thủy Biều', time: '11:00 — 12:30' },
          { emoji: '🎵', name: 'Nhã nhạc cung đình', time: '15:00 — 16:30' },
          { emoji: '🌃', name: 'Đêm phố cổ', time: '19:00 — 21:00' }
        ]
      }
    ],
    included: [
      { text: '🏨 3 đêm khách sạn', yes: true },
      { text: '🍽️ Bữa sáng hàng ngày', yes: true },
      { text: '🎫 Vé vào cửa di tích', yes: true },
      { text: '🚐 Di chuyển riêng', yes: true },
      { text: '📸 HDV địa phương', yes: true },
      { text: '🚢 Sunset cruise', yes: true },
      { text: '✈️ Vé máy bay', yes: false },
      { text: '🍽️ Bữa tối', yes: false }
    ],
    pricing: [
      { label: 'Vé di tích (5 điểm)', value: '600k VND' },
      { label: 'Sunset cruise', value: '250k VND' },
      { label: 'Food tour', value: '350k VND' },
      { label: 'Di chuyển', value: '500k VND' },
      { label: 'HDV (3 ngày)', value: '300k VND' }
    ],
    reviews: [
      { avatar: '🧑', name: 'Trọng Nhân', date: '1 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"3 ngày tuyệt vời nhất! AI gợi ý chuẩn khỏi chỉnh. Mọi thứ sắp xếp mượt mà."' },
      { avatar: '👩', name: 'Sarah K.', date: '2 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"Perfectly balanced between culture and food. The guide was amazing!"' }
    ]
  },
  foodhalf: {
    name: 'Nửa ngày Food Tour',
    img: 'assets/food.png',
    badge: 'Phổ biến',
    days: 'Nửa ngày', spots: '6 quán', group: '2-8 người', rating: '4.8',
    aiMatch: 'Phù hợp 92% với bạn',
    aiText: 'Bạn yêu ẩm thực đường phố — tour này dẫn bạn đến 6 quán bí mật của dân Huế.',
    total: '$15',
    dayList: [
      {
        num: 'N1', title: 'Khám phá ẩm thực đường phố',
        subtitle: '3 giờ ăn uống thỏa thích',
        activities: [
          { emoji: '🍜', name: 'Bún bò Bà Tuyết', time: '17:00 — 17:30' },
          { emoji: '🥟', name: 'Bánh bèo, bánh lọc', time: '17:40 — 18:00' },
          { emoji: '🦀', name: 'Cơm hến & bánh khoái', time: '18:10 — 18:40' },
          { emoji: '🍧', name: 'Chè Huế — Chè Hẻm', time: '18:50 — 19:10' },
          { emoji: '☕', name: 'Cà phê muối', time: '19:20 — 19:45' },
          { emoji: '🌃', name: 'Dạo phố đêm', time: '19:45 — 20:00' }
        ]
      }
    ],
    included: [
      { text: '🍜 6 quán ăn', yes: true },
      { text: '🧑‍🍳 HDV người Huế', yes: true },
      { text: '🥤 Nước & đồ uống', yes: true },
      { text: '📖 Câu chuyện ẩm thực', yes: true },
      { text: '🚗 Di chuyển', yes: false },
      { text: '🎁 Quà lưu niệm', yes: false }
    ],
    pricing: [
      { label: 'Tất cả 6 quán ăn', value: '200k VND' },
      { label: 'HDV & câu chuyện', value: '100k VND' },
      { label: 'Nước & đồ uống', value: '50k VND' }
    ],
    reviews: [
      { avatar: '🧑', name: 'David N.', date: '1 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"Best food tour ever! Every stop was incredible."' },
      { avatar: '👩', name: 'Linh Đan', date: '3 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"No ơi là no! Chị hướng dẫn rất vui và hiểu biết."' }
    ]
  },
  sunset: {
    name: 'Hoàng hôn sông Hương',
    img: 'assets/river.png',
    badge: 'Mới',
    days: '1 buổi tối', spots: '3 trải nghiệm', group: '2-10 người', rating: '4.9',
    aiMatch: 'Phù hợp 98% với bạn',
    aiText: 'Bạn yêu hoàng hôn — đây là trải nghiệm hoàng hôn đẹp nhất trên sông Hương.',
    total: '$12',
    dayList: [
      {
        num: '🌅', title: 'Hoàng hôn trên sông Hương',
        subtitle: 'Tối hôm nay, sông Hương đẹp lắm',
        activities: [
          { emoji: '🚢', name: 'Khởi hành từ bến thuyền', time: '17:00' },
          { emoji: '🌅', name: 'Ngắm hoàng hôn', time: '17:45' },
          { emoji: '🎵', name: 'Nhã nhạc & trà Huế', time: '18:15' },
          { emoji: '🌃', name: 'Ngắm thành phố về đêm', time: '18:45' },
          { emoji: '🏠', name: 'Kết thúc tại bến', time: '19:00' }
        ]
      }
    ],
    included: [
      { text: '🚢 Thuyền rồng', yes: true },
      { text: '🎵 Nhã nhạc', yes: true },
      { text: '🍵 Trà & bánh', yes: true },
      { text: '📸 HDV & chụp ảnh', yes: true },
      { text: '🍽️ Bữa tối', yes: false },
      { text: '🚗 Đưa đón', yes: false }
    ],
    pricing: [
      { label: 'Thuyền rồng & nhã nhạc', value: '200k VND' },
      { label: 'Trà & bánh Huế', value: '50k VND' },
      { label: 'HDV & quà lưu niệm', value: '50k VND' }
    ],
    reviews: [
      { avatar: '🧑', name: 'Minh Anh', date: '2 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"Hoàng hôn trên sông Hương đẹp đến nao lòng!"' },
      { avatar: '👩', name: 'Emma L.', date: '1 tháng trước', stars: '⭐⭐⭐⭐⭐', text: '"One of the best experiences in Vietnam!"' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tourId = params.get('id') || 'culture3d';
  const tour = TOURS[tourId] || TOURS.culture3d;

  document.title = `HueViVu — ${tour.name}`;
  document.getElementById('hero-img').src = tour.img;
  document.getElementById('hero-badge').textContent = tour.badge;
  document.getElementById('detail-name').textContent = tour.name;
  document.getElementById('tm-days').textContent = tour.days;
  document.getElementById('tm-spots').textContent = tour.spots;
  document.getElementById('tm-group').textContent = tour.group;
  document.getElementById('tm-rating').textContent = tour.rating;
  document.getElementById('tam-label').textContent = tour.aiMatch;
  document.getElementById('tam-text').textContent = tour.aiText;
  document.getElementById('cta-total').textContent = tour.total;

  // Day cards
  const daysEl = document.getElementById('tour-days');
  daysEl.innerHTML = tour.dayList.map((d, i) =>
    `<div class="day-card${i === 0 ? ' expanded' : ''}" data-day="${i}">
      <div class="day-header">
        <div class="day-num">${d.num}</div>
        <div class="day-info">
          <span class="day-title">${d.title}</span>
          <span class="day-subtitle">${d.subtitle}</span>
        </div>
        <span class="day-toggle">▾</span>
      </div>
      <div class="day-body">
        <div class="day-activities">
          ${d.activities.map(a => `
            <div class="day-activity">
              <span class="da-emoji">${a.emoji}</span>
              <div class="da-content">
                <span class="da-name">${a.name}</span>
                <span class="da-time">${a.time}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`
  ).join('');

  // Day card accordion
  document.querySelectorAll('.day-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.day-card');
      card.classList.toggle('expanded');
    });
  });

  // Included
  const incEl = document.getElementById('tour-included');
  incEl.innerHTML = tour.included.map(i =>
    `<span class="tour-inc-item ${i.yes ? 'tour-inc-yes' : 'tour-inc-no'}">${i.text}</span>`
  ).join('');

  // Pricing
  const priceEl = document.getElementById('tour-pricing');
  const total = tour.pricing.reduce((sum, p) => {
    const num = parseInt(p.value.replace(/[^0-9]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  priceEl.innerHTML = tour.pricing.map(p =>
    `<div class="price-row"><span class="price-label">${p.label}</span><span class="price-value">${p.value}</span></div>`
  ).join('') +
    `<div class="price-divider"></div>
     <div class="price-row price-total"><span class="price-label">Tổng cộng</span><span class="price-value">${total.toLocaleString()}k VND</span></div>`;

  // Reviews
  const revEl = document.getElementById('tour-reviews');
  revEl.innerHTML = tour.reviews.map(r =>
    `<div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.avatar}</div>
        <div class="review-author"><span class="review-name">${r.name}</span><span class="review-date">${r.date}</span></div>
        <div class="review-stars">${r.stars}</div>
      </div>
      <p class="review-text">${r.text}</p>
    </div>`
  ).join('');

  // Section reveal
  const scroll = document.getElementById('detail-scroll');
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: scroll });
  sections.forEach(s => obs.observe(s));

  // Back
  document.getElementById('btn-back').addEventListener('click', () => {
    window.history.length > 1 ? window.history.back() : (window.location.href = 'home.html');
  });

  // Save
  document.getElementById('btn-save').addEventListener('click', function() {
    this.classList.toggle('saved');
    this.style.transform = 'scale(1.2)';
    setTimeout(() => { this.style.transform = ''; }, 300);
    const saved = this.classList.contains('saved');
    if (typeof API !== 'undefined') API.trackEvent(saved ? 'save' : 'unsave', { context: { tour: tourId } });
    if (window.toast) toast(saved ? 'Đã lưu tour 🔖' : 'Đã bỏ lưu', saved ? 'success' : '');
  });

  // Customize button → tạo lịch trình riêng từ tour này
  document.getElementById('btn-customize').addEventListener('click', () => {
    window.location.href = 'flow.html';
  });

  // Book CTA → tạo lịch trình theo tour (HueViVu không phải app đặt tour)
  document.getElementById('btn-book').addEventListener('click', function() {
    if (typeof API !== 'undefined') API.trackEvent('add_trip', { context: { tour: tourId } });
    this.innerHTML = '<span>✨</span> Đang mở trình lập lịch...';
    if (window.toast) toast('Để AI dựng lịch trình riêng theo tour này nhé ✨', 'success');
    setTimeout(() => { window.location.href = 'flow.html'; }, 700);
  });

  console.log(`📦 Tour detail loaded: ${tour.name}`);
});
