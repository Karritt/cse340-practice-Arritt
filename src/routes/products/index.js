import { Router } from 'express';
import { 
    getNavigationCategories, 
    getCategoryBySlug, 
    getChildCategories,
    getProductsByCategory, 
    getRandomNavigationCategory 
} from '../../models/categories/index.js';
import { getCategory, getItem, getRandomProduct } from '../../models/products-data.js';
 
const router = Router();
 
/**
 * The products functionality is more complex, involving data fetching and
 * dynamic content, so it gets its own directory. This keeps the code
 * organized and makes it easier to maintain and expand.
 */
 
// Route for /products - redirects to a random product
router.get('/', async (req, res, next) => {
    const randomCategory = await getRandomNavigationCategory();
 
    if (!randomCategory) {
        const error = new Error('No categories available');
        error.status = 404;
        return next(error);
    }
 
    res.redirect(`/products/${randomCategory.slug}`);
});

/**
 * Route for viewing a category and its products/subcategories
 * Updated to use database queries instead of static data
 */
router.get('/:category', async (req, res, next) => {
    const { category } = req.params;
    const { display = 'grid' } = req.query;
 
    // Get category from database
    const categoryData = await getCategoryBySlug(category);
 
    // Check if category exists
    if (!categoryData) {
        const error = new Error('Category Not Found');
        error.status = 404;
        return next(error);
    }
 
    // Get subcategories and products for this category
    const subcategories = await getChildCategories(categoryData.id);
    const products = await getProductsByCategory(categoryData.id);
 
    // Render the products template
    res.render('products-category', {
        title: `Exploring ${categoryData.name}`,
        display,
        categoryData,
        subcategories,
        products,
        hasProducts: products.length > 0,
        hasSubcategories: subcategories.length > 0
    });
});
 
// Route with multiple parameters
router.get('/:category/:id', async (req, res) => {
    const { category, id, sort, filter } = req.params;
 
    // Use await to get data from the model
    const categoryData = await getCategory(category);
    const itemData = await getItem(category, id);
 
    // Check if data exists
    if (!categoryData || !itemData) {
        return res.status(404).render('errors/404', { 
            title: 'Item Not Found' 
        });
    }

    const product = await getItem(category, id);
 
    res.render('products-item', { 
        title: `Exploring ${categoryData.name}`,
        category: categoryData,
        item: itemData,
        category: category,
        id: id,
        sort: sort,
        filter: filter,
        product: product
    });
});
 
export default router;