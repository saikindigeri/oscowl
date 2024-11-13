const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const authenticateJWT = require('../middleware/authMiddleware');
 
const router = express.Router();

// Create Todo
router.post('/', authenticateJWT, (req, res) => {
    const { title, description, status } = req.body;
    const id = uuidv4();
    const user_id = req.user.id;

    db.run(`INSERT INTO todos (id, user_id, title, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, user_id, title, description, status, new Date().toISOString()],
        function(err) {
            if (err) return res.status(400).json({ message: 'Error creating todo', error: err });
            res.status(201).json({ message: 'Todo created', id });
        }
    );
});

// Read Todos
router.get('/', authenticateJWT, (req, res) => {
    db.all(`SELECT * FROM todos WHERE user_id = ?`, [req.user.id], (err, rows) => {
        if (err) return res.status(400).json({ message: 'Error fetching todos', error: err });
        res.json(rows);
    });
});

// Update Todo
router.put('/:id', authenticateJWT, (req, res) => {
    const { title, description, status } = req.body;
    const { id } = req.params;

    db.run(`UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?`,
        [title, description, status, id, req.user.id],
        function(err) {
            if (err) return res.status(400).json({ message: 'Error updating todo', error: err });
            res.json({ message: 'Todo updated' });
        }
    );
});

// Delete Todo
router.delete('/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM todos WHERE id = ? AND user_id = ?`, [id, req.user.id], function(err) {
        if (err) return res.status(400).json({ message: 'Error deleting todo', error: err });
        res.json({ message: 'Todo deleted' });
    });
});

module.exports = router;
