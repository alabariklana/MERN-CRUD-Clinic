// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database('./clinic.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            reservation_date DATE NOT NULL,
            reservation_time TIME NOT NULL,
            doctor TEXT NOT NULL,
            notes TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients (id)
        )
    `);
});

// API Endpoints

// Get all reservations
app.get('/api/reservations', (req, res) => {
    const query = `
        SELECT r.*, p.name as patient_name, p.phone
        FROM reservations r
        JOIN patients p ON r.patient_id = p.id
        ORDER BY r.reservation_date, r.reservation_time
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Create new reservation
app.post('/api/reservations', (req, res) => {
    const { name, phone, email, reservation_date, reservation_time, doctor, notes } = req.body;

    db.serialize(() => {
        // First, create or get patient
        db.run(
            `INSERT INTO patients (name, phone, email) VALUES (?, ?, ?)`,
            [name, phone, email],
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const patient_id = this.lastID;

                // Then create reservation
                db.run(
                    `INSERT INTO reservations (patient_id, reservation_date, reservation_time, doctor, notes)
                     VALUES (?, ?, ?, ?, ?)`,
                    [patient_id, reservation_date, reservation_time, doctor, notes],
                    function(err) {
                        if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                        }
                        res.json({ id: this.lastID, message: "Reservation created successfully" });
                    }
                );
            }
        );
    });
});

// Update reservation
app.put('/api/reservations/:id', (req, res) => {
    const { reservation_date, reservation_time, doctor, notes, status } = req.body;
    
    db.run(
        `UPDATE reservations 
         SET reservation_date = ?, 
             reservation_time = ?, 
             doctor = ?, 
             notes = ?,
             status = ?
         WHERE id = ?`,
        [reservation_date, reservation_time, doctor, notes, status, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Reservation updated successfully" });
        }
    );
});

// Delete reservation
app.delete('/api/reservations/:id', (req, res) => {
    db.run(
        'DELETE FROM reservations WHERE id = ?',
        [req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Reservation deleted successfully" });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});