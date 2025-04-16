const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend/new_SMS-main')));

// For any other route, serve the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/new_SMS-main/index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
});
