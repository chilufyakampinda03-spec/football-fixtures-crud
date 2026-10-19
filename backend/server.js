const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GET all records
app.get('/api/sports', (req, res) => {
    db.all('SELECT * FROM sports', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET single record by ID
app.get('/api/sports/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM sports WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Record not found' });
        res.json(row);
    });
});

// POST create a record
app.post('/api/sports', (req, res) => {
    const { player_name, position, jersey_number } = req.body;
    const query = 'INSERT INTO sports (player_name, position, jersey_number) VALUES (?, ?, ?)';
    db.run(query, [player_name || null, position || null, jersey_number || null], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, player_name, position, jersey_number });
    });
});

// PUT update a record
app.put('/api/sports/:id', (req, res) => {
    const { id } = req.params;
    const { player_name, position, jersey_number } = req.body;
    const query = 'UPDATE sports SET player_name = ?, position = ?, jersey_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(query, [player_name || null, position || null, jersey_number || null, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Record not found' });
        res.json({ message: 'Updated successfully' });
    });
});

// DELETE a record
app.delete('/api/sports/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM sports WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Record not found' });
        res.json({ message: 'Deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(Server running on port \);
});
