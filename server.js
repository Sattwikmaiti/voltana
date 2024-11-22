const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Routesa
app.use('/api', userRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
