const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection Configuration
// We use 127.0.0.1 instead of localhost to avoid IPv6 issues on some Node versions
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'eventdb';

let db;
let registrationsCollection;

async function initDB() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        db = client.db(dbName);
        registrationsCollection = db.collection('registrations');
        
        // Ensure that regno is unique in the database
        await registrationsCollection.createIndex({ regno: 1 }, { unique: true });
        console.log("Database 'eventdb' and collection 'registrations' are ready.");
    } catch (err) {
        console.error('Database connection failed:', err);
        console.error('Please ensure MongoDB is running locally on port 27017.');
        process.exit(1);
    }
}

initDB();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle Registration Form Submission
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

    try {
        // Check if register number already exists
        const existingUser = await registrationsCollection.findOne({ regno: regno });
        
        if (existingUser) {
            return res.status(400).json({ error: "Register number already registered!" });
        }

        // Insert new document. Notice how we store events as an array directly.
        const newDoc = {
            regno: regno,
            name: name,
            events: selectedEvents
        };

        await registrationsCollection.insertOne(newDoc);
        
        res.status(200).json({ message: "Registration successful!" });

    } catch (err) {
        console.error("Error during registration:", err);
        // MongoDB duplicate key error code is 11000
        if (err.code === 11000) {
            res.status(400).json({ error: "Register number already registered!" });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
});

// Handle Admin Search
app.get('/search/:regno', async (req, res) => {
    const regno = req.params.regno;

    try {
        // Search the collection by regno
        const user = await registrationsCollection.findOne({ regno: regno });
        
        if (!user) {
            return res.status(404).json({ error: "Register number not found." });
        }

        // Return user data
        res.status(200).json({
            regno: user.regno,
            name: user.name,
            events: user.events // Array of events
        });

    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
