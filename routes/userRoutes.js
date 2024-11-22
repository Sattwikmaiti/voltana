const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const jwt = require('jsonwebtoken');
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

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       // Check if the user exists
//       const query = 'SELECT id, name, email, password, role FROM Users WHERE email = $1';
//       const result = await pool.query(query, [email]);
  
//       if (result.rowCount === 0) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }
  
//       const user = result.rows[0];
  
//       // Compare the provided password with the hashed password in the database
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid || user.role!="admin") {
//         return res.status(401).json({ error: 'Invalid email or password or Not Admin ' });
//       }
  
//       // If login is successful, return user details (except the password)
//       const { id, name, role } = user;
//       res.status(200).json({
//         message: 'Login successful',
//         user: { id, name, email, role },
//       });
//     } catch (error) {
//       console.error('Error during login:', error.message);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const query = 'SELECT id, name, email, password, role FROM Users WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rowCount === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid || user.role !== "admin") {
            return res.status(401).json({ error: 'Invalid email or password or Not Admin' });
        }

        // Create a JWT token (you can adjust the payload as needed)
        const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
        
        // You can set a secret key in an environment variable for security
        const token = jwt.sign(payload, "Sattwik", { expiresIn: '1h' });

        // If login is successful, return user details and the token
        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token: token,  // Send the token in the response
        });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
