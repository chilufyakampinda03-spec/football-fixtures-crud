const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database file (named sports.db as per your project theme)
const dbFile = path.join(__dirname, 'sports.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create the sports table with the exact fields required
        db.run(`CREATE TABLE IF NOT EXISTS sports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT,
            position TEXT,
            jersey_number INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
            } else {
                console.log("Sports table verified/created successfully.");
            }
        });
    }
});

module.exports = db;