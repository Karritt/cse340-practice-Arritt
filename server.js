import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Sample product data
const products = [
    {
        id: 1,
        name: "Kindle E-Reader",
        description: "Lightweight e-reader with a glare-free display and weeks of battery life.",
        price: 149.99,
        image: "https://picsum.photos/id/367/800/600"
    },
    {
        id: 2,
        name: "Vintage Film Camera",
        description: "Capture timeless moments with this classic vintage film camera, perfect for photography enthusiasts.",
        price: 199.99,
        image: "https://picsum.photos/id/250/800/600"
    }
];


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

// GENERIC MIDDLEWARE -----------------------------------------------------------
    
    // Global middleware to measure request processing time
    app.use((req, res, next) => {
        // Record the time when the request started
        const start = Date.now();
    
        /**
         * The `res` object has built-in event listeners we can use to trigger
         * actions at different points in the request/response lifecycle.
         * 
         * We will use the 'finish' event to detect when the response has been
         * sent to the client, and then calculate the time taken to process
         * the entire request.
         */
        res.on('finish', () => {
            // Calculate how much time has passed since the request started
            const end = Date.now();
            const processingTime = end - start;
    
            // Log the results to the console
            console.log(`${req.method} ${req.url} - Processing time: ${processingTime}ms`);
        });
    
        next();
    });


    // Static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Middleware to add current year to res.locals
    app.use((req, res, next) => {
        // Get the current year for copyright notice
        res.locals.currentYear = new Date().getFullYear();
        next();
    });

    //Log to the console
    app.use((req, res, next) => {
        console.log(`Method: ${req.method}, URL: ${req.url}`);
        next(); // Pass control to the next middleware or route
    });

    // Global middleware to set a custom header
    app.use((req, res, next) => {
        res.setHeader('X-Powered-By', 'Express Middleware Tutorial');
        next(); // Don't forget this or your request will hang!
    });

    // Middleware to validate display parameter
    const validateDisplayMode = (req, res, next) => {
        const { display } = req.params;
        if (display !== 'grid' && display !== 'details') {
            const error = new Error('Invalid display mode: must be either "grid" or "details".');
            next(error); // Pass control to the error-handling middleware
        }
        next(); // Pass control to the next middleware or route
    };

    // Middleware to add a timestamp to res.locals for all views
    app.use((req, res, next) => {
        // Create a formatted timestamp like "May 8, 2025 at 3:42 PM"
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
    
        // Adding to res.locals makes this available to all views automatically
        res.locals.timestamp = now.toLocaleDateString('en-US', options);
    
        next();
    });

// ROUTE MIDDLEWARE ---------------------------------------------------------------
    app.get('/', (req, res) => {
        res.render('index', { 
            title : "GreatStore", 
            content : "<h1>Welcome to GreatStore</h1><p><a href='/about'>About GreatStore<a></p>",
            NODE_ENV, PORT
        });
        //res.sendFile(path.join(__dirname, '/src/views/home.html'));
    });

    app.get('/about', (req, res) => {
        res.render('index', { 
            title : "About GreatStore", 
            content : "<h1>About GreatStore</h1><p>It's not real.</p>",
            NODE_ENV, PORT
        });
    });
    
    app.get('/contact', (req, res) => {
        res.render('index', { 
            title : "Contact GreatStore", 
            content : "<h1>Contact Us</h1><p>You can't, we're not real.</p>",
            NODE_ENV, PORT
        });
    });

    // Products page route with display mode validation
    app.get('/products/:display', validateDisplayMode, (req, res) => {
        const title = "Our Products";
        const { display } = req.params;
        res.render('products', { title, products, display, NODE_ENV, PORT });
    });
    
    // Default products route (redirects to grid view)
    app.get('/products', (req, res) => {
        res.redirect('/products/grid');
    });

    app.get('/testcode/:number', (req, res, next) => {
        const err = new Error('Test Error');
        if (isNaN(req.params.number)) {
            err.status = 400;
            err.message = 'Bad Request';
        } else {
            err.status = parseInt(req.params.number, 10);
        }
        
        next(err);
    });

    app.get('/explore/:category/:id', (req, res) => {
        const { category, id } = req.params;
        const { sort = 'default', filter = 'none' } = req.query;
        console.log(`Category: ${category}, ID: ${id}, Sort: ${sort}, Filter: ${filter}`);

        const title = `Exploring ${category}`;
    
        res.render('explore', { title, category, id, sort, filter, NODE_ENV, PORT });

    });

    app.get('/explore',(req, res) => {
        const title = "Explore";
        const category = "all";
        const id = '0';
        const { sort = 'default', filter = 'none' } = req.query;

        res.render('explore', { title, category, id, sort, filter, NODE_ENV, PORT });
    });

// ERROR MIDDLEWARE ---------------------------------------------------------------
    //404 Catch all
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use((err, req, res, next) => {
        // Log the error for debugging
        console.error(err.stack);
        
        // Set default status and determine error type
        const status = err.status || 500;
        const context = {
            title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
            error: err.message,
            stack: err.stack,
            code: err.status, //for the catch-all error page to render what error code it is
            NODE_ENV,
            PORT
        };

        // Render the appropriate template based on status code
        res.status(status).render(`errors/${status === 404 ? '404' : 'x'}`, context); //404 for specialized 404 page, x for a catch-all error page

        //res.send(`<img src="https://http.cat/${err.status}" alt="Error ${err.status}">`);
    });

//Set the listener ------------------------------------------------------

    // Websocket Connection
    // When in development mode, start a WebSocket server for live reloading
    if (NODE_ENV.includes('dev')) {
        const ws = await import('ws');
    
        try {
            const wsPort = parseInt(PORT) + 1;
            const wsServer = new ws.WebSocketServer({ port: wsPort });
    
            wsServer.on('listening', () => {
                console.log(`WebSocket server is running on port ${wsPort}`);
            });
    
            wsServer.on('error', (error) => {
                console.error('WebSocket server error:', error);
            });
        } catch (error) {
            console.error('Failed to start WebSocket server:', error);
        }
    }

    // Start the server and listen on the specified port
    app.listen(PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });