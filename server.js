// Imports
/**
 * Declare Important Variables
 */

import { fileURLToPath } from 'url';
import path from 'path';

// Import express using ESM syntax
import express from 'express';


//Import Variables
// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
/**
 * Setup Express Server
 */
const app = express();


/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


const name = process.env.NAME || 'World';


/**
 * Declare Routes
 */

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
    res.send(`Hello, ${name}!`);
});

app.get('/new-route', (req, res) => {
    res.send('This is a new route!');
});

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/about.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/home.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/products.html'));
});

app.get('/vehicles/browse', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/vehicles/browse.html'));
});



// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});