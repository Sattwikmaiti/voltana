const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const router = express.Router();

// Create: Add new user (Sign Up)
router.post('/users', async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;

    try {
        const result = await pool.query(query, [name, email, hashedPassword, role || 'user']);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read: Fetch all users
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM Users');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update: Edit user details
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const query = `UPDATE Users SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`;

    try {
        const result = await pool.query(query, [name, email, role, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete: Remove user record
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Users WHERE id = $1 RETURNING *`;

    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
