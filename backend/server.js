const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes for Sports / Fixtures
app.get('/api/sports', (req, res) => {
    db.all("SELECT * FROM sports", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/sports', (req, res) => {
    const { player_name, position, jersey_number } = req.body;
    const query = `INSERT INTO sports (player_name, position, jersey_number) VALUES (?, ?, ?)`;
    db.run(query, [player_name, position, jersey_number], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, player_name, position, jersey_number });
    });
});

app.put('/api/sports/:id', (req, res) => {
    const { player_name, position, jersey_number } = req.body;
    const query = `UPDATE sports SET player_name = ?, position = ?, jersey_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(query, [player_name, position, jersey_number, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

app.delete('/api/sports/:id', (req, res) => {
    db.run(`DELETE FROM sports WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});