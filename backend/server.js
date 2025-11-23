const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // serve root files

// Ensure backend/DB folder exists
const dbFolder = path.join(__dirname, 'DB');
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });

// Path to SQLite database file
const dbPath = path.join(dbFolder, 'myDB.db');

// Open SQLite database
const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) throw err;
        console.log('Connected to database at:', dbPath);
    }
);
// if i need to drop it becuase i've change a value uncomment
/*db.run('DROP TABLE IF EXISTS status', (err) => {
    if (err) console.error('Failed to drop table:', err.message);
    else console.log('Table "status" dropped.');
 */

// Create table if not exists
db.run(
    `CREATE TABLE IF NOT EXISTS status(
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          isUp INTEGER,
                                          lastChecked TEXT DEFAULT (datetime('now'))
     )`,
    (err) => {
        if (err) console.error('Failed to create table:', err.message);
        else console.log('Table "status" is ready.');
    }
);

// Insert new status with logging
app.post('/status', (req, res) => {
    const { isUp } = req.body;
    console.log('POST /status received:', req.body);

    db.run('INSERT INTO status (isUp) VALUES (?)', [isUp ? 1 : 0], function(err) {
        if (err) {
            console.error('Failed to insert status:', err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log('Inserted row ID:', this.lastID);

        db.get('SELECT * FROM status WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                console.error('Failed to fetch new row:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log('New row:', row);
            res.json(row);
        });
    });
});

// Retrieve last 10 statuses with logging
app.get('/status', (req, res) => {
    console.log('GET /status called');
    db.all('SELECT * FROM status ORDER BY id DESC LIMIT 10', (err, rows) => {
        if (err) {
            console.error('Failed to fetch statuses:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('Returning last 10 statuses:', rows);
        res.json(rows);
    });
});

// Start server

    //for testing
//app.listen(3000, () => console.log('Server running on http://localhost:3000'));

    //for PI server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (accessible via reverse proxy)`);
});
