import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';



// CONSTS ---------------------------------------------------------------
    // Create __dirname and __filename variables
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Define the port number the server will listen on
    const NODE_ENV = process.env.NODE_ENV || 'production';
    const PORT = process.env.PORT || 3000;

    // Create an instance of an Express application
    const app = express();

// APPLICATION CONFIGURATION --------------------------------------------
    app.set('view engine', 'ejs'); // Set the view engine to EJS
    app.set('views', path.join(__dirname, 'src/views')); // Set the views directory

// MIDDLEWARE -----------------------------------------------------------
    // Static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));

// ROUTES ---------------------------------------------------------------
    app.get('/', (req, res) => {
        res.render('index', { 
            title : "Home Page", 
            content : "<h1>Welcome to the Home Page</h1><p>This is the content of the home page.</p>" 
        });
        //res.sendFile(path.join(__dirname, '/src/views/home.html'));
    });
    
    app.get('/about', (req, res) => {
        res.render('index', { 
            title : "Page 1", 
            content : "<h1>Welcome to Page 1</h1><p>This is the content of page 1.</p>" 
        });
    });
    
    app.get('/contact', (req, res) => {
        res.render('index', { 
            title : "Page 2", 
            content : "<h1>Welcome to Page 2</h1><p>This is the content of page 2.</p>" 
        });
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