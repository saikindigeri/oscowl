const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const SECRET = 'your_jwt_secret';

const router = express.Router();

// Signup route
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = uuidv4();

    db.run(`INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
        [id, name, email, hashedPassword],
        function(err) {
            if (err) return res.status(400).json({ message: 'Error creating user', error: err });
            res.status(201).json({ message: 'User created successfully' });
        }
    );
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;
