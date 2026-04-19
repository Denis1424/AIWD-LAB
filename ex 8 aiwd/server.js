const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// MySQL Connection Configuration
// Note: We use createConnection without a database first to create it if it doesn't exist.
const dbConfig = {
    host: 'localhost',
    user: 'root', // Adjust if your user is different
    password: ''  // Adjust if your password is not empty
};

// Global db connection variable
let db;

// Initialize Database and Table
async function initDB() {
    try {
        // Create a connection just to check/create the database
        const tempConn = mysql.createConnection(dbConfig).promise();
        
        await tempConn.query("CREATE DATABASE IF NOT EXISTS eventdb");
        console.log("Database 'eventdb' checked/created.");
        await tempConn.end();

        // Now connect to the specific database
        db = mysql.createConnection({
            ...dbConfig,
            database: 'eventdb'
        }).promise();

        console.log("Connected to MySQL database 'eventdb'.");

        // Create the table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS registrations (
                regno VARCHAR(20) PRIMARY KEY,
                name VARCHAR(100),
                events TEXT
            )
        `;
        await db.query(createTableQuery);
        console.log("Table 'registrations' checked/created.");

    } catch (err) {
        console.error("Database initialization failed:", err.message);
        console.error("Please ensure MySQL is running and credentials are correct in server.js.");
        process.exit(1);
    }
}

// Call DB Init
initDB();

// Routes
// 1. Root route redirects to registration page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// 2. Handle Registration Form Submission
app.post('/register', async (req, res) => {
    const { regno, name, events } = req.body;

    // Validate data presence
    if (!regno || !name || !events) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Convert events to array if it's a single string (only 1 checkbox selected)
    const selectedEvents = Array.isArray(events) ? events : [events];

    // Validate max 3 events
    if (selectedEvents.length > 3) {
        return res.status(400).json({ error: "Maximum of 3 events can be selected." });
    }

    const eventsString = selectedEvents.join(', ');

    try {
        // Check if register number already exists
        const [existing] = await db.query('SELECT regno FROM registrations WHERE regno = ?', [regno]);
        
        if (existing.length > 0) {
            return res.status(400).json({ error: "Register number already registered!" });
        }

        // Insert new registration
        await db.query('INSERT INTO registrations (regno, name, events) VALUES (?, ?, ?)', [regno, name, eventsString]);
        
        res.status(200).json({ message: "Registration successful!" });

    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// 3. Handle Admin Search
app.get('/search/:regno', async (req, res) => {
    const regno = req.params.regno;

    try {
        const [rows] = await db.query('SELECT regno, name, events FROM registrations WHERE regno = ?', [regno]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Register number not found." });
        }

        res.status(200).json(rows[0]);

    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
