const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

// Update Profile
router.put('/update', authenticateJWT, (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    db.run(
        `UPDATE users SET name = ?, email = ?, password = COALESCE(?, password) WHERE id = ?`,
        [name, email, hashedPassword, req.user.id],
        function(err) {
            if (err) return res.status(400).json({ message: 'Error updating profile', error: err });
            res.json({ message: 'Profile updated' });
        }
    );
});

// Fetch Profile
router.get('/me', authenticateJWT, (req, res) => {
    db.get(`SELECT id, name, email FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(400).json({ message: 'Error fetching profile', error: err });
        res.json(user);
    });
});

module.exports = router;
