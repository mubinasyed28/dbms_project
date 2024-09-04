const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL client setup
const client = new Client({
    user: 'postgres',         // Replace with your PostgreSQL username
    host: 'localhost',        // Replace with your PostgreSQL host
    database: 'student',      // Replace with your database name
    password: 'vit@123',      // Replace with your PostgreSQL password
    port: 5435,               // Replace with your PostgreSQL port (5432 is default)
});

client.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend'))); // Use 'frontend' if your files are there

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
    const { username, password } = req.body;

    try {
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
        res.send('User data inserted successfully!');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Server error');
    }
});

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html')); // Use 'frontend' if your file is there
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
