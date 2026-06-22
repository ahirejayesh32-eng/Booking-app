require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Get all slots with booking status
app.get('/api/slots', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.start_time, s.end_time, r.name AS resource_name,
        b.id AS booking_id
      FROM slots s
      JOIN resources r ON s.resource_id = r.id
      LEFT JOIN bookings b ON b.slot_id = s.id
      ORDER BY s.start_time
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// Book a slot
app.post('/api/bookings', async (req, res) => {
  const { slot_id, name, email } = req.body;

  try {
    // Find or create a simple user record by email
    let userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    let userId;
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
    } else {
      const newUser = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        [email, 'no-auth-demo']
      );
      userId = newUser.rows[0].id;
    }

    const booking = await pool.query(
      'INSERT INTO bookings (slot_id, user_id) VALUES ($1, $2) RETURNING *',
      [slot_id, userId]
    );

    res.json(booking.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      // unique_violation — someone already booked this slot
      return res.status(409).json({ error: 'This slot was just booked by someone else. Please pick another.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));