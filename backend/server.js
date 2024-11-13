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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
