/* ========================================
   HueViVu — Collection Detail Interactions
   ======================================== */

const COLLECTIONS = {
  unesco: {
    name: 'Di sản UNESCO',
    img: 'assets/citadel.png',
    desc: 'Những di sản văn hóa thế giới tại Huế',
    aiSummary: '5 địa điểm di sản, AI gợi ý nên ghé 3 điểm phù hợp nhất với bạn trong 1 ngày.',
    places: [
      { id: 'citadel', name: 'Hoàng Thành Huế', img: 'assets/citadel.png', cat: '🏛️ Di tích lịch sử · UNESCO', rating: '⭐ 4.9', price: '200k VND', aiTag: 'AI đề xuất' },
      { id: 'pagoda', name: 'Chùa Thiên Mụ', img: 'assets/river.png', cat: '🛕 Tâm linh · Biểu tượng', rating: '⭐ 4.9', price: 'Miễn phí', aiTag: 'AI đề xuất' },
      { id: 'tomb', name: 'Lăng Tự Đức', img: 'assets/hero-hub.png', cat: '🏛️ Di tích · Kiến trúc', rating: '⭐ 4.8', price: '150k VND', aiTag: 'AI đề xuất' },
      { id: 'citadel', name: 'Lăng Minh Mạng', img: 'assets/hero.png', cat: '🏛️ Di tích · Phong thủy', rating: '⭐ 4.7', price: '150k VND', aiTag: null },
      { id: 'citadel', name: 'Lăng Khải Định', img: 'assets/citadel.png', cat: '🏛️ Di tích · Châu Âu', rating: '⭐ 4.8', price: '150k VND', aiTag: null }
    ]
  },
  food: {
    name: 'Ẩm thực Huế',
    img: 'assets/food.png',
    desc: 'Tinh hoa ẩm thực cung đình và đường phố Huế',
    aiSummary: '6 quán ăn, AI gợi ý lộ trình ăn uống tối ưu theo giờ mở cửa.',
    places: [
      { id: 'bunbo', name: 'Bún bò Bà Tuyết', img: 'assets/food.png', cat: '🍜 Bún bò Huế', rating: '⭐ 4.8', price: '40k VND', aiTag: 'Đang mở' },
      { id: 'market', name: 'Bánh bèo Chợ Đông Ba', img: 'assets/food.png', cat: '🥟 Bánh Huế', rating: '⭐ 4.7', price: '25k VND', aiTag: 'AI đề xuất' },
      { id: 'market', name: 'Cơm hến Bà Oanh', img: 'assets/food.png', cat: '🍚 Cơm hến', rating: '⭐ 4.6', price: '30k VND', aiTag: null },
      { id: 'market', name: 'Bánh khoái Lạc Thiện', img: 'assets/hero.png', cat: '🥞 Bánh khoái', rating: '⭐ 4.8', price: '45k VND', aiTag: 'Huyền thoại' },
      { id: 'market', name: 'Chè Hẻm', img: 'assets/hero.png', cat: '🍧 Chè Huế', rating: '⭐ 4.5', price: '20k VND', aiTag: null },
      { id: 'market', name: 'Cà phê muối Thành Nội', img: 'assets/citadel.png', cat: '☕ Cà phê muối', rating: '⭐ 4.7', price: '35k VND', aiTag: 'Must try' }
    ]
  },
  sunset: {
    name: 'Hoàng hôn Huế',
    img: 'assets/river.png',
    desc: 'Những điểm ngắm hoàng hôn đẹp nhất xứ Huế',
    aiSummary: '4 điểm hoàng hôn, AI đề xuất 2 điểm tốt nhất hôm nay dựa trên thời tiết.',
    places: [
      { id: 'river', name: 'Bến thuyền sông Hương', img: 'assets/river.png', cat: '🌅 Sunset cruise', rating: '⭐ 4.9', price: '250k VND', aiTag: 'Hôm nay đẹp' },
      { id: 'pagoda', name: 'Chùa Thiên Mụ', img: 'assets/river.png', cat: '🌅 View sông Hương', rating: '⭐ 4.8', price: 'Miễn phí', aiTag: 'AI đề xuất' },
      { id: 'citadel', name: 'Cầu Trường Tiền', img: 'assets/hero.png', cat: '🌉 Cầu & sông', rating: '⭐ 4.7', price: 'Miễn phí', aiTag: null },
      { id: 'citadel', name: 'Đồi Vọng Cảnh', img: 'assets/hero-hub.png', cat: '⛰️ Đồi panorama', rating: '⭐ 4.6', price: 'Miễn phí', aiTag: null }
    ]
  },
  cafe: {
    name: 'Cà phê Huế',
    img: 'assets/hero.png',
    desc: 'Những quán cà phê có view và không gian đẹp nhất',
    aiSummary: '5 quán cà phê, AI gợi ý theo thời gian và khoảng cách từ vị trí của bạn.',
    places: [
      { id: 'market', name: 'Cà phê muối Thành Nội', img: 'assets/citadel.png', cat: '☕ Cà phê muối · View thành', rating: '⭐ 4.7', price: '35k VND', aiTag: 'Gần bạn' },
      { id: 'market', name: 'La Patio Cafe', img: 'assets/hero.png', cat: '☕ Cà phê sân vườn', rating: '⭐ 4.6', price: '45k VND', aiTag: null },
      { id: 'market', name: 'Cà phê Ý Thảo', img: 'assets/river.png', cat: '☕ View sông Hương', rating: '⭐ 4.8', price: '40k VND', aiTag: 'AI đề xuất' },
      { id: 'market', name: 'The Rooftop', img: 'assets/hero-hub.png', cat: '☕ Rooftop · View 360°', rating: '⭐ 4.5', price: '55k VND', aiTag: null },
      { id: 'market', name: 'Calm House Coffee', img: 'assets/hero.png', cat: '☕ Hidden gem', rating: '⭐ 4.9', price: '35k VND', aiTag: 'Hidden gem' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const colId = params.get('id') || 'unesco';
  const col = COLLECTIONS[colId] || COLLECTIONS.unesco;

  document.title = `HueViVu — ${col.name}`;
  document.getElementById('hero-img').src = col.img;
  document.getElementById('col-name').textContent = col.name;
  document.getElementById('col-desc').textContent = col.desc;
  document.getElementById('col-count').textContent = `${col.places.length} địa điểm`;
  document.getElementById('ai-summary-text').textContent = col.aiSummary;

  // Place list
  const listEl = document.getElementById('col-place-list');
  listEl.innerHTML = col.places.map(p =>
    `<div class="col-place-card" data-place="${p.id}">
      <div class="cpc-img"><img src="${p.img}" alt="${p.name}" /></div>
      <div class="cpc-body">
        <span class="cpc-name">${p.name}</span>
        <span class="cpc-cat">${p.cat}</span>
        <div class="cpc-bottom">
          <span class="cpc-rating">${p.rating}</span>
          <span class="cpc-price">${p.price}</span>
          ${p.aiTag ? `<span class="cpc-ai-tag">${p.aiTag}</span>` : ''}
        </div>
      </div>
      <span class="cpc-arrow">→</span>
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
    window.history.length > 1 ? window.history.back() : (window.location.href = 'explore.html');
  });

  // Place card click → place detail
  document.querySelectorAll('.col-place-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.place;
      window.location.href = `place-detail.html?id=${id}`;
    });
  });

  // AI plan button
  document.getElementById('btn-ai-plan').addEventListener('click', () => {
    window.location.href = 'flow.html';
  });

  // Create trip CTA
  document.getElementById('btn-create-trip').addEventListener('click', function() {
    this.innerHTML = '<span>🚀</span> Đang tạo lịch trình...';
    this.style.pointerEvents = 'none';
    setTimeout(() => { window.location.href = 'flow.html'; }, 800);
  });

  console.log(`📚 Collection detail loaded: ${col.name}`);
});
