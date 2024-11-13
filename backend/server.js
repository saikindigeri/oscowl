
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const app = express();

const DB_PATH = path.resolve(__dirname, 'todos.db');
const JWT_SECRET = 'your_jwt_secret';  
app.use(cors());
const router = express.Router();


const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

let db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

const createTables=()=>{
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT,
            description TEXT,
            status TEXT,
            created_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);
    });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
 

app.post('/api/auth/signup', (req, res) => {
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
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

app.post('/api/todos/', authenticateJWT, (req, res) => {
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
app.get('/api/todos/', authenticateJWT, (req, res) => {
    db.all(`SELECT * FROM todos WHERE user_id = ?`, [req.user.id], (err, rows) => {
        if (err) return res.status(400).json({ message: 'Error fetching todos', error: err });
        res.json(rows);
    });
});

// Update Todo
app.put('/api/todos/:id', authenticateJWT, (req, res) => {
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
app.delete('/api/todos/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM todos WHERE id = ? AND user_id = ?`, [id, req.user.id], function(err) {
        if (err) return res.status(400).json({ message: 'Error deleting todo', error: err });
        res.json({ message: 'Todo deleted' });
    });
});

app.put('/api/profile/update', authenticateJWT, (req, res) => {
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
app.get('/api/profile/me', authenticateJWT, (req, res) => {
    db.get(`SELECT id, name, email FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(400).json({ message: 'Error fetching profile', error: err });
        res.json(user);
    });
});

/*

const express = require('express');
const cors = require("cors"); // Import CORS
const bodyParser = require("body-parser");



const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const profileRoutes = require('./routes/profileRoutes');
const db = require('./database');
 
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/profile', profileRoutes);
*/


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
