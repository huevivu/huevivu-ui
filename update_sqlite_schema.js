const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'huevivu.db');
const db = new sqlite3.Database(dbPath);

const newColumns = [
    "vibe TEXT",
    "noise_level TEXT",
    "authenticity INTEGER DEFAULT 3",
    "walking_distance TEXT",
    "accessibility TEXT",
    "weather_dependent INTEGER DEFAULT 0",
    "best_time_of_day TEXT",
    "ideal_pacing TEXT",
    "taste_profile TEXT",
    "dining_style TEXT",
    "specialties TEXT"
];

db.serialize(() => {
    newColumns.forEach(col => {
        db.run(`ALTER TABLE places ADD COLUMN ${col}`, (err) => {
            if (err) {
                // Ignore errors if column already exists
                if (err.message.includes('duplicate column name')) {
                    console.log(`Column already exists (ignored): ${col}`);
                } else {
                    console.error(`Error adding column ${col}:`, err.message);
                }
            } else {
                console.log(`Successfully added column: ${col}`);
            }
        });
    });
});

db.close(() => {
    console.log("Migration finished.");
});
