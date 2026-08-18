const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'huevivu.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening db:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
    if (err) {
      console.error(err.message);
      return;
    }
    
    tables.forEach(table => {
      console.log(`\nTable: ${table.name}`);
      db.all(`PRAGMA table_info(${table.name});`, [], (err, columns) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(columns.map(c => `- ${c.name} (${c.type})`).join('\n'));
      });
    });
  });
});
