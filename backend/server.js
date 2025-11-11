const express = require('express');
const mysql = require('mysql2/promise'); // Using promise-based version
const cors = require('cors');
require('dotenv').config(); // Add this line to load environment variables
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'bus_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        connection.release();
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
}

testConnection();

// API Routes

// Get all cities
app.get('/api/cities', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cities');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search buses
app.get('/api/buses/search', async (req, res) => {
    const { from, to, date } = req.query;
    try {
        const [rows] = await pool.query(`
            SELECT b.*, 
                   c1.name as source_city, 
                   c2.name as destination_city
            FROM buses b
            JOIN cities c1 ON b.source_id = c1.id
            JOIN cities c2 ON b.destination_id = c2.id
            WHERE c1.name = ? AND c2.name = ? AND b.departure_date = ?
        `, [from, to, date]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bus details
app.get('/api/buses/:id', async (req, res) => {
    const busId = req.params.id;
    try {
        const [rows] = await pool.query(`
            SELECT b.*, 
                   c1.name as source_city, 
                   c2.name as destination_city
            FROM buses b
            JOIN cities c1 ON b.source_id = c1.id
            JOIN cities c2 ON b.destination_id = c2.id
            WHERE b.id = ?
        `, [busId]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    const { bus_id, user_id, seats, total_fare, passengers } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Insert booking
        const [result] = await connection.query(`
            INSERT INTO bookings (bus_id, user_id, total_fare, booking_date, status)
            VALUES (?, ?, ?, NOW(), 'confirmed')
        `, [bus_id, user_id, total_fare]);
        
        const bookingId = result.insertId;
        
        // Insert passengers
        for (const passenger of passengers) {
            await connection.query(`
                INSERT INTO passengers (booking_id, name, age, gender, seat_number)
                VALUES (?, ?, ?, ?, ?)
            `, [bookingId, passenger.name, passenger.age, passenger.gender, passenger.seat_number]);
        }
        
        await connection.commit();
        res.json({ bookingId, message: 'Booking created successfully' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// Get booking details
app.get('/api/bookings/:id', async (req, res) => {
    const bookingId = req.params.id;
    try {
        const [rows] = await pool.query(`
            SELECT b.*, 
                   bu.bus_number, bu.bus_type,
                   c1.name as source_city, 
                   c2.name as destination_city,
                   p.name as passenger_name, p.age, p.gender, p.seat_number
            FROM bookings b
            JOIN buses bu ON b.bus_id = bu.id
            JOIN cities c1 ON bu.source_id = c1.id
            JOIN cities c2 ON bu.destination_id = c2.id
            JOIN passengers p ON b.id = p.booking_id
            WHERE b.id = ?
        `, [bookingId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 