// Imports
/**
 * Declare Important Variables
 */

// Import express using ESM syntax
import express from 'express';


// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;


// Create an instance of an Express application
/**
 * Setup Express Server
 */
const app = express();

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




// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});