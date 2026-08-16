require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../lib/db');
const { generateTrip, customizeTrip, chat } = require('../lib/ai');
const { generateToken, authMiddleware, optionalAuth } = require('../lib/auth');

const app = express();

app.use(cors({ origin: true, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: '2mb' }));

// Serve frontend files in local dev mode
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '..')));
}

// ── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, version: '1.0.0', service: 'HueViVu API' });
});

// ── SYSTEM STATS & OVERVIEW ──────────────────────────────────────────────────
app.get('/api/stats/overview', (req, res) => {
  const db = getDb();
  const placesCount = db.prepare('SELECT COUNT(*) as cnt FROM places').get().cnt;
  const tripsCount = db.prepare('SELECT COUNT(*) as cnt FROM trips').get().cnt;
  const reviewsCount = db.prepare('SELECT COUNT(*) as cnt FROM trip_feedback').get().cnt;
  const usersCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt;

  res.json({
    total_places: placesCount,
    total_trips_generated: tripsCount,
    total_reviews: reviewsCount,
    total_users: usersCount,
    service_status: 'operational',
    ai_mode: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'Gemini AI Native' : 'MVP Local Engine (Offline-Ready)'
  });
});

// ── CULTURAL & SEASONAL TRAVEL GUIDE ─────────────────────────────────────────
app.get('/api/hue/travel-guide', (req, res) => {
  const month = new Date().getMonth() + 1;
  const isRainySeason = month >= 9 && month <= 12;

  res.json({
    current_month: month,
    season_name: isRainySeason ? 'Mùa mưa xứ Huế (Tháng 9 - Tháng 12)' : 'Mùa nắng đẹp (Tháng 1 - Tháng 8)',
    weather_advice: isRainySeason
      ? 'Huế đang vào mùa mưa lãng mạn. Nên chuẩn bị ô/áo mưa nhẹ, ưu tiên tham quan bảo tàng, lăng tẩm và thưởng thức trà cung đình ấm cúng.'
      : 'Thời tiết nắng ráo lý tưởng để dạo quanh Đại Nội, đạp xe ven sông Hương và ghé đồi Vọng Cảnh ngắm hoàng hôn.',
    top_seasonal_foods: isRainySeason
      ? ['Bún bò Huế nóng hổi', 'Bánh canh cá lóc', 'Chè khoai tía ấm', 'Cơm hến cay nồng']
      : ['Chè hẻm mát lạnh', 'Bánh bèo nậm lọc chay', 'Bún thịt nướng', 'Vả trộn bò kho'],
    cultural_etiquette: [
      { title: 'Trang phục lăng tẩm', tip: 'Mặc trang phục lịch sự, qua đầu gối và có tay áo khi tham quan Đại Nội, đền chùa.' },
      { title: 'Giao tiếp nhẹ nhàng', tip: 'Người Huế ưa sự từ tốn, giọng nói nhẹ nhàng và trân trọng sự kính nhường.' },
      { title: 'Ẩm thực cay', tip: 'Món Huế gốc thường có vị cay đậm đà, nên dặn trước quán nếu bạn không ăn được cay.' }
    ],
    transport_tips: [
      { mode: 'Xe đạp ven sông', desc: 'Phương tiện lãng mạn nhất để ngắm cầu Trường Tiền và đường Lê Lợi.' },
      { mode: 'Xích lô du lịch', desc: 'Phù hợp đi dạo phố cổ xung quanh Đại Nội, nhớ trao đổi giá và lộ trình trước.' },
      { mode: 'Taxi / Xe công nghệ', desc: 'Phổ biến, nhanh chóng để đi các lăng tẩm cách xa trung tâm.' }
    ]
  });
});

// ── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Thiếu thông tin đăng ký' });

    const db = getDb();
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
      return res.status(409).json({ error: 'Email đã được sử dụng' });
    }

    const id = 'user_' + uuidv4().replace(/-/g, '').slice(0, 12);
    const hash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(id, name, email, hash);

    const user = db.prepare('SELECT id, name, email, level, total_trips FROM users WHERE id = ?').get(id);
    res.json({ token: generateToken(id), user });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ error: 'Lỗi đăng ký' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu' });

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Email không tồn tại' });

    if (!await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    const { password_hash, ...safeUser } = user;
    res.json({ token: generateToken(user.id), user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi đăng nhập' });
  }
});

// Auto-login as demo user — dùng cho showcase và dev
app.post('/api/auth/demo', (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, level, total_trips, total_places FROM users WHERE email = ?')
      .get('demo@huevivu.app');
    if (!user) return res.status(404).json({ error: 'Demo user not found' });
    res.json({ token: generateToken(user.id), user });
  } catch (err) {
    res.status(500).json({ error: 'Demo login error' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, level, total_trips, total_places, created_at FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ── TRIPS ─────────────────────────────────────────────────────────────────────
app.post('/api/trips/generate', optionalAuth, async (req, res) => {
  try {
    const { duration, styles, companion, budget, food, sessionId } = req.body;
    if (!duration || !styles || !companion || !budget) {
      return res.status(400).json({ error: 'Thiếu thông tin để tạo lịch trình' });
    }

    // Build user context for personalization
    let userContext = null;
    const db = getDb();
    const ctxUserId = req.userId;
    const ctxSessionId = sessionId;
    if (ctxUserId || ctxSessionId) {
      const clause = ctxUserId ? 'user_id = ?' : 'session_id = ?';
      const param  = ctxUserId || ctxSessionId;

      const visitedRows = db.prepare(
        `SELECT DISTINCT place_id FROM user_events WHERE ${clause} AND place_id IS NOT NULL AND event_type IN ('view','add_trip') LIMIT 30`
      ).all(param);
      const skippedRows = db.prepare(
        `SELECT DISTINCT place_id FROM user_events WHERE ${clause} AND place_id IS NOT NULL AND event_type = 'skip' LIMIT 20`
      ).all(param);
      const topViewed = db.prepare(
        `SELECT place_id, COUNT(*) as cnt FROM user_events WHERE ${clause} AND place_id IS NOT NULL AND event_type = 'view' GROUP BY place_id ORDER BY cnt DESC LIMIT 5`
      ).all(param);
      const ratings = db.prepare(
        `SELECT overall_rating FROM trip_feedback WHERE ${ctxUserId ? 'user_id' : 'session_id'} = ?`
      ).all(param);
      const avgSat = ratings.length
        ? (ratings.reduce((s, r) => s + r.overall_rating, 0) / ratings.length).toFixed(1)
        : null;

      userContext = {
        personalized: visitedRows.length > 0 || ratings.length > 0,
        visited_place_ids: visitedRows.map(r => r.place_id),
        skipped_place_ids: skippedRows.map(r => r.place_id),
        top_viewed_places: topViewed.map(r => r.place_id),
        avg_satisfaction: avgSat ? Number(avgSat) : null,
      };
    }

    const itinerary = await generateTrip({ duration, styles, companion, budget, food: food || [], userContext });

    const tripId = 'trip_' + uuidv4().replace(/-/g, '').slice(0, 12);
    const userId = req.userId || 'user_demo';

    db.prepare(`INSERT INTO trips
      (id, user_id, title, summary, duration, style, companion, budget, food_prefs,
       itinerary, highlights, ai_insight, total_cost_estimate, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      tripId, userId,
      itinerary.title, itinerary.summary,
      Number(duration),
      Array.isArray(styles) ? styles.join(',') : styles,
      companion, Number(budget),
      JSON.stringify(Array.isArray(food) ? food : []),
      JSON.stringify(itinerary),
      JSON.stringify(itinerary.highlights || []),
      itinerary.ai_insight,
      itinerary.total_cost_estimate,
      'active'
    );

    db.prepare('UPDATE users SET total_trips = total_trips + 1 WHERE id = ?').run(userId);

    res.json({ tripId, trip: { id: tripId, ...itinerary } });
  } catch (err) {
    console.error('[generate-trip]', err);
    res.status(500).json({ error: 'Lỗi tạo lịch trình: ' + err.message });
  }
});

app.get('/api/trips', authMiddleware, (req, res) => {
  const db = getDb();
  const trips = db.prepare(`
    SELECT id, title, summary, duration, style, companion, total_cost_estimate,
           status, created_at, is_shared, like_count, ai_match_score
    FROM trips WHERE user_id = ? ORDER BY created_at DESC
  `).all(req.userId);
  res.json(trips);
});

app.get('/api/trips/:id', optionalAuth, (req, res) => {
  const db = getDb();
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  // Bảo mật: chỉ chủ sở hữu hoặc trip đã chia sẻ mới xem được (tránh lộ trip riêng tư)
  if (!trip.is_shared && trip.user_id !== req.userId) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  trip.itinerary = JSON.parse(trip.itinerary || '{}');
  trip.highlights = JSON.parse(trip.highlights || '[]');
  trip.food_prefs = JSON.parse(trip.food_prefs || '[]');

  const owner = db.prepare('SELECT name FROM users WHERE id = ?').get(trip.user_id);
  trip.owner_name = owner?.name;

  if (req.userId) {
    trip.liked = !!db.prepare('SELECT 1 FROM trip_likes WHERE trip_id = ? AND user_id = ?').get(trip.id, req.userId);
    trip.saved = !!db.prepare('SELECT 1 FROM trip_saves WHERE trip_id = ? AND user_id = ?').get(trip.id, req.userId);
  }

  res.json(trip);
});

app.put('/api/trips/:id/share', authMiddleware, (req, res) => {
  const db = getDb();
  const trip = db.prepare('SELECT id FROM trips WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  db.prepare('UPDATE trips SET is_shared = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.put('/api/trips/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  if (!['active', 'upcoming', 'past'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const db = getDb();
  db.prepare('UPDATE trips SET status = ? WHERE id = ? AND user_id = ?').run(status, req.params.id, req.userId);
  res.json({ success: true });
});

// Điều chỉnh lịch trình bằng AI theo chỉ dẫn tự nhiên ("ít đi bộ", "thêm ăn"...)
app.post('/api/trips/:id/customize', optionalAuth, async (req, res) => {
  try {
    const { instruction } = req.body;
    if (!instruction) return res.status(400).json({ error: 'Thiếu chỉ dẫn điều chỉnh' });

    const db = getDb();
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Chỉ chủ trip mới được sửa (tránh người khác chỉnh lịch trình không phải của mình)
    if (req.userId && trip.user_id !== req.userId) {
      return res.status(403).json({ error: 'Không có quyền chỉnh sửa lịch trình này' });
    }

    const newItinerary = await customizeTrip(trip, instruction);

    db.prepare(`UPDATE trips SET title = ?, summary = ?, itinerary = ?, highlights = ?, ai_insight = ?, total_cost_estimate = ? WHERE id = ?`).run(
      newItinerary.title || trip.title,
      newItinerary.summary || trip.summary,
      JSON.stringify(newItinerary),
      JSON.stringify(newItinerary.highlights || []),
      newItinerary.ai_insight || trip.ai_insight,
      newItinerary.total_cost_estimate || trip.total_cost_estimate,
      req.params.id
    );

    res.json({ tripId: req.params.id, trip: { id: req.params.id, ...newItinerary } });
  } catch (err) {
    console.error('[customize-trip]', err);
    res.status(500).json({ error: 'Lỗi điều chỉnh lịch trình: ' + err.message });
  }
});

// ── CHAT ─────────────────────────────────────────────────────────────────────
app.post('/api/chat', optionalAuth, async (req, res) => {
  try {
    const { message, tripId, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Tin nhắn không được để trống' });

    const db = getDb();
    let tripContext = null;

    if (tripId) {
      const trip = db.prepare('SELECT title, summary, duration, style, companion, total_cost_estimate, itinerary FROM trips WHERE id = ?').get(tripId);
      if (trip) {
        try { trip.itinerary = JSON.parse(trip.itinerary || '{}'); } catch { trip.itinerary = null; }
        tripContext = trip;
      }
    }

    const messages = [
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const reply = await chat(messages, tripContext);

    if (req.userId && tripId) {
      const uid = req.userId;
      db.prepare('INSERT INTO chat_messages (id, trip_id, user_id, role, content) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), tripId, uid, 'user', message);
      db.prepare('INSERT INTO chat_messages (id, trip_id, user_id, role, content) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), tripId, uid, 'assistant', reply);
    }

    res.json({ reply });
  } catch (err) {
    console.error('[chat]', err);
    res.status(500).json({ error: 'Lỗi trợ lý AI: ' + err.message });
  }
});

app.get('/api/chat/:tripId', authMiddleware, (req, res) => {
  const db = getDb();
  const messages = db.prepare('SELECT role, content, created_at FROM chat_messages WHERE trip_id = ? AND user_id = ? ORDER BY created_at ASC')
    .all(req.params.tripId, req.userId);
  res.json(messages);
});

// ── PLACES ───────────────────────────────────────────────────────────────────
app.get('/api/places/categories', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT category, COUNT(*) as count FROM places GROUP BY category').all();
  const countMap = Object.fromEntries(rows.map(r => [r.category, r.count]));

  const categories = [
    { id: 'all', name: 'Tất cả địa điểm', count: rows.reduce((s, r) => s + r.count, 0), icon: '🌸' },
    { id: 'heritage', name: 'Di tích & Hoàng cung', count: countMap.heritage || 0, icon: '🏛️', description: 'Đại Nội, lăng tẩm, cung điện hoàng gia Cố đô' },
    { id: 'food', name: 'Ẩm thực & Quán ăn', count: countMap.food || 0, icon: '🍜', description: 'Bún bò, cơm hến, bánh bèo và món ngon đường phố' },
    { id: 'cafe', name: 'Cà phê & Trà quán', count: countMap.cafe || 0, icon: '☕', description: 'Quán cà phê cổ kính, ngắm sông Hương thơ mộng' },
    { id: 'nature', name: 'Thiên nhiên & Cảnh quan', count: countMap.nature || 0, icon: '🌿', description: 'Đồi Vọng Cảnh, sông Hương, biển Thuận An' },
    { id: 'temple', name: 'Đền chùa & Tâm linh', count: countMap.temple || 0, icon: 'pagoda', description: 'Chùa Thiên Mụ, Huyền Không Sơn Thượng' },
    { id: 'market', name: 'Chợ & Làng nghề', count: (countMap.market || 0) + (countMap.craft_village || 0), icon: '🛍️', description: 'Chợ Đông Ba, làng hương Thủy Xuân' },
  ];

  res.json(categories);
});

app.get('/api/places', (req, res) => {
  const db = getDb();
  const { category, q } = req.query;
  const conditions = [];
  const params = [];

  if (category && category !== 'all') {
    conditions.push('category = ?');
    params.push(category);
  }
  if (q) {
    conditions.push('(name LIKE ? OR description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';
  const places = db.prepare(`SELECT * FROM places${where} ORDER BY rating DESC`).all(...params);

  places.forEach(p => {
    p.highlights = JSON.parse(p.highlights || '[]');
    p.tips = JSON.parse(p.tips || '[]');
  });

  res.json(places);
});

app.get('/api/places/:id', (req, res) => {
  const db = getDb();
  const place = db.prepare('SELECT * FROM places WHERE id = ?').get(req.params.id);
  if (!place) return res.status(404).json({ error: 'Place not found' });
  place.highlights = JSON.parse(place.highlights || '[]');
  place.tips = JSON.parse(place.tips || '[]');
  res.json(place);
});

// ── COMMUNITY FEED ───────────────────────────────────────────────────────────
app.get('/api/feed', optionalAuth, (req, res) => {
  const db = getDb();
  const trips = db.prepare(`
    SELECT t.*, u.name as owner_name
    FROM trips t JOIN users u ON t.user_id = u.id
    WHERE t.is_shared = 1
    ORDER BY t.like_count DESC, t.created_at DESC
    LIMIT 20
  `).all();

  trips.forEach(t => {
    t.highlights = JSON.parse(t.highlights || '[]');
    t.food_prefs = JSON.parse(t.food_prefs || '[]');
    t.itinerary = JSON.parse(t.itinerary || '{}');
    if (req.userId) {
      t.liked = !!db.prepare('SELECT 1 FROM trip_likes WHERE trip_id = ? AND user_id = ?').get(t.id, req.userId);
      t.saved = !!db.prepare('SELECT 1 FROM trip_saves WHERE trip_id = ? AND user_id = ?').get(t.id, req.userId);
    }
  });

  res.json(trips);
});

app.post('/api/feed/:id/like', optionalAuth, (req, res) => {
  const db = getDb();
  const tripId = req.params.id;
  const userId = req.userId || 'guest_' + Math.random().toString(36).slice(2, 9);

  const existing = db.prepare('SELECT 1 FROM trip_likes WHERE trip_id = ? AND user_id = ?').get(tripId, userId);
  if (existing) {
    db.prepare('DELETE FROM trip_likes WHERE trip_id = ? AND user_id = ?').run(tripId, userId);
    db.prepare('UPDATE trips SET like_count = MAX(0, like_count - 1) WHERE id = ?').run(tripId);
    res.json({ liked: false });
  } else {
    db.prepare('INSERT INTO trip_likes (trip_id, user_id) VALUES (?, ?)').run(tripId, userId);
    db.prepare('UPDATE trips SET like_count = like_count + 1 WHERE id = ?').run(tripId);
    res.json({ liked: true });
  }
});

app.post('/api/feed/:id/save', optionalAuth, (req, res) => {
  const db = getDb();
  const tripId = req.params.id;
  const userId = req.userId || 'guest_' + Math.random().toString(36).slice(2, 9);

  const existing = db.prepare('SELECT 1 FROM trip_saves WHERE trip_id = ? AND user_id = ?').get(tripId, userId);
  if (existing) {
    db.prepare('DELETE FROM trip_saves WHERE trip_id = ? AND user_id = ?').run(tripId, userId);
    db.prepare('UPDATE trips SET save_count = MAX(0, save_count - 1) WHERE id = ?').run(tripId);
    res.json({ saved: false });
  } else {
    db.prepare('INSERT INTO trip_saves (trip_id, user_id) VALUES (?, ?)').run(tripId, userId);
    db.prepare('UPDATE trips SET save_count = save_count + 1 WHERE id = ?').run(tripId);
    res.json({ saved: true });
  }
});

app.post('/api/feed/:id/clone', optionalAuth, (req, res) => {
  const db = getDb();
  const original = db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id);
  if (!original) return res.status(404).json({ error: 'Trip not found' });

  const newId = 'trip_' + uuidv4().replace(/-/g, '').slice(0, 12);
  const userId = req.userId || 'user_demo';

  db.prepare(`INSERT INTO trips
    (id, user_id, title, summary, duration, style, companion, budget, food_prefs,
     itinerary, highlights, ai_insight, total_cost_estimate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    newId, userId,
    `[Clone] ${original.title}`, original.summary,
    original.duration, original.style, original.companion, original.budget,
    original.food_prefs, original.itinerary, original.highlights,
    original.ai_insight, original.total_cost_estimate, 'active'
  );

  db.prepare('UPDATE trips SET clone_count = clone_count + 1 WHERE id = ?').run(req.params.id);
  res.json({ tripId: newId, message: 'Đã clone lịch trình!' });
});

// ── JOURNAL ──────────────────────────────────────────────────────────────────
app.get('/api/journal', authMiddleware, (req, res) => {
  const db = getDb();
  const { tripId } = req.query;
  const params = [req.userId];
  let query = 'SELECT * FROM journal_entries WHERE user_id = ?';
  if (tripId) { query += ' AND trip_id = ?'; params.push(tripId); }
  query += ' ORDER BY created_at DESC';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/journal', authMiddleware, (req, res) => {
  const db = getDb();
  const { tripId, time_str, place_name, content, mood, is_private } = req.body;
  if (!content) return res.status(400).json({ error: 'Nội dung không được để trống' });

  const id = 'je_' + uuidv4().replace(/-/g, '').slice(0, 12);
  db.prepare(`INSERT INTO journal_entries (id, user_id, trip_id, time_str, place_name, content, mood, is_private)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, req.userId, tripId || null, time_str || null, place_name || null,
    content, mood || 'happy', is_private ? 1 : 0
  );
  res.status(201).json(db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(id));
});

app.put('/api/journal/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const entry = db.prepare('SELECT * FROM journal_entries WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  const { content, mood, is_private } = req.body;
  db.prepare('UPDATE journal_entries SET content = ?, mood = ?, is_private = ? WHERE id = ?').run(
    content ?? entry.content, mood ?? entry.mood,
    is_private !== undefined ? (is_private ? 1 : 0) : entry.is_private,
    req.params.id
  );
  res.json(db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(req.params.id));
});

app.delete('/api/journal/:id', authMiddleware, (req, res) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM journal_entries WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (!result.changes) return res.status(404).json({ error: 'Entry not found' });
  res.json({ success: true });
});

// ── WEATHER ──────────────────────────────────────────────────────────────────
app.get('/api/weather', (req, res) => {
  const month = new Date().getMonth();
  const isRainy = month >= 9 || month <= 1;
  const temp = isRainy ? 22 : 30;
  const conditions = ['sunny', 'cloudy', 'rainy'];
  const conditionIdx = isRainy
    ? (Math.random() > 0.4 ? 2 : 1)
    : (Math.random() > 0.3 ? 0 : 1);
  const condition = conditions[conditionIdx];

  const conditionVi = { sunny: 'Nắng đẹp', cloudy: 'Nhiều mây', rainy: 'Có mưa' };

  res.json({
    city: 'Huế',
    temp,
    feels_like: temp - 2,
    humidity: isRainy ? 88 : 65,
    condition,
    condition_vi: conditionVi[condition],
    uv_index: isRainy ? 3 : 8,
    wind_kmh: isRainy ? 18 : 10,
    forecast: Array.from({ length: 5 }, (_, i) => ({
      day: ['Hôm nay', 'Ngày mai', 'Thứ 4', 'Thứ 5', 'Thứ 6'][i],
      temp_max: temp + Math.floor(Math.random() * 4) - 2,
      temp_min: temp - 5 + Math.floor(Math.random() * 3),
      condition: Math.random() > (isRainy ? 0.35 : 0.8) ? 'rainy' : (Math.random() > 0.5 ? 'sunny' : 'cloudy'),
    })),
    updated_at: new Date().toISOString(),
  });
});

// ── EVENT TRACKING ───────────────────────────────────────────────────────────
// Ghi lại mọi tương tác của user để dùng cho personalization
app.post('/api/events', optionalAuth, (req, res) => {
  try {
    const { event_type, place_id, trip_id, value, context, session_id } = req.body;
    if (!event_type || !session_id) return res.status(400).json({ error: 'event_type và session_id là bắt buộc' });

    const db = getDb();
    const id = uuidv4();
    const userId = req.userId || null;

    db.prepare(`INSERT INTO user_events (id, user_id, session_id, event_type, place_id, trip_id, value, context)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, userId, session_id, event_type,
      place_id || null, trip_id || null,
      value !== undefined ? value : null,
      JSON.stringify(context || {})
    );

    // Cập nhật popularity của địa điểm realtime
    if (place_id && ['view', 'save', 'add_trip', 'rate'].includes(event_type)) {
      const weight = { view: 0.001, save: 0.005, add_trip: 0.01, rate: 0.008 }[event_type] || 0.001;
      db.prepare('UPDATE places SET popularity = MIN(1.0, popularity + ?) WHERE id = ?').run(weight, place_id);
    }

    res.json({ ok: true, id });
  } catch (err) {
    console.error('[events]', err);
    res.status(500).json({ error: 'Lỗi ghi event' });
  }
});

// Lấy ngữ cảnh cá nhân hóa của user (dùng để enrich prompt cho AI)
app.get('/api/user/context', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const userId = req.userId;
    const sessionId = req.query.session_id;

    if (!userId && !sessionId) return res.json({ personalized: false });

    // Địa điểm đã lưu / thêm vào lịch trình
    const savedPlaces = userId
      ? db.prepare(`SELECT DISTINCT place_id, event_type FROM user_events
          WHERE user_id = ? AND place_id IS NOT NULL
          AND event_type IN ('save','add_trip','rate') ORDER BY created_at DESC LIMIT 30`).all(userId)
      : [];

    // Địa điểm đã xem nhiều nhất (biểu hiện quan tâm)
    const viewedPlaces = userId
      ? db.prepare(`SELECT place_id, COUNT(*) as cnt, AVG(value) as avg_value
          FROM user_events WHERE user_id = ? AND place_id IS NOT NULL
          GROUP BY place_id ORDER BY cnt DESC LIMIT 20`).all(userId)
      : [];

    // Lịch sử các chuyến đi
    const tripHistory = userId
      ? db.prepare(`SELECT t.style, t.companion, t.duration, t.budget, f.overall_rating, f.places_visited, f.places_skipped
          FROM trips t LEFT JOIN trip_feedback f ON t.id = f.trip_id
          WHERE t.user_id = ? ORDER BY t.created_at DESC LIMIT 10`).all(userId)
      : [];

    // Feedback gần nhất
    const recentFeedback = userId
      ? db.prepare(`SELECT f.*, t.style, t.companion FROM trip_feedback f
          JOIN trips t ON f.trip_id = t.id
          WHERE f.user_id = ? ORDER BY f.created_at DESC LIMIT 5`).all(userId)
      : [];

    // Tính toán sở thích
    const visitedPlaceIds = [
      ...savedPlaces.map(e => e.place_id),
      ...recentFeedback.flatMap(f => JSON.parse(f.places_visited || '[]')),
    ];
    const skippedPlaceIds = recentFeedback.flatMap(f => JSON.parse(f.places_skipped || '[]'));

    const avgRating = recentFeedback.filter(f => f.overall_rating).reduce((s, f) => s + f.overall_rating, 0)
      / (recentFeedback.filter(f => f.overall_rating).length || 1);

    const favoriteStyles = tripHistory.flatMap(t => (t.style || '').split(','))
      .reduce((acc, s) => { if (s) acc[s] = (acc[s] || 0) + 1; return acc; }, {});

    const context = {
      personalized: savedPlaces.length > 0 || tripHistory.length > 0,
      visited_place_ids: [...new Set(visitedPlaceIds)],
      skipped_place_ids: [...new Set(skippedPlaceIds)],
      top_viewed_places: viewedPlaces.slice(0, 5).map(v => v.place_id),
      favorite_styles: Object.entries(favoriteStyles).sort((a, b) => b[1] - a[1]).map(([s]) => s).slice(0, 3),
      avg_satisfaction: Math.round(avgRating * 10) / 10 || null,
      trip_count: tripHistory.length,
      typical_companion: tripHistory[0]?.companion || null,
      typical_duration: tripHistory.length > 0
        ? Math.round(tripHistory.reduce((s, t) => s + (t.duration || 0), 0) / tripHistory.length)
        : null,
    };

    res.json(context);
  } catch (err) {
    console.error('[user-context]', err);
    res.json({ personalized: false });
  }
});

// ── TRIP FEEDBACK ─────────────────────────────────────────────────────────────
app.post('/api/feedback/trip', optionalAuth, async (req, res) => {
  try {
    const {
      trip_id, overall_rating, ai_rating,
      places_visited, places_skipped, duration_actual, notes, session_id
    } = req.body;

    if (!trip_id || overall_rating === undefined) {
      return res.status(400).json({ error: 'trip_id và overall_rating là bắt buộc' });
    }

    const db = getDb();
    const userId = req.userId || null;
    const id = 'fb_' + uuidv4().replace(/-/g, '').slice(0, 12);

    db.prepare(`INSERT INTO trip_feedback
      (id, trip_id, user_id, session_id, overall_rating, ai_rating, places_visited, places_skipped, duration_actual, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, trip_id, userId, session_id || null,
      overall_rating,
      ai_rating || null,
      JSON.stringify(places_visited || []),
      JSON.stringify(places_skipped || []),
      duration_actual || null,
      notes || null
    );

    // Lưu vào training_examples (dữ liệu cho model sau này)
    const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(trip_id);
    if (trip) {
      const reward = (overall_rating / 5) * 0.7 + ((ai_rating || overall_rating) / 5) * 0.3;
      const userProfile = {
        styles: trip.style ? trip.style.split(',') : [],
        companion: trip.companion,
        duration: trip.duration,
        budget: trip.budget,
        food_prefs: JSON.parse(trip.food_prefs || '[]'),
      };
      const trainingContext = {
        season: getHueSeason(),
        timestamp: new Date().toISOString(),
      };

      db.prepare(`INSERT INTO training_examples (id, user_profile, context, output, reward, source)
        VALUES (?, ?, ?, ?, ?, ?)`).run(
        uuidv4(),
        JSON.stringify(userProfile),
        JSON.stringify(trainingContext),
        JSON.stringify({ trip_id, places_visited, places_skipped }),
        Math.round(reward * 100) / 100,
        'feedback'
      );
    }

    res.json({ ok: true, id });
  } catch (err) {
    console.error('[feedback]', err);
    res.status(500).json({ error: 'Lỗi lưu feedback' });
  }
});

app.get('/api/feedback/trip/:tripId', optionalAuth, (req, res) => {
  const db = getDb();
  const fb = db.prepare('SELECT * FROM trip_feedback WHERE trip_id = ?').get(req.params.tripId);
  if (!fb) return res.json(null);
  fb.places_visited = JSON.parse(fb.places_visited || '[]');
  fb.places_skipped = JSON.parse(fb.places_skipped || '[]');
  res.json(fb);
});

// Thống kê training data (dùng để biết khi nào đủ data để train)
app.get('/api/admin/training-stats', (req, res) => {
  const db = getDb();
  const stats = {
    total_examples: db.prepare('SELECT COUNT(*) as c FROM training_examples').get().c,
    avg_reward: db.prepare('SELECT ROUND(AVG(reward), 2) as r FROM training_examples').get().r,
    high_quality: db.prepare('SELECT COUNT(*) as c FROM training_examples WHERE reward >= 0.7').get().c,
    total_events: db.prepare('SELECT COUNT(*) as c FROM user_events').get().c,
    total_feedback: db.prepare('SELECT COUNT(*) as c FROM trip_feedback').get().c,
    unique_users: db.prepare('SELECT COUNT(DISTINCT user_id) as c FROM user_events WHERE user_id IS NOT NULL').get().c,
    ready_to_train: false,
  };
  stats.ready_to_train = stats.high_quality >= 100;
  res.json(stats);
});

function getHueSeason() {
  const m = new Date().getMonth();
  if (m >= 9 || m <= 1) return 'rainy';
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  return 'autumn';
}

// ── USER PROFILE ─────────────────────────────────────────────────────────────
app.get('/api/user/profile', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, level, total_trips, total_places, created_at FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const tripCount = db.prepare('SELECT COUNT(*) as c FROM trips WHERE user_id = ?').get(req.userId).c;
  const journalCount = db.prepare('SELECT COUNT(*) as c FROM journal_entries WHERE user_id = ?').get(req.userId).c;
  res.json({ ...user, trip_count: tripCount, journal_count: journalCount });
});

app.put('/api/user/profile', authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  getDb().prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.userId);
  res.json({ success: true });
});

// ── LOCAL DEV SERVER ─────────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🌸 HueViVu API đang chạy tại http://localhost:${PORT}\n`);
  });
}

module.exports = app;
