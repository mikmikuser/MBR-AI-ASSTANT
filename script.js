const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middleware to handle JSON
app.use(express.json());

// Token generation endpoint
app.get('/generate-token', (req, res) => {
    const token = crypto.randomBytes(16).toString('hex'); // Generate a 16-byte token
    res.json({ token });
});

// Static file serving
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
