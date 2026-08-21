import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Khởi tạo Database SQLite cho công cụ admin
const dbPath = path.join(process.cwd(), 'data', 'admin_collector.db');

function initDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      
      const createTableQuery = `
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
          lat REAL DEFAULT 16.4637,
          lng REAL DEFAULT 107.5909,
          img TEXT,
          ai_insight TEXT,
          hours TEXT,
          hours_time TEXT,
          hours_note TEXT,
          highlights TEXT,
          tips TEXT,
          indoor INTEGER DEFAULT 0,
          best_time TEXT,
          crowd_level TEXT,
          physical_level TEXT,
          tags TEXT,
          avg_visit_min INTEGER DEFAULT 90,
          popularity REAL DEFAULT 0.0,
          vibe TEXT,
          noise_level TEXT,
          authenticity INTEGER DEFAULT 3,
          walking_distance TEXT,
          accessibility TEXT,
          weather_dependent INTEGER DEFAULT 0,
          best_time_of_day TEXT,
          ideal_pacing TEXT,
          taste_profile TEXT,
          dining_style TEXT,
          specialties TEXT
        )
      `;
      db.run(createTableQuery, (err) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
  });
}

// Hàm hỗ trợ query sqlite dạng Promise
const runQuery = (db, query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

const getQuery = (db, query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export async function GET(request) {
  try {
    const db = await initDb();
    const { searchParams } = new URL(request.url);
    
    let query = 'SELECT * FROM places';
    const params = [];
    
    // Ở đây ta có thể mở rộng xử lý category v.v. nhưng với Admin Collector, chủ yếu là lưu
    const limit = parseInt(searchParams.get('limit') || '10');
    query += ` LIMIT ?`;
    params.push(limit);

    const data = await getQuery(db, query, params);
    
    db.close();

    return NextResponse.json({
      status: 'success',
      data: data,
    });
  } catch (error) {
    console.error('API /places error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Lấy file ảnh
    const imageFile = formData.get('image');
    let imgPath = '';

    if (imageFile && imageFile instanceof Blob) {
      // Đảm bảo thư mục upload tồn tại
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      imgPath = `/uploads/${filename}`;
    }

    // Trích xuất các fields khác
    const body = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'image') {
        body[key] = value;
      }
    }

    if (!body.id) {
      body.id = (body.name || 'place').toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + Date.now().toString().slice(-4);
    }

    // Set đường dẫn ảnh
    if (imgPath) body.img = imgPath;

    const db = await initDb();
    
    const columns = Object.keys(body);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(body);

    const insertQuery = `INSERT INTO places (${columns.join(', ')}) VALUES (${placeholders})`;
    
    await runQuery(db, insertQuery, values);
    db.close();

    return NextResponse.json({
      status: 'success',
      data: body,
    });
  } catch (error) {
    console.error('API POST /places error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
