// 1. GET a single record by ID
app.get('/api/sports/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM sports WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json(row);
  });
});

// 2. PUT (Update) a record by ID
app.put('/api/sports/:id', (req, res) => {
  const id = req.params.id;
  const { player_name, position, jersey_number } = req.body;
  db.run(
    `UPDATE sports SET player_name = ?, position = ?, jersey_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [player_name, position, jersey_number, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Record not found" });
      }
      res.json({ message: "Updated successfully", changes: this.changes });
    }
  );
});

// 3. DELETE a record by ID
app.delete('/api/sports/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM sports WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ message: "Deleted successfully", deletedID: id });
  });
});