const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

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

module.exports = db;
