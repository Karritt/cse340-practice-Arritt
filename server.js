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
            content : "<h1>Welcome to the Home Page</h1><p>This is the content of the home page.</p>",
            NODE_ENV, PORT
        });
        //res.sendFile(path.join(__dirname, '/src/views/home.html'));
    });
    
    app.get('/about', (req, res) => {
        res.render('index', { 
            title : "Page 1", 
            content : "<h1>Welcome to Page 1</h1><p>This is the content of page 1.</p>",
            NODE_ENV, PORT
        });
    });
    
    app.get('/contact', (req, res) => {
        res.render('index', { 
            title : "Page 2", 
            content : "<h1>Welcome to Page 2</h1><p>This is the content of page 2.</p>",
            NODE_ENV, PORT
        });
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