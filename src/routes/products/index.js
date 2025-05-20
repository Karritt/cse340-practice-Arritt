import { Router } from 'express';
import { getCategory, getItem, getRandomProduct } from '../../models/products-data.js';
 
const router = Router();
 
/**
 * The products functionality is more complex, involving data fetching and
 * dynamic content, so it gets its own directory. This keeps the code
 * organized and makes it easier to maintain and expand.
 */
 
// Route for /products - redirects to a random product
router.get('/', async (req, res) => {
    const randomProduct = await getRandomProduct();
    res.redirect(`/products/${randomProduct.category}/${randomProduct.id}`);
});

router.get('/:category', async (req, res) => {
    const { category } = req.params;
    let { display } = req.query;
    if (!display) display = "grid";
    const ret = await getCategory(category);
    const products = ret.items;
    res.render('products-category', {
        products: products,
        title: `Exploring ${category}`,
        display: display,
        category: category
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