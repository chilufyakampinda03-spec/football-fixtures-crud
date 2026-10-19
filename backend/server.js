const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/api/sports', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sports');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/sports/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sports WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Record not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sports', async (req, res) => {
    try {
        const { player_name, position, jersey_number } = req.body;
        const [result] = await pool.query(
            'INSERT INTO sports (player_name, position, jersey_number) VALUES (?, ?, ?)',
            [player_name || null, position || null, jersey_number || null]
        );
        res.status(201).json({ id: result.insertId, player_name, position, jersey_number });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/sports/:id', async (req, res) => {
    try {
        const { player_name, position, jersey_number } = req.body;
        await pool.query(
            'UPDATE sports SET player_name = ?, position = ?, jersey_number = ? WHERE id = ?',
            [player_name || null, position || null, jersey_number || null, req.params.id]
        );
        res.json({ message: 'Record updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/sports/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM sports WHERE id = ?', [req.params.id]);
        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
