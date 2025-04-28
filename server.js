import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';



// CONSTS ---------------------------------------------------------------
    // Create __dirname and __filename variables
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Define the port number the server will listen on
    const PORT = process.env.PORT || 3000;

    // Create an instance of an Express application
    const app = express();

// MIDDLEWARE -----------------------------------------------------------
    // Static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));

// ROUTES ---------------------------------------------------------------
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/src/views/home.html'));
    });
    
    app.get('/page1', (req, res) => {
        res.sendFile(path.join(__dirname, '/src/views/page1.html'));
    });
    
    app.get('/page2', (req, res) => {
        res.sendFile(path.join(__dirname, '/src/views/page2.html'));
    });


    // Define a route handler for the root URL ('/')
    // app.get('/', (req, res) => {
    //     res.send('Hello, World! <a href="/about">Go to About</a>');
    // });

    

    // app.get('/about', (req, res) => {
    //     res.send('About Page <a href="/">Go back</a>');
    // });

    // app.get("/api", (req, res) => {
    //     res.json({
    //         message: "Hello from the API!" 
    //     });
    // });



//Set the listener ------------------------------------------------------
    // Start the server and listen on the specified port
    app.listen(PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });