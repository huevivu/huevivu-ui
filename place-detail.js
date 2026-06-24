/* ========================================
   HueViVu — Place Detail Interactions
   ======================================== */

const PLACES = {
  citadel: {
    name: 'Hoàng Thành Huế',
    img: 'assets/citadel.png',
    cats: ['🏛️ Di tích lịch sử', '🌏 UNESCO'],
    badges: ['UNESCO'],
    rating: '4.9', ratingCount: '(2.3k)', price: '200k VND', duration: '2-3 giờ', distance: '1.2 km',
    ai: 'Nên đến lúc 7h sáng — ít người, ánh sáng đẹp cho chụp ảnh, và tránh được nắng nóng buổi trưa.',
    desc: 'Hoàng Thành Huế là quần thể kiến trúc hoàng gia lớn nhất còn tồn tại ở Việt Nam, được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993. Nơi đây từng là trung tâm chính trị và văn hóa của triều Nguyễn suốt 143 năm (1802-1945).',
    desc2: 'Với diện tích hơn 520 hecta, Hoàng Thành bao gồm Ngọ Môn, Điện Thái Hòa, Tử Cấm Thành, và nhiều cung điện, đền miếu mang đậm dấu ấn nghệ thuật và lịch sử Huế.',
    highlights: [
      { icon: '🏛️', text: 'Ngọ Môn — cổng chính hoành tráng' },
      { icon: '👑', text: 'Điện Thái Hòa — nơi thiết triều' },
      { icon: '🏯', text: 'Tử Cấm Thành — nơi ở của vua' },
      { icon: '🌿', text: 'Vườn Cơ Hạ — khu vườn yên tĩnh' }
    ],
    hours: 'Thứ 2 — Chủ nhật', hoursTime: '07:00 — 17:30',
    hoursNote: 'Quầy vé đóng lúc 17:00. Nên đến trước 15:00 để tham quan thoải mái.',
    tips: [
      { avatar: '👩‍🍳', author: 'Chị Hoa · Người Huế', quote: '"Đi từ cổng Ngọ Môn, rẽ trái vào Tử Cấm Thành trước — ít khách hơn nhiều so với đi thẳng."' },
      { avatar: '🧑‍🎨', author: 'Anh Minh · Nhiếp ảnh gia', quote: '"Golden hour ở Ngọ Môn là khoảng 16:30 — ánh sáng chiếu qua cổng rất đẹp để chụp ảnh."' }
    ],
    gallery: ['assets/citadel.png', 'assets/hero-hub.png', 'assets/hero.png', 'assets/river.png'],
    nearby: [
      { id: 'pagoda', name: 'Chùa Thiên Mụ', img: 'assets/river.png', dist: '📍 3.2 km' },
      { id: 'market', name: 'Chợ Đông Ba', img: 'assets/food.png', dist: '📍 0.8 km' },
      { id: 'tomb', name: 'Lăng Tự Đức', img: 'assets/hero-hub.png', dist: '📍 5.4 km' }
    ]
  },
  pagoda: {
    name: 'Chùa Thiên Mụ',
    img: 'assets/river.png',
    cats: ['🛕 Tâm linh', '📸 Landmark'],
    badges: ['Biểu tượng'],
    rating: '4.9', ratingCount: '(1.8k)', price: 'Miễn phí', duration: '1-1.5 giờ', distance: '3.2 km',
    ai: 'Nên ghé vào buổi chiều muộn — ngắm hoàng hôn trên sông Hương từ sân chùa rất tuyệt.',
    desc: 'Chùa Thiên Mụ là ngôi chùa cổ nhất và nổi tiếng nhất của Huế, nằm trên đồi Hà Khê bên bờ sông Hương. Tháp Phước Duyên 7 tầng cao 21m là biểu tượng không chính thức của thành phố Huế.',
    desc2: 'Được xây dựng năm 1601 dưới triều chúa Nguyễn Hoàng, chùa mang vẻ đẹp thanh tịnh với vườn cây xanh mát và tầm nhìn panorama ra sông Hương.',
    highlights: [
      { icon: '🛕', text: 'Tháp Phước Duyên 7 tầng' },
      { icon: '🌊', text: 'View sông Hương tuyệt đẹp' },
      { icon: '🔔', text: 'Đại Hồng Chung nặng 3.285 kg' },
      { icon: '🌿', text: 'Vườn cây cổ thụ yên tĩnh' }
    ],
    hours: 'Hàng ngày', hoursTime: '06:00 — 18:00',
    hoursNote: 'Miễn phí vào cửa. Nên mặc trang phục lịch sự khi vào chùa.',
    tips: [
      { avatar: '🧘', author: 'Sư thầy Minh · Chùa Thiên Mụ', quote: '"Sáng sớm 6h là lúc yên tĩnh nhất, nghe tiếng chuông chùa vang trên sông Hương rất thanh bình."' },
      { avatar: '📸', author: 'Chị Lan · Travel blogger', quote: '"Đứng ở sân trước tháp, quay mặt ra sông — đó là góc chụp đẹp nhất, nhất là lúc chiều tà."' }
    ],
    gallery: ['assets/river.png', 'assets/hero.png', 'assets/citadel.png', 'assets/hero-hub.png'],
    nearby: [
      { id: 'citadel', name: 'Hoàng Thành', img: 'assets/citadel.png', dist: '📍 3.2 km' },
      { id: 'tomb', name: 'Lăng Tự Đức', img: 'assets/hero-hub.png', dist: '📍 4.1 km' },
      { id: 'river', name: 'Sông Hương', img: 'assets/river.png', dist: '📍 0.2 km' }
    ]
  },
  tomb: {
    name: 'Lăng Tự Đức',
    img: 'assets/hero-hub.png',
    cats: ['🏛️ Di tích', '🎨 Kiến trúc'],
    badges: ['Thơ mộng'],
    rating: '4.8', ratingCount: '(1.2k)', price: '150k VND', duration: '1.5-2 giờ', distance: '5.4 km',
    ai: 'Nơi yên tĩnh nhất vào buổi sáng sớm — cảm giác như lạc vào một khu vườn bí mật thời Nguyễn.',
    desc: 'Lăng Tự Đức là lăng mộ đẹp nhất trong các lăng tẩm hoàng gia Huế, được xây dựng từ 1864-1867. Vua Tự Đức đã tự thiết kế nơi này như một cung điện thu nhỏ giữa rừng thông và hồ sen.',
    desc2: 'Nơi đây không chỉ là lăng mộ mà còn là nơi vua đọc sách, ngâm thơ, và nghỉ ngơi — một tuyệt tác kiến trúc cảnh quan hài hòa giữa thiên nhiên và nghệ thuật.',
    highlights: [
      { icon: '🌺', text: 'Hồ Lưu Khiêm — hồ sen thơ mộng' },
      { icon: '📜', text: 'Khiêm Cung — cung điện thu nhỏ' },
      { icon: '🌲', text: 'Rừng thông tự nhiên bao quanh' },
      { icon: '🎭', text: 'Nhà hát Minh Khiêm — nhà hát hoàng gia' }
    ],
    hours: 'Thứ 2 — Chủ nhật', hoursTime: '07:00 — 17:30',
    hoursNote: 'Nên dành ít nhất 1.5 giờ để tham quan đầy đủ. Mang nước uống vì không có nhiều quán bán.',
    tips: [
      { avatar: '🎨', author: 'Anh Tuấn · Hướng dẫn viên', quote: '"Đi qua cổng chính, rẽ phải đến hồ Lưu Khiêm trước — đó là nơi đẹp nhất và ít người nhất."' },
      { avatar: '📸', author: 'Chị Mai · Photographer', quote: '"Mùa sen (tháng 6-8) là thời điểm đẹp nhất — hồ sen nở hồng rực, chụp ảnh áo dài tuyệt vời."' }
    ],
    gallery: ['assets/hero-hub.png', 'assets/citadel.png', 'assets/hero.png', 'assets/river.png'],
    nearby: [
      { id: 'citadel', name: 'Hoàng Thành', img: 'assets/citadel.png', dist: '📍 5.4 km' },
      { id: 'pagoda', name: 'Chùa Thiên Mụ', img: 'assets/river.png', dist: '📍 4.1 km' },
      { id: 'market', name: 'Chợ Đông Ba', img: 'assets/food.png', dist: '📍 6.2 km' }
    ]
  },
  bunbo: {
    name: 'Quán Bà Tuyết — Bún bò Huế',
    img: 'assets/food.png',
    cats: ['🍜 Ẩm thực', '🔥 Đường phố'],
    badges: ['Huyền thoại'],
    rating: '4.8', ratingCount: '(3.1k)', price: '40k VND', duration: '30-45 phút', distance: '0.8 km',
    ai: 'Quán đông nhất từ 6:30-8:00 sáng. Nên đến sau 8h để không phải xếp hàng.',
    desc: 'Quán Bà Tuyết là một trong những quán bún bò Huế lâu đời nhất thành phố, hoạt động từ năm 1972. Tô bún bò ở đây nổi tiếng với nước dùng đậm đà, thịt bò mềm, và chả cua giòn.',
    desc2: 'Đây là trải nghiệm ẩm thực đường phố đích thực của Huế — ngồi ghế nhựa bên đường, thưởng thức một tô bún bò nóng hổi trong buổi sáng sớm.',
    highlights: [
      { icon: '🥩', text: 'Thịt bò tái, chín, bắp' },
      { icon: '🦀', text: 'Chả cua giòn rụm' },
      { icon: '🌶️', text: 'Nước dùng cay nồng đặc trưng' },
      { icon: '🥬', text: 'Rau sống tươi & mắm ruốc' }
    ],
    hours: 'Hàng ngày', hoursTime: '05:30 — 10:00',
    hoursNote: 'Chỉ bán buổi sáng! Hết hàng thì nghỉ sớm. Nên đến trước 9h.',
    tips: [
      { avatar: '👩‍🍳', author: 'Chị Hoa · Người Huế', quote: '"Gọi thêm chả cua riêng — đó là món ngon nhất ở đây mà nhiều khách du lịch không biết."' },
      { avatar: '🍜', author: 'Anh Nam · Food blogger', quote: '"Ăn kèm mắm ruốc mới đúng kiểu Huế. Và nhớ cho thêm ớt tươi — cay nhưng rất ngon!"' }
    ],
    gallery: ['assets/food.png', 'assets/hero.png', 'assets/citadel.png', 'assets/river.png'],
    nearby: [
      { id: 'market', name: 'Chợ Đông Ba', img: 'assets/food.png', dist: '📍 0.5 km' },
      { id: 'citadel', name: 'Hoàng Thành', img: 'assets/citadel.png', dist: '📍 1.2 km' },
      { id: 'river', name: 'Sông Hương', img: 'assets/river.png', dist: '📍 0.6 km' }
    ]
  },
  river: {
    name: 'Bến thuyền sông Hương',
    img: 'assets/river.png',
    cats: ['🌊 Trải nghiệm', '🚢 Du thuyền'],
    badges: ['Sunset'],
    rating: '4.7', ratingCount: '(980)', price: '150-250k VND', duration: '1.5-2 giờ', distance: '2.1 km',
    ai: 'Chuyến thuyền hoàng hôn (17:00-18:30) là trải nghiệm được đánh giá cao nhất. Đặt trước 1 ngày.',
    desc: 'Sông Hương — "Perfume River" — là linh hồn của Huế. Trải nghiệm du thuyền trên sông Hương lúc hoàng hôn là một trong những trải nghiệm đẹp nhất tại Việt Nam.',
    desc2: 'Thuyền rồng truyền thống sẽ đưa bạn lướt qua Cầu Trường Tiền, Chùa Thiên Mụ, và nhiều lăng tẩm bên bờ sông trong ánh chiều tà.',
    highlights: [
      { icon: '🌅', text: 'Sunset cruise — hoàng hôn tuyệt đẹp' },
      { icon: '🎵', text: 'Nhã nhạc cung đình trên thuyền' },
      { icon: '🍵', text: 'Thưởng thức trà Huế' },
      { icon: '🏛️', text: 'View Cầu Trường Tiền & chùa' }
    ],
    hours: 'Hàng ngày', hoursTime: '08:00 — 20:00',
    hoursNote: 'Chuyến hoàng hôn 17:00 bán hết nhanh nhất. Nên đặt trước qua điện thoại.',
    tips: [
      { avatar: '🚣', author: 'Anh Đức · Thuyền trưởng', quote: '"Ngồi ở mũi thuyền bên phải — sẽ thấy Chùa Thiên Mụ và hoàng hôn cùng lúc."' },
      { avatar: '📸', author: 'Chị Linh · Du khách', quote: '"Mang theo áo khoác mỏng — gió trên sông khá mát, nhất là lúc chiều tối."' }
    ],
    gallery: ['assets/river.png', 'assets/hero.png', 'assets/hero-hub.png', 'assets/citadel.png'],
    nearby: [
      { id: 'pagoda', name: 'Chùa Thiên Mụ', img: 'assets/river.png', dist: '📍 2.8 km' },
      { id: 'citadel', name: 'Hoàng Thành', img: 'assets/citadel.png', dist: '📍 2.1 km' },
      { id: 'bunbo', name: 'Bún bò Bà Tuyết', img: 'assets/food.png', dist: '📍 1.5 km' }
    ]
  },
  market: {
    name: 'Chợ Đông Ba',
    img: 'assets/food.png',
    cats: ['🛍️ Chợ', '🍜 Ẩm thực'],
    badges: ['Nhộn nhịp'],
    rating: '4.6', ratingCount: '(1.5k)', price: 'Miễn phí', duration: '1-2 giờ', distance: '0.6 km',
    ai: 'Đi vào buổi sáng sớm (6-8h) để thấy chợ nhộn nhịp nhất và có thể ăn sáng tại chợ.',
    desc: 'Chợ Đông Ba là khu chợ lớn nhất và lâu đời nhất của Huế, nằm ngay bên bờ sông Hương. Đây là nơi lý tưởng để trải nghiệm đời sống thường nhật của người Huế và thưởng thức ẩm thực đường phố.',
    desc2: 'Từ bánh bèo, bánh lọc, chè Huế đến các sản phẩm thủ công, nón lá, áo dài — tất cả đều có ở Đông Ba với giá rất phải chăng.',
    highlights: [
      { icon: '🍜', text: 'Khu ẩm thực bánh Huế' },
      { icon: '👒', text: 'Nón lá & quà lưu niệm' },
      { icon: '🌺', text: 'Hoa tươi & trái cây' },
      { icon: '👗', text: 'Vải & áo dài Huế' }
    ],
    hours: 'Hàng ngày', hoursTime: '05:00 — 20:00',
    hoursNote: 'Sáng sớm là thời điểm nhộn nhịp nhất. Buổi chiều thường vắng hơn.',
    tips: [
      { avatar: '🛍️', author: 'Chị Tuyền · Tiểu thương', quote: '"Vào khu bán bánh ở tầng trệt, phía trong — đó là nơi ngon nhất và rẻ nhất."' },
      { avatar: '💰', author: 'Anh Khoa · Du khách', quote: '"Nên trả giá nhẹ nhàng khoảng 70-80% giá hỏi. Người Huế bán thật thà, không hét giá quá cao."' }
    ],
    gallery: ['assets/food.png', 'assets/citadel.png', 'assets/hero.png', 'assets/river.png'],
    nearby: [
      { id: 'citadel', name: 'Hoàng Thành', img: 'assets/citadel.png', dist: '📍 0.8 km' },
      { id: 'bunbo', name: 'Bún bò Bà Tuyết', img: 'assets/food.png', dist: '📍 0.5 km' },
      { id: 'river', name: 'Sông Hương', img: 'assets/river.png', dist: '📍 0.3 km' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const placeId = params.get('id') || 'citadel';

  // Map place từ DB (shape backend) sang shape render của trang
  function mapDbPlace(p) {
    return {
      name: p.name, img: p.img || 'assets/citadel.png',
      cats: [p.category].filter(Boolean), badges: [],
      rating: String(p.rating || ''), ratingCount: p.rating_count ? `(${p.rating_count})` : '',
      price: p.price || '', duration: p.duration || '', distance: p.distance || '',
      ai: p.ai_insight || '', desc: p.description || '', desc2: '',
      highlights: (p.highlights || []).map(h => ({ icon: '✨', text: h })),
      hours: p.hours || '', hoursTime: p.hours_time || '', hoursNote: p.hours_note || '',
      tips: (p.tips || []).map(t => ({ avatar: '🧑', author: 'Mẹo địa phương', quote: `"${t}"` })),
      gallery: [p.img || 'assets/citadel.png'],
      nearby: [],
    };
  }

  function renderPlace(place) {
  // Populate content
  document.title = `HueViVu — ${place.name}`;
  document.getElementById('hero-img').src = place.img;
  document.getElementById('hero-img').alt = place.name;
  document.getElementById('detail-name').textContent = place.name;
  document.getElementById('stat-rating').textContent = place.rating;
  document.querySelector('.detail-stat-label').textContent = place.ratingCount;
  document.getElementById('stat-price').textContent = place.price;
  document.getElementById('stat-duration').textContent = place.duration;
  document.getElementById('stat-distance').textContent = place.distance;
  document.getElementById('ai-insight-text').textContent = place.ai;
  document.getElementById('detail-desc').textContent = place.desc;
  document.getElementById('detail-desc-2').textContent = place.desc2;

  // Categories
  const catsEl = document.getElementById('detail-cats');
  catsEl.innerHTML = place.cats.map(c => `<span class="detail-cat">${c}</span>`).join('');

  // Badges
  const badgesEl = document.getElementById('hero-badges');
  badgesEl.innerHTML = place.badges.map(b => `<span class="hero-badge-tag">${b}</span>`).join('');

  // Highlights
  const hlEl = document.getElementById('detail-highlights');
  hlEl.innerHTML = place.highlights.map(h =>
    `<div class="highlight-card"><span class="highlight-icon">${h.icon}</span><span class="highlight-text">${h.text}</span></div>`
  ).join('');

  // Hours
  document.querySelector('.hours-day').textContent = place.hours;
  document.querySelector('.hours-time').textContent = place.hoursTime;
  document.querySelector('.hours-note span:last-child').textContent = place.hoursNote;

  // Tips
  const tipsEl = document.querySelector('.detail-tips');
  tipsEl.innerHTML = place.tips.map(t =>
    `<div class="detail-tip">
      <div class="tip-avatar-small">${t.avatar}</div>
      <div class="tip-content">
        <span class="tip-author-small">${t.author}</span>
        <p class="tip-quote">${t.quote}</p>
      </div>
    </div>`
  ).join('');

  // Gallery
  const galleryEl = document.getElementById('detail-gallery');
  galleryEl.innerHTML = place.gallery.map(g =>
    `<div class="gallery-item"><img src="${g}" alt="Photo" /></div>`
  ).join('');

  // Nearby
  const nearbyEl = document.querySelector('.detail-nearby-scroll');
  if (place.nearby && place.nearby.length) {
    nearbyEl.innerHTML = place.nearby.map(n =>
      `<div class="detail-nearby-card" data-place="${n.id}">
        <div class="dnc-img"><img src="${n.img}" alt="${n.name}" /></div>
        <span class="dnc-name">${n.name}</span>
        <span class="dnc-dist">${n.dist}</span>
      </div>`
    ).join('');
  }
  }

  // --- Chọn nguồn dữ liệu: static (giàu) → fallback DB (cho địa điểm seed mới) ---
  if (PLACES[placeId]) {
    renderPlace(PLACES[placeId]);
  } else if (typeof API !== 'undefined') {
    API.getPlace(placeId)
      .then(p => renderPlace(mapDbPlace(p)))
      .catch(() => renderPlace(PLACES.citadel));
  } else {
    renderPlace(PLACES.citadel);
  }

  // Track view (data flywheel cho AI personalization)
  if (typeof API !== 'undefined') API.trackEvent('view', { place_id: placeId });

  // --- Section reveal ---
  const scroll = document.getElementById('detail-scroll');
  const sections = document.querySelectorAll('.section');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px', root: scroll });
  sections.forEach(s => obs.observe(s));

  // --- Back button ---
  document.getElementById('btn-back').addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'home.html';
    }
  });

  // --- Save toggle ---
  const btnSave = document.getElementById('btn-save');
  btnSave.addEventListener('click', () => {
    btnSave.classList.toggle('saved');
    btnSave.style.transform = 'scale(1.2)';
    setTimeout(() => { btnSave.style.transform = ''; }, 300);
    const saved = btnSave.classList.contains('saved');
    if (typeof API !== 'undefined') API.trackEvent(saved ? 'save' : 'unsave', { place_id: placeId });
    if (window.toast) toast(saved ? 'Đã lưu địa điểm 🔖' : 'Đã bỏ lưu', saved ? 'success' : '');
  });

  // --- Share ---
  const btnShare = document.getElementById('btn-share');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const name = document.getElementById('detail-name')?.textContent || 'Địa điểm ở Huế';
      if (typeof API !== 'undefined') API.trackEvent('share', { place_id: placeId });
      if (window.hvShare) window.hvShare(name, `${name} — khám phá cùng HueViVu`);
    });
  }

  // --- Directions (mở Google Maps) ---
  const btnDirections = document.getElementById('btn-directions');
  if (btnDirections) {
    btnDirections.addEventListener('click', () => {
      const name = document.getElementById('detail-name')?.textContent || '';
      const q = encodeURIComponent(`${name} Huế`);
      if (typeof API !== 'undefined') API.trackEvent('directions', { place_id: placeId });
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
    });
  }

  // --- Nearby card navigation (delegation — vì render bất đồng bộ) ---
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.detail-nearby-card');
    if (card && card.dataset.place) {
      window.location.href = `place-detail.html?id=${card.dataset.place}`;
    }
    const gi = e.target.closest('.gallery-item');
    if (gi) {
      gi.style.transform = 'scale(0.95)';
      setTimeout(() => { gi.style.transform = ''; }, 200);
    }
  });

  // --- CTA buttons ---
  document.getElementById('btn-add-trip').addEventListener('click', () => {
    const btn = document.getElementById('btn-add-trip');
    if (typeof API !== 'undefined') API.trackEvent('add_trip', { place_id: placeId });
    btn.innerHTML = '<span>✅</span> Đã thêm!';
    btn.style.background = '#22C55E';
    btn.style.boxShadow = '0 8px 24px rgba(34,197,94,0.3)';
    if (window.toast) toast('Đã ghi nhận yêu thích — AI sẽ ưu tiên nơi này trong lịch trình ✨', 'success');
    setTimeout(() => {
      btn.innerHTML = '<span>✨</span> Thêm vào lịch trình';
      btn.style.background = '';
      btn.style.boxShadow = '';
    }, 2000);
  });

  console.log('📍 Place detail loaded:', placeId);
});
