import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { setupDatabase, testConnection } from './src/models/setup.js';
 
// Import route handlers from their new locations
import indexRoutes from './src/routes/index.js';
import productsRoutes from './src/routes/products/index.js';
import dashboardRoutes from './src/routes/dashboard/index.js';
import accountRoutes from './src/routes/accounts/index.js';
 
// Import global middleware
import { addGlobalData, addNavigationData } from './src/middleware/index.js';

// Import session
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import db from './src/models/db.js';
 
/**
 * Define important variables
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;
 
/**
 * Create an instance of an Express application
 */
const app = express();
 
/**
 * Configure the Express server
 */
 
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON data in request body
app.use(express.json());
 
// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));
 
// Set the view engine to EJS
app.set('view engine', 'ejs');
 
// Set the views directory (where your templates are located)
app.set('views', path.join(__dirname, 'src/views'));
 
/**
 * Middleware
 */
app.use(addGlobalData);
app.use(addNavigationData);


// Session stuff
// Configure PostgreSQL session store
const PostgresStore = pgSession(session);
 
// Configure session middleware
app.use(session({
    store: new PostgresStore({
        pool: db, // Use your PostgreSQL connection
        tableName: 'sessions', // Table name for storing sessions
        createTableIfMissing: true // Creates table if it does not exist
    }),
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true, // Prevents client-side access to the cookie
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    }
}));


/**
 * Routes
 */
app.use('/', indexRoutes);
app.use('/products', productsRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/accounts', accountRoutes);

app.get('/testcode/:code', (req, res, next) => {
    const err = new Error("Test Error")
    err.status = parseInt(req.params.code, 10);
    next(err);
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
    // Test database connection and setup tables
    testConnection()
        .then(() => setupDatabase())
        .then(() => {
            // Start your WebSocket server if you have one
            // startWebSocketServer();
    
            // Start the Express server
            app.listen(PORT, () => {
                console.log(`Server running on http://127.0.0.1:${PORT}`);
                console.log('Database connected and ready');
            });
        })
        .catch((error) => {
            console.error('Failed to start server:', error.message);
            process.exit(1);
        });