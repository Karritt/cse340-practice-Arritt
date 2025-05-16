// Sample data for explore functionality
const exploreData = {
    categories: {
        mens: {
            name: "Men's Clothing",
            description: "Explore our collection of men's fashion",
            items: {
                123: { 
                    name: "Classic T-Shirt", 
                    price: 29.99,
                    description: "..."
                },
                124: { 
                    name: "Denim Jeans", 
                    price: 89.99,
                    description: "..."
                },
                125: { 
                    name: "Leather Jacket", 
                    price: 299.99,
                    description: "..."
                }
            }
        },
        womens: {
            name: "Women's Clothing", 
            description: "Discover our women's fashion line",
            items: {
                231: { 
                    name: "Summer Dress", 
                    price: 59.99,
                    description: "..."
                },
                232: { 
                    name: "Blouse", 
                    price: 49.99,
                    description: "..."
                },
                233: { 
                    name: "High Heels", 
                    price: 99.99,
                    description: "..."
                }
            }
        },
        accessories: {
            name: "Accessories",
            description: "Complete your look with our accessories",
            items: {
                331: { 
                    name: "Leather Belt", 
                    price: 39.99,
                    description: "..."
                },
                332: { 
                    name: "Sunglasses", 
                    price: 79.99,
                    description: "..."
                },
                333: { 
                    name: "Watch", 
                    price: 199.99,
                    description: "..."
                }
            }
        }
    }
};
 
// Get all categories
export const getAllCategories = async() => Promise.resolve(exploreData.categories);
 
// Get category data
export const getCategory = async(categoryId) => {
    // Simulate async database call
    return Promise.resolve(exploreData.categories[categoryId] || null);
};
 
// Get all products in a category
export const getCategoryItems = async(categoryId) => {
    const category = await getCategory(categoryId);
    return category ? category.items : null;
};
 
// Get item data
export const getItem = async(categoryId, itemId) => {
    const category = await getCategory(categoryId);
    return category ? category.items[itemId] || null : null;
};
 
// Get a random product
export const getRandomProduct = async() => {
    const categories = Object.keys(exploreData.categories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const category = exploreData.categories[randomCategory];
    const itemIds = Object.keys(category.items);
    const randomItemId = itemIds[Math.floor(Math.random() * itemIds.length)];
 
    return {
        category: randomCategory,
        id: randomItemId
    };
};