const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
