import { Router } from 'express';
 
const router = Router();
 
/**
 * This file groups together simple, related routes that don't require 
 * complex logic or data processing. These are often static pages or 
 * simple renders without database interaction.
 */
 
// Middleware to validate display parameter
const validateDisplayMode = (req, res, next) => {
    const { display } = req.params;
    if (display !== 'grid' && display !== 'details') {
        const error = new Error('Invalid display mode: must be either "grid" or "details".');
        next(error); // Pass control to the error-handling middleware
    }
    next(); // Pass control to the next middleware or route
};
 
// Home page route
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        content: 'Welcome to our website! Explore our products and services.'
    });
});
 
// About page route  
router.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});
 
// Default products route (redirects to grid view)
// router.get('/products', (req, res) => {
//     res.redirect('/products/grid');
// });
 
// // Products page route with display mode validation
// router.get('/products/:display', validateDisplayMode, (req, res) => {
//     const title = "Our Products";
//     const { display } = req.params;
//     res.render('products', { title, products, display });
// });
 
export default router;