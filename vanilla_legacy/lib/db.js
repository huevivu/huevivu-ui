const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let _db = null;

function getDb() {
  if (_db) return _db;

  const dbPath = process.env.VERCEL
    ? '/tmp/huevivu.db'
    : path.join(__dirname, '../data/huevivu.db');

  if (!process.env.VERCEL) {
    const dir = path.join(__dirname, '../data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  _db = new Database(dbPath);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  createSchema(_db);
  seedData(_db);
  return _db;
}

function addColumnIfMissing(db, table, column, definition) {
  try { db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`); } catch {}
}

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      total_trips INTEGER DEFAULT 0,
      total_places INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      duration INTEGER NOT NULL,
      style TEXT NOT NULL,
      companion TEXT NOT NULL,
      budget INTEGER NOT NULL,
      food_prefs TEXT DEFAULT '[]',
      itinerary TEXT DEFAULT '{}',
      highlights TEXT DEFAULT '[]',
      ai_insight TEXT,
      total_cost_estimate TEXT,
      status TEXT DEFAULT 'active',
      is_shared INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      save_count INTEGER DEFAULT 0,
      clone_count INTEGER DEFAULT 0,
      ai_match_score INTEGER DEFAULT 85,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      address TEXT,
      rating REAL DEFAULT 4.5,
      rating_count INTEGER DEFAULT 100,
      price TEXT DEFAULT 'Miễn phí',
      duration TEXT DEFAULT '1-2 giờ',
      distance TEXT,
      lat REAL DEFAULT 16.4637,
      lng REAL DEFAULT 107.5909,
      img TEXT DEFAULT 'assets/citadel.png',
      ai_insight TEXT,
      hours TEXT,
      hours_time TEXT,
      hours_note TEXT,
      highlights TEXT DEFAULT '[]',
      tips TEXT DEFAULT '[]',
      -- ML feature columns
      indoor INTEGER DEFAULT 0,
      best_time TEXT DEFAULT 'all',
      crowd_level TEXT DEFAULT 'medium',
      physical_level TEXT DEFAULT 'easy',
      tags TEXT DEFAULT '[]',
      avg_visit_min INTEGER DEFAULT 90,
      popularity REAL DEFAULT 0.5
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      trip_id TEXT,
      user_id TEXT NOT NULL,
      time_str TEXT,
      place_name TEXT,
      content TEXT NOT NULL,
      mood TEXT DEFAULT 'happy',
      is_private INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS trip_likes (
      trip_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (trip_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS trip_saves (
      trip_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (trip_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      trip_id TEXT,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ── TRACKING & PERSONALIZATION ─────────────────────────────────────────
    -- Mọi tương tác của user với app
    CREATE TABLE IF NOT EXISTS user_events (
      id          TEXT PRIMARY KEY,
      user_id     TEXT,
      session_id  TEXT NOT NULL,
      event_type  TEXT NOT NULL,
      place_id    TEXT,
      trip_id     TEXT,
      value       REAL,
      context     TEXT DEFAULT '{}',
      created_at  TEXT DEFAULT (datetime('now'))
    );

    -- Đánh giá sau chuyến đi
    CREATE TABLE IF NOT EXISTS trip_feedback (
      id               TEXT PRIMARY KEY,
      trip_id          TEXT NOT NULL,
      user_id          TEXT,
      session_id       TEXT,
      overall_rating   REAL,
      ai_rating        REAL,
      places_visited   TEXT DEFAULT '[]',
      places_skipped   TEXT DEFAULT '[]',
      duration_actual  INTEGER,
      notes            TEXT,
      created_at       TEXT DEFAULT (datetime('now'))
    );

    -- Dữ liệu training đã xử lý (input → output pairs)
    CREATE TABLE IF NOT EXISTS training_examples (
      id            TEXT PRIMARY KEY,
      user_profile  TEXT NOT NULL,
      context       TEXT NOT NULL,
      output        TEXT NOT NULL,
      reward        REAL DEFAULT 0.0,
      source        TEXT DEFAULT 'generated',
      created_at    TEXT DEFAULT (datetime('now'))
    );

    -- Index để query nhanh
    CREATE INDEX IF NOT EXISTS idx_events_user ON user_events(user_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_events_place ON user_events(place_id, event_type);
    CREATE INDEX IF NOT EXISTS idx_feedback_trip ON trip_feedback(trip_id);
    CREATE INDEX IF NOT EXISTS idx_training_reward ON training_examples(reward DESC);
  `);

  // Migration: thêm cột mới vào bảng cũ nếu chưa có (safe, idempotent)
  addColumnIfMissing(db, 'places', 'indoor',         'INTEGER DEFAULT 0');
  addColumnIfMissing(db, 'places', 'best_time',      "TEXT DEFAULT 'all'");
  addColumnIfMissing(db, 'places', 'crowd_level',    "TEXT DEFAULT 'medium'");
  addColumnIfMissing(db, 'places', 'physical_level', "TEXT DEFAULT 'easy'");
  addColumnIfMissing(db, 'places', 'tags',           "TEXT DEFAULT '[]'");
  addColumnIfMissing(db, 'places', 'avg_visit_min',  'INTEGER DEFAULT 90');
  addColumnIfMissing(db, 'places', 'popularity',     'REAL DEFAULT 0.5');
}

function seedData(db) {
  const existing = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (existing.c > 0) return;

  const passwordHash = bcrypt.hashSync('demo123', 10);

  // Users
  db.prepare(`INSERT INTO users (id, name, email, password_hash, level, total_trips, total_places)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run('user_demo', 'Hue Traveler', 'demo@huevivu.app', passwordHash, 3, 3, 24);
  db.prepare(`INSERT INTO users (id, name, email, password_hash, level)
    VALUES (?, ?, ?, ?, ?)`).run('user_minh_anh', 'Minh Anh 🌸', 'minhanh@example.com', passwordHash, 4);
  db.prepare(`INSERT INTO users (id, name, email, password_hash, level)
    VALUES (?, ?, ?, ?, ?)`).run('user_thu_huong', 'Thu Hương ☕', 'thuhuong@example.com', passwordHash, 2);
  db.prepare(`INSERT INTO users (id, name, email, password_hash, level)
    VALUES (?, ?, ?, ?, ?)`).run('user_nam_khanh', 'Nam Khánh 🎒', 'namkhanh@example.com', passwordHash, 5);

  // Places
  const insertPlace = db.prepare(`INSERT INTO places
    (id, name, category, description, address, rating, rating_count, price, duration,
     distance, lat, lng, img, ai_insight, hours, hours_time, hours_note, highlights, tips,
     indoor, best_time, crowd_level, physical_level, tags, avg_visit_min, popularity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  // Format: [...base fields..., indoor, best_time, crowd_level, physical_level, tags, avg_visit_min, popularity]
  const places = [
    ['citadel', 'Hoàng Thành Huế', 'heritage',
      'Quần thể di tích cung đình triều Nguyễn — UNESCO World Heritage. Một trong những kiến trúc phong kiến vĩ đại nhất Đông Nam Á còn tồn tại.',
      '23 Tháng 8, Phú Hậu, TP. Huế', 4.8, 12847,
      '200,000 VNĐ', '2-3 giờ', '0.8km từ trung tâm', 16.4698, 107.5777, 'assets/citadel.png',
      'Đến trước 8h để có ánh sáng đẹp và tránh đông. Thuê thuyết minh viên địa phương sẽ giúp bạn hiểu chiều sâu từng công trình.',
      'Hàng ngày', '08:00 – 17:30', 'Mua vé online tiết kiệm hơn',
      JSON.stringify(['Ngọ Môn — cửa chính hoành tráng', 'Điện Thái Hòa — trung tâm triều đình', 'Hiển Lâm Các — tháp 9 tầng', 'Thế Miếu — thờ các vị vua']),
      JSON.stringify(['Mặc trang phục lịch sự, che vai và đầu gối', 'Mang theo nước uống', 'Thuê xe điện nội khu tiết kiệm sức', 'Buổi tối có show ánh sáng vào cuối tuần']),
      0, 'morning', 'high', 'moderate', JSON.stringify(['heritage','history','photo','romantic','family','solo']), 150, 0.95],

    ['pagoda', 'Chùa Thiên Mụ', 'temple',
      'Ngôi chùa cổ nhất và thiêng liêng nhất Huế, nằm bên bờ sông Hương. Tháp Phước Duyên 7 tầng là biểu tượng của thành phố.',
      'Kim Long, TP. Huế', 4.7, 8234,
      'Miễn phí', '1-2 giờ', '4km từ trung tâm', 16.4539, 107.5479, 'assets/citadel.png',
      'Kết hợp tham quan chùa với đi thuyền sông Hương để có trải nghiệm hoàn hảo. Buổi chiều muộn có tiếng chuông chùa rất linh thiêng.',
      'Hàng ngày', '07:00 – 17:00', 'Không thu phí vào cửa',
      JSON.stringify(['Tháp Phước Duyên 7 tầng', 'Xe ô tô lịch sử của TT Thích Quảng Đức', 'Vườn bonsai cổ thụ', 'View sông Hương từ chùa']),
      JSON.stringify(['Ăn mặc kín đáo khi vào chùa', 'Tốt nhất đến bằng thuyền từ bến Thừa Phủ', 'Mang hoa quả để cúng dường']),
      0, 'all', 'medium', 'easy', JSON.stringify(['spiritual','photo','peaceful','solo','couple']), 75, 0.88],

    ['tomb-khai-dinh', 'Lăng Khải Định', 'heritage',
      'Lăng tẩm vua Khải Định — sự pha trộn độc đáo giữa kiến trúc Gothic châu Âu và nghệ thuật Á Đông. Trang trí bằng hàng triệu mảnh sứ và thủy tinh.',
      'Thủy Bằng, Hương Thủy, Huế', 4.6, 6120,
      '150,000 VNĐ', '1.5-2 giờ', '8km từ trung tâm', 16.3929, 107.6072, 'assets/citadel.png',
      'Ghép lịch trình với Lăng Tự Đức (chỉ 3km) để tiết kiệm di chuyển. Khải Định nhỏ nhưng tinh xảo hơn — cần 2 giờ để ngắm đủ chi tiết.',
      'Hàng ngày', '07:00 – 17:30', 'Combo 3 lăng tiết kiệm hơn',
      JSON.stringify(['Bích họa trần Cung Thiên Định', 'Đồ sứ Pháp khảm toàn bộ tường', 'Tượng đồng vua Khải Định', 'Kiến trúc Đông-Tây giao thoa']),
      JSON.stringify(['Đi bộ 127 bậc thang lên đỉnh rất đáng', 'Ảnh đẹp nhất trước 9h sáng', 'Có hướng dẫn viên tại chỗ']),
      0, 'morning', 'medium', 'moderate', JSON.stringify(['heritage','history','photo','architecture','couple','solo']), 100, 0.80],

    ['tomb-tu-duc', 'Lăng Tự Đức', 'heritage',
      'Lăng tẩm thơ mộng nhất của triều Nguyễn, được bao quanh bởi hồ sen và rừng thông. Vua Tự Đức cũng dùng nơi này như cung điện nghỉ dưỡng.',
      'Thủy Xuân, TP. Huế', 4.5, 5432,
      '150,000 VNĐ', '1.5-2 giờ', '7km từ trung tâm', 16.4579, 107.5779, 'assets/citadel.png',
      'Lăng đẹp nhất vào sáng sớm khi sương mù còn trên hồ sen. Đường đi bộ qua rừng thông rất dễ chịu, không nên vội vàng.',
      'Hàng ngày', '07:00 – 17:30', 'Combo vé tiết kiệm tại cổng',
      JSON.stringify(['Hồ Lưu Khiêm xanh biếc', 'Điện Hòa Khiêm — nơi vua làm việc', 'Rừng thông trăm tuổi', 'Khiêm Lăng — nơi an táng vua']),
      JSON.stringify(['Thuê xe máy từ trung tâm (~100k/ngày)', 'Kết hợp với Lăng Khải Định cùng ngày', 'Mang theo nước và kem chống nắng']),
      0, 'morning', 'low', 'easy', JSON.stringify(['heritage','peaceful','romantic','photo','solo','nature']), 105, 0.75],

    ['bunbo', 'Bún Bò Bà Tuyết', 'food',
      'Quán bún bò gia truyền 3 đời, nổi tiếng nhất Huế với người địa phương. Nước dùng ninh 12 tiếng, chả cua gia truyền.',
      '47 Ngô Quyền, Phú Nhuận, Huế', 4.9, 4231,
      '35,000-55,000 VNĐ', '30-45 phút', '1.2km từ trung tâm', 16.4637, 107.6009, 'assets/food.png',
      'Quán bún bò "bản địa nhất" Huế — không có biển hiệu du lịch. Đến trước 8h để không hết hàng. Gọi tô đặc biệt có đủ chả, bắp bò, gân.',
      'Thứ 2 - Chủ Nhật', '06:00 – 11:00', 'Thường hết hàng trước 10h',
      JSON.stringify(['Nước dùng ninh 12 tiếng', 'Chả cua gia truyền', 'Bắp bò mềm tan', 'Ớt sa tế đặc biệt']),
      JSON.stringify(['Gọi "đặc biệt" để có đủ topping', 'Không điều hòa — nên đi sáng sớm', 'Trả tiền mặt', 'Đậu phộng rang thêm miễn phí']),
      0, 'morning', 'high', 'easy', JSON.stringify(['food','local','authentic','budget','streetfood','solo','couple','family']), 40, 0.92],

    ['com-hen', 'Cơm Hến Bà Cẩm', 'food',
      'Đặc sản cơm hến chính hiệu Huế — hến tươi từ sông Hương, rau thơm bản địa, ăn kèm tôm chấy và bánh tráng nướng.',
      'Cồn Hến, Vĩ Dạ, Huế', 4.8, 2890,
      '20,000-35,000 VNĐ', '20-30 phút', '2km từ trung tâm', 16.4559, 107.6049, 'assets/food.png',
      'Đây là món ăn dân dã nhất Huế, không thể tìm ở nơi khác. Ăn ngay tại Cồn Hến — nơi người dân tự bắt hến từ sông Hương.',
      'Hàng ngày', '06:30 – 10:30', 'Chỉ có buổi sáng',
      JSON.stringify(['Hến tươi từ sông Hương', 'Rau thơm bản địa 10+ loại', 'Tôm chấy giòn', 'Bánh tráng nướng']),
      JSON.stringify(['Nếu lần đầu ăn hãy thử tô nhỏ trước', 'Ớt rất cay — hỏi trước khi thêm', 'Ngồi bàn thấp theo kiểu Huế']),
      0, 'morning', 'low', 'easy', JSON.stringify(['food','local','authentic','budget','hidden','solo']), 30, 0.70],

    ['river', 'Sông Hương — Hoàng Hôn', 'nature',
      'Điểm ngắm hoàng hôn đẹp nhất Huế, tại góc cầu Trường Tiền. Ánh nắng vàng chiều tà phản chiếu trên mặt sông tạo khung cảnh huyền ảo.',
      'Bờ sông Hương, gần Cầu Trường Tiền, Huế', 4.9, 15234,
      'Miễn phí', '1-2 giờ', '0.5km từ trung tâm', 16.4659, 107.5948, 'assets/river.png',
      'Giờ vàng 17:30-18:10 là thời điểm ánh sáng đẹp nhất. Thuê xe đạp dọc bờ sông và dừng tại đây lúc chiều tà cho trải nghiệm không thể quên.',
      'Cả ngày', '24/7', 'Đẹp nhất 17:30-18:10',
      JSON.stringify(['Hoàng hôn sông Hương', 'Cầu Trường Tiền 6 nhịp', 'Du thuyền trên sông', 'Phong cảnh thơ mộng']),
      JSON.stringify(['Đến trước 17h để chọn chỗ đẹp', 'Đặt du thuyền trước 1 ngày', 'Tránh ngày mưa lớn']),
      0, 'evening', 'medium', 'easy', JSON.stringify(['nature','photo','romantic','sunset','peaceful','couple','solo','family']), 75, 0.97],

    ['market', 'Chợ Đông Ba', 'market',
      'Khu chợ lớn nhất Huế từ thế kỷ 19 — trung tâm mua sắm đặc sản và ẩm thực đường phố của người địa phương.',
      'Trần Hưng Đạo, Phú Hòa, TP. Huế', 4.4, 7823,
      'Miễn phí vào cửa', '1-2 giờ', '0.3km từ trung tâm', 16.4686, 107.5982, 'assets/food.png',
      'Tầng 2 là nơi ẩm thực đường phố ngon và rẻ nhất. Mua mứt me, bánh đậu xanh, và nón lá làm quà. Trả giá tự nhiên — đây là văn hóa chợ Huế.',
      'Hàng ngày', '06:00 – 18:00', 'Đông nhất buổi sáng',
      JSON.stringify(['Ẩm thực đường phố tầng 2', 'Mứt me, mứt gừng đặc sản', 'Nón lá truyền thống', 'Đặc sản Huế giá tốt']),
      JSON.stringify(['Trả giá 20-30% là bình thường', 'Thử bánh bèo, bánh nậm tầng 2', 'Đi buổi sáng hàng tươi hơn']),
      1, 'morning', 'high', 'easy', JSON.stringify(['food','shopping','local','budget','family','streetfood']), 90, 0.72],

    ['the-time-coffee', 'The Time Coffee', 'cafe',
      'Quán cà phê vintage nổi tiếng nhất Huế, thiết kế hoài cổ trên phố Nguyễn Công Trứ. Rang xay tại chỗ, không gian yên tĩnh.',
      '3 Nguyễn Công Trứ, Phú Hội, Huế', 4.7, 3241,
      '40,000-65,000 VNĐ', '1-2 giờ', '0.7km từ trung tâm', 16.4612, 107.5943, 'assets/hero.png',
      'Nơi trú mưa hoàn hảo trong chuyến đi. Đặt bàn tầng 2 nhìn ra đường phố cổ. Cà phê sữa đá đặc biệt là must-try.',
      'Hàng ngày', '07:00 – 22:00', 'Đông nhất 15h-17h',
      JSON.stringify(['Thiết kế vintage hoài cổ', 'Cà phê rang xay tại chỗ', 'Tầng 2 view phố cổ', 'Không gian yên tĩnh']),
      JSON.stringify(['Gọi "cà phê sữa đá đặc biệt"', 'Tầng 2 cần đặt trước cuối tuần']),
      1, 'afternoon', 'medium', 'easy', JSON.stringify(['cafe','relax','romantic','photo','work','couple','solo','rainy']), 90, 0.82],

    ['sunset-spot', 'Đồi Vọng Cảnh', 'nature',
      'Tọa độ bí mật nhìn xuống khúc uốn sông Hương đẹp nhất. Chỉ người địa phương và dân nhiếp ảnh mới biết điểm này.',
      'Đồi Vọng Cảnh, Thủy Biều, Huế', 4.9, 892,
      'Miễn phí', '1-2 giờ', '5km từ trung tâm', 16.4482, 107.5721, 'assets/river.png',
      'Điểm ẩn số 1 của Huế. Đặt chuông báo thức 17:15 để kịp lên đồi trước giờ vàng. Mang theo chăn nếu trời se lạnh vì đón gió trên đồi.',
      'Tự do', '05:00 – 19:00', 'Đẹp nhất 17:30-18:10',
      JSON.stringify(['Khúc uốn sông Hương từ trên cao', 'Điểm chụp ảnh bí mật', 'Bình minh và hoàng hôn', 'Thoáng mát, ít người']),
      JSON.stringify(['Đến bằng xe máy thuê (30k/h)', 'Mang theo đèn pin', 'Giờ vàng 17:30-18:10', 'Kết hợp Lăng Tự Đức gần đó']),
      0, 'evening', 'low', 'moderate', JSON.stringify(['nature','hidden','photo','sunset','romantic','solo','couple','adventure']), 80, 0.78],
  ];

  for (const p of places) insertPlace.run(...p);

  // Demo trips (shared to community)
  const insertTrip = db.prepare(`INSERT INTO trips
    (id, user_id, title, summary, duration, style, companion, budget, food_prefs,
     itinerary, highlights, ai_insight, total_cost_estimate, is_shared,
     like_count, save_count, clone_count, ai_match_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const trip1Itinerary = JSON.stringify({ days: [
    { day: 1, theme: 'Ẩm Thực Bản Địa', day_tip: 'Bắt đầu sớm để bắt kịp quán ngon trước 8h', activities: [
      { time: '07:00', name: 'Bún Bò Bà Tuyết', type: 'food', duration: '45 phút', cost: '55,000 VNĐ', description: 'Bắt đầu ngày với bún bò gia truyền nức tiếng nhất Huế', ai_tip: 'Gọi tô đặc biệt thêm chả cua', location: '47 Ngô Quyền, Phú Nhuận' },
      { time: '09:00', name: 'Hoàng Thành Huế', type: 'heritage', duration: '3 giờ', cost: '200,000 VNĐ', description: 'Khám phá trung tâm triều đình Nguyễn UNESCO', ai_tip: 'Thuê xe điện nội khu để đỡ mệt', location: '23 Tháng 8, Phú Hậu' },
      { time: '12:30', name: 'Cơm Hến Bà Cẩm', type: 'food', duration: '30 phút', cost: '30,000 VNĐ', description: 'Đặc sản cơm hến chính hiệu ngay tại Cồn Hến', ai_tip: 'Ăn với bánh tráng nướng mới đúng vị', location: 'Cồn Hến, Vĩ Dạ' },
      { time: '15:00', name: 'Chợ Đông Ba', type: 'market', duration: '1.5 giờ', cost: 'Miễn phí', description: 'Mua đặc sản Huế và ăn bánh bèo tầng 2', ai_tip: 'Thử mứt me ở gian hàng góc phải', location: 'Trần Hưng Đạo, Phú Hòa' },
      { time: '17:30', name: 'Hoàng Hôn Sông Hương', type: 'nature', duration: '1 giờ', cost: 'Miễn phí', description: 'Ngắm hoàng hôn thơ mộng cạnh cầu Trường Tiền', ai_tip: 'Đứng góc phải cầu để ảnh đẹp nhất', location: 'Bờ sông Hương, cầu Trường Tiền' },
    ]},
    { day: 2, theme: 'Di Sản & Đêm Huế', day_tip: 'Đặt thuyền trước 1 ngày để du thuyền tối', activities: [
      { time: '08:00', name: 'Chùa Thiên Mụ', type: 'temple', duration: '1.5 giờ', cost: 'Miễn phí', description: 'Ngôi chùa cổ nhất Huế bên bờ sông Hương', ai_tip: 'Đi bằng xe đạp dọc bờ sông rất thú vị', location: 'Kim Long, TP. Huế' },
      { time: '10:30', name: 'The Time Coffee', type: 'cafe', duration: '1.5 giờ', cost: '60,000 VNĐ', description: 'Thư giãn tại quán cà phê vintage nổi tiếng', ai_tip: 'Gọi bạc xỉu đá đặc biệt', location: '3 Nguyễn Công Trứ' },
      { time: '14:00', name: 'Lăng Khải Định', type: 'heritage', duration: '2 giờ', cost: '150,000 VNĐ', description: 'Kiến trúc Đông-Tây giao thoa độc đáo nhất Huế', ai_tip: '127 bậc thang nhưng rất đáng leo', location: 'Thủy Bằng, Hương Thủy' },
    ]},
    { day: 3, theme: 'Tạm Biệt Huế', day_tip: 'Ngày cuối nên đi chậm và thưởng thức', activities: [
      { time: '08:00', name: 'Đồi Vọng Cảnh (Bình Minh)', type: 'nature', duration: '1.5 giờ', cost: 'Miễn phí', description: 'Ngắm bình minh trên đồi nhìn xuống sông Hương', ai_tip: 'Đặt chuông 5:45 để kịp bình minh', location: 'Đồi Vọng Cảnh, Thủy Biều' },
      { time: '10:00', name: 'Bún Bò & Bánh Khoái Cuối Chuyến', type: 'food', duration: '1 giờ', cost: '80,000 VNĐ', description: 'Bữa ăn cuối cùng với các đặc sản Huế', ai_tip: 'Hỏi chủ quán về món bánh khoái', location: 'Phố ẩm thực Chi Lăng' },
    ]},
  ]});

  insertTrip.run(
    'trip_minh_anh', 'user_minh_anh',
    '3 Ngày Ẩm Thực & Di Sản',
    'Khám phá Huế qua lăng kính ẩm thực và di sản cổ. Từ bún bò sáng sớm đến du thuyền hoàng hôn.',
    3, 'cultural,foodie', 'couple', 2500000,
    JSON.stringify(['bun-bo', 'street-food', 'traditional']),
    trip1Itinerary,
    JSON.stringify(['Bún bò gia truyền sáng sớm', 'Tham quan Hoàng Thành', 'Hoàng hôn sông Hương', 'Lăng Khải Định kiến trúc độc đáo']),
    'Lịch trình cân bằng hoàn hảo giữa ẩm thực và di sản, rất phù hợp cho cặp đôi muốn khám phá Huế sâu.',
    '2,200,000 VNĐ', 1, 47, 23, 12, 92, 'past'
  );

  const trip2Itinerary = JSON.stringify({ days: [
    { day: 1, theme: 'Lăng Tẩm Cổ Kính', day_tip: 'Thuê xe máy 1 ngày để ghé 2 lăng cho tiện', activities: [
      { time: '08:00', name: 'Lăng Khải Định', type: 'heritage', duration: '2 giờ', cost: '150,000 VNĐ', description: 'Kiến trúc Đông-Tây pha trộn độc nhất vô nhị', ai_tip: 'Ngắm kỹ từng mảnh ghép trên tường', location: 'Thủy Bằng, Hương Thủy' },
      { time: '11:00', name: 'Lăng Tự Đức', type: 'heritage', duration: '2 giờ', cost: '150,000 VNĐ', description: 'Lăng thơ mộng nhất triều Nguyễn bên hồ sen', ai_tip: 'Đi bộ vòng quanh hồ Lưu Khiêm thật chậm', location: 'Thủy Xuân, TP. Huế' },
      { time: '15:00', name: 'The Time Coffee', type: 'cafe', duration: '2 giờ', cost: '50,000 VNĐ', description: 'Thư giãn tại quán cà phê vintage sau ngày dài', ai_tip: 'Tầng 2 view phố cổ cực đẹp', location: '3 Nguyễn Công Trứ' },
    ]},
    { day: 2, theme: 'Huế Chậm & Yên', day_tip: 'Ngày thứ 2 đi chậm, ngắm nhìn nhiều hơn chụp ảnh', activities: [
      { time: '07:00', name: 'Cơm Hến Cồn Hến', type: 'food', duration: '30 phút', cost: '25,000 VNĐ', description: 'Bữa sáng đặc sản Huế ngay tại làng hến', ai_tip: 'Điểm hiếm người biết — yên tĩnh hơn chợ', location: 'Cồn Hến, Vĩ Dạ' },
      { time: '09:00', name: 'Chùa Thiên Mụ', type: 'temple', duration: '1.5 giờ', cost: 'Miễn phí', description: 'Ngôi chùa linh thiêng nhất Huế bên sông Hương', ai_tip: 'Ngồi thiền trong vườn bonsai 30 phút', location: 'Kim Long, TP. Huế' },
      { time: '17:00', name: 'Đồi Vọng Cảnh — Hoàng Hôn', type: 'nature', duration: '1.5 giờ', cost: 'Miễn phí', description: 'Tọa độ bí mật ngắm hoàng hôn sông Hương từ trên cao', ai_tip: 'Điểm ẩn số 1 Huế, ít người biết', location: 'Đồi Vọng Cảnh, Thủy Biều' },
    ]},
  ]});

  insertTrip.run(
    'trip_thu_huong', 'user_thu_huong',
    '2 Ngày Lăng Tẩm & Cà Phê',
    'Hành trình khám phá lăng tẩm triều Nguyễn kết hợp những quán cà phê ẩn nhất Huế, nhịp sống chậm.',
    2, 'relaxed,cultural', 'solo', 1200000,
    JSON.stringify(['ca-phe', 'vegetarian', 'local']),
    trip2Itinerary,
    JSON.stringify(['Lăng Khải Định kiến trúc độc đáo', 'Cà phê vintage The Time', 'Nhịp sống chậm của Huế', 'Hoàng hôn Đồi Vọng Cảnh']),
    'Hoàn hảo cho người muốn trải nghiệm Huế theo nhịp thong thả — không vội vàng, chú tâm vào từng khoảnh khắc.',
    '1,100,000 VNĐ', 1, 31, 15, 8, 87, 'past'
  );

  // Demo user's own trip (not shared)
  const trip3Itinerary = JSON.stringify({ days: [
    { day: 1, theme: 'Khám Phá Hoàng Thành', day_tip: 'Khởi động chuyến đi với di sản lớn nhất Huế', activities: [
      { time: '07:30', name: 'Bún Bò Bà Tuyết', type: 'food', duration: '45 phút', cost: '55,000 VNĐ', description: 'Khởi đầu với bún bò gia truyền', ai_tip: 'Tô đặc biệt = trải nghiệm đầy đủ nhất', location: '47 Ngô Quyền' },
      { time: '09:00', name: 'Hoàng Thành Huế', type: 'heritage', duration: '3 giờ', cost: '200,000 VNĐ', description: 'UNESCO di sản thế giới', ai_tip: 'Điện Thái Hòa đẹp nhất lúc sáng sớm', location: '23 Tháng 8' },
      { time: '17:30', name: 'Hoàng Hôn Sông Hương', type: 'nature', duration: '1 giờ', cost: 'Miễn phí', description: 'Khoảnh khắc đẹp nhất Huế', ai_tip: 'Ngồi xuống và nhìn — đừng vội chụp ảnh', location: 'Bờ sông Hương' },
    ]},
  ]});

  insertTrip.run(
    'trip_demo_user', 'user_demo',
    '1 Ngày Di Sản Huế',
    'Trải nghiệm tinh hoa Huế trong 1 ngày — từ bún bò sáng sớm đến hoàng hôn sông Hương.',
    1, 'cultural', 'solo', 800000,
    JSON.stringify(['bun-bo', 'traditional']),
    trip3Itinerary,
    JSON.stringify(['Hoàng Thành UNESCO', 'Bún bò gia truyền', 'Hoàng hôn sông Hương']),
    'Lịch trình cô đọng nhất để cảm nhận Huế trong 1 ngày.',
    '700,000 VNĐ', 0, 0, 0, 0, 95, 'past'
  );

  // Demo journal entries
  const insertEntry = db.prepare(`INSERT INTO journal_entries
    (id, user_id, trip_id, time_str, place_name, content, mood)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);

  insertEntry.run('je1', 'user_demo', 'trip_demo_user', '07:30', 'Quán Bà Tuyết',
    'Tô bún bò sáng nay hoàn hảo — nước dùng sánh đặc, chả cua tươi ngọt. Hàng dài nhưng đáng chờ! Sẽ quay lại ngày mai.', 'happy');
  insertEntry.run('je2', 'user_demo', 'trip_demo_user', '10:00', 'Hoàng Thành Huế',
    'Điện Thái Hòa đứng đây mà cảm nhận được bao nhiêu lịch sử... Ánh nắng sáng sớm qua mái ngói vàng thật sự ấn tượng. Thuê thuyết minh viên 100k rất đáng.', 'wonder');
  insertEntry.run('je3', 'user_demo', 'trip_demo_user', '17:45', 'Sông Hương',
    'Hoàng hôn sông Hương hôm nay đỏ rực. Gió thổi nhẹ, mùi hoa dại từ bờ sông. Ngồi xuống đất, nhắm mắt lại... Huế ơi, sao mà đẹp và yên vậy.', 'love');
}

module.exports = { getDb };
