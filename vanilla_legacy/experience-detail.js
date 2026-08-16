/* ========================================
   HueViVu — Experience Detail Interactions
   ======================================== */

const EXPERIENCES = {
  sunset: {
    name: 'Sunset Cruise trên sông Hương',
    img: 'assets/river.png',
    badge: 'HOT',
    duration: '2 giờ', rating: '4.9', count: '(856)', price: '250k VND',
    ai: 'Bạn yêu hoàng hôn & nhiếp ảnh — trải nghiệm này sẽ cho bạn cả hai trên sông Hương.',
    aiMatch: 'Phù hợp 95% với bạn',
    desc: 'Lướt nhẹ trên sông Hương trong ánh hoàng hôn vàng rực, nghe nhã nhạc cung đình và thưởng thức trà Huế truyền thống. Một trải nghiệm không thể bỏ lỡ khi đến Huế.',
    included: [
      { icon: '🚢', text: 'Thuyền rồng truyền thống', yes: true },
      { icon: '🎵', text: 'Nhã nhạc cung đình', yes: true },
      { icon: '🍵', text: 'Trà & bánh Huế', yes: true },
      { icon: '📸', text: 'Hướng dẫn viên', yes: true },
      { icon: '🍽️', text: 'Bữa tối (tùy chọn thêm)', yes: false },
      { icon: '🚗', text: 'Đưa đón khách sạn', yes: false }
    ],
    schedule: [
      { time: '17:00', title: 'Tập trung tại bến thuyền', desc: 'Nhận welcome drink & chụp ảnh kỷ niệm', active: false },
      { time: '17:15', title: 'Khởi hành trên sông Hương', desc: 'Lướt qua Cầu Trường Tiền, ngắm thành phố', active: false },
      { time: '17:45', title: 'Ngắm hoàng hôn ✨', desc: 'Thời khắc đẹp nhất — mặt trời lặn trên sông Hương', active: true },
      { time: '18:15', title: 'Nhã nhạc & trà Huế', desc: 'Thưởng thức nghệ thuật cung đình & trà truyền thống', active: false },
      { time: '19:00', title: 'Kết thúc tại bến thuyền', desc: 'Trở về bến, tặng quà lưu niệm', active: false }
    ],
    reviews: [
      { avatar: '🧑', name: 'Minh Anh', date: '2 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"Trải nghiệm tuyệt vời nhất tại Huế! Hoàng hôn trên sông Hương đẹp đến nao lòng."' },
      { avatar: '👩', name: 'Thu Hà', date: '1 tháng trước', stars: '⭐⭐⭐⭐⭐', text: '"Nhã nhạc trên sông rất đặc biệt — cảm giác như quay về thời Nguyễn."' }
    ]
  },
  foodtour: {
    name: 'Food Tour ẩm thực đường phố Huế',
    img: 'assets/food.png',
    badge: '#1 Food',
    duration: '3 giờ', rating: '4.8', count: '(1.2k)', price: '350k VND',
    ai: 'Bạn yêu ẩm thực đường phố — tour này sẽ đưa bạn đến 6 quán ăn bí mật mà dân Huế yêu thích.',
    aiMatch: 'Phù hợp 92% với bạn',
    desc: 'Khám phá 6 quán ăn đường phố ngon nhất Huế cùng hướng dẫn viên địa phương. Từ bún bò, bánh bèo đến chè Huế — tất cả đều là những quán ẩn giấu mà du khách thường không biết.',
    included: [
      { icon: '🍜', text: '6 quán ăn đường phố', yes: true },
      { icon: '🧑‍🍳', text: 'Hướng dẫn viên người Huế', yes: true },
      { icon: '🥤', text: 'Đồ uống & nước', yes: true },
      { icon: '📖', text: 'Câu chuyện ẩm thực Huế', yes: true },
      { icon: '🚗', text: 'Di chuyển xe máy', yes: false },
      { icon: '🎁', text: 'Quà lưu niệm', yes: false }
    ],
    schedule: [
      { time: '17:00', title: 'Gặp nhau tại Chợ Đông Ba', desc: 'Giới thiệu tour & uống nước mía', active: false },
      { time: '17:20', title: 'Bún bò Huế — Quán Bà Tuyết', desc: 'Tô bún bò truyền thống 50 năm', active: true },
      { time: '17:50', title: 'Bánh bèo, bánh lọc', desc: 'Quán nhỏ ven đường — cực ngon', active: false },
      { time: '18:20', title: 'Cơm hến & bánh khoái', desc: 'Đặc sản Huế chính hiệu', active: false },
      { time: '18:50', title: 'Chè Huế — Chè Hẻm', desc: 'Tráng miệng với chè cung đình', active: false },
      { time: '19:15', title: 'Cà phê muối', desc: 'Kết thúc với ly cà phê muối nổi tiếng', active: false }
    ],
    reviews: [
      { avatar: '🧑', name: 'David N.', date: '1 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"Best food tour I\'ve ever done! The guide knew every hidden gem."' },
      { avatar: '👩', name: 'Linh Đan', date: '3 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"No ơi là no! 6 quán đều ngon khó tin. Chị hướng dẫn rất vui và nhiệt tình."' }
    ]
  },
  heritage: {
    name: 'Heritage Walk — Di sản Hoàng gia',
    img: 'assets/citadel.png',
    badge: 'Photo Spot',
    duration: '4 giờ', rating: '4.9', count: '(650)', price: '400k VND',
    ai: 'Bạn yêu lịch sử & kiến trúc — walk này sẽ đưa bạn vào những góc khuất của Hoàng Thành.',
    aiMatch: 'Phù hợp 98% với bạn',
    desc: 'Cuộc dạo bộ chuyên sâu qua 3 di sản hoàng gia quan trọng nhất Huế cùng hướng dẫn viên chuyên gia lịch sử. Khám phá những câu chuyện thú vị và góc chụp ảnh đẹp nhất.',
    included: [
      { icon: '🎫', text: 'Vé vào cửa 3 di tích', yes: true },
      { icon: '📚', text: 'HDV chuyên gia lịch sử', yes: true },
      { icon: '📸', text: 'Hỗ trợ chụp ảnh', yes: true },
      { icon: '🍵', text: 'Trà & nước giải khát', yes: true },
      { icon: '🚗', text: 'Di chuyển giữa các điểm', yes: true },
      { icon: '🍽️', text: 'Bữa trưa', yes: false }
    ],
    schedule: [
      { time: '07:30', title: 'Hoàng Thành Huế', desc: 'Tham quan Ngọ Môn, Điện Thái Hòa, Tử Cấm Thành', active: true },
      { time: '09:30', title: 'Di chuyển & giải lao', desc: 'Thưởng thức trà sen tại quán ven hào thành', active: false },
      { time: '10:00', title: 'Lăng Tự Đức', desc: 'Lăng đẹp nhất — kiến trúc hài hòa với thiên nhiên', active: false },
      { time: '11:15', title: 'Chùa Thiên Mụ', desc: 'Biểu tượng Huế bên bờ sông Hương', active: false },
      { time: '11:30', title: 'Kết thúc tại bến sông', desc: 'Ngắm sông Hương & tặng quà lưu niệm', active: false }
    ],
    reviews: [
      { avatar: '🧓', name: 'Prof. James', date: '1 tháng trước', stars: '⭐⭐⭐⭐⭐', text: '"Incredibly knowledgeable guide. Learned more in 4 hours than from any book."' },
      { avatar: '👩', name: 'Hương Trà', date: '2 tuần trước', stars: '⭐⭐⭐⭐⭐', text: '"Những góc khuất của Hoàng Thành mà không ai biết — tour này xứng đáng từng đồng!"' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const expId = params.get('id') || 'sunset';
  const exp = EXPERIENCES[expId] || EXPERIENCES.sunset;

  document.title = `HueViVu — ${exp.name}`;
  document.getElementById('hero-img').src = exp.img;
  document.getElementById('hero-badge').textContent = exp.badge;
  document.getElementById('detail-name').textContent = exp.name;
  document.getElementById('meta-duration').textContent = exp.duration;
  document.getElementById('meta-rating').textContent = exp.rating;
  document.getElementById('meta-count').textContent = exp.count;
  document.getElementById('meta-price').textContent = exp.price;
  document.getElementById('ai-match-text').textContent = exp.ai;
  document.querySelector('.eam-label').textContent = exp.aiMatch;
  document.getElementById('detail-desc').textContent = exp.desc;
  document.getElementById('cta-price').textContent = exp.price;

  // Included
  const incEl = document.getElementById('exp-included');
  incEl.innerHTML = exp.included.map(i =>
    `<div class="inc-item ${i.yes ? 'inc-yes' : 'inc-no'}"><span class="inc-icon">${i.icon}</span><span>${i.text}</span></div>`
  ).join('');

  // Schedule
  const schEl = document.getElementById('exp-schedule');
  schEl.innerHTML = exp.schedule.map((s, i) =>
    `<div class="sch-item">
      <div class="sch-time">${s.time}</div>
      <div class="sch-dot-line"><div class="sch-dot${s.active ? ' active' : ''}"></div></div>
      <div class="sch-content">
        <span class="sch-title">${s.title}</span>
        <span class="sch-desc">${s.desc}</span>
      </div>
    </div>`
  ).join('');

  // Reviews
  const revEl = document.getElementById('exp-reviews');
  revEl.innerHTML = exp.reviews.map(r =>
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
    window.history.length > 1 ? window.history.back() : (window.location.href = 'explore.html');
  });

  // Save toggle
  document.getElementById('btn-save').addEventListener('click', function() {
    this.classList.toggle('saved');
    this.style.transform = 'scale(1.2)';
    setTimeout(() => { this.style.transform = ''; }, 300);
    const saved = this.classList.contains('saved');
    if (typeof API !== 'undefined') API.trackEvent(saved ? 'save' : 'unsave', { context: { experience: expId } });
    if (window.toast) toast(saved ? 'Đã lưu trải nghiệm 🔖' : 'Đã bỏ lưu', saved ? 'success' : '');
  });

  // Share
  const expShare = document.getElementById('btn-share');
  if (expShare) {
    expShare.addEventListener('click', () => {
      if (typeof API !== 'undefined') API.trackEvent('share', { context: { experience: expId } });
      if (window.hvShare) window.hvShare(exp.name || 'Trải nghiệm ở Huế', `${exp.name} — khám phá cùng HueViVu`);
    });
  }

  // Book CTA → đưa trải nghiệm vào lịch trình AI
  document.getElementById('btn-book').addEventListener('click', function() {
    if (typeof API !== 'undefined') API.trackEvent('add_trip', { context: { experience: expId } });
    this.innerHTML = '<span>✨</span> Đang mở trình lập lịch...';
    if (window.toast) toast('Thêm trải nghiệm này vào lịch trình AI nhé ✨', 'success');
    setTimeout(() => { window.location.href = 'flow.html'; }, 700);
  });

  console.log(`🎯 Experience detail loaded: ${exp.name}`);
});
