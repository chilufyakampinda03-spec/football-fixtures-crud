const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create table and auto-seed if empty
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT,
      position TEXT,
      jersey_number INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
      return;
    }

    db.get(`SELECT COUNT(*) as count FROM sports`, (err, row) => {
      if (err) return;

      if (row.count === 0) {
        console.log("Seeding initial 10 records into database...");
        const stmt = db.prepare(`
          INSERT INTO sports (player_name, position, jersey_number) 
          VALUES (?, ?, ?)
        `);

        const sampleRecords = [
          ['John Mwewa', 'Goalkeeper', 1],
          ['Bwalya Tembo', 'Defender', 3],
          ['Chileshe Mulenga', 'Defender', 4],
          ['Kampinda Chilufya', 'Midfielder', 8],
          ['Lubinda Phiri', 'Midfielder', 10],
          ['Musonda Banda', 'Forward', 7],
          ['Mulenga Chisanga', 'Forward', 9],
          ['Kasonde Lungu', 'Defender', 2],
          ['Mwape Chanda', 'Midfielder', 6],
          ['Kapembwa Kalenga', 'Goalkeeper', 16]
        ];

        sampleRecords.forEach(record => stmt.run(record));
        stmt.finalize();
        console.log("Successfully seeded 10 sample records!");
      }
    });
  });
});

module.exports = db;