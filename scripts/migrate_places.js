require('dotenv').config({ path: '.env.local' });
const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const dbPath = path.join(__dirname, '..', 'data', 'huevivu.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

async function migratePlaces() {
  console.log("Starting migration of places...");

  db.all("SELECT * FROM places", [], async (err, rows) => {
    if (err) {
      console.error("Error reading sqlite:", err);
      return;
    }

    console.log(`Found ${rows.length} places in sqlite. Preparing for Supabase...`);

    const formattedPlaces = rows.map(row => {
      // Parse JSON strings to Arrays to insert into JSONB columns
      let highlights = [];
      let tips = [];
      let vibe = [];
      let tags = [];

      try { highlights = row.highlights ? JSON.parse(row.highlights) : []; } catch (e) { }
      try { tips = row.tips ? JSON.parse(row.tips) : []; } catch (e) { }
      try { tags = row.tags ? JSON.parse(row.tags) : []; } catch (e) { }

      return {
        id: row.id,
        name: row.name,
        category: row.category || 'unknown',
        description: row.description,
        address: row.address,
        rating: row.rating,
        rating_count: row.rating_count,
        price: row.price,
        duration: row.duration,
        distance: row.distance,
        lat: row.lat,
        lng: row.lng,
        img: row.img,
        ai_insight: row.ai_insight,
        hours: row.hours,
        hours_time: row.hours_time,
        hours_note: row.hours_note,
        highlights: highlights,
        tips: tips,
        indoor: row.indoor,
        best_time: row.best_time,
        crowd_level: row.crowd_level,
        physical_level: row.physical_level,
        tags: tags,
        avg_visit_min: row.avg_visit_min,
        popularity: row.popularity
      };
    });

    // Insert to Supabase in chunks to avoid payload limits
    const CHUNK_SIZE = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 50; i < formattedPlaces.length; i += CHUNK_SIZE) {
      const chunk = formattedPlaces.slice(i, i + CHUNK_SIZE);
      const { data, error } = await supabase.from('places').upsert(chunk); // Dùng upsert cho an toàn

      if (error) {
        console.error(`Error inserting chunk ${i} - ${i + CHUNK_SIZE}:`, error.message);
        errorCount += chunk.length;
      } else {
        console.log(`Inserted chunk ${i} - ${i + CHUNK_SIZE}`);
        successCount += chunk.length;
      }
    }

    console.log(`Migration completed! Successfully inserted: ${successCount}. Errors: ${errorCount}`);
  });
}

migratePlaces();
