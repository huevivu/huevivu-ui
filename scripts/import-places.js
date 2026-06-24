/* ========================================
   HueViVu — Import địa điểm từ places_seed.json vào SQLite
   Dùng: node scripts/import-places.js [đường-dẫn-json]
   Mặc định đọc ./places_seed.json
   - Tự nhận diện & sửa lỗi encoding mojibake (UTF-8 bị đọc nhầm Latin-1)
   - INSERT OR REPLACE (idempotent) — chạy lại nhiều lần đều an toàn
   ======================================== */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { getDb } = require('../lib/db');

const file = process.argv[2] || path.join(__dirname, '../places_seed.json');

if (!fs.existsSync(file)) {
  console.error(`❌ Không tìm thấy file: ${file}`);
  console.error('   → Lưu places_seed.json vào thư mục dự án rồi chạy lại: npm run seed');
  process.exit(1);
}

// Đọc raw bytes để có thể sửa mojibake chính xác
const raw = fs.readFileSync(file);
let text = raw.toString('utf8');

// Nhận diện mojibake: nhiều cụm "Ã", "Ä", "á»", "áº" là dấu hiệu UTF-8 bị đọc thành Latin-1
function looksMojibake(s) {
  const hits = (s.match(/Ã|Ä|á»|áº|Æ°|Ã |Ã©/g) || []).length;
  return hits > 3;
}

// Sửa: chuỗi mojibake -> bytes Latin-1 -> decode UTF-8
function fixMojibake(s) {
  return Buffer.from(s, 'latin1').toString('utf8');
}

if (looksMojibake(text)) {
  const fixed = fixMojibake(text);
  // chỉ dùng bản sửa nếu nó parse JSON được và giảm dấu hiệu mojibake
  try {
    JSON.parse(fixed);
    if ((fixed.match(/Ã|Ä/g) || []).length < (text.match(/Ã|Ä/g) || []).length) {
      console.log('🔧 Phát hiện lỗi encoding — đã tự động sửa mojibake (Latin-1 → UTF-8).');
      text = fixed;
    }
  } catch { /* giữ nguyên nếu bản sửa không parse được */ }
}

let records;
try {
  records = JSON.parse(text);
} catch (e) {
  console.error('❌ File JSON không hợp lệ:', e.message);
  process.exit(1);
}
if (!Array.isArray(records)) {
  console.error('❌ File phải là một mảng JSON các địa điểm.');
  process.exit(1);
}

// Đảm bảo highlights/tips/tags là chuỗi JSON hợp lệ (DB lưu dạng TEXT)
function asJsonText(v, fallback) {
  if (v == null) return fallback;
  if (typeof v === 'string') {
    try { JSON.parse(v); return v; } catch { return JSON.stringify([v]); }
  }
  return JSON.stringify(v);
}

const db = getDb();

const stmt = db.prepare(`INSERT OR REPLACE INTO places
  (id, name, category, description, address, rating, rating_count, price, duration,
   distance, lat, lng, img, ai_insight, hours, hours_time, hours_note, highlights, tips,
   indoor, best_time, crowd_level, physical_level, tags, avg_visit_min, popularity)
  VALUES (@id, @name, @category, @description, @address, @rating, @rating_count, @price, @duration,
   @distance, @lat, @lng, @img, @ai_insight, @hours, @hours_time, @hours_note, @highlights, @tips,
   @indoor, @best_time, @crowd_level, @physical_level, @tags, @avg_visit_min, @popularity)`);

const FALLBACK_IMG = {
  heritage: 'assets/citadel.png', temple: 'assets/citadel.png', market: 'assets/food.png',
  food: 'assets/food.png', cafe: 'assets/hero.png', nature: 'assets/river.png',
  craft_village: 'assets/citadel.png', architecture: 'assets/hero-hub.png', art: 'assets/hero-hub.png',
};

let ok = 0, skip = 0;
const upsertAll = db.transaction((rows) => {
  for (const r of rows) {
    if (!r.id || !r.name) { skip++; continue; }
    stmt.run({
      id: String(r.id),
      name: String(r.name),
      category: r.category || 'heritage',
      description: r.description || '',
      address: r.address || '',
      rating: Number(r.rating) || 4.5,
      rating_count: Number(r.rating_count) || 0,
      price: r.price != null ? String(r.price) : 'Miễn phí',
      duration: r.duration || '1-2 giờ',
      distance: r.distance || '',
      lat: Number(r.lat) || 16.4637,
      lng: Number(r.lng) || 107.5909,
      img: r.img || FALLBACK_IMG[r.category] || 'assets/citadel.png',
      ai_insight: r.ai_insight || '',
      hours: r.hours || '',
      hours_time: r.hours_time || '',
      hours_note: r.hours_note || '',
      highlights: asJsonText(r.highlights, '[]'),
      tips: asJsonText(r.tips, '[]'),
      indoor: r.indoor ? 1 : 0,
      best_time: r.best_time || 'all',
      crowd_level: r.crowd_level || 'medium',
      physical_level: r.physical_level || 'easy',
      tags: asJsonText(r.tags, '[]'),
      avg_visit_min: Number(r.avg_visit_min) || 90,
      popularity: r.popularity != null ? Number(r.popularity) : 0.5,
    });
    ok++;
  }
});

upsertAll(records);

const total = db.prepare('SELECT COUNT(*) c FROM places').get().c;
console.log(`✅ Đã import ${ok} địa điểm (bỏ qua ${skip}). Tổng địa điểm trong DB: ${total}.`);
// In vài tên để xác nhận encoding đúng
const sample = db.prepare('SELECT name FROM places ORDER BY rowid DESC LIMIT 5').all();
console.log('   Mẫu:', sample.map(s => s.name).join(' · '));
